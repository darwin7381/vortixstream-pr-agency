from fastapi import APIRouter, HTTPException, Request
from typing import List

from ..core.database import db
from ..models.contact import ContactSubmissionCreate, ContactSubmission

router = APIRouter(prefix="/contact")


@router.post("/submit", response_model=ContactSubmission, status_code=201)
async def submit_contact_form(submission: ContactSubmissionCreate, request: Request):
    """提交聯絡表單"""
    
    # 取得客戶端資訊
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO contact_submissions (
                name, email, company, phone, message, ip_address, user_agent
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            """,
            submission.name,
            submission.email,
            submission.company,
            submission.phone,
            submission.message,
            ip_address,
            user_agent
        )
    
    # TODO: 發送 Email 通知給管理員
    
    return dict(row)


@router.get("/submissions", response_model=List[ContactSubmission])
async def get_contact_submissions(
    status: str = "all",
    limit: int = 50
):
    """取得聯絡表單提交列表（需要認證 - 未來實作）"""
    
    async with db.pool.acquire() as conn:
        if status == "all":
            rows = await conn.fetch(
                """
                SELECT * FROM contact_submissions
                ORDER BY created_at DESC
                LIMIT $1
                """,
                limit
            )
        else:
            rows = await conn.fetch(
                """
                SELECT * FROM contact_submissions
                WHERE status = $1
                ORDER BY created_at DESC
                LIMIT $2
                """,
                status,
                limit
            )
    
    return [dict(row) for row in rows]


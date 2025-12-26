from fastapi import APIRouter, Request

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


from fastapi import APIRouter, Request
import logging

from ..core.database import db
from ..models.contact import ContactSubmissionCreate, ContactSubmission
from ..services.email_service import email_service

router = APIRouter(prefix="/contact")
logger = logging.getLogger(__name__)


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
    
    # 發送 Email 通知給管理員
    try:
        await email_service.send_contact_notification(
            name=submission.name,
            email=submission.email,
            company=submission.company,
            phone=submission.phone,
            message=submission.message
        )
    except Exception as e:
        logger.error(f"Failed to send email notification: {e}")
        # 不影響表單提交，即使郵件發送失敗
    
    return dict(row)


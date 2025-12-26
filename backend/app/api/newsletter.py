from fastapi import APIRouter, HTTPException, Request

from ..core.database import db
from ..models.newsletter import NewsletterSubscribe

router = APIRouter(prefix="/newsletter")


@router.post("/subscribe", status_code=201)
async def subscribe_newsletter(subscription: NewsletterSubscribe, request: Request):
    """訂閱 Newsletter"""
    
    ip_address = request.client.host if request.client else None
    
    async with db.pool.acquire() as conn:
        # 檢查是否已訂閱
        existing = await conn.fetchrow(
            "SELECT * FROM newsletter_subscribers WHERE email = $1",
            subscription.email
        )
        
        if existing:
            # 如果之前取消訂閱，重新啟用
            if existing["status"] == "unsubscribed":
                await conn.execute(
                    """
                    UPDATE newsletter_subscribers
                    SET status = 'active', unsubscribed_at = NULL
                    WHERE email = $1
                    """,
                    subscription.email
                )
                return {"message": "Re-subscribed successfully"}
            else:
                return {"message": "Already subscribed"}
        
        # 新訂閱
        await conn.execute(
            """
            INSERT INTO newsletter_subscribers (email, source, ip_address)
            VALUES ($1, $2, $3)
            """,
            subscription.email,
            subscription.source,
            ip_address
        )
    
    # TODO: 發送歡迎 Email
    
    return {"message": "Subscribed successfully"}


@router.post("/unsubscribe")
async def unsubscribe_newsletter(email: str):
    """取消訂閱 Newsletter"""
    
    async with db.pool.acquire() as conn:
        result = await conn.execute(
            """
            UPDATE newsletter_subscribers
            SET status = 'unsubscribed', unsubscribed_at = NOW()
            WHERE email = $1 AND status = 'active'
            """,
            email
        )
    
    if result == "UPDATE 0":
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    return {"message": "Unsubscribed successfully"}


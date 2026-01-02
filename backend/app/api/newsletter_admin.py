from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from ..core.database import db
from ..models.newsletter import NewsletterSubscriber

router = APIRouter(prefix="/newsletter")


@router.get("/subscribers", response_model=List[NewsletterSubscriber])
async def get_subscribers(
    status: str = Query("all", pattern="^(all|active|unsubscribed)$"),
    limit: int = Query(100, ge=1, le=500),
    search: Optional[str] = None
):
    """取得訂閱者列表"""
    
    async with db.pool.acquire() as conn:
        # 建立查詢條件
        conditions = []
        params = []
        param_count = 1
        
        if status != "all":
            conditions.append(f"status = ${param_count}")
            params.append(status)
            param_count += 1
        
        if search:
            conditions.append(f"email ILIKE ${param_count}")
            params.append(f"%{search}%")
            param_count += 1
        
        where_clause = " AND ".join(conditions) if conditions else "TRUE"
        
        rows = await conn.fetch(
            f"""
            SELECT * FROM newsletter_subscribers
            WHERE {where_clause}
            ORDER BY subscribed_at DESC
            LIMIT ${param_count}
            """,
            *params, limit
        )
    
    return [dict(row) for row in rows]


@router.get("/subscribers/{subscriber_id}", response_model=NewsletterSubscriber)
async def get_subscriber(subscriber_id: int):
    """取得單個訂閱者"""
    
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM newsletter_subscribers WHERE id = $1",
            subscriber_id
        )
    
    if not row:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    
    return dict(row)


@router.patch("/subscribers/{subscriber_id}/status")
async def update_subscriber_status(
    subscriber_id: int,
    status: str = Query(..., pattern="^(active|unsubscribed)$")
):
    """更新訂閱者狀態"""
    
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE newsletter_subscribers
            SET status = $1, 
                unsubscribed_at = CASE WHEN $1 = 'unsubscribed' THEN NOW() ELSE NULL END
            WHERE id = $2
            RETURNING *
            """,
            status,
            subscriber_id
        )
    
    if not row:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    
    return {"message": "Status updated", "subscriber": dict(row)}


@router.delete("/subscribers/{subscriber_id}", status_code=204)
async def delete_subscriber(subscriber_id: int):
    """刪除訂閱者"""
    
    async with db.pool.acquire() as conn:
        result = await conn.execute(
            "DELETE FROM newsletter_subscribers WHERE id = $1",
            subscriber_id
        )
    
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Subscriber not found")
    
    return None


@router.get("/stats")
async def get_newsletter_stats():
    """取得訂閱統計資訊"""
    
    async with db.pool.acquire() as conn:
        stats = await conn.fetchrow(
            """
            SELECT 
                COUNT(*) FILTER (WHERE status = 'active') as active_count,
                COUNT(*) FILTER (WHERE status = 'unsubscribed') as unsubscribed_count,
                COUNT(*) as total_count
            FROM newsletter_subscribers
            """
        )
    
    return dict(stats)




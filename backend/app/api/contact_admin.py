from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from ..core.database import db
from ..models.contact import ContactSubmission

router = APIRouter(prefix="/contact")


@router.get("/submissions", response_model=List[ContactSubmission])
async def get_contact_submissions(
    status: str = Query("all", pattern="^(all|new|read|replied)$"),
    limit: int = Query(100, ge=1, le=500),
    search: Optional[str] = None
):
    """取得聯絡表單提交列表"""
    
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
            conditions.append(f"(name ILIKE ${param_count} OR email ILIKE ${param_count} OR company ILIKE ${param_count} OR message ILIKE ${param_count})")
            params.append(f"%{search}%")
            param_count += 1
        
        where_clause = " AND ".join(conditions) if conditions else "TRUE"
        
        rows = await conn.fetch(
            f"""
            SELECT * FROM contact_submissions
            WHERE {where_clause}
            ORDER BY created_at DESC
            LIMIT ${param_count}
            """,
            *params, limit
        )
    
    return [dict(row) for row in rows]


@router.get("/submissions/{submission_id}", response_model=ContactSubmission)
async def get_contact_submission(submission_id: int):
    """取得單個聯絡表單提交"""
    
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM contact_submissions WHERE id = $1",
            submission_id
        )
    
    if not row:
        raise HTTPException(status_code=404, detail="Contact submission not found")
    
    return dict(row)


@router.patch("/submissions/{submission_id}/status")
async def update_submission_status(
    submission_id: int,
    status: str = Query(..., pattern="^(new|read|replied)$")
):
    """更新聯絡表單狀態"""
    
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE contact_submissions
            SET status = $1
            WHERE id = $2
            RETURNING *
            """,
            status,
            submission_id
        )
    
    if not row:
        raise HTTPException(status_code=404, detail="Contact submission not found")
    
    return {"message": "Status updated", "submission": dict(row)}


@router.delete("/submissions/{submission_id}", status_code=204)
async def delete_contact_submission(submission_id: int):
    """刪除聯絡表單提交"""
    
    async with db.pool.acquire() as conn:
        result = await conn.execute(
            "DELETE FROM contact_submissions WHERE id = $1",
            submission_id
        )
    
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Contact submission not found")
    
    return None


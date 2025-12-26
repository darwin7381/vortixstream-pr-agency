from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import math

from ..core.database import db
from ..models.blog import BlogPost, BlogPostList

router = APIRouter(prefix="/blog")


@router.get("/posts", response_model=BlogPostList)
async def get_blog_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    status: str = Query("published", pattern="^(draft|published|archived|all)$"),
    search: Optional[str] = None
):
    """取得 Blog 文章列表（分頁）"""
    
    # 計算 offset
    offset = (page - 1) * page_size
    
    # 建立查詢條件
    conditions = []
    params = []
    param_count = 1
    
    if status != "all":
        conditions.append(f"status = ${param_count}")
        params.append(status)
        param_count += 1
    
    if category:
        conditions.append(f"category = ${param_count}")
        params.append(category)
        param_count += 1
    
    if search:
        conditions.append(f"(title ILIKE ${param_count} OR content ILIKE ${param_count})")
        params.append(f"%{search}%")
        param_count += 1
    
    where_clause = " AND ".join(conditions) if conditions else "TRUE"
    
    async with db.pool.acquire() as conn:
        # 取得總數
        total = await conn.fetchval(
            f"SELECT COUNT(*) FROM blog_posts WHERE {where_clause}",
            *params
        )
        
        # 取得文章
        rows = await conn.fetch(
            f"""
            SELECT * FROM blog_posts 
            WHERE {where_clause}
            ORDER BY published_at DESC NULLS LAST, created_at DESC
            LIMIT ${param_count} OFFSET ${param_count + 1}
            """,
            *params, page_size, offset
        )
    
    posts = [dict(row) for row in rows]
    total_pages = math.ceil(total / page_size) if total > 0 else 0
    
    return {
        "posts": posts,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }


@router.get("/posts/{slug}", response_model=BlogPost)
async def get_blog_post(slug: str):
    """取得單篇 Blog 文章（通過 slug）"""
    
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM blog_posts WHERE slug = $1",
            slug
        )
    
    if not row:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    return dict(row)


@router.get("/categories")
async def get_blog_categories():
    """取得所有文章分類"""
    
    async with db.pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT category, COUNT(*) as count
            FROM blog_posts
            WHERE status = 'published'
            GROUP BY category
            ORDER BY category
            """
        )
    
    return [{"name": row["category"], "count": row["count"]} for row in rows]


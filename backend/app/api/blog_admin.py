from fastapi import APIRouter, HTTPException
from slugify import slugify
from datetime import datetime

from ..core.database import db
from ..models.blog import BlogPostCreate, BlogPostUpdate, BlogPost

router = APIRouter(prefix="/blog")


@router.get("/posts/by-id/{post_id}", response_model=BlogPost)
async def get_blog_post_by_id(post_id: int):
    """取得單篇 Blog 文章（通過 ID）- Admin 專用"""
    
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM blog_posts WHERE id = $1",
            post_id
        )
    
    if not row:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    return dict(row)


@router.post("/posts", response_model=BlogPost, status_code=201)
async def create_blog_post(post: BlogPostCreate):
    """創建 Blog 文章"""
    
    # 生成 slug
    slug = slugify(post.title)
    
    # 檢查 slug 是否已存在
    async with db.pool.acquire() as conn:
        existing = await conn.fetchval(
            "SELECT id FROM blog_posts WHERE slug = $1",
            slug
        )
        
        if existing:
            # 如果存在，加上時間戳
            slug = f"{slug}-{int(datetime.now().timestamp())}"
        
        # 插入文章
        row = await conn.fetchrow(
            """
            INSERT INTO blog_posts (
                title, slug, category, excerpt, content, author, 
                read_time, image_url, meta_title, meta_description, 
                status, published_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
            """,
            post.title,
            slug,
            post.category,
            post.excerpt,
            post.content,
            post.author,
            post.read_time,
            post.image_url,
            post.meta_title,
            post.meta_description,
            post.status,
            datetime.now() if post.status == "published" else None
        )
    
    return dict(row)


@router.put("/posts/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: int, post: BlogPostUpdate):
    """更新 Blog 文章"""
    
    # 取得要更新的欄位
    update_data = post.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # 建立更新語句
    set_clauses = []
    params = []
    param_count = 1
    
    for field, value in update_data.items():
        set_clauses.append(f"{field} = ${param_count}")
        params.append(value)
        param_count += 1
    
    # 加入 updated_at
    set_clauses.append(f"updated_at = ${param_count}")
    params.append(datetime.now())
    param_count += 1
    
    # 如果狀態改為 published 且 published_at 為空，設定 published_at
    if update_data.get("status") == "published":
        set_clauses.append(
            f"published_at = COALESCE(published_at, ${param_count})"
        )
        params.append(datetime.now())
        param_count += 1
    
    params.append(post_id)
    
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            f"""
            UPDATE blog_posts
            SET {', '.join(set_clauses)}
            WHERE id = ${param_count}
            RETURNING *
            """,
            *params
        )
    
    if not row:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    return dict(row)


@router.delete("/posts/{post_id}", status_code=204)
async def delete_blog_post(post_id: int):
    """刪除 Blog 文章"""
    
    async with db.pool.acquire() as conn:
        result = await conn.execute(
            "DELETE FROM blog_posts WHERE id = $1",
            post_id
        )
    
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    return None




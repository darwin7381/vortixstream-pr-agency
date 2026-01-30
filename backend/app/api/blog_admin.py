from fastapi import APIRouter, HTTPException, Header
from slugify import slugify
from datetime import datetime
from notion_client import Client

from ..core.database import db
from ..models.blog import BlogPostCreate, BlogPostUpdate, BlogPost, NotionBlogSync
from ..config import settings

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


@router.post("/sync-from-notion")
async def sync_from_notion(
    payload: NotionBlogSync,
    x_notion_webhook_secret: str = Header(None, alias="X-Notion-Webhook-Secret")
):
    """
    從 Notion 同步文章
    
    N8N 傳送基本資訊，Backend 自動取得並轉換頁面內容
    """
    
    # 1. 驗證 webhook secret
    if x_notion_webhook_secret != settings.NOTION_WEBHOOK_SECRET:
        raise HTTPException(status_code=403, detail="Invalid webhook secret")
    
    # 2. 用 Notion SDK 取得頁面完整資訊
    try:
        notion = Client(auth=settings.NOTION_API_KEY)
        
        # 取得 page properties
        page = notion.pages.retrieve(page_id=payload.notion_page_id)
        props = page['properties']
        
        # 提取欄位
        title = props.get('Title', {}).get('title', [{}])[0].get('plain_text', 'Untitled')
        pillar = props.get('Pillar', {}).get('select', {}).get('name', 'Industry News')
        
        # Meta Description
        meta_desc_array = props.get('Meta Description', {}).get('rich_text', [])
        meta_description = ''.join([t.get('plain_text', '') for t in meta_desc_array])
        
        # Author
        author_array = props.get('Author', {}).get('rich_text', [])
        author = ''.join([t.get('plain_text', '') for t in author_array]) or 'VortixPR Team'
        
        # Cover Image
        cover_files = props.get('Cover Image', {}).get('files', [])
        cover_image_url = ''
        if cover_files:
            cover_image_url = cover_files[0].get('file', {}).get('url') or cover_files[0].get('external', {}).get('url', '')
        
        # Publish Date
        publish_date_obj = props.get('Publish Date', {}).get('date', {})
        published_at = datetime.now()
        if publish_date_obj and publish_date_obj.get('start'):
            try:
                dt = datetime.fromisoformat(publish_date_obj['start'].replace('Z', '+00:00'))
                published_at = dt.replace(tzinfo=None)
            except:
                pass
        
        # Tags
        tags_array = props.get('tag', {}).get('multi_select', [])
        tags = [t.get('name', '') for t in tags_array]
        
        # 取得 page blocks（內容）
        blocks_response = notion.blocks.children.list(
            block_id=payload.notion_page_id,
            page_size=100
        )
        
        blocks = blocks_response['results']
        
        # 轉換為 HTML
        html_content = _convert_blocks_to_html(blocks)
        
        # 自動計算 read_time
        read_time = _calculate_read_time(html_content)
        
        # 自動設定 meta_title
        meta_title = f"{title} | VortixPR"
        
        # excerpt 用 meta_description
        excerpt = meta_description[:160] if meta_description else title[:160]
        
        # meta_description 截斷到 160 字元
        meta_description = meta_description[:160] if meta_description else title[:160]
        
        # 3. 檢查文章是否已存在
        async with db.pool.acquire() as conn:
            existing = await conn.fetchrow(
                "SELECT id, slug FROM blog_posts WHERE notion_page_id = $1",
                payload.notion_page_id
            )
            
            if existing:
                # 更新現有文章
                row = await conn.fetchrow(
                    """
                    UPDATE blog_posts
                    SET
                        title = $1,
                        category = $2,
                        excerpt = $3,
                        content = $4,
                        author = $5,
                        image_url = $6,
                        read_time = $7,
                        meta_title = $8,
                        meta_description = $9,
                        notion_last_edited_time = $10,
                        updated_at = NOW()
                    WHERE id = $11
                    RETURNING *
                    """,
                    title,
                    pillar,
                    excerpt,
                    html_content,
                    author,
                    cover_image_url,
                    read_time,
                    meta_title,
                    meta_description,
                    datetime.now(),
                    existing['id']
                )
                action = "updated"
            else:
                # 創建新文章
                slug = slugify(title)
                
                # 檢查 slug 是否已存在
                existing_slug = await conn.fetchval(
                    "SELECT id FROM blog_posts WHERE slug = $1", slug
                )
                
                if existing_slug:
                    slug = f"{slug}-{int(datetime.now().timestamp())}"
                
                row = await conn.fetchrow(
                    """
                    INSERT INTO blog_posts (
                        notion_page_id,
                        notion_last_edited_time,
                        sync_source,
                        title,
                        slug,
                        category,
                        excerpt,
                        content,
                        author,
                        image_url,
                        read_time,
                        meta_title,
                        meta_description,
                        status,
                        published_at
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                    RETURNING *
                    """,
                    payload.notion_page_id,
                    datetime.now(),
                    'notion',
                    title,
                    slug,
                    pillar,
                    excerpt,
                    html_content,
                    author,
                    cover_image_url,
                    read_time,
                    meta_title,
                    meta_description,
                    'published',
                    published_at
                )
                action = "created"
        
        # 組合回傳資料
        result = dict(row)
        result['_sync_action'] = action
        
        # 生成文章完整 URL（給 Notion 回填 Article URL）
        frontend_url = settings.FRONTEND_URL.rstrip('/')
        result['article_url'] = f"{frontend_url}/blog/{row['slug']}"
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to sync from Notion: {str(e)}"
        )


def _convert_blocks_to_html(blocks):
    """轉換 Notion blocks 為 HTML（簡化版，支援常用類型）"""
    
    def get_text(rich_text_array):
        if not rich_text_array:
            return ''
        return ''.join([t.get('plain_text', '') for t in rich_text_array])
    
    html_parts = []
    
    for block in blocks:
        block_type = block['type']
        
        if block_type == 'heading_1':
            html_parts.append(f"<h1>{get_text(block['heading_1']['rich_text'])}</h1>")
        elif block_type == 'heading_2':
            html_parts.append(f"<h2>{get_text(block['heading_2']['rich_text'])}</h2>")
        elif block_type == 'heading_3':
            html_parts.append(f"<h3>{get_text(block['heading_3']['rich_text'])}</h3>")
        elif block_type == 'paragraph':
            text = get_text(block['paragraph']['rich_text'])
            if text:
                html_parts.append(f"<p>{text}</p>")
        elif block_type == 'bulleted_list_item':
            html_parts.append(f"<li>{get_text(block['bulleted_list_item']['rich_text'])}</li>")
        elif block_type == 'numbered_list_item':
            html_parts.append(f"<li>{get_text(block['numbered_list_item']['rich_text'])}</li>")
        elif block_type == 'image':
            url = block['image'].get('external', {}).get('url') or block['image'].get('file', {}).get('url', '')
            if url:
                html_parts.append(f'<img src="{url}" alt="Image" />')
        elif block_type == 'divider':
            html_parts.append('<hr />')
        # 可以之後再加更多類型（quote, code, callout 等）
    
    return '\n'.join(html_parts)


def _calculate_read_time(html_content: str) -> int:
    """自動計算閱讀時間（基於內容長度）"""
    import re
    
    # 移除 HTML tags
    text = re.sub('<[^<]+?>', '', html_content)
    
    # 計算字數
    word_count = len(text.split())
    
    # 計算閱讀時間（假設 250 字/分鐘）
    read_time = max(1, round(word_count / 250))
    
    return read_time






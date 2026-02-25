from fastapi import APIRouter, HTTPException, Header, Depends
from slugify import slugify
from datetime import datetime
import httpx
import re
import logging

from ..core.database import db
from ..models.blog import BlogPostCreate, BlogPostUpdate, BlogPost, NotionBlogSync
from ..config import settings
from ..services.r2_storage import r2_storage
from ..utils.security import require_admin

router = APIRouter(prefix="/blog")
logger = logging.getLogger(__name__)


@router.get("/posts")
async def list_admin_blog_posts(
    page: int = 1,
    page_size: int = 50,
    status: str = "all",
    search: str = "",
    current_user=Depends(require_admin)
):
    """取得所有 Blog 文章列表（Admin 專用，支援全部狀態）"""
    offset = (page - 1) * page_size

    conditions = []
    params: list = []
    param_count = 1

    if status != "all":
        conditions.append(f"status = ${param_count}")
        params.append(status)
        param_count += 1

    if search:
        conditions.append(f"(title ILIKE ${param_count} OR author ILIKE ${param_count})")
        params.append(f"%{search}%")
        param_count += 1

    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""

    async with db.pool.acquire() as conn:
        total = await conn.fetchval(
            f"SELECT COUNT(*) FROM blog_posts {where_clause}",
            *params
        )
        rows = await conn.fetch(
            f"""
            SELECT id, title, slug, category, author, status,
                   read_time, image_url, published_at, created_at, updated_at,
                   notion_page_id, sync_source
            FROM blog_posts
            {where_clause}
            ORDER BY
                CASE status WHEN 'published' THEN 1 WHEN 'draft' THEN 2 ELSE 3 END,
                updated_at DESC
            LIMIT ${param_count} OFFSET ${param_count + 1}
            """,
            *params, page_size, offset
        )

    return {
        "posts": [dict(r) for r in rows],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": max(1, (total + page_size - 1) // page_size),
    }


@router.get("/posts/by-id/{post_id}", response_model=BlogPost)
async def get_blog_post_by_id(post_id: int, current_user=Depends(require_admin)):
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
async def create_blog_post(post: BlogPostCreate, current_user=Depends(require_admin)):
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


@router.put("/posts/{post_id}")
async def update_blog_post(post_id: int, post: BlogPostUpdate, current_user=Depends(require_admin)):
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
    
    result = dict(row)
    
    # 如果狀態有變更且文章來自 Notion，同步更新 Notion 狀態
    new_status = update_data.get("status")
    if new_status and row.get("notion_page_id"):
        notion_status_map = {
            "published": "Published",
            "draft": "Draft",
            "archived": "Archived"
        }
        notion_status = notion_status_map.get(new_status)
        if notion_status:
            notion_synced = await _sync_status_to_notion(
                notion_page_id=row["notion_page_id"],
                notion_status=notion_status
            )
            if not notion_synced:
                result["_notion_sync_warning"] = (
                    f"文章狀態已更新為 {new_status}，但 Notion 狀態同步失敗。"
                    "請手動在 Notion 更新狀態，或稍後重試。"
                )
    
    return result


@router.delete("/posts/{post_id}", status_code=204)
async def delete_blog_post(post_id: int, current_user=Depends(require_admin)):
    """刪除 Blog 文章（網站刪除 → Notion 改為 Archived）"""
    
    async with db.pool.acquire() as conn:
        # 先取得文章資料（確認存在 + 取得 notion_page_id）
        post_row = await conn.fetchrow(
            "SELECT id, notion_page_id FROM blog_posts WHERE id = $1",
            post_id
        )
        
        if not post_row:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        # 如果來自 Notion，先同步狀態為 Archived
        if post_row["notion_page_id"]:
            await _sync_status_to_notion(
                notion_page_id=post_row["notion_page_id"],
                notion_status="Archived"
            )
        
        # 刪除網站文章
        await conn.execute(
            "DELETE FROM blog_posts WHERE id = $1",
            post_id
        )
    
    return None


@router.post("/posts/{post_id}/export-to-notion")
async def export_post_to_notion(post_id: int, current_user=Depends(require_admin)):
    """
    將網站文章匯出到 Notion Database
    
    適用於：Admin 後台手動建立的文章（notion_page_id = NULL）
    執行後：在 Notion 建立對應 card，並將 notion_page_id 寫回 blog_posts
    """
    async with db.pool.acquire() as conn:
        post = await conn.fetchrow(
            "SELECT * FROM blog_posts WHERE id = $1",
            post_id
        )
    
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    post_dict = dict(post)
    
    # 已有 notion_page_id，不需要重複建立
    if post_dict.get("notion_page_id"):
        raise HTTPException(
            status_code=400,
            detail=f"文章已有對應的 Notion page: {post_dict['notion_page_id']}"
        )
    
    try:
        # Notion 的 select 欄位：傳入不存在的選項名稱時，Notion 會自動新增
        # 因此直接使用網站的 category 值，不需要對應表
        # 這確保兩邊的分類保持完全一致（對等）
        pillar = post_dict.get("category", "PR Strategy") or "PR Strategy"
        
        # status 對應到 Notion Status
        status_map = {
            "published": "Published",
            "draft": "Draft",
            "archived": "Archived",
        }
        notion_status = status_map.get(post_dict["status"], "Draft")
        
        # 從 HTML content 提取純文字，建立 Notion paragraph blocks
        plain_text = re.sub('<[^<]+?>', '', post_dict.get("content") or "")
        plain_text = plain_text.strip()
        
        # 切成每 2000 字一段（Notion 每個 rich_text block 最多 2000 字）
        MAX_BLOCK_LENGTH = 1900
        content_blocks = []
        for i in range(0, len(plain_text), MAX_BLOCK_LENGTH):
            chunk = plain_text[i:i + MAX_BLOCK_LENGTH]
            if chunk.strip():
                content_blocks.append({
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [{"type": "text", "text": {"content": chunk}}]
                    }
                })
        
        # 建立 Notion page
        page_data = {
            "parent": {
                "type": "database_id",
                "database_id": settings.NOTION_DATABASE_ID
            },
            "properties": {
                "Title": {
                    "title": [{"type": "text", "text": {"content": post_dict["title"]}}]
                },
                "Pillar": {
                    "select": {"name": pillar}
                },
                "Status": {
                    "select": {"name": notion_status}
                },
            },
            "children": content_blocks[:50]  # Notion 一次最多 100 個 blocks
        }
        
        # 加入選填欄位（有值才加）
        if post_dict.get("meta_description"):
            page_data["properties"]["Meta Description"] = {
                "rich_text": [{"type": "text", "text": {"content": post_dict["meta_description"][:2000]}}]
            }
        
        if post_dict.get("author"):
            page_data["properties"]["Author"] = {
                "rich_text": [{"type": "text", "text": {"content": post_dict["author"]}}]
            }
        
        if post_dict.get("published_at"):
            page_data["properties"]["Publish Date"] = {
                "date": {"start": post_dict["published_at"].strftime("%Y-%m-%d")}
            }
        
        # 呼叫 Notion API 建立 page
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                "https://api.notion.com/v1/pages",
                headers={
                    "Authorization": f"Bearer {settings.NOTION_API_KEY}",
                    "Notion-Version": "2022-06-28",
                    "Content-Type": "application/json"
                },
                json=page_data
            )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"Notion 建立 page 失敗: {response.text}"
            )
        
        notion_page = response.json()
        notion_page_id = notion_page["id"]
        notion_url = notion_page.get("url", "")
        
        # 更新 blog_posts 寫入 notion_page_id
        async with db.pool.acquire() as conn:
            await conn.execute(
                """
                UPDATE blog_posts
                SET notion_page_id = $1,
                    sync_source = 'notion',
                    updated_at = NOW()
                WHERE id = $2
                """,
                notion_page_id,
                post_id
            )
        
        logger.info(f"✅ 文章 {post_id} 已匯出到 Notion: {notion_page_id}")
        
        return {
            "success": True,
            "post_id": post_id,
            "notion_page_id": notion_page_id,
            "notion_url": notion_url,
            "message": f"已成功在 Notion 建立對應 card。Notion 頁面：{notion_url}"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ 匯出到 Notion 失敗: {e}")
        raise HTTPException(status_code=500, detail=f"匯出失敗: {str(e)}")


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
        # 只在需要時才 import（避免影響 backend 啟動）
        from notion_client import Client
        
        notion = Client(auth=settings.NOTION_API_KEY)
        
        # 取得 page properties
        page = notion.pages.retrieve(page_id=payload.notion_page_id)
        props = page['properties']
        
        # ── 提前檢查 Status：若為 Archive，直接封存文章，不做內容同步 ──
        notion_status = props.get('Status', {}).get('select', {}).get('name', '')
        
        if notion_status == 'Archive':
            async with db.pool.acquire() as conn:
                existing = await conn.fetchrow(
                    "SELECT id, slug FROM blog_posts WHERE notion_page_id = $1",
                    payload.notion_page_id
                )
                if not existing:
                    raise HTTPException(
                        status_code=404,
                        detail=f"找不到對應的文章（notion_page_id={payload.notion_page_id}）"
                    )
                await conn.execute(
                    "UPDATE blog_posts SET status = 'archived', updated_at = NOW() WHERE id = $1",
                    existing['id']
                )
            frontend_url = settings.FRONTEND_URL.rstrip('/')
            return {
                "id": existing['id'],
                "slug": existing['slug'],
                "notion_page_id": payload.notion_page_id,
                "_sync_action": "archived",
                "article_url": f"{frontend_url}/blog/{existing['slug']}",
            }
        # ── 以下為正常 Publish / Update 流程 ──

        # 提取欄位
        title = props.get('Title', {}).get('title', [{}])[0].get('plain_text', 'Untitled')
        pillar = props.get('Pillar', {}).get('select', {}).get('name', 'Industry News')
        
        # Meta Description
        meta_desc_array = props.get('Meta Description', {}).get('rich_text', [])
        meta_description = ''.join([t.get('plain_text', '') for t in meta_desc_array])
        
        # Author
        author_array = props.get('Author', {}).get('rich_text', [])
        author = ''.join([t.get('plain_text', '') for t in author_array]) or 'VortixPR Team'
        
        # Cover Image（所有圖片都上傳到 R2）
        cover_files = props.get('Cover Image', {}).get('files', [])
        cover_image_url = ''
        if cover_files:
            original_cover_url = cover_files[0].get('file', {}).get('url') or cover_files[0].get('external', {}).get('url', '')
            
            if original_cover_url:
                # 所有圖片都上傳到 R2（不論來源）
                try:
                    async with httpx.AsyncClient(timeout=30.0) as client:
                        response = await client.get(original_cover_url)
                        if response.status_code == 200:
                            # 從 content-type 判斷副檔名
                            content_type = response.headers.get('content-type', 'image/jpeg')
                            ext_map = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp'}
                            ext = ext_map.get(content_type, 'jpg')
                            
                            filename = f"notion-blog-{payload.notion_page_id[:8]}-cover.{ext}"
                            upload_result = r2_storage.upload_file(
                                file_content=response.content,
                                filename=filename,
                                folder="blog-covers",
                                content_type=content_type
                            )
                            cover_image_url = upload_result['url']
                        else:
                            cover_image_url = original_cover_url  # 下載失敗，fallback
                except Exception as e:
                    cover_image_url = original_cover_url  # 出錯，fallback
                    import logging
                    logging.getLogger(__name__).warning(f"⚠️ 封面圖上傳失敗: {e}")
            else:
                cover_image_url = ''
        
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
        
        # 轉換為 HTML 並處理圖片（下載 Notion 圖片到 R2）
        html_content = await _convert_blocks_to_html_and_upload_images(blocks, payload.notion_page_id)
        
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


async def _convert_blocks_to_html_and_upload_images(blocks, page_id: str):
    """轉換 Notion blocks 為 HTML，並上傳圖片到 R2"""
    
    def get_text(rich_text_array):
        if not rich_text_array:
            return ''
        return ''.join([t.get('plain_text', '') for t in rich_text_array])
    
    html_parts = []
    image_count = 0
    
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
            original_url = block['image'].get('external', {}).get('url') or block['image'].get('file', {}).get('url', '')
            if original_url:
                # 如果是 Notion 的臨時 URL，下載並上傳到 R2
                if 'prod-files-secure.s3' in original_url or 'amazonaws.com' in original_url:
                    try:
                        # 下載圖片
                        async with httpx.AsyncClient() as client:
                            response = await client.get(original_url)
                            if response.status_code == 200:
                                image_count += 1
                                # 生成檔名
                                filename = f"notion-blog-{page_id[:8]}-img-{image_count}.jpg"
                                
                                # 上傳到 R2
                                upload_result = r2_storage.upload_file(
                                    file_content=response.content,
                                    filename=filename,
                                    folder="blog-images",
                                    content_type=response.headers.get('content-type', 'image/jpeg')
                                )
                                
                                # 使用 R2 的永久 URL
                                final_url = upload_result['url']
                            else:
                                final_url = original_url  # 下載失敗，用原始 URL
                    except Exception as e:
                        final_url = original_url  # 出錯，用原始 URL
                else:
                    final_url = original_url  # 已經是外部 URL，直接使用
                
                html_parts.append(f'<img src="{final_url}" alt="Image" />')
        elif block_type == 'divider':
            html_parts.append('<hr />')
        # 可以之後再加更多類型（quote, code, callout 等）
    
    return '\n'.join(html_parts)


async def _convert_blocks_to_html_and_upload_images(blocks, page_id: str):
    """
    轉換 Notion blocks 為 HTML，並上傳 Notion 圖片到 R2
    
    Notion 的圖片 URL 會過期，需要下載並上傳到我們的 R2
    """
    
    def get_text(rich_text_array):
        if not rich_text_array:
            return ''
        return ''.join([t.get('plain_text', '') for t in rich_text_array])
    
    html_parts = []
    image_count = 0
    
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
            original_url = block['image'].get('external', {}).get('url') or block['image'].get('file', {}).get('url', '')
            
            if original_url:
                # 所有圖片都上傳到 R2（完全掌控）
                try:
                    # 下載圖片
                    async with httpx.AsyncClient(timeout=30.0) as client:
                        response = await client.get(original_url)
                        
                        if response.status_code == 200:
                            image_count += 1
                            
                            # 從 content-type 判斷副檔名
                            content_type = response.headers.get('content-type', 'image/jpeg')
                            ext_map = {
                                'image/jpeg': 'jpg',
                                'image/png': 'png',
                                'image/gif': 'gif',
                                'image/webp': 'webp'
                            }
                            ext = ext_map.get(content_type, 'jpg')
                            
                            filename = f"notion-blog-{page_id[:8]}-img-{image_count}.{ext}"
                            
                            # 上傳到 R2
                            upload_result = r2_storage.upload_file(
                                file_content=response.content,
                                filename=filename,
                                folder="blog-images",
                                content_type=content_type
                            )
                            
                            final_url = upload_result['url']
                            import logging
                            logging.getLogger(__name__).info(f"✅ 圖片已上傳到 R2: {filename} (原始: {original_url[:50]}...)")
                        else:
                            final_url = original_url  # 下載失敗，fallback
                            import logging
                            logging.getLogger(__name__).warning(f"⚠️ 下載圖片失敗 {response.status_code}: {original_url[:80]}")
                
                except Exception as e:
                    final_url = original_url  # 出錯，fallback
                    import logging
                    logging.getLogger(__name__).warning(f"⚠️ 圖片處理失敗: {e}")
                
                html_parts.append(f'<img src="{final_url}" alt="Image" />')
        
        elif block_type == 'divider':
            html_parts.append('<hr />')
    
    return '\n'.join(html_parts)


def _calculate_read_time(html_content: str) -> int:
    """自動計算閱讀時間（基於內容長度）"""
    # 移除 HTML tags
    text = re.sub('<[^<]+?>', '', html_content)
    
    # 計算字數
    word_count = len(text.split())
    
    # 計算閱讀時間（假設 250 字/分鐘）
    read_time = max(1, round(word_count / 250))
    
    return read_time


async def _sync_status_to_notion(notion_page_id: str, notion_status: str) -> bool:
    """
    同步狀態變更到 Notion（Website → Notion 方向）
    
    Backend 直接呼叫 Notion API，不經過 N8N。
    
    Args:
        notion_page_id: Notion page ID
        notion_status: 要設定的 Notion Status 值（"Published"/"Draft"/"Archived"）
    
    Returns:
        bool: True = 成功，False = 失敗
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.patch(
                f"https://api.notion.com/v1/pages/{notion_page_id}",
                headers={
                    "Authorization": f"Bearer {settings.NOTION_API_KEY}",
                    "Notion-Version": "2022-06-28",
                    "Content-Type": "application/json"
                },
                json={
                    "properties": {
                        "Status": {
                            "select": {
                                "name": notion_status
                            }
                        }
                    }
                }
            )
            
            if response.status_code == 200:
                logger.info(f"✅ Notion 狀態已同步為 {notion_status}: {notion_page_id}")
                return True
            else:
                logger.warning(f"⚠️ Notion 狀態更新失敗 HTTP {response.status_code}: {notion_page_id}")
                return False
    
    except Exception as e:
        logger.warning(f"⚠️ Notion 狀態同步失敗（不影響網站操作）: {e}")
        return False






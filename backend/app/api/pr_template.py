from fastapi import APIRouter, HTTPException, Request
from typing import List, Optional
import logging
import json
import secrets
from datetime import datetime

from ..core.database import db
from ..models.pr_template import (
    PRTemplateResponse,
    WaitlistCreate,
    WaitlistResponse,
    EmailRequestCreate,
    EmailRequestResponse
)
from ..services.email_service import email_service

router = APIRouter(prefix="/api/public")
logger = logging.getLogger(__name__)


# ==================== Public Template APIs ====================

@router.get("/templates/stats")
async def get_template_stats():
    """
    獲取模板統計數據（公開）
    
    ⚠️ 注意：此路由必須在 /templates/{template_id} 之前定義
    """
    async with db.pool.acquire() as conn:
        stats = await conn.fetchrow("""
            SELECT 
                COUNT(*) as total_templates,
                SUM(download_count) as total_downloads,
                SUM(preview_count) as total_previews,
                SUM(waitlist_count) as total_waitlist
            FROM pr_templates
            WHERE is_active = TRUE
        """)
        
        popular = await conn.fetch("""
            SELECT id, title, category, download_count
            FROM pr_templates
            WHERE is_active = TRUE
            ORDER BY download_count DESC
            LIMIT 5
        """)
        
        return {
            "overview": dict(stats),
            "popular_templates": [dict(row) for row in popular]
        }


@router.get("/templates", response_model=List[PRTemplateResponse])
async def get_templates(
    category: Optional[str] = None,
    industry: Optional[str] = None,
    search: Optional[str] = None,
    sort: str = "popular"
):
    """
    獲取所有啟用的 PR 模板
    
    Query params:
    - category: 分類篩選（Launch, Finance, etc.）
    - industry: 產業篩選（Tech, SaaS, etc.）
    - search: 關鍵字搜尋
    - sort: 排序方式（popular, latest, name）
    """
    async with db.pool.acquire() as conn:
        # Base query
        query = """
            SELECT id, title, description, category, category_color, icon,
                   content, industry_tags, use_cases, includes,
                   download_count, email_request_count, preview_count, waitlist_count,
                   is_active, display_order, created_at, updated_at
            FROM pr_templates
            WHERE is_active = TRUE
        """
        params = []
        param_count = 0
        
        # Category filter
        if category:
            param_count += 1
            query += f" AND category = ${param_count}"
            params.append(category)
        
        # Industry filter
        if industry and industry != "All":
            param_count += 1
            query += f" AND (industry_tags @> ${param_count}::jsonb OR industry_tags @> '[\"All Industries\"]'::jsonb)"
            params.append(json.dumps([industry]))
        
        # Search filter
        if search:
            param_count += 1
            query += f" AND (title ILIKE ${param_count} OR description ILIKE ${param_count} OR category ILIKE ${param_count})"
            params.append(f"%{search}%")
        
        # Sorting
        if sort == "popular":
            query += " ORDER BY download_count DESC, preview_count DESC"
        elif sort == "latest":
            query += " ORDER BY created_at DESC"
        elif sort == "name":
            query += " ORDER BY title ASC"
        else:
            query += " ORDER BY display_order ASC, created_at DESC"
        
        rows = await conn.fetch(query, *params)
        
        # 轉換資料格式
        results = []
        for row in rows:
            data = dict(row)
            # JSONB 欄位轉換
            if isinstance(data.get('industry_tags'), str):
                data['industry_tags'] = json.loads(data['industry_tags'])
            if isinstance(data.get('use_cases'), str):
                data['use_cases'] = json.loads(data['use_cases'])
            if isinstance(data.get('includes'), str):
                data['includes'] = json.loads(data['includes'])
            # Datetime 轉換為 ISO string
            if data.get('created_at'):
                data['created_at'] = data['created_at'].isoformat()
            if data.get('updated_at'):
                data['updated_at'] = data['updated_at'].isoformat()
            results.append(data)
        
        return results


@router.get("/templates/{template_id}", response_model=PRTemplateResponse)
async def get_template(template_id: int):
    """
    獲取單一模板詳情（自動記錄 preview_count）
    """
    async with db.pool.acquire() as conn:
        # 增加 preview_count
        await conn.execute("""
            UPDATE pr_templates 
            SET preview_count = preview_count + 1
            WHERE id = $1
        """, template_id)
        
        # 獲取模板
        row = await conn.fetchrow("""
            SELECT id, title, description, category, category_color, icon,
                   content, industry_tags, use_cases, includes,
                   download_count, email_request_count, preview_count, waitlist_count,
                   is_active, display_order, created_at, updated_at
            FROM pr_templates
            WHERE id = $1 AND is_active = TRUE
        """, template_id)
        
        if not row:
            raise HTTPException(status_code=404, detail="Template not found")
        
        # 轉換資料格式
        data = dict(row)
        # JSONB 欄位
        if isinstance(data.get('industry_tags'), str):
            data['industry_tags'] = json.loads(data['industry_tags'])
        if isinstance(data.get('use_cases'), str):
            data['use_cases'] = json.loads(data['use_cases'])
        if isinstance(data.get('includes'), str):
            data['includes'] = json.loads(data['includes'])
        # Datetime 轉換
        if data.get('created_at'):
            data['created_at'] = data['created_at'].isoformat()
        if data.get('updated_at'):
            data['updated_at'] = data['updated_at'].isoformat()
        
        return data


@router.post("/templates/waitlist", response_model=dict)
async def join_waitlist(
    data: WaitlistCreate,
    request: Request
):
    """
    加入 AI PR Editor Waitlist
    """
    async with db.pool.acquire() as conn:
        # 檢查模板是否存在
        template = await conn.fetchrow("""
            SELECT id, title FROM pr_templates WHERE id = $1
        """, data.template_id)
        
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        # 檢查是否已經在 waitlist 中
        existing = await conn.fetchrow("""
            SELECT id FROM template_waitlist 
            WHERE email = $1 AND template_id = $2
        """, data.email, data.template_id)
        
        if existing:
            return {
                "success": True,
                "message": "You're already on the waitlist!",
                "already_exists": True
            }
        
        # 加入 waitlist
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")
        
        await conn.execute("""
            INSERT INTO template_waitlist (
                template_id, email, name, subscribe_newsletter,
                source_template_title, ip_address, user_agent
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        """, 
            data.template_id,
            data.email,
            data.name,
            data.subscribe_newsletter,
            template["title"],
            client_ip,
            user_agent
        )
        
        # 更新模板的 waitlist_count
        await conn.execute("""
            UPDATE pr_templates 
            SET waitlist_count = waitlist_count + 1
            WHERE id = $1
        """, data.template_id)
        
        # 如果訂閱 newsletter，也加入 newsletter 表
        if data.subscribe_newsletter:
            await conn.execute("""
                INSERT INTO newsletter_subscribers (email, source, ip_address)
                VALUES ($1, $2, $3)
                ON CONFLICT (email) DO NOTHING
            """, data.email, f"template_waitlist_{template['title']}", client_ip)
        
        # TODO: 發送確認信（使用 Resend）
        # await send_waitlist_confirmation_email(data.email, data.name, template["title"])
        
        logger.info(f"✅ New waitlist signup: {data.email} for {template['title']}")
        
        return {
            "success": True,
            "message": "Successfully joined the waitlist!",
            "template_title": template["title"]
        }


@router.post("/templates/{template_id}/email", response_model=EmailRequestResponse)
async def request_template_email(
    template_id: int,
    data: EmailRequestCreate,
    request: Request
):
    """
    請求將模板發送到 Email
    """
    async with db.pool.acquire() as conn:
        # 檢查模板是否存在
        template = await conn.fetchrow("""
            SELECT id, title, content FROM pr_templates 
            WHERE id = $1 AND is_active = TRUE
        """, template_id)
        
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        # 生成追蹤 ID
        tracking_id = secrets.token_urlsafe(32)
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")
        
        # 記錄請求
        await conn.execute("""
            INSERT INTO template_email_requests (
                template_id, email, tracking_id, ip_address, user_agent
            )
            VALUES ($1, $2, $3, $4, $5)
        """, template_id, data.email, tracking_id, client_ip, user_agent)
        
        # 更新模板的 email_request_count
        await conn.execute("""
            UPDATE pr_templates 
            SET email_request_count = email_request_count + 1
            WHERE id = $1
        """, template_id)
        
        # 發送 Email（使用 Resend）
        email_sent = await email_service.send_template_email(
            to_email=data.email,
            template_title=template["title"],
            template_content=template["content"],
            tracking_id=tracking_id
        )
        
        if email_sent:
            logger.info(f"✅ Email sent successfully: {data.email} for {template['title']}")
        else:
            logger.warning(f"⚠️ Email sending failed but request recorded: {data.email}")
        
        return EmailRequestResponse(
            success=True,
            message=f"Template will be sent to {data.email}",
            tracking_id=tracking_id
        )




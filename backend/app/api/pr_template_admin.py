from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
import logging
import json
from datetime import datetime, timedelta

from ..core.database import db
from ..models.pr_template import (
    PRTemplateCreate,
    PRTemplateUpdate,
    PRTemplateResponse,
    WaitlistResponse
)
from ..utils.security import require_admin
from ..models.user import TokenData

router = APIRouter(prefix="/api/admin")
logger = logging.getLogger(__name__)


# ==================== Template CRUD ====================

@router.get("/templates", response_model=List[PRTemplateResponse])
async def admin_get_templates(
    current_user: TokenData = Depends(require_admin)
):
    """
    Admin: 獲取所有模板（包含停用的）
    """
    
    async with db.pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, title, description, category, category_color, icon,
                   content, industry_tags, use_cases, includes,
                   download_count, email_request_count, preview_count, waitlist_count,
                   is_active, display_order, created_at, updated_at
            FROM pr_templates
            ORDER BY display_order ASC, created_at DESC
        """)
        
        # 轉換 JSONB 欄位
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
            results.append(data)
        
        return results


@router.post("/templates", response_model=PRTemplateResponse)
async def admin_create_template(
    template: PRTemplateCreate,
    current_user: TokenData = Depends(require_admin)
):
    """
    Admin: 創建新模板
    """
    
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow("""
            INSERT INTO pr_templates (
                title, description, category, category_color, icon,
                content, industry_tags, use_cases, includes, display_order
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9::jsonb, $10)
            RETURNING id, title, description, category, category_color, icon,
                      content, industry_tags, use_cases, includes,
                      download_count, email_request_count, preview_count, waitlist_count,
                      is_active, display_order, created_at, updated_at
        """,
            template.title,
            template.description,
            template.category,
            template.category_color,
            template.icon,
            template.content,
            json.dumps(template.industry_tags),
            json.dumps(template.use_cases),
            json.dumps(template.includes),
            template.display_order
        )
        
        # 轉換 JSONB 和 datetime
        result = dict(row)
        if isinstance(result.get('industry_tags'), str):
            result['industry_tags'] = json.loads(result['industry_tags'])
        if isinstance(result.get('use_cases'), str):
            result['use_cases'] = json.loads(result['use_cases'])
        if isinstance(result.get('includes'), str):
            result['includes'] = json.loads(result['includes'])
        if result.get('created_at'):
            result['created_at'] = result['created_at'].isoformat()
        if result.get('updated_at'):
            result['updated_at'] = result['updated_at'].isoformat()
        
        logger.info(f"✅ Admin {current_user.email} created template: {template.title}")
        return result


@router.put("/templates/{template_id}", response_model=PRTemplateResponse)
async def admin_update_template(
    template_id: int,
    template: PRTemplateUpdate,
    current_user: TokenData = Depends(require_admin)
):
    """
    Admin: 更新模板
    """
    
    async with db.pool.acquire() as conn:
        # 檢查模板是否存在
        existing = await conn.fetchrow("SELECT id FROM pr_templates WHERE id = $1", template_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Template not found")
        
        # 動態建構更新語句
        updates = []
        params = []
        param_count = 0
        
        if template.title is not None:
            param_count += 1
            updates.append(f"title = ${param_count}")
            params.append(template.title)
        
        if template.description is not None:
            param_count += 1
            updates.append(f"description = ${param_count}")
            params.append(template.description)
        
        if template.category is not None:
            param_count += 1
            updates.append(f"category = ${param_count}")
            params.append(template.category)
        
        if template.category_color is not None:
            param_count += 1
            updates.append(f"category_color = ${param_count}")
            params.append(template.category_color)
        
        if template.icon is not None:
            param_count += 1
            updates.append(f"icon = ${param_count}")
            params.append(template.icon)
        
        if template.content is not None:
            param_count += 1
            updates.append(f"content = ${param_count}")
            params.append(template.content)
        
        if template.industry_tags is not None:
            param_count += 1
            updates.append(f"industry_tags = ${param_count}::jsonb")
            params.append(json.dumps(template.industry_tags))
        
        if template.use_cases is not None:
            param_count += 1
            updates.append(f"use_cases = ${param_count}::jsonb")
            params.append(json.dumps(template.use_cases))
        
        if template.includes is not None:
            param_count += 1
            updates.append(f"includes = ${param_count}::jsonb")
            params.append(json.dumps(template.includes))
        
        if template.is_active is not None:
            param_count += 1
            updates.append(f"is_active = ${param_count}")
            params.append(template.is_active)
        
        if template.display_order is not None:
            param_count += 1
            updates.append(f"display_order = ${param_count}")
            params.append(template.display_order)
        
        if not updates:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        # 更新 updated_at
        updates.append("updated_at = NOW()")
        
        param_count += 1
        query = f"""
            UPDATE pr_templates 
            SET {', '.join(updates)}
            WHERE id = ${param_count}
            RETURNING id, title, description, category, category_color, icon,
                      content, industry_tags, use_cases, includes,
                      download_count, email_request_count, preview_count, waitlist_count,
                      is_active, display_order, created_at, updated_at
        """
        params.append(template_id)
        
        row = await conn.fetchrow(query, *params)
        
        # 轉換 JSONB 和 datetime
        result = dict(row)
        if isinstance(result.get('industry_tags'), str):
            result['industry_tags'] = json.loads(result['industry_tags'])
        if isinstance(result.get('use_cases'), str):
            result['use_cases'] = json.loads(result['use_cases'])
        if isinstance(result.get('includes'), str):
            result['includes'] = json.loads(result['includes'])
        if result.get('created_at'):
            result['created_at'] = result['created_at'].isoformat()
        if result.get('updated_at'):
            result['updated_at'] = result['updated_at'].isoformat()
        
        logger.info(f"✅ Admin {current_user.email} updated template: {template_id}")
        return result


@router.delete("/templates/{template_id}")
async def admin_delete_template(
    template_id: int,
    current_user: TokenData = Depends(require_admin)
):
    """
    Admin: 刪除模板
    """
    
    async with db.pool.acquire() as conn:
        result = await conn.execute("""
            DELETE FROM pr_templates WHERE id = $1
        """, template_id)
        
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Template not found")
        
        logger.info(f"✅ Admin {current_user.email} deleted template: {template_id}")
        return {"success": True, "message": "Template deleted"}


# ==================== Waitlist Management ====================

@router.get("/templates/waitlist", response_model=List[WaitlistResponse])
async def admin_get_waitlist(
    template_id: Optional[int] = None,
    status: Optional[str] = None,
    current_user: TokenData = Depends(require_admin)
):
    """
    Admin: 獲取 Waitlist 名單
    """
    
    async with db.pool.acquire() as conn:
        query = """
            SELECT id, template_id, email, name, subscribe_newsletter,
                   source_template_title, status, created_at
            FROM template_waitlist
            WHERE 1=1
        """
        params = []
        param_count = 0
        
        if template_id:
            param_count += 1
            query += f" AND template_id = ${param_count}"
            params.append(template_id)
        
        if status:
            param_count += 1
            query += f" AND status = ${param_count}"
            params.append(status)
        
        query += " ORDER BY created_at DESC"
        
        rows = await conn.fetch(query, *params)
        return [dict(row) for row in rows]


@router.get("/templates/analytics/overview")
async def admin_get_analytics(
    current_user: TokenData = Depends(require_admin)
):
    """
    Admin: 獲取分析數據
    """
    
    async with db.pool.acquire() as conn:
        # 總體統計
        overview = await conn.fetchrow("""
            SELECT 
                COUNT(*) as total_templates,
                SUM(download_count) as total_downloads,
                SUM(preview_count) as total_previews,
                SUM(waitlist_count) as total_waitlist,
                SUM(email_request_count) as total_email_requests
            FROM pr_templates
        """)
        
        # 最受歡迎模板
        popular = await conn.fetch("""
            SELECT id, title, category, download_count, preview_count, waitlist_count
            FROM pr_templates
            WHERE is_active = TRUE
            ORDER BY download_count DESC
            LIMIT 10
        """)
        
        # 最近 30 天的 waitlist 增長
        waitlist_growth = await conn.fetch("""
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as signups
            FROM template_waitlist
            WHERE created_at >= NOW() - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        """)
        
        # Email 表現
        email_stats = await conn.fetchrow("""
            SELECT 
                COUNT(*) as total_sent,
                COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END) as total_opened,
                COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END) as total_clicked
            FROM template_email_requests
            WHERE sent_at IS NOT NULL
        """)
        
        return {
            "overview": dict(overview),
            "popular_templates": [dict(row) for row in popular],
            "waitlist_growth": [dict(row) for row in waitlist_growth],
            "email_performance": dict(email_stats) if email_stats else {}
        }


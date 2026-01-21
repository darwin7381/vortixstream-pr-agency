"""
網站設定管理 - Navigation & Footer Admin API
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import asyncpg

from ..core.database import Database
from ..utils.security import require_admin
from ..models.user import TokenData

router = APIRouter(prefix="/admin/site", tags=["Site Admin"])

# 資料庫依賴
async def get_db_conn():
    from ..main import app
    db: Database = app.state.db
    async with db.pool.acquire() as conn:
        yield conn


# ==================== Models ====================

class NavigationItemCreate(BaseModel):
    label_en: str
    label_zh: Optional[str] = None
    label_ja: Optional[str] = None
    desktop_url: str
    mobile_url: Optional[str] = None
    target: str = '_self'
    parent_id: Optional[int] = None
    display_order: int = 0
    is_active: bool = True


class NavigationItemUpdate(BaseModel):
    label_en: Optional[str] = None
    label_zh: Optional[str] = None
    label_ja: Optional[str] = None
    desktop_url: Optional[str] = None
    mobile_url: Optional[str] = None
    target: Optional[str] = None
    parent_id: Optional[int] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class NavigationCTAUpdate(BaseModel):
    text_en: Optional[str] = None
    text_zh: Optional[str] = None
    text_ja: Optional[str] = None
    url: Optional[str] = None
    is_active: Optional[bool] = None


class FooterSectionCreate(BaseModel):
    section_key: str
    title_en: str
    title_zh: Optional[str] = None
    title_ja: Optional[str] = None
    display_order: int = 0
    is_active: bool = True


class FooterSectionUpdate(BaseModel):
    section_key: Optional[str] = None
    title_en: Optional[str] = None
    title_zh: Optional[str] = None
    title_ja: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class FooterLinkCreate(BaseModel):
    section_id: int
    label_en: str
    label_zh: Optional[str] = None
    label_ja: Optional[str] = None
    url: str
    target: str = '_self'
    display_order: int = 0
    is_active: bool = True


class FooterLinkUpdate(BaseModel):
    section_id: Optional[int] = None
    label_en: Optional[str] = None
    label_zh: Optional[str] = None
    label_ja: Optional[str] = None
    url: Optional[str] = None
    target: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class FooterTextSettingUpdate(BaseModel):
    value_en: Optional[str] = None
    value_zh: Optional[str] = None
    value_ja: Optional[str] = None


# ==================== Navigation Items CRUD ====================

@router.get("/navigation/items")
async def get_all_navigation_items(
    current_user: TokenData = Depends(require_admin),
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有 Navigation Items（包括未啟用的）"""
    rows = await conn.fetch("""
        SELECT * FROM navigation_items 
        ORDER BY display_order ASC, id ASC
    """)
    return [dict(row) for row in rows]


@router.post("/navigation/items")
async def create_navigation_item(
    data: NavigationItemCreate,
    current_user: TokenData = Depends(require_admin),
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """創建 Navigation Item"""
    row = await conn.fetchrow("""
        INSERT INTO navigation_items 
        (label_en, label_zh, label_ja, desktop_url, mobile_url, target, parent_id, display_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    """, data.label_en, data.label_zh, data.label_ja, data.desktop_url, data.mobile_url,
        data.target, data.parent_id, data.display_order, data.is_active)
    
    return dict(row)


@router.put("/navigation/items/{item_id}")
async def update_navigation_item(
    item_id: int,
    data: NavigationItemUpdate,
    current_user: TokenData = Depends(require_admin),
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """
    更新 Navigation Item
    
    ⚠️ 重要：使用 model_dump(exclude_unset=True) 來區分「未提供」和「空值」
    - exclude_unset=True：只包含前端明確提供的欄位
    - 這樣可以正確處理空字串（前端想清空欄位）
    """
    # 使用 exclude_unset=True 只獲取前端明確提供的欄位
    update_data = data.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    updates = []
    values = []
    param_count = 1
    
    for field, value in update_data.items():
        updates.append(f"{field} = ${param_count}")
        values.append(value)
        param_count += 1
    
    # 添加 updated_at
    updates.append(f"updated_at = NOW()")
    
    # 添加 WHERE 條件的參數
    values.append(item_id)
    
    query = f"""
        UPDATE navigation_items 
        SET {', '.join(updates)}
        WHERE id = ${param_count}
        RETURNING *
    """
    
    row = await conn.fetchrow(query, *values)
    if not row:
        raise HTTPException(status_code=404, detail="Navigation item not found")
    
    return dict(row)


@router.delete("/navigation/items/{item_id}")
async def delete_navigation_item(
    item_id: int,
    current_user: TokenData = Depends(require_admin),
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """刪除 Navigation Item"""
    await conn.execute("""
        DELETE FROM navigation_items WHERE id = $1
    """, item_id)
    
    return {"message": "Navigation item deleted successfully"}


# ==================== Navigation CTA ====================

@router.get("/navigation/cta")
async def get_navigation_cta_admin(
    current_user: TokenData = Depends(require_admin),
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得 Navigation CTA（管理用，包含所有語言）"""
    row = await conn.fetchrow("""
        SELECT * FROM navigation_cta 
        WHERE is_active = true 
        LIMIT 1
    """)
    
    return dict(row) if row else None


@router.patch("/navigation/cta")
async def update_navigation_cta(
    data: NavigationCTAUpdate,
    current_user: TokenData = Depends(require_admin),
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """更新 Navigation CTA"""
    # 先取得現有記錄
    existing = await conn.fetchrow("SELECT id FROM navigation_cta LIMIT 1")
    
    if not existing:
        # 如果不存在，創建一個
        row = await conn.fetchrow("""
            INSERT INTO navigation_cta (text_en, text_zh, text_ja, url, is_active)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        """, data.text_en or 'Get Started', data.text_zh, data.text_ja, 
            data.url or '/contact', data.is_active if data.is_active is not None else True)
    else:
        # ✅ 修復：使用 model_dump(exclude_unset=True) 來區分「未提供」和「空值」
        update_data = data.model_dump(exclude_unset=True)
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        updates = []
        values = []
        param_count = 1
        
        for field, value in update_data.items():
            updates.append(f"{field} = ${param_count}")
            values.append(value)
            param_count += 1
        
        updates.append(f"updated_at = NOW()")
        values.append(existing['id'])
        
        query = f"""
            UPDATE navigation_cta 
            SET {', '.join(updates)}
            WHERE id = ${param_count}
            RETURNING *
        """
        
        row = await conn.fetchrow(query, *values)
    
    return dict(row)


# ==================== Footer Sections CRUD ====================

@router.get("/footer/sections")
async def get_all_footer_sections(
    current_user: TokenData = Depends(require_admin),
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有 Footer Sections（包括未啟用的，含 links）"""
    sections = await conn.fetch("""
        SELECT * FROM footer_sections 
        ORDER BY display_order ASC, id ASC
    """)
    
    result = []
    for section in sections:
        links = await conn.fetch("""
            SELECT * FROM footer_links 
            WHERE section_id = $1 
            ORDER BY display_order ASC
        """, section['id'])
        
        result.append({
            **dict(section),
            'links': [dict(link) for link in links]
        })
    
    return result


@router.post("/footer/sections")
async def create_footer_section(
    data: FooterSectionCreate,
    current_user: TokenData = Depends(require_admin),
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """創建 Footer Section"""
    row = await conn.fetchrow("""
        INSERT INTO footer_sections 
        (section_key, title_en, title_zh, title_ja, display_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    """, data.section_key, data.title_en, data.title_zh, data.title_ja,
        data.display_order, data.is_active)
    
    return dict(row)


@router.put("/footer/sections/{section_id}")
async def update_footer_section(
    section_id: int,
    data: FooterSectionUpdate,
    current_user: TokenData = Depends(require_admin),
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """✅ 修復：使用 model_dump(exclude_unset=True) 來區分「未提供」和「空值」"""
    update_data = data.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    updates = []
    values = []
    param_count = 1
    
    for field, value in update_data.items():
        updates.append(f"{field} = ${param_count}")
        values.append(value)
        param_count += 1
    
    updates.append(f"updated_at = NOW()")
    values.append(section_id)
    
    query = f"""
        UPDATE footer_sections 
        SET {', '.join(updates)}
        WHERE id = ${param_count}
        RETURNING *
    """
    
    row = await conn.fetchrow(query, *values)
    if not row:
        raise HTTPException(status_code=404, detail="Footer section not found")
    
    return dict(row)


@router.delete("/footer/sections/{section_id}")
async def delete_footer_section(
    section_id: int,
    current_user: TokenData = Depends(require_admin),
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """刪除 Footer Section（會連帶刪除該 section 下的所有 links）"""
    await conn.execute("""
        DELETE FROM footer_sections WHERE id = $1
    """, section_id)
    
    return {"message": "Footer section deleted successfully"}


# ==================== Footer Links CRUD ====================

@router.post("/footer/links")
async def create_footer_link(
    data: FooterLinkCreate,
    current_user: TokenData = Depends(require_admin),
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """創建 Footer Link"""
    row = await conn.fetchrow("""
        INSERT INTO footer_links 
        (section_id, label_en, label_zh, label_ja, url, target, display_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    """, data.section_id, data.label_en, data.label_zh, data.label_ja,
        data.url, data.target, data.display_order, data.is_active)
    
    return dict(row)


@router.put("/footer/links/{link_id}")
async def update_footer_link(
    link_id: int,
    data: FooterLinkUpdate,
    current_user: TokenData = Depends(require_admin),
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """✅ 修復：使用 model_dump(exclude_unset=True) 來區分「未提供」和「空值」"""
    update_data = data.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    updates = []
    values = []
    param_count = 1
    
    for field, value in update_data.items():
        updates.append(f"{field} = ${param_count}")
        values.append(value)
        param_count += 1
    
    updates.append(f"updated_at = NOW()")
    values.append(link_id)
    
    query = f"""
        UPDATE footer_links 
        SET {', '.join(updates)}
        WHERE id = ${param_count}
        RETURNING *
    """
    
    row = await conn.fetchrow(query, *values)
    if not row:
        raise HTTPException(status_code=404, detail="Footer link not found")
    
    return dict(row)


@router.delete("/footer/links/{link_id}")
async def delete_footer_link(
    link_id: int,
    current_user: TokenData = Depends(require_admin),
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """刪除 Footer Link"""
    await conn.execute("""
        DELETE FROM footer_links WHERE id = $1
    """, link_id)
    
    return {"message": "Footer link deleted successfully"}


# ==================== Footer Text Settings ====================

@router.get("/footer/text-settings")
async def get_all_footer_text_settings(
    current_user: TokenData = Depends(require_admin),
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有 Footer 文字設定"""
    rows = await conn.fetch("""
        SELECT * FROM footer_text_settings 
        ORDER BY setting_key ASC
    """)
    
    return [dict(row) for row in rows]


@router.patch("/footer/text-settings/{setting_key}")
async def update_footer_text_setting(
    setting_key: str,
    data: FooterTextSettingUpdate,
    current_user: TokenData = Depends(require_admin),
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """✅ 修復：使用 model_dump(exclude_unset=True) 來區分「未提供」和「空值」"""
    # 檢查是否存在
    existing = await conn.fetchrow("""
        SELECT id FROM footer_text_settings WHERE setting_key = $1
    """, setting_key)
    
    if not existing:
        raise HTTPException(status_code=404, detail="Setting not found")
    
    # 使用 model_dump(exclude_unset=True)
    update_data = data.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    updates = []
    values = []
    param_count = 1
    
    for field, value in update_data.items():
        updates.append(f"{field} = ${param_count}")
        values.append(value)
        param_count += 1
    
    updates.append(f"updated_at = NOW()")
    values.append(setting_key)
    
    query = f"""
        UPDATE footer_text_settings 
        SET {', '.join(updates)}
        WHERE setting_key = ${param_count}
        RETURNING *
    """
    
    row = await conn.fetchrow(query, *values)
    return dict(row)


"""
內容管理 - 公開 API（前台讀取）
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
import asyncpg

from ..core.database import Database
from ..config import settings
from ..models.content import (
    FAQResponse,
    TestimonialResponse,
    TeamMemberResponse,
    ServiceResponse,
    SettingResponse,
    DifferentiatorResponse,
    StatResponse,
    ClientLogoResponse,
    PublisherFeatureResponse,
    HeroSectionResponse
)

router = APIRouter(prefix="/public/content", tags=["Public Content"])

# 資料庫依賴
async def get_db_conn():
    from ..main import app
    db: Database = app.state.db
    async with db.pool.acquire() as conn:
        yield conn


# ==================== FAQs ====================

@router.get("/faqs", response_model=List[FAQResponse])
async def get_faqs(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有啟用的 FAQs（按順序）"""
    rows = await conn.fetch("""
        SELECT * FROM faqs 
        WHERE is_active = true 
        ORDER BY display_order ASC, id ASC
    """)
    
    return [dict(row) for row in rows]


# ==================== Testimonials ====================

@router.get("/testimonials", response_model=List[TestimonialResponse])
async def get_testimonials(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有啟用的客戶評價（按順序）"""
    rows = await conn.fetch("""
        SELECT * FROM testimonials 
        WHERE is_active = true 
        ORDER BY display_order ASC, id ASC
    """)
    
    return [dict(row) for row in rows]


# ==================== Team Members ====================

@router.get("/team", response_model=List[TeamMemberResponse])
async def get_team_members(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有啟用的團隊成員（按順序）"""
    rows = await conn.fetch("""
        SELECT * FROM team_members 
        WHERE is_active = true 
        ORDER BY display_order ASC, id ASC
    """)
    
    return [dict(row) for row in rows]


# ==================== Services ====================

@router.get("/services", response_model=List[ServiceResponse])
async def get_services(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有啟用的服務項目（按順序）"""
    rows = await conn.fetch("""
        SELECT * FROM services 
        WHERE is_active = true 
        ORDER BY display_order ASC, id ASC
    """)
    
    return [dict(row) for row in rows]


# ==================== Site Settings ====================

@router.get("/settings", response_model=dict)
async def get_site_settings(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有網站設定（key-value 格式）"""
    rows = await conn.fetch("""
        SELECT setting_key, setting_value, setting_type 
        FROM system_settings 
        WHERE setting_key LIKE 'site_%' 
        OR setting_key LIKE 'stats_%' 
        OR setting_key LIKE 'contact_%' 
        OR setting_key LIKE 'social_%'
        ORDER BY setting_key
    """)
    
    # 轉換為 key-value 格式
    settings_dict = {}
    for row in rows:
        key = row['setting_key']
        value = row['setting_value']
        setting_type = row['setting_type']
        
        # 類型轉換
        if setting_type == 'number' or setting_type == 'integer':
            try:
                settings_dict[key] = int(value) if value else 0
            except:
                settings_dict[key] = 0
        elif setting_type == 'boolean':
            settings_dict[key] = value.lower() == 'true' if value else False
        else:
            settings_dict[key] = value
    
    return settings_dict


# ==================== Differentiators ====================

@router.get("/differentiators", response_model=List[DifferentiatorResponse])
async def get_differentiators(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有啟用的特點項目（按順序）"""
    rows = await conn.fetch("""
        SELECT * FROM differentiators 
        WHERE is_active = true 
        ORDER BY display_order ASC, id ASC
    """)
    
    return [dict(row) for row in rows]


# ==================== Stats ====================

@router.get("/stats", response_model=List[StatResponse])
async def get_stats(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有啟用的統計數據（按順序）"""
    rows = await conn.fetch("""
        SELECT * FROM stats 
        WHERE is_active = true 
        ORDER BY display_order ASC, id ASC
    """)
    
    return [dict(row) for row in rows]


# ==================== Client Logos ====================
# 顯示在首頁 "Trusted by industry leaders" 區塊

@router.get("/clients", response_model=List[ClientLogoResponse])
async def get_client_logos(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有啟用的客戶 Logo（按順序）- 顯示在首頁 "Trusted by industry leaders" 區塊"""
    rows = await conn.fetch("""
        SELECT * FROM client_logos 
        WHERE is_active = true 
        ORDER BY display_order ASC, id ASC
    """)
    
    return [dict(row) for row in rows]


# ==================== Publisher Features ====================

@router.get("/publisher-features", response_model=List[PublisherFeatureResponse])
async def get_publisher_features(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有啟用的 Publisher 功能（按順序）"""
    rows = await conn.fetch("""
        SELECT * FROM publisher_features 
        WHERE is_active = true 
        ORDER BY display_order ASC, id ASC
    """)
    
    return [dict(row) for row in rows]


# ==================== Hero Sections ====================

@router.get("/hero/{page}", response_model=HeroSectionResponse)
async def get_hero_section(
    page: str,
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得指定頁面的 Hero 區塊內容"""
    row = await conn.fetchrow("""
        SELECT * FROM hero_sections 
        WHERE page = $1 AND is_active = true
    """, page)
    
    if not row:
        raise HTTPException(status_code=404, detail="Hero section not found")
    
    return dict(row)


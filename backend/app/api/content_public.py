"""
內容管理 - 公開 API（前台讀取）
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
import asyncpg
import json

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
    PublisherFeatureResponse,
    HeroSectionResponse,
    HeroMediaLogoResponse,
    LyroSectionResponse,
    LyroFeatureResponse,
    SectionContentResponse
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

# Services API 已完全移除 - 請使用 /sections/services


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
        OR setting_key LIKE 'carousel_%'
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

@router.get("/clients")
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


# ==================== Hero Media Logos ====================

@router.get("/hero/{page}/logos", response_model=List[HeroMediaLogoResponse])
async def get_hero_media_logos(
    page: str,
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得指定頁面 Hero 的 Media Cloud Logos"""
    rows = await conn.fetch("""
        SELECT * FROM hero_media_logos 
        WHERE hero_page = $1 AND is_active = true 
        ORDER BY display_order ASC, id ASC
    """, page)
    
    return [dict(row) for row in rows]


# ==================== Lyro Section ====================

@router.get("/lyro", response_model=LyroSectionResponse)
async def get_lyro_section(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得 Lyro Section 內容"""
    row = await conn.fetchrow("""
        SELECT * FROM lyro_section 
        WHERE is_active = true 
        LIMIT 1
    """)
    
    if not row:
        raise HTTPException(status_code=404, detail="Lyro section not found")
    
    return dict(row)


@router.get("/lyro/features", response_model=List[LyroFeatureResponse])
async def get_lyro_features(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得 Lyro 功能列表"""
    rows = await conn.fetch("""
        SELECT * FROM lyro_features 
        WHERE is_active = true 
        ORDER BY display_order ASC, id ASC
    """)
    
    return [dict(row) for row in rows]


# ==================== Carousel Logos ====================
# 顯示在首頁跑馬燈區塊

@router.get("/carousel-logos")
async def get_carousel_logos(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有啟用的跑馬燈 Logo（按順序）- 顯示在首頁跑馬燈區塊"""
    rows = await conn.fetch("""
        SELECT * FROM carousel_logos 
        WHERE is_active = true 
        ORDER BY display_order ASC, id ASC
    """)
    
    return [dict(row) for row in rows]


# ==================== Section Contents (JSONB) ====================

@router.get("/sections/{section_key}")
async def get_section_content(
    section_key: str,
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """
    取得指定 section 的內容（JSONB 格式）
    
    使用範例：
    - GET /public/content/sections/services
    - GET /public/content/sections/lyro
    """
    row = await conn.fetchrow("""
        SELECT content 
        FROM section_contents 
        WHERE section_key = $1
    """, section_key)
    
    if not row:
        raise HTTPException(status_code=404, detail=f"Section '{section_key}' not found")
    
    # asyncpg 返回的 JSONB 是字串，需要解析成 dict
    content = row['content']
    if isinstance(content, str):
        content = json.loads(content)
    
    return content


# ==================== Navigation ====================

@router.get("/navigation/items")
async def get_navigation_items(
    lang: str = 'en',
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得 Navigation 選單項目"""
    rows = await conn.fetch("""
        SELECT 
            id,
            CASE 
                WHEN $1 = 'zh' THEN COALESCE(label_zh, label_en)
                WHEN $1 = 'ja' THEN COALESCE(label_ja, label_en)
                ELSE label_en
            END as label,
            desktop_url,
            mobile_url,
            target,
            parent_id,
            display_order
        FROM navigation_items 
        WHERE is_active = true 
        ORDER BY display_order ASC, id ASC
    """, lang)
    
    return [dict(row) for row in rows]


@router.get("/navigation/cta")
async def get_navigation_cta(
    lang: str = 'en',
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得 Navigation CTA 按鈕"""
    row = await conn.fetchrow("""
        SELECT 
            CASE 
                WHEN $1 = 'zh' THEN COALESCE(text_zh, text_en)
                WHEN $1 = 'ja' THEN COALESCE(text_ja, text_en)
                ELSE text_en
            END as text,
            url
        FROM navigation_cta 
        WHERE is_active = true 
        LIMIT 1
    """, lang)
    
    return dict(row) if row else None


# ==================== Footer ====================

@router.get("/footer/sections")
async def get_footer_sections(
    lang: str = 'en',
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得 Footer 區塊及連結"""
    sections = await conn.fetch("""
        SELECT 
            id,
            CASE 
                WHEN $1 = 'zh' THEN COALESCE(title_zh, title_en)
                WHEN $1 = 'ja' THEN COALESCE(title_ja, title_en)
                ELSE title_en
            END as title,
            section_key,
            display_order
        FROM footer_sections 
        WHERE is_active = true 
        ORDER BY display_order ASC
    """, lang)
    
    result = []
    for section in sections:
        links = await conn.fetch("""
            SELECT 
                id,
                CASE 
                    WHEN $1 = 'zh' THEN COALESCE(label_zh, label_en)
                    WHEN $1 = 'ja' THEN COALESCE(label_ja, label_en)
                    ELSE label_en
                END as label,
                url,
                target,
                display_order
            FROM footer_links 
            WHERE section_id = $2 AND is_active = true 
            ORDER BY display_order ASC
        """, lang, section['id'])
        
        result.append({
            **dict(section),
            'links': [dict(link) for link in links]
        })
    
    return result


@router.get("/footer/text-settings")
async def get_footer_text_settings(
    lang: str = 'en',
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得 Footer 文字設定"""
    rows = await conn.fetch("""
        SELECT 
            setting_key,
            CASE 
                WHEN $1 = 'zh' THEN COALESCE(value_zh, value_en)
                WHEN $1 = 'ja' THEN COALESCE(value_ja, value_en)
                ELSE value_en
            END as value
        FROM footer_text_settings
    """, lang)
    
    return {row['setting_key']: row['value'] for row in rows}


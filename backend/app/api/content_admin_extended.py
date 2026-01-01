"""
內容管理 - Admin API 擴展（Client Logos, Publisher Features, Hero Sections）
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
import asyncpg
from datetime import datetime

from ..core.database import Database
from ..utils.security import get_current_user, require_admin
from ..models.content import (
    ClientLogoCreate, ClientLogoUpdate, ClientLogoResponse,
    PublisherFeatureCreate, PublisherFeatureUpdate, PublisherFeatureResponse,
    HeroSectionCreate, HeroSectionUpdate, HeroSectionResponse,
    HeroMediaLogoCreate, HeroMediaLogoUpdate, HeroMediaLogoResponse
)

router = APIRouter(prefix="/admin/content", tags=["Admin Content Extended"], dependencies=[Depends(require_admin)])

async def get_db_conn():
    from ..main import app
    db: Database = app.state.db
    async with db.pool.acquire() as conn:
        yield conn


# ==================== Client Logos ====================

@router.get("/clients", response_model=List[ClientLogoResponse])
async def get_all_clients(conn: asyncpg.Connection = Depends(get_db_conn)):
    rows = await conn.fetch("SELECT * FROM client_logos ORDER BY display_order ASC")
    return [dict(row) for row in rows]


@router.post("/clients", response_model=ClientLogoResponse)
async def create_client(item: ClientLogoCreate, conn: asyncpg.Connection = Depends(get_db_conn), current_user = Depends(get_current_user)):
    row = await conn.fetchrow("INSERT INTO client_logos (name, logo_url, website_url, display_order, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
        item.name, item.logo_url, item.website_url, item.display_order, item.is_active)
    return dict(row)


@router.put("/clients/{item_id}", response_model=ClientLogoResponse)
async def update_client(item_id: int, item: ClientLogoUpdate, conn: asyncpg.Connection = Depends(get_db_conn), current_user = Depends(get_current_user)):
    existing = await conn.fetchrow("SELECT * FROM client_logos WHERE id = $1", item_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Not found")
    
    update_fields = []
    values = []
    param_count = 1
    
    for field in ['name', 'logo_url', 'website_url', 'display_order', 'is_active']:
        value = getattr(item, field, None)
        if value is not None:
            update_fields.append(f"{field} = ${param_count}")
            values.append(value)
            param_count += 1
    
    update_fields.append(f"updated_at = ${param_count}")
    values.append(datetime.utcnow())
    param_count += 1
    values.append(item_id)
    
    row = await conn.fetchrow(f"UPDATE client_logos SET {', '.join(update_fields)} WHERE id = ${param_count} RETURNING *", *values)
    return dict(row)


@router.delete("/clients/{item_id}")
async def delete_client(item_id: int, conn: asyncpg.Connection = Depends(get_db_conn), current_user = Depends(get_current_user)):
    result = await conn.execute("DELETE FROM client_logos WHERE id = $1", item_id)
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Not found")
    return {"message": "Deleted"}


# ==================== Publisher Features ====================

@router.get("/publisher-features", response_model=List[PublisherFeatureResponse])
async def get_all_publisher_features(conn: asyncpg.Connection = Depends(get_db_conn)):
    rows = await conn.fetch("SELECT * FROM publisher_features ORDER BY display_order ASC, id ASC")
    return [dict(row) for row in rows]


@router.post("/publisher-features", response_model=PublisherFeatureResponse)
async def create_publisher_feature(item: PublisherFeatureCreate, conn: asyncpg.Connection = Depends(get_db_conn), current_user = Depends(get_current_user)):
    row = await conn.fetchrow("""
        INSERT INTO publisher_features (title, description, display_order, is_active)
        VALUES ($1, $2, $3, $4) RETURNING *
    """, item.title, item.description, item.display_order, item.is_active)
    return dict(row)


@router.put("/publisher-features/{item_id}", response_model=PublisherFeatureResponse)
async def update_publisher_feature(item_id: int, item: PublisherFeatureUpdate, conn: asyncpg.Connection = Depends(get_db_conn), current_user = Depends(get_current_user)):
    existing = await conn.fetchrow("SELECT * FROM publisher_features WHERE id = $1", item_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Feature not found")
    
    update_fields = []
    values = []
    param_count = 1
    
    for field in ['title', 'description', 'display_order', 'is_active']:
        value = getattr(item, field, None)
        if value is not None:
            update_fields.append(f"{field} = ${param_count}")
            values.append(value)
            param_count += 1
    
    update_fields.append(f"updated_at = ${param_count}")
    values.append(datetime.utcnow())
    param_count += 1
    values.append(item_id)
    
    row = await conn.fetchrow(f"UPDATE publisher_features SET {', '.join(update_fields)} WHERE id = ${param_count} RETURNING *", *values)
    return dict(row)


@router.delete("/publisher-features/{item_id}")
async def delete_publisher_feature(item_id: int, conn: asyncpg.Connection = Depends(get_db_conn), current_user = Depends(get_current_user)):
    result = await conn.execute("DELETE FROM publisher_features WHERE id = $1", item_id)
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Feature not found")
    return {"message": "Feature deleted successfully"}


# ==================== Hero Sections ====================

@router.get("/hero", response_model=List[HeroSectionResponse])
async def get_all_hero_sections(conn: asyncpg.Connection = Depends(get_db_conn)):
    rows = await conn.fetch("SELECT * FROM hero_sections ORDER BY page ASC")
    return [dict(row) for row in rows]


@router.post("/hero", response_model=HeroSectionResponse)
async def create_hero_section(item: HeroSectionCreate, conn: asyncpg.Connection = Depends(get_db_conn), current_user = Depends(get_current_user)):
    row = await conn.fetchrow("""
        INSERT INTO hero_sections (page, title, subtitle, description, cta_primary_text, cta_primary_url, cta_secondary_text, cta_secondary_url, background_image_url, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
    """, item.page, item.title, item.subtitle, item.description, item.cta_primary_text, item.cta_primary_url, item.cta_secondary_text, item.cta_secondary_url, item.background_image_url, item.is_active)
    return dict(row)


@router.put("/hero/{page}", response_model=HeroSectionResponse)
async def update_hero_section(page: str, item: HeroSectionUpdate, conn: asyncpg.Connection = Depends(get_db_conn), current_user = Depends(get_current_user)):
    existing = await conn.fetchrow("SELECT * FROM hero_sections WHERE page = $1", page)
    if not existing:
        raise HTTPException(status_code=404, detail="Hero section not found")
    
    update_fields = []
    values = []
    param_count = 1
    
    for field in ['title_prefix', 'title_highlights', 'title_suffix', 'subtitle', 'description', 'center_logo_url', 'cta_primary_text', 'cta_primary_url', 'cta_primary_url_mobile', 'cta_secondary_text', 'cta_secondary_url', 'cta_secondary_url_mobile', 'background_image_url', 'background_video_url', 'is_active']:
        value = getattr(item, field, None)
        if value is not None:
            update_fields.append(f"{field} = ${param_count}")
            values.append(value)
            param_count += 1
    
    update_fields.append(f"updated_at = ${param_count}")
    values.append(datetime.utcnow())
    param_count += 1
    values.append(page)
    
    row = await conn.fetchrow(f"UPDATE hero_sections SET {', '.join(update_fields)} WHERE page = ${param_count} RETURNING *", *values)
    return dict(row)


# ==================== Hero Media Logos ====================

@router.get("/hero/{page}/logos", response_model=List[HeroMediaLogoResponse])
async def get_hero_logos(page: str, conn: asyncpg.Connection = Depends(get_db_conn)):
    rows = await conn.fetch("SELECT * FROM hero_media_logos WHERE hero_page = $1 ORDER BY display_order ASC", page)
    return [dict(row) for row in rows]


@router.post("/hero/{page}/logos", response_model=HeroMediaLogoResponse)
async def create_hero_logo(page: str, item: HeroMediaLogoCreate, conn: asyncpg.Connection = Depends(get_db_conn), current_user = Depends(get_current_user)):
    row = await conn.fetchrow("""
        INSERT INTO hero_media_logos (hero_page, name, logo_url, website_url, opacity, size, position_top, position_left, position_right, position_bottom, animation_speed, display_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *
    """, page, item.name, item.logo_url, item.website_url, item.opacity, item.size, item.position_top, item.position_left, item.position_right, item.position_bottom, item.animation_speed, item.display_order, item.is_active)
    return dict(row)


@router.put("/hero-logos/{logo_id}", response_model=HeroMediaLogoResponse)
async def update_hero_logo(logo_id: int, item: HeroMediaLogoUpdate, conn: asyncpg.Connection = Depends(get_db_conn), current_user = Depends(get_current_user)):
    existing = await conn.fetchrow("SELECT * FROM hero_media_logos WHERE id = $1", logo_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Logo not found")
    
    update_fields = []
    values = []
    param_count = 1
    
    for field in ['name', 'logo_url', 'website_url', 'opacity', 'size', 'position_top', 'position_left', 'position_right', 'position_bottom', 'animation_speed', 'display_order', 'is_active']:
        value = getattr(item, field, None)
        if value is not None:
            update_fields.append(f"{field} = ${param_count}")
            values.append(value)
            param_count += 1
    
    update_fields.append(f"updated_at = ${param_count}")
    values.append(datetime.utcnow())
    param_count += 1
    values.append(logo_id)
    
    row = await conn.fetchrow(f"UPDATE hero_media_logos SET {', '.join(update_fields)} WHERE id = ${param_count} RETURNING *", *values)
    return dict(row)


@router.delete("/hero-logos/{logo_id}")
async def delete_hero_logo(logo_id: int, conn: asyncpg.Connection = Depends(get_db_conn), current_user = Depends(get_current_user)):
    result = await conn.execute("DELETE FROM hero_media_logos WHERE id = $1", logo_id)
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Logo not found")
    return {"message": "Logo deleted"}


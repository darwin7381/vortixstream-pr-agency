"""
內容管理 - Admin API 擴展（Partner Logos, Publisher Features, Hero Sections）
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
import asyncpg
from datetime import datetime

from ..core.database import Database
from ..utils.security import get_current_user, require_admin
from ..models.content import (
    PartnerLogoCreate, PartnerLogoUpdate, PartnerLogoResponse,
    PublisherFeatureCreate, PublisherFeatureUpdate, PublisherFeatureResponse,
    HeroSectionCreate, HeroSectionUpdate, HeroSectionResponse
)

router = APIRouter(prefix="/admin/content", tags=["Admin Content Extended"], dependencies=[Depends(require_admin)])

async def get_db_conn():
    from ..main import app
    db: Database = app.state.db
    async with db.pool.acquire() as conn:
        yield conn


# ==================== Partner Logos ====================

@router.get("/partners", response_model=List[PartnerLogoResponse])
async def get_all_partners(conn: asyncpg.Connection = Depends(get_db_conn)):
    rows = await conn.fetch("SELECT * FROM partner_logos ORDER BY display_order ASC, id ASC")
    return [dict(row) for row in rows]


@router.post("/partners", response_model=PartnerLogoResponse)
async def create_partner(item: PartnerLogoCreate, conn: asyncpg.Connection = Depends(get_db_conn), current_user = Depends(get_current_user)):
    row = await conn.fetchrow("""
        INSERT INTO partner_logos (name, logo_url, website_url, display_order, is_active)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
    """, item.name, item.logo_url, item.website_url, item.display_order, item.is_active)
    return dict(row)


@router.put("/partners/{item_id}", response_model=PartnerLogoResponse)
async def update_partner(item_id: int, item: PartnerLogoUpdate, conn: asyncpg.Connection = Depends(get_db_conn), current_user = Depends(get_current_user)):
    existing = await conn.fetchrow("SELECT * FROM partner_logos WHERE id = $1", item_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Partner not found")
    
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
    
    row = await conn.fetchrow(f"UPDATE partner_logos SET {', '.join(update_fields)} WHERE id = ${param_count} RETURNING *", *values)
    return dict(row)


@router.delete("/partners/{item_id}")
async def delete_partner(item_id: int, conn: asyncpg.Connection = Depends(get_db_conn), current_user = Depends(get_current_user)):
    result = await conn.execute("DELETE FROM partner_logos WHERE id = $1", item_id)
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Partner not found")
    return {"message": "Partner deleted successfully"}


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
    
    for field in ['title', 'subtitle', 'description', 'cta_primary_text', 'cta_primary_url', 'cta_secondary_text', 'cta_secondary_url', 'background_image_url', 'is_active']:
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


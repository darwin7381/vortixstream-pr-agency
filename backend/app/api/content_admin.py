"""
內容管理 - Admin API（後台 CRUD）
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
import asyncpg
from datetime import datetime

from ..core.database import Database
from ..utils.security import get_current_user, require_admin
from ..models.content import (
    FAQCreate, FAQUpdate, FAQResponse,
    TestimonialCreate, TestimonialUpdate, TestimonialResponse,
    TeamMemberCreate, TeamMemberUpdate, TeamMemberResponse,
    ServiceCreate, ServiceUpdate, ServiceResponse,
    SettingUpdate, SettingResponse,
    DifferentiatorCreate, DifferentiatorUpdate, DifferentiatorResponse,
    StatCreate, StatUpdate, StatResponse,
    ClientLogoCreate, ClientLogoUpdate, ClientLogoResponse,
    PublisherFeatureCreate, PublisherFeatureUpdate, PublisherFeatureResponse,
    HeroSectionCreate, HeroSectionUpdate, HeroSectionResponse
)

router = APIRouter(prefix="/admin/content", tags=["Admin Content"], dependencies=[Depends(require_admin)])

# 資料庫依賴
async def get_db_conn():
    from ..main import app
    db: Database = app.state.db
    async with db.pool.acquire() as conn:
        yield conn


# ==================== FAQs Management ====================

@router.get("/faqs", response_model=List[FAQResponse])
async def get_all_faqs(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有 FAQs（包含停用的）"""
    rows = await conn.fetch("""
        SELECT * FROM faqs 
        ORDER BY display_order ASC, id ASC
    """)
    return [dict(row) for row in rows]


@router.post("/faqs", response_model=FAQResponse)
async def create_faq(
    faq: FAQCreate,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """創建新 FAQ"""
    row = await conn.fetchrow("""
        INSERT INTO faqs (question, answer, display_order, is_active)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    """, faq.question, faq.answer, faq.display_order, faq.is_active)
    
    return dict(row)


@router.put("/faqs/{faq_id}", response_model=FAQResponse)
async def update_faq(
    faq_id: int,
    faq: FAQUpdate,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """更新 FAQ"""
    # 檢查是否存在
    existing = await conn.fetchrow("SELECT * FROM faqs WHERE id = $1", faq_id)
    if not existing:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    # 準備更新欄位
    update_fields = []
    values = []
    param_count = 1
    
    if faq.question is not None:
        update_fields.append(f"question = ${param_count}")
        values.append(faq.question)
        param_count += 1
    
    if faq.answer is not None:
        update_fields.append(f"answer = ${param_count}")
        values.append(faq.answer)
        param_count += 1
    
    if faq.display_order is not None:
        update_fields.append(f"display_order = ${param_count}")
        values.append(faq.display_order)
        param_count += 1
    
    if faq.is_active is not None:
        update_fields.append(f"is_active = ${param_count}")
        values.append(faq.is_active)
        param_count += 1
    
    update_fields.append(f"updated_at = ${param_count}")
    values.append(datetime.utcnow())
    param_count += 1
    
    values.append(faq_id)
    
    query = f"""
        UPDATE faqs 
        SET {', '.join(update_fields)}
        WHERE id = ${param_count}
        RETURNING *
    """
    
    row = await conn.fetchrow(query, *values)
    return dict(row)


@router.delete("/faqs/{faq_id}")
async def delete_faq(
    faq_id: int,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """刪除 FAQ"""
    result = await conn.execute("DELETE FROM faqs WHERE id = $1", faq_id)
    
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    return {"message": "FAQ deleted successfully"}


# ==================== Testimonials Management ====================

@router.get("/testimonials", response_model=List[TestimonialResponse])
async def get_all_testimonials(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有客戶評價（包含停用的）"""
    rows = await conn.fetch("""
        SELECT * FROM testimonials 
        ORDER BY display_order ASC, id ASC
    """)
    return [dict(row) for row in rows]


@router.post("/testimonials", response_model=TestimonialResponse)
async def create_testimonial(
    testimonial: TestimonialCreate,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """創建新客戶評價"""
    row = await conn.fetchrow("""
        INSERT INTO testimonials (quote, author_name, author_title, author_company, author_avatar_url, display_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    """, testimonial.quote, testimonial.author_name, testimonial.author_title, 
        testimonial.author_company, testimonial.author_avatar_url, 
        testimonial.display_order, testimonial.is_active)
    
    return dict(row)


@router.put("/testimonials/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial(
    testimonial_id: int,
    testimonial: TestimonialUpdate,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """更新客戶評價"""
    existing = await conn.fetchrow("SELECT * FROM testimonials WHERE id = $1", testimonial_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    update_fields = []
    values = []
    param_count = 1
    
    for field in ['quote', 'author_name', 'author_title', 'author_company', 'author_avatar_url', 'display_order', 'is_active']:
        value = getattr(testimonial, field, None)
        if value is not None:
            update_fields.append(f"{field} = ${param_count}")
            values.append(value)
            param_count += 1
    
    update_fields.append(f"updated_at = ${param_count}")
    values.append(datetime.utcnow())
    param_count += 1
    
    values.append(testimonial_id)
    
    query = f"""
        UPDATE testimonials 
        SET {', '.join(update_fields)}
        WHERE id = ${param_count}
        RETURNING *
    """
    
    row = await conn.fetchrow(query, *values)
    return dict(row)


@router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(
    testimonial_id: int,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """刪除客戶評價"""
    result = await conn.execute("DELETE FROM testimonials WHERE id = $1", testimonial_id)
    
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    return {"message": "Testimonial deleted successfully"}


# ==================== Team Members Management ====================

@router.get("/team", response_model=List[TeamMemberResponse])
async def get_all_team_members(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有團隊成員（包含停用的）"""
    rows = await conn.fetch("""
        SELECT * FROM team_members 
        ORDER BY display_order ASC, id ASC
    """)
    return [dict(row) for row in rows]


@router.post("/team", response_model=TeamMemberResponse)
async def create_team_member(
    member: TeamMemberCreate,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """創建新團隊成員"""
    row = await conn.fetchrow("""
        INSERT INTO team_members (name, position, avatar_url, bio, linkedin_url, twitter_url, display_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    """, member.name, member.position, member.avatar_url, member.bio,
        member.linkedin_url, member.twitter_url, member.display_order, member.is_active)
    
    return dict(row)


@router.put("/team/{member_id}", response_model=TeamMemberResponse)
async def update_team_member(
    member_id: int,
    member: TeamMemberUpdate,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """更新團隊成員"""
    existing = await conn.fetchrow("SELECT * FROM team_members WHERE id = $1", member_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    update_fields = []
    values = []
    param_count = 1
    
    for field in ['name', 'position', 'avatar_url', 'bio', 'linkedin_url', 'twitter_url', 'display_order', 'is_active']:
        value = getattr(member, field, None)
        if value is not None:
            update_fields.append(f"{field} = ${param_count}")
            values.append(value)
            param_count += 1
    
    update_fields.append(f"updated_at = ${param_count}")
    values.append(datetime.utcnow())
    param_count += 1
    
    values.append(member_id)
    
    query = f"""
        UPDATE team_members 
        SET {', '.join(update_fields)}
        WHERE id = ${param_count}
        RETURNING *
    """
    
    row = await conn.fetchrow(query, *values)
    return dict(row)


@router.delete("/team/{member_id}")
async def delete_team_member(
    member_id: int,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """刪除團隊成員"""
    result = await conn.execute("DELETE FROM team_members WHERE id = $1", member_id)
    
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Team member not found")
    
    return {"message": "Team member deleted successfully"}


# ==================== Services Management ====================

@router.get("/services", response_model=List[ServiceResponse])
async def get_all_services(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有服務項目（包含停用的）"""
    rows = await conn.fetch("""
        SELECT * FROM services 
        ORDER BY display_order ASC, id ASC
    """)
    return [dict(row) for row in rows]


@router.post("/services", response_model=ServiceResponse)
async def create_service(
    service: ServiceCreate,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """創建新服務項目"""
    row = await conn.fetchrow("""
        INSERT INTO services (title, description, icon, display_order, is_active)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    """, service.title, service.description, service.icon, 
        service.display_order, service.is_active)
    
    return dict(row)


@router.put("/services/{service_id}", response_model=ServiceResponse)
async def update_service(
    service_id: int,
    service: ServiceUpdate,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """更新服務項目"""
    existing = await conn.fetchrow("SELECT * FROM services WHERE id = $1", service_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Service not found")
    
    update_fields = []
    values = []
    param_count = 1
    
    for field in ['title', 'description', 'icon', 'display_order', 'is_active']:
        value = getattr(service, field, None)
        if value is not None:
            update_fields.append(f"{field} = ${param_count}")
            values.append(value)
            param_count += 1
    
    update_fields.append(f"updated_at = ${param_count}")
    values.append(datetime.utcnow())
    param_count += 1
    
    values.append(service_id)
    
    query = f"""
        UPDATE services 
        SET {', '.join(update_fields)}
        WHERE id = ${param_count}
        RETURNING *
    """
    
    row = await conn.fetchrow(query, *values)
    return dict(row)


@router.delete("/services/{service_id}")
async def delete_service(
    service_id: int,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """刪除服務項目"""
    result = await conn.execute("DELETE FROM services WHERE id = $1", service_id)
    
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Service not found")
    
    return {"message": "Service deleted successfully"}


# ==================== Site Settings Management ====================

@router.get("/settings", response_model=List[SettingResponse])
async def get_all_settings(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有網站設定"""
    rows = await conn.fetch("""
        SELECT * FROM system_settings 
        WHERE setting_key LIKE 'site_%' 
        OR setting_key LIKE 'stats_%' 
        OR setting_key LIKE 'contact_%' 
        OR setting_key LIKE 'social_%'
        ORDER BY setting_key
    """)
    return [dict(row) for row in rows]


@router.patch("/settings/{setting_key}", response_model=SettingResponse)
async def update_setting(
    setting_key: str,
    setting: SettingUpdate,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """更新單一設定"""
    # 檢查設定是否存在
    existing = await conn.fetchrow(
        "SELECT * FROM system_settings WHERE setting_key = $1", 
        setting_key
    )
    
    if not existing:
        raise HTTPException(status_code=404, detail="Setting not found")
    
    # 更新設定
    row = await conn.fetchrow("""
        UPDATE system_settings 
        SET setting_value = $1, 
            updated_at = $2,
            updated_by = $3
        WHERE setting_key = $4
        RETURNING *
    """, setting.value, datetime.utcnow(), current_user.user_id, setting_key)
    
    return dict(row)


# ==================== Differentiators Management ====================

@router.get("/differentiators", response_model=List[DifferentiatorResponse])
async def get_all_differentiators(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有特點項目（包含停用的）"""
    rows = await conn.fetch("""
        SELECT * FROM differentiators 
        ORDER BY display_order ASC, id ASC
    """)
    return [dict(row) for row in rows]


@router.post("/differentiators", response_model=DifferentiatorResponse)
async def create_differentiator(
    item: DifferentiatorCreate,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """創建新特點項目"""
    row = await conn.fetchrow("""
        INSERT INTO differentiators (text, display_order, is_active)
        VALUES ($1, $2, $3)
        RETURNING *
    """, item.text, item.display_order, item.is_active)
    
    return dict(row)


@router.put("/differentiators/{item_id}", response_model=DifferentiatorResponse)
async def update_differentiator(
    item_id: int,
    item: DifferentiatorUpdate,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """更新特點項目"""
    existing = await conn.fetchrow("SELECT * FROM differentiators WHERE id = $1", item_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Differentiator not found")
    
    update_fields = []
    values = []
    param_count = 1
    
    if item.text is not None:
        update_fields.append(f"text = ${param_count}")
        values.append(item.text)
        param_count += 1
    
    if item.display_order is not None:
        update_fields.append(f"display_order = ${param_count}")
        values.append(item.display_order)
        param_count += 1
    
    if item.is_active is not None:
        update_fields.append(f"is_active = ${param_count}")
        values.append(item.is_active)
        param_count += 1
    
    update_fields.append(f"updated_at = ${param_count}")
    values.append(datetime.utcnow())
    param_count += 1
    
    values.append(item_id)
    
    query = f"""
        UPDATE differentiators 
        SET {', '.join(update_fields)}
        WHERE id = ${param_count}
        RETURNING *
    """
    
    row = await conn.fetchrow(query, *values)
    return dict(row)


@router.delete("/differentiators/{item_id}")
async def delete_differentiator(
    item_id: int,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """刪除特點項目"""
    result = await conn.execute("DELETE FROM differentiators WHERE id = $1", item_id)
    
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Differentiator not found")
    
    return {"message": "Differentiator deleted successfully"}


# ==================== Stats Management ====================

@router.get("/stats", response_model=List[StatResponse])
async def get_all_stats(
    conn: asyncpg.Connection = Depends(get_db_conn)
):
    """取得所有統計數據（包含停用的）"""
    rows = await conn.fetch("""
        SELECT * FROM stats 
        ORDER BY display_order ASC, id ASC
    """)
    return [dict(row) for row in rows]


@router.post("/stats", response_model=StatResponse)
async def create_stat(
    item: StatCreate,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """創建新統計數據"""
    row = await conn.fetchrow("""
        INSERT INTO stats (label, value, suffix, description, display_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    """, item.label, item.value, item.suffix, item.description, item.display_order, item.is_active)
    
    return dict(row)


@router.put("/stats/{item_id}", response_model=StatResponse)
async def update_stat(
    item_id: int,
    item: StatUpdate,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """更新統計數據"""
    existing = await conn.fetchrow("SELECT * FROM stats WHERE id = $1", item_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Stat not found")
    
    update_fields = []
    values = []
    param_count = 1
    
    for field in ['label', 'value', 'suffix', 'description', 'display_order', 'is_active']:
        value = getattr(item, field, None)
        if value is not None:
            update_fields.append(f"{field} = ${param_count}")
            values.append(value)
            param_count += 1
    
    update_fields.append(f"updated_at = ${param_count}")
    values.append(datetime.utcnow())
    param_count += 1
    
    values.append(item_id)
    
    query = f"""
        UPDATE stats 
        SET {', '.join(update_fields)}
        WHERE id = ${param_count}
        RETURNING *
    """
    
    row = await conn.fetchrow(query, *values)
    return dict(row)


@router.delete("/stats/{item_id}")
async def delete_stat(
    item_id: int,
    conn: asyncpg.Connection = Depends(get_db_conn),
    current_user = Depends(get_current_user)
):
    """刪除統計數據"""
    result = await conn.execute("DELETE FROM stats WHERE id = $1", item_id)
    
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Stat not found")
    
    return {"message": "Stat deleted successfully"}


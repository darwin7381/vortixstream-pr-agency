from fastapi import APIRouter, HTTPException
from typing import List
from slugify import slugify
from datetime import datetime
import json

from ..core.database import db
from ..models.pricing import (
    PricingPackageCreate,
    PricingPackageUpdate,
    PricingPackage
)

router = APIRouter(prefix="/pricing")


@router.get("/packages", response_model=List[PricingPackage])
async def get_pricing_packages(status: str = "active"):
    """取得所有定價方案"""
    
    async with db.pool.acquire() as conn:
        if status == "all":
            rows = await conn.fetch(
                """
                SELECT * FROM pricing_packages
                ORDER BY display_order, id
                """
            )
        else:
            rows = await conn.fetch(
                """
                SELECT * FROM pricing_packages
                WHERE status = $1
                ORDER BY display_order, id
                """,
                status
            )
    
    # 處理 JSONB features 欄位（asyncpg 返回字串，需要解析）
    packages = []
    for row in rows:
        package_dict = dict(row)
        # 如果 features 是字串，解析成 list
        if isinstance(package_dict['features'], str):
            package_dict['features'] = json.loads(package_dict['features'])
        packages.append(package_dict)
    
    return packages


@router.get("/packages/{slug}", response_model=PricingPackage)
async def get_pricing_package(slug: str):
    """取得單個定價方案"""
    
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM pricing_packages WHERE slug = $1",
            slug
        )
    
    if not row:
        raise HTTPException(status_code=404, detail="Pricing package not found")
    
    package_dict = dict(row)
    # 如果 features 是字串，解析成 list
    if isinstance(package_dict['features'], str):
        package_dict['features'] = json.loads(package_dict['features'])
    return package_dict


@router.post("/packages", response_model=PricingPackage, status_code=201)
async def create_pricing_package(package: PricingPackageCreate):
    """創建定價方案"""
    
    # 生成 slug
    slug = slugify(package.name)
    
    async with db.pool.acquire() as conn:
        # 檢查 slug 是否已存在
        existing = await conn.fetchval(
            "SELECT id FROM pricing_packages WHERE slug = $1",
            slug
        )
        
        if existing:
            slug = f"{slug}-{int(datetime.now().timestamp())}"
        
        # 插入方案
        row = await conn.fetchrow(
            """
            INSERT INTO pricing_packages (
                name, slug, description, price, currency, billing_period,
                features, is_popular, badge_text, display_order, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
            """,
            package.name,
            slug,
            package.description,
            package.price,
            package.currency,
            package.billing_period,
            json.dumps(package.features),  # 轉換為 JSON
            package.is_popular,
            package.badge_text,
            package.display_order,
            package.status
        )
    
    return dict(row)


@router.put("/packages/{package_id}", response_model=PricingPackage)
async def update_pricing_package(package_id: int, package: PricingPackageUpdate):
    """更新定價方案"""
    
    update_data = package.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # 建立更新語句
    set_clauses = []
    params = []
    param_count = 1
    
    for field, value in update_data.items():
        if field == "features":
            # 特殊處理 features (轉 JSON)
            set_clauses.append(f"{field} = ${param_count}")
            params.append(json.dumps(value))
        else:
            set_clauses.append(f"{field} = ${param_count}")
            params.append(value)
        param_count += 1
    
    # 加入 updated_at
    set_clauses.append(f"updated_at = ${param_count}")
    params.append(datetime.now())
    param_count += 1
    
    params.append(package_id)
    
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            f"""
            UPDATE pricing_packages
            SET {', '.join(set_clauses)}
            WHERE id = ${param_count}
            RETURNING *
            """,
            *params
        )
    
    if not row:
        raise HTTPException(status_code=404, detail="Pricing package not found")
    
    return dict(row)


@router.delete("/packages/{package_id}", status_code=204)
async def delete_pricing_package(package_id: int):
    """刪除定價方案"""
    
    async with db.pool.acquire() as conn:
        result = await conn.execute(
            "DELETE FROM pricing_packages WHERE id = $1",
            package_id
        )
    
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Pricing package not found")
    
    return None


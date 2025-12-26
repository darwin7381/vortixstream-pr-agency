from fastapi import APIRouter, HTTPException
from typing import List
import json

from ..core.database import db
from ..models.pricing import PricingPackage

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


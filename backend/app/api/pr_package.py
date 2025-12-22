from fastapi import APIRouter, HTTPException
from typing import List
from slugify import slugify
from datetime import datetime
import json

from ..core.database import db
from ..models.pr_package import (
    PRPackageCreate,
    PRPackageUpdate,
    PRPackage
)
from ..models.pr_package_frontend import PRPackageCategoryFrontend

router = APIRouter(prefix="/pr-packages")


@router.get("/", response_model=List[PRPackageCategoryFrontend])
async def get_pr_packages_by_category(status: str = "active"):
    """取得所有 PR Packages（按分類組織）"""
    
    async with db.pool.acquire() as conn:
        if status == "all":
            rows = await conn.fetch(
                """
                SELECT * FROM pr_packages
                ORDER BY category_order, display_order, id
                """
            )
        else:
            rows = await conn.fetch(
                """
                SELECT * FROM pr_packages
                WHERE status = $1
                ORDER BY category_order, display_order, id
                """,
                status
            )
    
    # 處理 JSONB 欄位並按 category 分組
    packages_by_category = {}
    
    for row in rows:
        package_dict = dict(row)
        
        # 解析 JSON 欄位
        if isinstance(package_dict['features'], str):
            package_dict['features'] = json.loads(package_dict['features'])
        if isinstance(package_dict['media_logos'], str):
            package_dict['media_logos'] = json.loads(package_dict['media_logos'])
        if package_dict['detailed_info'] and isinstance(package_dict['detailed_info'], str):
            package_dict['detailed_info'] = json.loads(package_dict['detailed_info'])
        
        # 轉換欄位名稱為 camelCase（匹配前端）
        # 處理 detailedInfo 的 cta_text → ctaText
        detailed_info = None
        if package_dict['detailed_info']:
            detailed_info = package_dict['detailed_info'].copy()
            if 'cta_text' in detailed_info:
                detailed_info['ctaText'] = detailed_info.pop('cta_text')
        
        frontend_package = {
            "id": package_dict['slug'],  # 前端用 id 存 slug
            "name": package_dict['name'],
            "price": package_dict['price'],
            "description": package_dict['description'],
            "features": package_dict['features'],
            "badge": package_dict['badge'],
            "guaranteedPublications": package_dict['guaranteed_publications'],
            "mediaLogos": package_dict['media_logos'],
            "detailedInfo": detailed_info,
        }
        
        category_id = package_dict['category_id']
        
        if category_id not in packages_by_category:
            packages_by_category[category_id] = []
        
        packages_by_category[category_id].append(frontend_package)
    
    # 組織成分類結構（按前端順序：global-pr, asia-packages, founder-pr）
    category_order = ["global-pr", "asia-packages", "founder-pr"]
    
    # 定義分類資訊
    category_info = {
        "global-pr": {
            "title": "GLOBAL PR",
            "badges": ["🚀 Launches", "💰 Funding", "🤝 Partnerships"]
        },
        "asia-packages": {
            "title": "ASIA PACKAGES",
            "badges": ["🇨🇳 CN", "🇰🇷 KR", "🇯🇵 JP", "🌏 SEA"]
        },
        "founder-pr": {
            "title": "FOUNDER PR",
            "badges": ["👤 Founders", "💼 CMOs", "⭐ Key Leaders"]
        }
    }
    
    categories = []
    for category_id in category_order:
        if category_id in packages_by_category:
            info = category_info[category_id]
            categories.append({
                "id": category_id,
                "title": info["title"],
                "badges": info["badges"],
                "packages": packages_by_category[category_id]
            })
    
    return categories


@router.get("/{slug}", response_model=PRPackage)
async def get_pr_package(slug: str):
    """取得單個 PR Package"""
    
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM pr_packages WHERE slug = $1",
            slug
        )
    
    if not row:
        raise HTTPException(status_code=404, detail="PR Package not found")
    
    package_dict = dict(row)
    
    # 解析 JSON 欄位
    if isinstance(package_dict['features'], str):
        package_dict['features'] = json.loads(package_dict['features'])
    if isinstance(package_dict['media_logos'], str):
        package_dict['media_logos'] = json.loads(package_dict['media_logos'])
    if package_dict['detailed_info'] and isinstance(package_dict['detailed_info'], str):
        package_dict['detailed_info'] = json.loads(package_dict['detailed_info'])
    
    return package_dict


@router.post("/", response_model=PRPackage, status_code=201)
async def create_pr_package(package: PRPackageCreate):
    """創建 PR Package"""
    
    slug = slugify(package.name)
    
    async with db.pool.acquire() as conn:
        # 檢查 slug 是否已存在
        existing = await conn.fetchval(
            "SELECT id FROM pr_packages WHERE slug = $1",
            slug
        )
        
        if existing:
            slug = f"{slug}-{int(datetime.now().timestamp())}"
        
        # 插入
        row = await conn.fetchrow(
            """
            INSERT INTO pr_packages (
                name, slug, price, description, badge, guaranteed_publications,
                category_id, media_logos, features, detailed_info,
                display_order, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb, $11, $12)
            RETURNING *
            """,
            package.name,
            slug,
            package.price,
            package.description,
            package.badge,
            package.guaranteed_publications,
            package.category_id,
            json.dumps([logo.dict() for logo in (package.media_logos or [])]),
            json.dumps(package.features),
            json.dumps(package.detailed_info.dict()) if package.detailed_info else None,
            package.display_order,
            package.status
        )
    
    package_dict = dict(row)
    
    # 解析 JSON 欄位
    if isinstance(package_dict['features'], str):
        package_dict['features'] = json.loads(package_dict['features'])
    if isinstance(package_dict['media_logos'], str):
        package_dict['media_logos'] = json.loads(package_dict['media_logos'])
    if package_dict['detailed_info'] and isinstance(package_dict['detailed_info'], str):
        package_dict['detailed_info'] = json.loads(package_dict['detailed_info'])
    
    return package_dict


@router.delete("/{package_id}", status_code=204)
async def delete_pr_package(package_id: int):
    """刪除 PR Package"""
    
    async with db.pool.acquire() as conn:
        result = await conn.execute(
            "DELETE FROM pr_packages WHERE id = $1",
            package_id
        )
    
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="PR Package not found")
    
    return None


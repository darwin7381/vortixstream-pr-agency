from fastapi import APIRouter, HTTPException
from typing import List
import json

from ..core.database import db
from ..models.pr_package import PRPackage
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
    
    # 從資料庫獲取分類資訊（動態載入，不再寫死）
    async with db.pool.acquire() as conn:
        category_rows = await conn.fetch(
            """
            SELECT category_id, title, badges
            FROM pr_package_categories
            ORDER BY display_order, id
            """
        )
    
    categories = []
    for cat_row in category_rows:
        category_id = cat_row['category_id']
        
        # 解析 badges
        badges = cat_row['badges']
        if isinstance(badges, str):
            badges = json.loads(badges)
        
        # 如果該分類有 packages，才加入結果
        if category_id in packages_by_category:
            categories.append({
                "id": category_id,
                "title": cat_row['title'],
                "badges": badges,
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


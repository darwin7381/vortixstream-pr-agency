from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
import json

from ..core.database import db
from ..models.pr_category import (
    PRCategoryCreate,
    PRCategoryUpdate,
    PRCategory,
    PRCategoryWithPackages
)

router = APIRouter(prefix="/pr-package-categories")


@router.get("/", response_model=List[PRCategoryWithPackages])
async def get_all_categories():
    """取得所有分類及其 packages 數量"""
    
    async with db.pool.acquire() as conn:
        # 獲取所有分類
        categories = await conn.fetch(
            """
            SELECT * FROM pr_package_categories
            ORDER BY display_order, id
            """
        )
        
        result = []
        for cat in categories:
            cat_dict = dict(cat)
            
            # 解析 JSONB badges
            if isinstance(cat_dict['badges'], str):
                cat_dict['badges'] = json.loads(cat_dict['badges'])
            
            # 獲取該分類下的 packages 數量和列表
            packages = await conn.fetch(
                """
                SELECT id, name, slug, price, badge, status
                FROM pr_packages
                WHERE category_id = $1
                ORDER BY display_order, id
                """,
                cat_dict['category_id']
            )
            
            cat_dict['packages_count'] = len(packages)
            cat_dict['packages'] = [dict(pkg) for pkg in packages]
            
            result.append(cat_dict)
        
        return result


@router.get("/{category_id}", response_model=PRCategoryWithPackages)
async def get_category(category_id: str):
    """取得單個分類"""
    
    async with db.pool.acquire() as conn:
        cat = await conn.fetchrow(
            "SELECT * FROM pr_package_categories WHERE category_id = $1",
            category_id
        )
        
        if not cat:
            raise HTTPException(status_code=404, detail="Category not found")
        
        cat_dict = dict(cat)
        
        # 解析 JSONB badges
        if isinstance(cat_dict['badges'], str):
            cat_dict['badges'] = json.loads(cat_dict['badges'])
        
        # 獲取該分類下的 packages
        packages = await conn.fetch(
            """
            SELECT id, name, slug, price, badge, status
            FROM pr_packages
            WHERE category_id = $1
            ORDER BY display_order, id
            """,
            category_id
        )
        
        cat_dict['packages_count'] = len(packages)
        cat_dict['packages'] = [dict(pkg) for pkg in packages]
        
        return cat_dict


@router.post("/", response_model=PRCategory, status_code=201)
async def create_category(category: PRCategoryCreate):
    """創建新分類"""
    
    async with db.pool.acquire() as conn:
        # 檢查 category_id 是否已存在
        existing = await conn.fetchval(
            "SELECT id FROM pr_package_categories WHERE category_id = $1",
            category.category_id
        )
        
        if existing:
            raise HTTPException(
                status_code=400, 
                detail=f"Category with ID '{category.category_id}' already exists"
            )
        
        # 插入新分類
        row = await conn.fetchrow(
            """
            INSERT INTO pr_package_categories (
                category_id, title, badges, display_order
            )
            VALUES ($1, $2, $3::jsonb, $4)
            RETURNING *
            """,
            category.category_id,
            category.title,
            json.dumps(category.badges),
            category.display_order
        )
        
        cat_dict = dict(row)
        if isinstance(cat_dict['badges'], str):
            cat_dict['badges'] = json.loads(cat_dict['badges'])
        
        return cat_dict


@router.put("/{category_id}", response_model=PRCategory)
async def update_category(category_id: str, category: PRCategoryUpdate):
    """更新分類"""
    
    update_data = category.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # 建立更新語句
    set_clauses = []
    params = []
    param_count = 1
    
    for field, value in update_data.items():
        if field == "badges":
            set_clauses.append(f"{field} = ${param_count}::jsonb")
            params.append(json.dumps(value))
        else:
            set_clauses.append(f"{field} = ${param_count}")
            params.append(value)
        param_count += 1
    
    # 加入 updated_at
    set_clauses.append(f"updated_at = ${param_count}")
    params.append(datetime.now())
    param_count += 1
    
    params.append(category_id)
    
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            f"""
            UPDATE pr_package_categories
            SET {', '.join(set_clauses)}
            WHERE category_id = ${param_count}
            RETURNING *
            """,
            *params
        )
        
        if not row:
            raise HTTPException(status_code=404, detail="Category not found")
        
        cat_dict = dict(row)
        if isinstance(cat_dict['badges'], str):
            cat_dict['badges'] = json.loads(cat_dict['badges'])
        
        return cat_dict


@router.delete("/{category_id}", status_code=204)
async def delete_category(category_id: str):
    """刪除分類"""
    
    async with db.pool.acquire() as conn:
        # 檢查是否有 packages 使用此分類
        package_count = await conn.fetchval(
            "SELECT COUNT(*) FROM pr_packages WHERE category_id = $1",
            category_id
        )
        
        if package_count > 0:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot delete category with {package_count} packages. Please reassign or delete packages first."
            )
        
        # 刪除分類
        result = await conn.execute(
            "DELETE FROM pr_package_categories WHERE category_id = $1",
            category_id
        )
        
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Category not found")
        
        return None




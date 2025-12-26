from fastapi import APIRouter, HTTPException
from slugify import slugify
from datetime import datetime
import json

from ..core.database import db
from ..models.pr_package import PRPackageCreate, PRPackageUpdate, PRPackage

router = APIRouter(prefix="/pr-packages")


@router.get("/all")
async def get_all_packages(status: str = "all"):
    """取得所有 PR Packages（不分類組織）- Admin 專用"""
    
    async with db.pool.acquire() as conn:
        if status == "all":
            rows = await conn.fetch(
                """
                SELECT * FROM pr_packages
                ORDER BY category_order, category_id, display_order, id
                """
            )
        else:
            rows = await conn.fetch(
                """
                SELECT * FROM pr_packages
                WHERE status = $1
                ORDER BY category_order, category_id, display_order, id
                """,
                status
            )
    
    packages = []
    for row in rows:
        package_dict = dict(row)
        
        # 解析 JSON 欄位
        if isinstance(package_dict['features'], str):
            package_dict['features'] = json.loads(package_dict['features'])
        if isinstance(package_dict['media_logos'], str):
            package_dict['media_logos'] = json.loads(package_dict['media_logos'])
        if package_dict['detailed_info'] and isinstance(package_dict['detailed_info'], str):
            package_dict['detailed_info'] = json.loads(package_dict['detailed_info'])
        
        packages.append(package_dict)
    
    return packages


@router.get("/by-id/{package_id}", response_model=PRPackage)
async def get_pr_package_by_id(package_id: int):
    """取得單個 PR Package（通過 ID）- Admin 專用"""
    
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM pr_packages WHERE id = $1",
            package_id
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
                display_order, category_order, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb, $11, $12, $13)
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
            package.category_order if hasattr(package, 'category_order') else 1,
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


@router.put("/{package_id}", response_model=PRPackage)
async def update_pr_package(package_id: int, package: PRPackageUpdate):
    """更新 PR Package"""
    
    update_data = package.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # 建立更新語句
    set_clauses = []
    params = []
    param_count = 1
    
    for field, value in update_data.items():
        if field in ["features", "media_logos"]:
            set_clauses.append(f"{field} = ${param_count}::jsonb")
            if field == "media_logos":
                params.append(json.dumps([logo.dict() if hasattr(logo, 'dict') else logo for logo in value]))
            else:
                params.append(json.dumps(value))
        elif field == "detailed_info":
            set_clauses.append(f"{field} = ${param_count}::jsonb")
            params.append(json.dumps(value.dict() if hasattr(value, 'dict') else value) if value else None)
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
            UPDATE pr_packages
            SET {', '.join(set_clauses)}
            WHERE id = ${param_count}
            RETURNING *
            """,
            *params
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


@router.patch("/{package_id}/category")
async def update_package_category(
    package_id: int,
    category_id: str,
    display_order: int = 0
):
    """更新 Package 的分類和順序"""
    
    async with db.pool.acquire() as conn:
        # 檢查分類是否存在
        category_exists = await conn.fetchval(
            "SELECT id FROM pr_package_categories WHERE category_id = $1",
            category_id
        )
        
        if not category_exists:
            raise HTTPException(status_code=404, detail="Category not found")
        
        # 更新 package
        row = await conn.fetchrow(
            """
            UPDATE pr_packages
            SET category_id = $1, display_order = $2, updated_at = $3
            WHERE id = $4
            RETURNING id, name, slug, category_id, display_order
            """,
            category_id,
            display_order,
            datetime.now(),
            package_id
        )
        
        if not row:
            raise HTTPException(status_code=404, detail="PR Package not found")
        
        return {"message": "Package category updated", "package": dict(row)}


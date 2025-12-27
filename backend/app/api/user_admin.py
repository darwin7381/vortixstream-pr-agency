from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from datetime import datetime

from app.models.user import UserResponse
from app.utils.security import require_admin, require_super_admin
from app.core.database import db

router = APIRouter(prefix="/api/admin/users", tags=["Admin - Users"])


# ==================== 用戶列表 ====================
@router.get("/", response_model=List[UserResponse])
async def get_users(
    status: Optional[str] = None,
    role: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    current_user = Depends(require_admin)
):
    """
    取得所有用戶列表
    
    參數：
    - status: 過濾狀態（active/inactive）
    - role: 過濾角色（user/admin）
    - search: 搜尋（email 或 name）
    - limit: 限制數量
    """
    async with db.pool.acquire() as conn:
        # 構建查詢（確保包含 is_active）
        query = """
            SELECT id, email, name, avatar_url, provider, role, is_active, is_verified, created_at, last_login_at
            FROM users
            WHERE 1=1
        """
        params = []
        param_count = 0
        
        # 狀態過濾
        if status == "active":
            query += " AND is_active = TRUE"
        elif status == "inactive":
            query += " AND is_active = FALSE"
        
        # 角色過濾
        if role:
            param_count += 1
            query += f" AND role = ${param_count}"
            params.append(role)
        
        # 搜尋
        if search:
            param_count += 1
            query += f" AND (LOWER(email) LIKE ${param_count} OR LOWER(name) LIKE ${param_count})"
            params.append(f"%{search.lower()}%")
        
        # 排序和限制
        query += f" ORDER BY created_at DESC LIMIT {limit}"
        
        rows = await conn.fetch(query, *params)
        
        # 注意：UserResponse 需要包含 is_active 欄位
        users = []
        for row in rows:
            user_dict = dict(row)
            # 臨時處理：添加 is_active 到回應中
            users.append({
                "id": row["id"],
                "email": row["email"],
                "name": row["name"],
                "avatar_url": row["avatar_url"],
                "role": row["role"],
                "is_verified": row["is_verified"],
                "is_active": row.get("is_active", True),
                "created_at": row["created_at"]
            })
        
        return users


# ==================== 用戶統計 ====================
@router.get("/stats")
async def get_user_stats(current_user = Depends(require_admin)):
    """取得用戶統計資料"""
    async with db.pool.acquire() as conn:
        stats = await conn.fetchrow("""
            SELECT 
                COUNT(*) as total_users,
                COUNT(*) FILTER (WHERE is_active = TRUE) as active_users,
                COUNT(*) FILTER (WHERE is_active = FALSE) as inactive_users,
                COUNT(*) FILTER (WHERE role = 'admin') as admin_count,
                COUNT(*) FILTER (WHERE role = 'user') as user_count,
                COUNT(*) FILTER (WHERE provider = 'google') as google_users,
                COUNT(*) FILTER (WHERE provider = 'email') as email_users,
                COUNT(*) FILTER (WHERE is_verified = TRUE) as verified_users
            FROM users
        """)
        
        return dict(stats)


# ==================== 更新用戶角色 ====================
@router.patch("/{user_id}/role")
async def update_user_role(
    user_id: int,
    role: str,
    current_user = Depends(require_admin)
):
    """
    更新用戶角色
    
    權限規則：
    - admin 可以設定：user, publisher
    - super_admin 可以設定：user, publisher, admin, super_admin
    """
    # 驗證角色值
    valid_roles = ['user', 'publisher', 'admin', 'super_admin']
    if role not in valid_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"無效的角色。允許的值：{', '.join(valid_roles)}"
        )
    
    # 權限檢查：只有 super_admin 可以設定 admin 或 super_admin
    if role in ['admin', 'super_admin'] and current_user.role != 'super_admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="只有超級管理員可以設定管理員角色"
        )
    
    async with db.pool.acquire() as conn:
        # 檢查用戶是否存在
        user = await conn.fetchrow(
            "SELECT id, email, role FROM users WHERE id = $1",
            user_id
        )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用戶不存在"
            )
        
        # 防止自己降低自己的權限
        if user_id == current_user.user_id and role not in ['admin', 'super_admin']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="無法降低自己的管理員權限"
            )
        
        # 更新角色
        await conn.execute("""
            UPDATE users 
            SET role = $1, updated_at = NOW()
            WHERE id = $2
        """, role, user_id)
        
        return {
            "message": f"用戶 {user['email']} 的角色已更新為 {role}",
            "user_id": user_id,
            "new_role": role
        }


# ==================== 啟用/停用用戶 ====================
@router.patch("/{user_id}/status")
async def update_user_status(
    user_id: int,
    is_active: bool,
    current_user = Depends(require_admin)
):
    """啟用或停用用戶帳號"""
    async with db.pool.acquire() as conn:
        # 檢查用戶是否存在
        user = await conn.fetchrow(
            "SELECT id, email FROM users WHERE id = $1",
            user_id
        )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用戶不存在"
            )
        
        # 防止停用自己
        if user_id == current_user.user_id and not is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="無法停用自己的帳號"
            )
        
        # 更新狀態
        await conn.execute("""
            UPDATE users 
            SET is_active = $1, updated_at = NOW()
            WHERE id = $2
        """, is_active, user_id)
        
        status_text = "啟用" if is_active else "停用"
        return {
            "message": f"用戶 {user['email']} 已{status_text}",
            "user_id": user_id,
            "is_active": is_active
        }


# ==================== 刪除用戶（軟刪除）====================
@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    permanent: bool = False,
    current_user = Depends(require_admin)
):
    """
    刪除用戶（預設為軟刪除，停用帳號）
    
    參數：
    - permanent: True 時永久刪除（需 super_admin）
    
    建議：使用軟刪除（停用），保留資料以供審計
    """
    async with db.pool.acquire() as conn:
        # 檢查用戶是否存在
        user = await conn.fetchrow(
            "SELECT id, email, role FROM users WHERE id = $1",
            user_id
        )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用戶不存在"
            )
        
        # 防止刪除自己
        if user_id == current_user.user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="無法刪除自己的帳號"
            )
        
        # 永久刪除（需要 super_admin 權限）
        if permanent:
            if current_user.role != "super_admin":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="永久刪除需要超級管理員權限"
                )
            
            # 先刪除相關的外鍵資料
            await conn.execute("""
                UPDATE user_invitations 
                SET accepted_by = NULL 
                WHERE accepted_by = $1
            """, user_id)
            
            await conn.execute("""
                UPDATE user_invitations 
                SET invited_by = NULL 
                WHERE invited_by = $1
            """, user_id)
            
            # 永久刪除用戶
            await conn.execute("DELETE FROM users WHERE id = $1", user_id)
            
            return {
                "message": f"用戶 {user['email']} 已永久刪除",
                "user_id": user_id,
                "permanent": True
            }
        
        # 軟刪除（停用帳號）- 預設行為
        else:
            await conn.execute("""
                UPDATE users 
                SET is_active = FALSE, updated_at = NOW()
                WHERE id = $1
            """, user_id)
            
            return {
                "message": f"用戶 {user['email']} 已停用（軟刪除）",
                "user_id": user_id,
                "permanent": False,
                "note": "用戶資料已保留，可隨時重新啟用"
            }


# ==================== 取得單一用戶詳細資料 ====================
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    current_user = Depends(require_admin)
):
    """取得單一用戶的詳細資料"""
    async with db.pool.acquire() as conn:
        user = await conn.fetchrow("""
            SELECT id, email, name, avatar_url, role, is_verified, created_at
            FROM users
            WHERE id = $1
        """, user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用戶不存在"
            )
        
        return UserResponse(**dict(user))


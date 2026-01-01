from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict, Any
from pydantic import BaseModel

from app.utils.security import require_super_admin
from app.core.database import db

router = APIRouter(prefix="/api/admin/settings", tags=["Admin - Settings"])


class SettingUpdate(BaseModel):
    setting_value: str


# ==================== 取得所有設定 ====================
@router.get("/")
async def get_all_settings(current_user = Depends(require_super_admin)) -> List[Dict[str, Any]]:
    """取得所有系統設定（僅 super_admin）"""
    async with db.pool.acquire() as conn:
        settings = await conn.fetch("""
            SELECT setting_key, setting_value, setting_type, description, updated_at
            FROM system_settings
            ORDER BY setting_key
        """)
        
        return [dict(s) for s in settings]


# ==================== 更新設定 ====================
@router.patch("/{setting_key}")
async def update_setting(
    setting_key: str,
    data: SettingUpdate,
    current_user = Depends(require_super_admin)
):
    """更新系統設定"""
    async with db.pool.acquire() as conn:
        # 檢查設定是否存在
        setting = await conn.fetchrow(
            "SELECT id FROM system_settings WHERE setting_key = $1",
            setting_key
        )
        
        if not setting:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="設定不存在"
            )
        
        # 更新設定
        await conn.execute("""
            UPDATE system_settings 
            SET setting_value = $1,
                updated_at = NOW(),
                updated_by = $2
            WHERE setting_key = $3
        """, data.setting_value, current_user.user_id, setting_key)
        
        return {
            "message": "設定已更新",
            "setting_key": setting_key,
            "new_value": data.setting_value
        }



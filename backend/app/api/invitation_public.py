from fastapi import APIRouter, HTTPException, status
from datetime import datetime

from app.core.database import db

router = APIRouter(prefix="/api/auth", tags=["Authentication - Public"])


# ==================== 取得邀請資訊（公開端點）====================
@router.get("/invitation/{token}")
async def get_invitation_info(token: str):
    """
    取得邀請資訊（公開端點，用於顯示邀請詳情）
    
    不需要認證，但只返回基本資訊
    """
    async with db.pool.acquire() as conn:
        invitation = await conn.fetchrow("""
            SELECT 
                i.email, 
                i.role, 
                i.status, 
                i.expires_at,
                u.email as inviter_email,
                u.name as inviter_name
            FROM user_invitations i
            LEFT JOIN users u ON i.invited_by = u.id
            WHERE i.token = $1
        """, token)
        
        if not invitation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="邀請不存在或已失效"
            )
        
        # 檢查邀請狀態
        if invitation["status"] != "pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="此邀請已被使用或已取消"
            )
        
        # 檢查是否過期
        if invitation["expires_at"] < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="邀請已過期"
            )
        
        return {
            "email": invitation["email"],
            "role": invitation["role"],
            "inviter_email": invitation["inviter_email"],
            "inviter_name": invitation["inviter_name"],
            "expires_at": invitation["expires_at"].isoformat()
        }



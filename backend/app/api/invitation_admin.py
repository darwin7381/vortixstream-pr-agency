from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timedelta
from typing import List
import secrets
import logging

from app.models.invitation import InvitationCreate, InvitationResponse
from app.utils.security import get_current_user, require_admin
from app.models.user import TokenData
from app.core.database import db
from app.config import settings
from app.services.email_service import email_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin", tags=["Admin - Invitations"])


# ==================== 創建邀請 ====================
@router.post("/invitations", response_model=InvitationResponse, status_code=status.HTTP_201_CREATED)
async def create_invitation(
    invitation: InvitationCreate,
    current_user: TokenData = Depends(require_admin)
):
    """
    創建用戶邀請
    
    權限規則：
    - admin 可以邀請：user, publisher
    - super_admin 可以邀請：user, publisher, admin
    """
    # 驗證角色
    valid_roles = ['user', 'publisher', 'admin', 'super_admin']
    if invitation.role not in valid_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"無效的角色。允許的值：{', '.join(valid_roles)}"
        )
    
    # 權限檢查：不能邀請同級或更高級的角色
    role_hierarchy = ['user', 'publisher', 'admin', 'super_admin']
    current_role_level = role_hierarchy.index(current_user.role)
    invite_role_level = role_hierarchy.index(invitation.role)
    
    if invite_role_level >= current_role_level:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="無法邀請同級或更高級別的角色"
        )
    
    async with db.pool.acquire() as conn:
        # 檢查是否在封禁名單
        is_banned = await conn.fetchval(
            "SELECT EXISTS(SELECT 1 FROM banned_emails WHERE email = $1)",
            invitation.email
        )
        
        if is_banned:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="此 Email 已被封禁，無法邀請"
            )
        
        # 檢查該 email 是否已註冊
        existing_user = await conn.fetchrow(
            "SELECT id, email, account_status FROM users WHERE email = $1",
            invitation.email
        )
        
        if existing_user:
            status = existing_user["account_status"]
            
            if status == 'active':
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="此用戶已註冊並啟用，無需邀請"
                )
            elif status == 'banned':
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="此用戶已被封禁，無法邀請"
                )
            # 如果是 user_deactivated 或 admin_suspended，允許邀請（會重新啟用）
        
        # 檢查是否已有待處理的邀請
        existing_invitation = await conn.fetchrow("""
            SELECT id FROM user_invitations 
            WHERE email = $1 AND status = 'pending' AND expires_at > NOW()
        """, invitation.email)
        
        if existing_invitation:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="此 Email 已有待處理的邀請"
            )
        
        # 生成邀請 Token（安全隨機）
        token = secrets.token_urlsafe(32)
        
        # 設定過期時間（7 天）
        expires_at = datetime.utcnow() + timedelta(days=7)
        
        # 創建邀請
        inv = await conn.fetchrow("""
            INSERT INTO user_invitations (email, role, token, invited_by, expires_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, role, token, invited_by, status, expires_at, created_at, accepted_at
        """, invitation.email, invitation.role, token, current_user.user_id, expires_at)
        
        # 發送邀請郵件
        try:
            invitation_url = f"{settings.FRONTEND_URL}/register?invitation={token}"
            await email_service.send_invitation_email(
                to_email=invitation.email,
                inviter_name=current_user.email.split('@')[0],
                invitation_url=invitation_url,
                role=invitation.role
            )
        except Exception as e:
            # 郵件發送失敗不影響邀請創建
            logger.warning(f"Failed to send invitation email: {e}")
        
        return InvitationResponse(**dict(inv))


# ==================== 取得所有邀請 ====================
@router.get("/invitations", response_model=List[InvitationResponse])
async def get_invitations(
    status: str = "pending",
    current_user: TokenData = Depends(require_admin)
):
    """取得邀請列表"""
    async with db.pool.acquire() as conn:
        invitations = await conn.fetch("""
            SELECT id, email, role, token, invited_by, status, expires_at, created_at, accepted_at
            FROM user_invitations
            WHERE status = $1
            ORDER BY created_at DESC
        """, status)
        
        return [InvitationResponse(**dict(inv)) for inv in invitations]


# ==================== 取消邀請 ====================
@router.delete("/invitations/{invitation_id}")
async def cancel_invitation(
    invitation_id: int,
    current_user: TokenData = Depends(require_admin)
):
    """取消邀請"""
    async with db.pool.acquire() as conn:
        invitation = await conn.fetchrow(
            "SELECT id, email FROM user_invitations WHERE id = $1",
            invitation_id
        )
        
        if not invitation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="邀請不存在"
            )
        
        # 更新狀態為 cancelled
        await conn.execute("""
            UPDATE user_invitations 
            SET status = 'cancelled'
            WHERE id = $1
        """, invitation_id)
        
        return {
            "message": f"已取消對 {invitation['email']} 的邀請"
        }


# ==================== 重新發送邀請 ====================
@router.post("/invitations/{invitation_id}/resend")
async def resend_invitation(
    invitation_id: int,
    current_user: TokenData = Depends(require_admin)
):
    """重新發送邀請郵件"""
    async with db.pool.acquire() as conn:
        invitation = await conn.fetchrow("""
            SELECT id, email, role, token, expires_at, status
            FROM user_invitations 
            WHERE id = $1
        """, invitation_id)
        
        if not invitation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="邀請不存在"
            )
        
        if invitation["status"] != "pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="只能重新發送待處理的邀請"
            )
        
        # 延長過期時間
        new_expires_at = datetime.utcnow() + timedelta(days=7)
        await conn.execute("""
            UPDATE user_invitations 
            SET expires_at = $1
            WHERE id = $2
        """, new_expires_at, invitation_id)
        
        # 重新發送郵件
        try:
            invitation_url = f"{settings.FRONTEND_URL}/register?invitation={invitation['token']}"
            await email_service.send_invitation_email(
                to_email=invitation["email"],
                inviter_name=current_user.email.split('@')[0],
                invitation_url=invitation_url,
                role=invitation["role"]
            )
            return {"message": "Invitation email has been resent"}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to send email: {str(e)}"
            )


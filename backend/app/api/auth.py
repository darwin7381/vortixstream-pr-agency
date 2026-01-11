from fastapi import APIRouter, HTTPException, status, Depends, Query
from fastapi.responses import RedirectResponse
from datetime import datetime
import httpx
from typing import Optional
from urllib.parse import urlencode

from app.models.user import UserRegister, UserLogin, TokenResponse, UserResponse, TokenData
from app.utils.security import (
    hash_password, 
    verify_password, 
    create_access_token, 
    create_refresh_token,
    get_current_user
)
from app.core.database import db
from app.config import settings

router = APIRouter(prefix="/api", tags=["Authentication"])


# ==================== Google OAuth 設定 ====================
GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID if hasattr(settings, 'GOOGLE_CLIENT_ID') else ""
GOOGLE_CLIENT_SECRET = settings.GOOGLE_CLIENT_SECRET if hasattr(settings, 'GOOGLE_CLIENT_SECRET') else ""
GOOGLE_REDIRECT_URI = settings.GOOGLE_REDIRECT_URI


# ==================== 註冊 ====================
@router.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, invitation_token: Optional[str] = Query(None)):
    """
    用戶註冊
    
    - 檢查 email 是否已存在
    - 加密密碼
    - 創建用戶
    - 返回 JWT tokens
    """
    async with db.pool.acquire() as conn:
        # 檢查 email 是否已存在
        existing_user = await conn.fetchrow(
            "SELECT id, account_status FROM users WHERE email = $1",
            user_data.email
        )
        
        # 檢查是否在封禁名單
        is_banned_email = await conn.fetchval(
            "SELECT EXISTS(SELECT 1 FROM banned_emails WHERE email = $1)",
            user_data.email
        )
        
        if is_banned_email:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="此 Email 已被封禁，無法註冊"
            )
        
        if existing_user:
            status = existing_user["account_status"]
            
            if status == 'active':
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="此 Email 已被註冊"
                )
            
            elif status == 'banned':
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="此帳號已被封禁，無法註冊"
                )
            
            elif status == 'admin_suspended':
                # 管理員停用的，不允許重新註冊（只能由管理員重新啟用）
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="此帳號已被停用，請聯絡管理員重新啟用"
                )
            
            elif status == 'user_deactivated':
                # 用戶自主停用的，允許重新啟用（保留舊帳號，不刪除）
                hashed_pw = hash_password(user_data.password)
                
                await conn.execute("""
                    UPDATE users 
                    SET account_status = 'active',
                        is_active = TRUE,
                        hashed_password = $1,
                        name = $2,
                        deactivated_at = NULL,
                        updated_at = NOW()
                    WHERE id = $3
                """, hashed_pw, user_data.name, existing_user["id"])
                
                # 取得更新後的用戶資料
                user = await conn.fetchrow("""
                    SELECT id, email, name, avatar_url, role, is_verified, created_at
                    FROM users WHERE id = $1
                """, existing_user["id"])
                
                # 直接跳到生成 token 的部分（不再執行創建用戶）
                token_data = {
                    "sub": str(user["id"]),
                    "email": user["email"],
                    "role": user["role"]
                }
                
                access_token = create_access_token(token_data)
                refresh_token = create_refresh_token(token_data)
                
                user_response = UserResponse(
                    id=user["id"],
                    email=user["email"],
                    name=user["name"],
                    avatar_url=user["avatar_url"],
                    role=user["role"],
                    is_verified=user["is_verified"],
                    created_at=user["created_at"]
                )
                
                return TokenResponse(
                    access_token=access_token,
                    refresh_token=refresh_token,
                    user=user_response
                )
        
        # 檢查是否有邀請（並取得邀請的角色）
        invitation_role = None
        invitation_id = None
        
        if invitation_token:
            invitation = await conn.fetchrow("""
                SELECT id, role, expires_at, status
                FROM user_invitations
                WHERE token = $1 AND email = $2
            """, invitation_token, user_data.email)
            
            if invitation:
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
                
                invitation_role = invitation["role"]
                invitation_id = invitation["id"]
        
        # 加密密碼
        hashed_pw = hash_password(user_data.password)
        
        # 創建用戶（如果有邀請，使用邀請的角色）
        user = await conn.fetchrow("""
            INSERT INTO users (email, hashed_password, name, provider, is_verified, role, account_status, is_active)
            VALUES ($1, $2, $3, 'email', FALSE, $4, 'active', TRUE)
            RETURNING id, email, name, avatar_url, role, is_verified, created_at
        """, user_data.email, hashed_pw, user_data.name, invitation_role or 'user')
        
        # 如果有邀請，標記為已接受
        if invitation_id:
            await conn.execute("""
                UPDATE user_invitations
                SET status = 'accepted', accepted_at = NOW(), accepted_by = $1
                WHERE id = $2
            """, user["id"], invitation_id)
        
        # 生成 tokens
        token_data = {
            "sub": str(user["id"]),
            "email": user["email"],
            "role": user["role"]
        }
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        # 構建用戶響應
        user_response = UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            avatar_url=user["avatar_url"],
            role=user["role"],
            is_verified=user["is_verified"],
            created_at=user["created_at"]
        )
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=user_response
        )


# ==================== 登入 ====================
@router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """
    用戶登入
    
    - 驗證 email 和密碼
    - 更新最後登入時間
    - 返回 JWT tokens
    """
    async with db.pool.acquire() as conn:
        # 查找用戶
        user = await conn.fetchrow("""
            SELECT id, email, hashed_password, name, avatar_url, role, is_active, is_verified, created_at
            FROM users
            WHERE email = $1 AND provider = 'email'
        """, credentials.email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email 或密碼錯誤"
            )
        
        # 驗證密碼
        if not verify_password(credentials.password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email 或密碼錯誤"
            )
        
        # 檢查帳號是否啟用
        if not user["is_active"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="帳號已被停用"
            )
        
        # 更新最後登入時間
        await conn.execute(
            "UPDATE users SET last_login_at = NOW() WHERE id = $1",
            user["id"]
        )
        
        # 生成 tokens
        token_data = {
            "sub": str(user["id"]),
            "email": user["email"],
            "role": user["role"]
        }
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        # 構建用戶響應
        user_response = UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            avatar_url=user["avatar_url"],
            role=user["role"],
            is_verified=user["is_verified"],
            created_at=user["created_at"]
        )
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=user_response
        )


# ==================== 獲取當前用戶 ====================
@router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: TokenData = Depends(get_current_user)):
    """獲取當前登入用戶的完整資料"""
    async with db.pool.acquire() as conn:
        user = await conn.fetchrow("""
            SELECT id, email, name, avatar_url, role, is_verified, created_at
            FROM users
            WHERE id = $1
        """, current_user.user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用戶不存在"
            )
        
        return UserResponse(**dict(user))


# ==================== Google OAuth ====================
@router.get("/auth/google/login")
async def google_login():
    """導向 Google OAuth 登入頁面"""
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth 尚未設定"
        )
    
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={GOOGLE_REDIRECT_URI}&"
        "response_type=code&"
        "scope=openid email profile&"
        "access_type=offline&"
        "prompt=consent"
    )
    
    return {"url": google_auth_url}


@router.get("/auth/google/callback")
async def google_callback(code: str):
    """
    Google OAuth 回調
    
    - 用 code 換取 access token
    - 獲取用戶資料
    - 創建或更新用戶
    - 返回 JWT tokens
    """
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth 尚未設定"
        )
    
    async with httpx.AsyncClient() as client:
        # Step 1: 用 code 換取 access token
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code"
            }
        )
        
        if token_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="無法從 Google 獲取 access token"
            )
        
        tokens = token_response.json()
        access_token_google = tokens.get("access_token")
        
        # Step 2: 用 access token 獲取用戶資料
        user_info_response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token_google}"}
        )
        
        if user_info_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="無法從 Google 獲取用戶資料"
            )
        
        google_user = user_info_response.json()
        
        # Step 3: 創建或更新用戶
        async with db.pool.acquire() as conn:
            # 先查找是否已存在（通過 provider_id 或 email）
            user = await conn.fetchrow("""
                SELECT id, email, name, avatar_url, role, is_verified, created_at
                FROM users
                WHERE (provider = 'google' AND provider_id = $1) OR email = $2
            """, google_user["id"], google_user["email"])
            
            if user:
                # 更新現有用戶
                user = await conn.fetchrow("""
                    UPDATE users
                    SET 
                        provider = 'google',
                        provider_id = $1,
                        avatar_url = COALESCE(avatar_url, $2),
                        is_verified = TRUE,
                        last_login_at = NOW(),
                        updated_at = NOW()
                    WHERE id = $3
                    RETURNING id, email, name, avatar_url, role, is_verified, created_at
                """, google_user["id"], google_user.get("picture"), user["id"])
            else:
                # 創建新用戶
                user = await conn.fetchrow("""
                    INSERT INTO users (
                        email, name, avatar_url, provider, provider_id, is_verified
                    )
                    VALUES ($1, $2, $3, 'google', $4, TRUE)
                    RETURNING id, email, name, avatar_url, role, is_verified, created_at
                """, 
                    google_user["email"],
                    google_user.get("name", google_user["email"].split("@")[0]),
                    google_user.get("picture"),
                    google_user["id"]
                )
        
        # Step 4: 生成我們自己的 JWT tokens
        token_data = {
            "sub": str(user["id"]),
            "email": user["email"],
            "role": user["role"]
        }
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        # Step 5: 重新導向到前端，並在 URL 中帶上 tokens
        frontend_url = f"{settings.FRONTEND_URL}/auth/google/callback"
        params = {
            "access_token": access_token,
            "refresh_token": refresh_token
        }
        redirect_url = f"{frontend_url}?{urlencode(params)}"
        
        return RedirectResponse(url=redirect_url)


# ==================== Refresh Token ====================
@router.post("/auth/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str):
    """
    使用 Refresh Token 獲取新的 Access Token
    """
    from app.utils.security import verify_token
    
    # 驗證 refresh token
    token_data = verify_token(refresh_token)
    
    # 查詢用戶（確保用戶仍然存在且活躍）
    async with db.pool.acquire() as conn:
        user = await conn.fetchrow("""
            SELECT id, email, name, avatar_url, role, is_active, is_verified, created_at
            FROM users
            WHERE id = $1 AND is_active = TRUE
        """, token_data.user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="用戶不存在或已被停用"
            )
    
    # 生成新的 tokens
    new_token_data = {
        "sub": user["id"],
        "email": user["email"],
        "role": user["role"]
    }
    
    new_access_token = create_access_token(new_token_data)
    new_refresh_token = create_refresh_token(new_token_data)
    
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        avatar_url=user["avatar_url"],
        role=user["role"],
        is_verified=user["is_verified"],
        created_at=user["created_at"]
    )
    
    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        user=user_response
    )


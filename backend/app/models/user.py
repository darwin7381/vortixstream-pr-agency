from pydantic import BaseModel, EmailStr
from typing import Optional, Literal
from datetime import datetime

# 角色類型定義
UserRole = Literal["user", "publisher", "admin", "super_admin"]

# ==================== Database Schema ====================
class UserInDB(BaseModel):
    """資料庫中的用戶完整資料"""
    id: int
    email: EmailStr
    hashed_password: Optional[str]
    name: str
    avatar_url: Optional[str]
    provider: str = "email"
    provider_id: Optional[str]
    role: UserRole = "user"
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime
    updated_at: datetime
    last_login_at: Optional[datetime]


# ==================== API Request Schemas ====================
class UserRegister(BaseModel):
    """註冊請求"""
    email: EmailStr
    password: str
    name: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "SecurePass123!",
                "name": "John Doe"
            }
        }


class UserLogin(BaseModel):
    """登入請求"""
    email: EmailStr
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "SecurePass123!"
            }
        }


# ==================== API Response Schemas ====================
class UserResponse(BaseModel):
    """用戶公開資料（不含密碼）"""
    id: int
    email: EmailStr
    name: str
    avatar_url: Optional[str]
    role: UserRole
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """登入成功回應"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    """JWT Token 中的資料"""
    user_id: int
    email: str
    role: UserRole


from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ==================== Request Schemas ====================
class InvitationCreate(BaseModel):
    """創建邀請請求"""
    email: EmailStr
    role: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "newuser@example.com",
                "role": "user"
            }
        }


# ==================== Response Schemas ====================
class InvitationResponse(BaseModel):
    """邀請資料"""
    id: int
    email: EmailStr
    role: str
    token: str
    invited_by: int
    status: str
    expires_at: datetime
    created_at: datetime
    accepted_at: Optional[datetime]
    
    class Config:
        from_attributes = True


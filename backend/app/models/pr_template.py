from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


# ==================== PR Template Models ====================

class PRTemplateBase(BaseModel):
    """PR Template 基礎模型"""
    title: str
    description: str
    category: str
    category_color: str = "#FF7400"
    icon: str = "FileText"
    content: str
    industry_tags: List[str] = []
    use_cases: List[str] = []
    includes: List[str] = []


class PRTemplateCreate(PRTemplateBase):
    """創建 PR Template"""
    display_order: int = 0


class PRTemplateUpdate(BaseModel):
    """更新 PR Template（所有欄位可選）"""
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    category_color: Optional[str] = None
    icon: Optional[str] = None
    content: Optional[str] = None
    industry_tags: Optional[List[str]] = None
    use_cases: Optional[List[str]] = None
    includes: Optional[List[str]] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


class PRTemplateResponse(PRTemplateBase):
    """PR Template 回應"""
    id: int
    download_count: int
    email_request_count: int
    preview_count: int
    waitlist_count: int
    is_active: bool
    display_order: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== Waitlist Models ====================

class WaitlistCreate(BaseModel):
    """加入 Waitlist"""
    template_id: int
    email: EmailStr
    name: Optional[str] = None
    subscribe_newsletter: bool = True


class WaitlistResponse(BaseModel):
    """Waitlist 回應"""
    id: int
    template_id: int
    email: str
    name: Optional[str]
    subscribe_newsletter: bool
    source_template_title: Optional[str]
    status: str
    created_at: datetime


# ==================== Email Request Models ====================

class EmailRequestCreate(BaseModel):
    """請求 Email 發送"""
    email: EmailStr


class EmailRequestResponse(BaseModel):
    """Email 請求回應"""
    success: bool
    message: str
    tracking_id: Optional[str] = None


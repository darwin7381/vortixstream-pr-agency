from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


class MediaLogo(BaseModel):
    """媒體 Logo"""
    url: str
    name: str


class DetailSection(BaseModel):
    """詳細資訊的章節"""
    title: str
    items: List[str]


class DetailedInfo(BaseModel):
    """詳細資訊"""
    sections: List[DetailSection]
    note: Optional[str] = None
    cta_text: Optional[str] = None


class PRPackageBase(BaseModel):
    """PR Package 基礎模型"""
    name: str = Field(..., min_length=1, max_length=100)
    price: str = Field(..., max_length=50)
    description: str
    badge: Optional[str] = Field(None, max_length=100)
    guaranteed_publications: Optional[int] = None
    media_logos: Optional[List[MediaLogo]] = Field(default_factory=list)
    features: List[str] = Field(default_factory=list)
    detailed_info: Optional[DetailedInfo] = None
    category_id: str = Field(..., max_length=50)


class PRPackageCreate(PRPackageBase):
    """創建 PR Package"""
    status: str = Field(default="active", pattern="^(active|inactive)$")
    display_order: int = Field(default=0)


class PRPackageUpdate(BaseModel):
    """更新 PR Package（所有欄位可選）"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    price: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None
    badge: Optional[str] = Field(None, max_length=100)
    guaranteed_publications: Optional[int] = None
    media_logos: Optional[List[MediaLogo]] = None
    features: Optional[List[str]] = None
    detailed_info: Optional[DetailedInfo] = None
    category_id: Optional[str] = Field(None, max_length=50)
    status: Optional[str] = Field(None, pattern="^(active|inactive)$")
    display_order: Optional[int] = None


class PRPackage(PRPackageBase):
    """PR Package 完整模型"""
    id: int
    slug: str
    status: str
    display_order: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PRPackageCategory(BaseModel):
    """PR Package 分類"""
    id: str
    title: str
    badges: List[str] = Field(default_factory=list)
    packages: List[PRPackage] = Field(default_factory=list)






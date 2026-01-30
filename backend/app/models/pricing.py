from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class PricingPackageBase(BaseModel):
    """Pricing Package 基礎模型"""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    price: Decimal = Field(..., ge=0)
    currency: str = Field(default="USD", max_length=3)
    billing_period: str = Field(default="monthly", pattern="^(monthly|yearly|one-time)$")
    features: List[str] = Field(default_factory=list)
    is_popular: bool = Field(default=False)
    badge_text: Optional[str] = Field(None, max_length=50)
    display_order: int = Field(default=0)


class PricingPackageCreate(PricingPackageBase):
    """創建 Pricing Package"""
    status: str = Field(default="active", pattern="^(active|inactive)$")


class PricingPackageUpdate(BaseModel):
    """更新 Pricing Package（所有欄位可選）"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, ge=0)
    currency: Optional[str] = Field(None, max_length=3)
    billing_period: Optional[str] = Field(None, pattern="^(monthly|yearly|one-time)$")
    features: Optional[List[str]] = None
    is_popular: Optional[bool] = None
    badge_text: Optional[str] = Field(None, max_length=50)
    display_order: Optional[int] = None
    status: Optional[str] = Field(None, pattern="^(active|inactive)$")


class PricingPackage(PricingPackageBase):
    """Pricing Package 完整模型（從資料庫返回）"""
    id: int
    slug: str
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True








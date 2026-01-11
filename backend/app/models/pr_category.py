from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class PRCategoryBase(BaseModel):
    """PR Package 分類基礎 Model"""
    category_id: str
    title: str
    badges: List[str] = []
    display_order: int = 0


class PRCategoryCreate(PRCategoryBase):
    """創建分類"""
    pass


class PRCategoryUpdate(BaseModel):
    """更新分類"""
    category_id: Optional[str] = None
    title: Optional[str] = None
    badges: Optional[List[str]] = None
    display_order: Optional[int] = None


class PRCategory(PRCategoryBase):
    """分類完整資訊"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PRCategoryWithPackages(PRCategory):
    """分類及其包含的 Packages"""
    packages_count: int = 0
    packages: List = []  # 將在 API 層填充





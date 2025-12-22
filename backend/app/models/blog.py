from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BlogPostBase(BaseModel):
    """Blog Post 基礎模型"""
    title: str = Field(..., min_length=1, max_length=255)
    category: str = Field(..., min_length=1, max_length=100)
    excerpt: Optional[str] = None
    content: str = Field(..., min_length=1)
    author: str = Field(default="VortixPR Team", max_length=100)
    read_time: Optional[int] = None
    image_url: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None


class BlogPostCreate(BlogPostBase):
    """創建 Blog Post"""
    status: str = Field(default="draft", pattern="^(draft|published|archived)$")


class BlogPostUpdate(BaseModel):
    """更新 Blog Post（所有欄位可選）"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    excerpt: Optional[str] = None
    content: Optional[str] = Field(None, min_length=1)
    author: Optional[str] = Field(None, max_length=100)
    read_time: Optional[int] = None
    image_url: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(draft|published|archived)$")


class BlogPost(BlogPostBase):
    """Blog Post 完整模型（從資料庫返回）"""
    id: int
    slug: str
    status: str
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class BlogPostList(BaseModel):
    """Blog Post 列表回應"""
    posts: list[BlogPost]
    total: int
    page: int
    page_size: int
    total_pages: int


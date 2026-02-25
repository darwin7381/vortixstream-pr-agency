from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Any
from datetime import datetime
import json as _json


class BlogPostBase(BaseModel):
    """Blog Post 基礎模型"""
    title: str = Field(..., min_length=1, max_length=255)
    category: str = Field(..., min_length=1, max_length=100)
    excerpt: Optional[str] = None
    content: str  # 移除 min_length 限制（允許空字串）
    author: str = Field(default="VortixPR Team", max_length=100)
    read_time: Optional[int] = None
    image_url: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    tags: Optional[List[str]] = Field(default_factory=list)

    @field_validator('tags', mode='before')
    @classmethod
    def parse_tags(cls, v: Any) -> List[str]:
        """防禦性處理 JSONB: asyncpg 可能回傳 string 或 list"""
        if v is None:
            return []
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            try:
                parsed = _json.loads(v)
                return parsed if isinstance(parsed, list) else []
            except Exception:
                return []
        return []


class BlogPostCreate(BlogPostBase):
    """創建 Blog Post"""
    status: str = Field(default="draft", pattern="^(draft|published|archived)$")


class BlogPostUpdate(BaseModel):
    """更新 Blog Post（所有欄位可選）"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    excerpt: Optional[str] = None
    content: Optional[str] = None  # 移除 min_length 限制
    author: Optional[str] = Field(None, max_length=100)
    read_time: Optional[int] = None
    image_url: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(draft|published|archived)$")
    tags: Optional[List[str]] = None


class BlogPost(BlogPostBase):
    """Blog Post 完整模型（從資料庫返回）"""
    id: int
    slug: str
    status: str
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
    
    # Notion 整合欄位（可選）
    notion_page_id: Optional[str] = None
    sync_source: Optional[str] = None
    notion_last_edited_time: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class BlogPostList(BaseModel):
    """Blog Post 列表回應"""
    posts: list[BlogPost]
    total: int
    page: int
    page_size: int
    total_pages: int


class NotionBlogSync(BaseModel):
    """從 Notion 同步的資料（N8N 只需傳送 page_id）"""
    notion_page_id: str = Field(..., min_length=1, max_length=100)
    
    # ⚠️ Backend 會自己去 Notion 取得所有資訊：
    # - Page properties（title, pillar, meta_description, author...）
    # - Page blocks（content）


class NotionBlogResponse(BlogPost):
    """同步成功後的回傳（包含給 Notion 的資訊）"""
    article_url: str  # 文章完整 URL（給 Notion 回填用）
    _sync_action: str  # 'created' or 'updated'








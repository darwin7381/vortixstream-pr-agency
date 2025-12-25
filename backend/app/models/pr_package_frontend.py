"""
前端專用的 PR Package models（完全匹配前端 TypeScript interface）
"""
from pydantic import BaseModel
from typing import Optional, List


class MediaLogoFrontend(BaseModel):
    """媒體 Logo（前端格式）"""
    url: str
    name: str


class DetailSectionFrontend(BaseModel):
    """詳細資訊的章節（前端格式）"""
    title: str
    items: List[str]


class DetailedInfoFrontend(BaseModel):
    """詳細資訊（前端格式）"""
    sections: List[DetailSectionFrontend]
    note: Optional[str] = None
    ctaText: Optional[str] = None  # 注意：前端用 ctaText 而非 cta_text


class PRPackageFrontend(BaseModel):
    """PR Package 前端格式（完全匹配前端 TypeScript）"""
    id: str  # 前端的 id 對應後端的 slug
    name: str
    price: str
    description: str
    features: List[str]
    badge: Optional[str] = None
    guaranteedPublications: Optional[int] = None
    mediaLogos: Optional[List[MediaLogoFrontend]] = None
    detailedInfo: Optional[DetailedInfoFrontend] = None


class PRPackageCategoryFrontend(BaseModel):
    """PR Package 分類（前端格式）"""
    id: str
    title: str
    badges: Optional[List[str]] = None
    packages: List[PRPackageFrontend]



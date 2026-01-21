"""
內容管理模型 (CMS)
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ==================== FAQ Models ====================

class FAQBase(BaseModel):
    question: str = Field(..., min_length=1, max_length=500)
    answer: str = Field(..., min_length=1)
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)


class FAQCreate(FAQBase):
    pass


class FAQUpdate(BaseModel):
    question: Optional[str] = Field(None, min_length=1, max_length=500)
    answer: Optional[str] = Field(None, min_length=1)
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class FAQResponse(FAQBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Testimonial Models ====================

class TestimonialBase(BaseModel):
    quote: str = Field(..., min_length=1, max_length=1000)
    author_name: str = Field(..., min_length=1, max_length=100)
    author_title: Optional[str] = Field(None, max_length=200)
    author_company: Optional[str] = Field(None, max_length=200)
    author_avatar_url: Optional[str] = None
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    quote: Optional[str] = Field(None, min_length=1, max_length=1000)
    author_name: Optional[str] = Field(None, min_length=1, max_length=100)
    author_title: Optional[str] = Field(None, max_length=200)
    author_company: Optional[str] = Field(None, max_length=200)
    author_avatar_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class TestimonialResponse(TestimonialBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Team Member Models ====================

class TeamMemberBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    position: str = Field(..., min_length=1, max_length=200)
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    position: Optional[str] = Field(None, min_length=1, max_length=200)
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class TeamMemberResponse(TeamMemberBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Service Models ====================

class ServiceBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    icon: Optional[str] = Field(None, max_length=50)
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1)
    icon: Optional[str] = Field(None, max_length=50)
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class ServiceResponse(ServiceBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Site Settings Models ====================

class SettingUpdate(BaseModel):
    value: str = Field(..., min_length=0)


class SettingResponse(BaseModel):
    id: int
    setting_key: str
    setting_value: str
    setting_type: str
    description: Optional[str]
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Differentiator Models ====================

class DifferentiatorBase(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)


class DifferentiatorCreate(DifferentiatorBase):
    pass


class DifferentiatorUpdate(BaseModel):
    text: Optional[str] = Field(None, min_length=1, max_length=500)
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class DifferentiatorResponse(DifferentiatorBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Stat Models ====================

class StatBase(BaseModel):
    label: str = Field(..., min_length=1, max_length=100)
    value: int = Field(..., ge=0)
    suffix: str = Field(default='+', max_length=10)
    description: Optional[str] = None
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)


class StatCreate(StatBase):
    pass


class StatUpdate(BaseModel):
    label: Optional[str] = Field(None, min_length=1, max_length=100)
    value: Optional[int] = Field(None, ge=0)
    suffix: Optional[str] = Field(None, max_length=10)
    description: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class StatResponse(StatBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Client Logo Models ====================

class ClientLogoBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    logo_url: str = Field(..., min_length=1)
    website_url: Optional[str] = None
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)


class ClientLogoCreate(ClientLogoBase):
    pass


class ClientLogoUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class ClientLogoResponse(ClientLogoBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Publisher Feature Models ====================

class PublisherFeatureBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)


class PublisherFeatureCreate(PublisherFeatureBase):
    pass


class PublisherFeatureUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class PublisherFeatureResponse(PublisherFeatureBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Hero Section Models ====================

class HeroSectionBase(BaseModel):
    """
    Hero Section 基礎模型
    
    ⚠️ 重要：所有欄位都必須在這裡定義，否則 API 不會返回該欄位
    
    特別注意：
    - cta_primary_url: 桌面版 CTA 連結
    - cta_primary_url_mobile: 手機版 CTA 連結（重要！必須定義才會被 API 返回）
    - cta_secondary_url: 桌面版次要 CTA 連結
    - cta_secondary_url_mobile: 手機版次要 CTA 連結（重要！必須定義才會被 API 返回）
    """
    page: str = Field(..., max_length=50)
    title_prefix: Optional[str] = None
    title_highlights: Optional[List[str]] = Field(default=['Web3 & AI'])
    title_suffix: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    center_logo_url: Optional[str] = None
    cta_primary_text: Optional[str] = None
    cta_primary_url: Optional[str] = None
    cta_primary_url_mobile: Optional[str] = None  # ⚠️ 必須定義，否則 API 不返回此欄位
    cta_secondary_text: Optional[str] = None
    cta_secondary_url: Optional[str] = None
    cta_secondary_url_mobile: Optional[str] = None  # ⚠️ 必須定義，否則 API 不返回此欄位
    background_image_url: Optional[str] = None
    background_video_url: Optional[str] = None
    is_active: bool = Field(default=True)


class HeroSectionCreate(HeroSectionBase):
    pass


class HeroSectionUpdate(BaseModel):
    title_prefix: Optional[str] = None
    title_highlights: Optional[List[str]] = None
    title_suffix: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    center_logo_url: Optional[str] = None
    cta_primary_text: Optional[str] = None
    cta_primary_url: Optional[str] = None
    cta_primary_url_mobile: Optional[str] = None
    cta_secondary_text: Optional[str] = None
    cta_secondary_url: Optional[str] = None
    cta_secondary_url_mobile: Optional[str] = None
    background_image_url: Optional[str] = None
    background_video_url: Optional[str] = None
    is_active: Optional[bool] = None


class HeroSectionResponse(HeroSectionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Section Contents (JSONB) Models ====================

class SectionContentBase(BaseModel):
    """
    通用的 Section Content Model（使用 JSONB）
    
    所有 section 的內容都可以存在 section_contents 表中
    這樣不需要為每個 section 創建新表
    """
    section_key: str = Field(..., max_length=100)
    content: dict  # JSONB 欄位，可以存任意結構


class SectionContentCreate(SectionContentBase):
    pass


class SectionContentUpdate(BaseModel):
    content: dict  # 更新時只需要提供 content


class SectionContentResponse(SectionContentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Hero Media Logo Models ====================

class HeroMediaLogoBase(BaseModel):
    hero_page: str = Field(..., max_length=50)
    name: str = Field(..., min_length=1, max_length=200)
    logo_url: str = Field(..., min_length=1)
    website_url: Optional[str] = None
    opacity: float = Field(default=0.5, ge=0.0, le=1.0)
    size: str = Field(default='md', pattern='^(sm|md|lg)$')
    position_top: Optional[str] = None
    position_left: Optional[str] = None
    position_right: Optional[str] = None
    position_bottom: Optional[str] = None
    animation_speed: int = Field(default=5, ge=1, le=60)
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)


class HeroMediaLogoCreate(HeroMediaLogoBase):
    pass


class HeroMediaLogoUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    opacity: Optional[float] = Field(None, ge=0.0, le=1.0)
    size: Optional[str] = Field(None, pattern='^(sm|md|lg)$')
    position_top: Optional[str] = None
    position_left: Optional[str] = None
    position_right: Optional[str] = None
    position_bottom: Optional[str] = None
    animation_speed: Optional[int] = Field(None, ge=1, le=60)
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class HeroMediaLogoResponse(HeroMediaLogoBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Lyro Section Models ====================

class LyroSectionBase(BaseModel):
    label: Optional[str] = None
    title: str = Field(..., min_length=1)
    subtitle: Optional[str] = None
    description: Optional[str] = None
    background_image_url: Optional[str] = None
    is_active: bool = Field(default=True)


class LyroSectionUpdate(BaseModel):
    label: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    background_image_url: Optional[str] = None
    is_active: Optional[bool] = None


class LyroSectionResponse(LyroSectionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class LyroFeatureBase(BaseModel):
    text: str = Field(..., min_length=1)
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)


class LyroFeatureCreate(LyroFeatureBase):
    pass


class LyroFeatureUpdate(BaseModel):
    text: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class LyroFeatureResponse(LyroFeatureBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Carousel Logo Models ====================

class CarouselLogoBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    logo_url: str = Field(..., min_length=1)
    alt_text: Optional[str] = Field(None, max_length=200)
    website_url: Optional[str] = None
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)


class CarouselLogoCreate(CarouselLogoBase):
    pass


class CarouselLogoUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    logo_url: Optional[str] = None
    alt_text: Optional[str] = Field(None, max_length=200)
    website_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class CarouselLogoResponse(CarouselLogoBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


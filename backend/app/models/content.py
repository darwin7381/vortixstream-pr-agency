"""
內容管理模型 (CMS)
"""
from pydantic import BaseModel, Field
from typing import Optional
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
    page: str = Field(..., max_length=50)
    title: str = Field(..., min_length=1)
    subtitle: Optional[str] = None
    description: Optional[str] = None
    cta_primary_text: Optional[str] = None
    cta_primary_url: Optional[str] = None
    cta_secondary_text: Optional[str] = None
    cta_secondary_url: Optional[str] = None
    background_image_url: Optional[str] = None
    is_active: bool = Field(default=True)


class HeroSectionCreate(HeroSectionBase):
    pass


class HeroSectionUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    cta_primary_text: Optional[str] = None
    cta_primary_url: Optional[str] = None
    cta_secondary_text: Optional[str] = None
    cta_secondary_url: Optional[str] = None
    background_image_url: Optional[str] = None
    is_active: Optional[bool] = None


class HeroSectionResponse(HeroSectionBase):
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


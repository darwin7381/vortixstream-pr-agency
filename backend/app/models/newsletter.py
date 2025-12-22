from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class NewsletterSubscribe(BaseModel):
    """Newsletter 訂閱"""
    email: EmailStr
    source: Optional[str] = Field(None, max_length=50)


class NewsletterSubscriber(BaseModel):
    """Newsletter 訂閱者模型"""
    id: int
    email: str
    status: str
    source: Optional[str]
    subscribed_at: datetime
    unsubscribed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


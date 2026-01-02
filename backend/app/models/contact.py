from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class ContactSubmissionCreate(BaseModel):
    """聯絡表單提交"""
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    company: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    message: str = Field(..., min_length=10)


class ContactSubmission(ContactSubmissionCreate):
    """聯絡表單完整模型"""
    id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True






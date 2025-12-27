from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MediaFileBase(BaseModel):
    """媒體檔案基礎 Model"""
    filename: str
    original_filename: str
    file_key: str
    file_url: str
    file_size: int
    mime_type: str
    folder: str = "uploads"
    width: Optional[int] = None
    height: Optional[int] = None
    alt_text: Optional[str] = None
    caption: Optional[str] = None
    uploaded_by: Optional[str] = None


class MediaFileCreate(BaseModel):
    """創建媒體檔案（上傳後儲存記錄）"""
    filename: str
    original_filename: str
    file_key: str
    file_url: str
    file_size: int
    mime_type: str
    folder: str = "uploads"
    alt_text: Optional[str] = None
    caption: Optional[str] = None
    uploaded_by: Optional[str] = "admin"


class MediaFileUpdate(BaseModel):
    """更新媒體檔案資訊"""
    alt_text: Optional[str] = None
    caption: Optional[str] = None


class MediaFile(MediaFileBase):
    """媒體檔案完整資訊"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


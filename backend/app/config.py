from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """應用程式設定"""
    
    # Database
    DATABASE_URL: str
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173"
    
    # Resend (郵件服務 - 可選)
    RESEND_API_KEY: str = ""
    FROM_EMAIL: str = "onboarding@resend.dev"
    ADMIN_EMAIL: str = ""
    
    # Cloudflare R2 (圖片存儲 - 可選)
    R2_ACCOUNT_ID: str = ""
    R2_ACCESS_KEY_ID: str = ""
    R2_SECRET_ACCESS_KEY: str = ""
    R2_BUCKET_NAME: str = ""
    R2_PUBLIC_URL: str = ""
    
    # Security
    SECRET_KEY: str = "change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Environment
    ENVIRONMENT: str = "development"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """將 ALLOWED_ORIGINS 字串轉換為列表"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]


# 全域設定實例
settings = Settings()




from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from .config import settings
from .core.database import db
from .api import (
    blog, pricing, contact, newsletter, pr_package,
    blog_admin, pricing_admin, pr_package_admin, contact_admin, newsletter_admin,
    pr_category_admin, media_admin, auth, user_admin, invitation_admin, invitation_public,
    settings_admin, content_public, content_admin, content_admin_extended
)

# 設定 logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 創建 FastAPI app
app = FastAPI(
    title="VortixPR API",
    description="VortixPR Backend API for Blog, Pricing, and more",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    redirect_slashes=True  # 明確設定（避免 307 導致協議問題）
)

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Startup event
@app.on_event("startup")
async def startup():
    """應用程式啟動時執行"""
    logger.info("🚀 Starting VortixPR API...")
    
    # 初始化資料庫
    db.database_url = settings.DATABASE_URL
    await db.connect()
    
    # 存儲 db 實例到 app.state
    app.state.db = db
    
    logger.info("✅ VortixPR API started successfully")


# Shutdown event
@app.on_event("shutdown")
async def shutdown():
    """應用程式關閉時執行"""
    logger.info("👋 Shutting down VortixPR API...")
    
    await db.disconnect()
    
    logger.info("✅ VortixPR API shut down successfully")


# Health check
@app.get("/")
async def root():
    """API 根路徑 - 健康檢查"""
    return {
        "message": "VortixPR API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """詳細的健康檢查"""
    try:
        # 測試資料庫連線
        async with db.pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        
        return {
            "status": "healthy",
            "database": "connected",
            "environment": settings.ENVIRONMENT
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e)
        }


# 註冊 API routers - 按快取策略分類

# Public APIs（可大量快取 - 只讀操作）
app.include_router(blog.router, prefix="/api/public", tags=["Public - Blog"])
app.include_router(pricing.router, prefix="/api/public", tags=["Public - Pricing"])
app.include_router(pr_package.router, prefix="/api/public", tags=["Public - PR Packages"])
app.include_router(content_public.router, prefix="/api", tags=["Public - Content"])

# Auth APIs（認證相關）
app.include_router(auth.router, tags=["Authentication"])
app.include_router(invitation_public.router, tags=["Authentication"])

# Write APIs（寫入操作，不快取 - 一般用戶可用）
app.include_router(contact.router, prefix="/api/write", tags=["Write - Contact"])
app.include_router(newsletter.router, prefix="/api/write", tags=["Write - Newsletter"])

# Admin APIs（管理操作，需認證，不快取）
app.include_router(blog_admin.router, prefix="/api/admin", tags=["Admin - Blog"])
app.include_router(pricing_admin.router, prefix="/api/admin", tags=["Admin - Pricing"])
app.include_router(pr_package_admin.router, prefix="/api/admin", tags=["Admin - PR Packages"])
app.include_router(pr_category_admin.router, prefix="/api/admin", tags=["Admin - PR Categories"])
app.include_router(contact_admin.router, prefix="/api/admin", tags=["Admin - Contact"])
app.include_router(newsletter_admin.router, prefix="/api/admin", tags=["Admin - Newsletter"])
app.include_router(media_admin.router, prefix="/api/admin", tags=["Admin - Media"])
app.include_router(user_admin.router, tags=["Admin - Users"])
app.include_router(invitation_admin.router, tags=["Admin - Invitations"])
app.include_router(settings_admin.router, tags=["Admin - Settings"])
app.include_router(content_admin.router, prefix="/api", tags=["Admin - Content"])
app.include_router(content_admin_extended.router, prefix="/api", tags=["Admin - Content Extended"])


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # 開發模式
        log_level="info"
    )


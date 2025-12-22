from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from .config import settings
from .core.database import db
from .api import blog, pricing, contact, newsletter, pr_package

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
    redoc_url="/redoc"
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

# Public APIs（可大量快取）
app.include_router(blog.router, prefix="/api/public", tags=["Public - Blog"])
app.include_router(pricing.router, prefix="/api/public", tags=["Public - Pricing"])
app.include_router(pr_package.router, prefix="/api/public", tags=["Public - PR Packages"])

# Write APIs（寫入操作，不快取）
app.include_router(contact.router, prefix="/api/write", tags=["Write - Contact"])
app.include_router(newsletter.router, prefix="/api/write", tags=["Write - Newsletter"])


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # 開發模式
        log_level="info"
    )


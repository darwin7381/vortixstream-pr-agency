# VortixPR Backend 開發計劃

## 📋 專案概述

基於前端分析，建立 FastAPI + PostgreSQL 後端系統，支援：
- Blog 文章管理（CMS）
- 聯絡表單處理
- Newsletter 訂閱管理
- Publisher 申請處理
- 未來 AI 功能擴展

---

## 🎯 核心功能需求

### 1. Blog 管理系統
```python
# 需要的功能
- 文章 CRUD（創建、讀取、更新、刪除）
- 分類管理（PR Strategy, Media Strategy, etc.）
- 文章列表分頁
- 按分類篩選
- 搜尋功能
- 閱讀時間自動計算
- SEO meta 資訊
```

### 2. 聯絡表單
```python
# 需要的功能
- 接收聯絡表單資料
- Email 通知（發給管理員）
- 儲存到資料庫
- 防止垃圾訊息（簡單的 rate limiting）
```

### 3. Newsletter 訂閱
```python
# 需要的功能
- Email 訂閱
- 重複訂閱檢查
- 取消訂閱功能
- 訂閱狀態管理（active, unsubscribed）
```

### 4. Publisher 申請
```python
# 需要的功能
- Publisher 申請表單處理
- 儲存申請資料
- 狀態追蹤（pending, approved, rejected）
```

### 5. 未來 AI 功能預留
```python
# 預留擴展空間
- AI 內容生成記錄
- 使用量追蹤
- 快取機制
```

---

## 🏗️ 技術架構

### 技術棧
```yaml
語言: Python 3.11+
框架: FastAPI
資料庫: PostgreSQL
ORM: asyncpg (原生，無 ORM)
驗證: JWT (未來)
Email: SMTP (或 Resend API)
部署: Railway / Fly.io
```

### 為什麼選擇 asyncpg（無 ORM）？
- ✅ 效能極佳（比 SQLAlchemy 快 3-5 倍）
- ✅ 代碼即文檔，一目瞭然
- ✅ 簡單直接，AI 容易理解
- ✅ 啟動時自動建表，無需 migration
- ✅ 適合中小型專案

---

## 📁 專案結構

```
backend/
├── app/
│   ├── main.py                 # FastAPI 入口
│   ├── config.py              # 設定檔（環境變數）
│   │
│   ├── core/
│   │   ├── database.py        # 🎯 資料庫連線 & 自動建表
│   │   └── email.py           # Email 發送
│   │
│   ├── api/
│   │   ├── blog.py            # Blog API
│   │   ├── contact.py         # Contact API
│   │   ├── newsletter.py      # Newsletter API
│   │   └── publisher.py       # Publisher API
│   │
│   ├── models/
│   │   ├── blog.py            # Blog Pydantic models
│   │   ├── contact.py         # Contact Pydantic models
│   │   └── newsletter.py      # Newsletter Pydantic models
│   │
│   └── utils/
│       ├── rate_limit.py      # Rate limiting
│       └── validators.py      # 驗證工具
│
├── requirements.txt
├── .env.example
└── README.md
```

---

## 🗄️ 資料庫設計

### 1. Blog Posts (文章)
```sql
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,  -- URL 友善 ID
    category VARCHAR(100) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author VARCHAR(100) DEFAULT 'VortixPR Team',
    read_time INTEGER,  -- 閱讀時間（分鐘）
    image_url TEXT,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft',  -- draft, published, archived
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP
);

CREATE INDEX idx_blog_category ON blog_posts(category);
CREATE INDEX idx_blog_status ON blog_posts(status);
CREATE INDEX idx_blog_published_at ON blog_posts(published_at DESC);
```

### 2. Contact Submissions (聯絡表單)
```sql
CREATE TABLE IF NOT EXISTS contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    message TEXT NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'new',  -- new, read, replied, archived
    
    -- Metadata
    ip_address VARCHAR(50),
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_created ON contact_submissions(created_at DESC);
```

### 3. Newsletter Subscribers (訂閱者)
```sql
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active',  -- active, unsubscribed
    
    -- Metadata
    source VARCHAR(50),  -- blog, homepage, etc.
    ip_address VARCHAR(50),
    
    -- Timestamps
    subscribed_at TIMESTAMP DEFAULT NOW(),
    unsubscribed_at TIMESTAMP
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);
```

### 4. Publisher Applications (Publisher 申請)
```sql
CREATE TABLE IF NOT EXISTS publisher_applications (
    id SERIAL PRIMARY KEY,
    
    -- Contact Info
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    website VARCHAR(255),
    
    -- Application Info
    audience_size INTEGER,
    content_topics TEXT[],  -- PostgreSQL array
    monthly_traffic INTEGER,
    social_media JSONB,  -- { "twitter": "...", "linkedin": "..." }
    additional_info TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending',  -- pending, approved, rejected
    reviewed_at TIMESTAMP,
    notes TEXT,  -- 內部備註
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_publisher_status ON publisher_applications(status);
CREATE INDEX idx_publisher_created ON publisher_applications(created_at DESC);
```

### 5. AI Usage Logs (未來 AI 功能)
```sql
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id SERIAL PRIMARY KEY,
    
    -- Request Info
    feature VARCHAR(50) NOT NULL,  -- blog_generation, meta_generation, etc.
    prompt TEXT,
    response TEXT,
    
    -- Metadata
    model VARCHAR(50),
    tokens_used INTEGER,
    cost DECIMAL(10, 6),
    duration_ms INTEGER,
    
    -- User (未來加入認證後)
    user_id INTEGER,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_feature ON ai_usage_logs(feature);
CREATE INDEX idx_ai_created ON ai_usage_logs(created_at DESC);
```

---

## 🎯 核心實作：database.py

```python
# app/core/database.py
import asyncpg
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class Database:
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.pool: Optional[asyncpg.Pool] = None
    
    async def connect(self):
        """啟動時連線並自動初始化資料庫"""
        logger.info("🔌 Connecting to database...")
        
        self.pool = await asyncpg.create_pool(
            self.database_url,
            min_size=2,
            max_size=10,
            command_timeout=60
        )
        
        logger.info("✅ Database connected")
        
        # 🎯 自動初始化資料表
        await self.init_tables()
        
        logger.info("✅ Database initialized")
    
    async def disconnect(self):
        """關閉連線"""
        if self.pool:
            await self.pool.close()
            logger.info("🔌 Database disconnected")
    
    async def init_tables(self):
        """初始化所有資料表（冪等性）"""
        async with self.pool.acquire() as conn:
            # 1. Blog Posts
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS blog_posts (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    slug VARCHAR(255) UNIQUE NOT NULL,
                    category VARCHAR(100) NOT NULL,
                    excerpt TEXT,
                    content TEXT NOT NULL,
                    author VARCHAR(100) DEFAULT 'VortixPR Team',
                    read_time INTEGER,
                    image_url TEXT,
                    meta_title VARCHAR(255),
                    meta_description TEXT,
                    status VARCHAR(20) DEFAULT 'draft',
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW(),
                    published_at TIMESTAMP
                );
                
                CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_posts(category);
                CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
                CREATE INDEX IF NOT EXISTS idx_blog_published_at ON blog_posts(published_at DESC);
            """)
            
            # 2. Contact Submissions
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS contact_submissions (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    company VARCHAR(255),
                    phone VARCHAR(50),
                    message TEXT NOT NULL,
                    status VARCHAR(20) DEFAULT 'new',
                    ip_address VARCHAR(50),
                    user_agent TEXT,
                    created_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
                CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at DESC);
            """)
            
            # 3. Newsletter Subscribers
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS newsletter_subscribers (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    status VARCHAR(20) DEFAULT 'active',
                    source VARCHAR(50),
                    ip_address VARCHAR(50),
                    subscribed_at TIMESTAMP DEFAULT NOW(),
                    unsubscribed_at TIMESTAMP
                );
                
                CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
                CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);
            """)
            
            # 4. Publisher Applications
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS publisher_applications (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    company VARCHAR(255),
                    website VARCHAR(255),
                    audience_size INTEGER,
                    content_topics TEXT[],
                    monthly_traffic INTEGER,
                    social_media JSONB,
                    additional_info TEXT,
                    status VARCHAR(20) DEFAULT 'pending',
                    reviewed_at TIMESTAMP,
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_publisher_status ON publisher_applications(status);
                CREATE INDEX IF NOT EXISTS idx_publisher_created ON publisher_applications(created_at DESC);
            """)
            
            # 5. AI Usage Logs
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS ai_usage_logs (
                    id SERIAL PRIMARY KEY,
                    feature VARCHAR(50) NOT NULL,
                    prompt TEXT,
                    response TEXT,
                    model VARCHAR(50),
                    tokens_used INTEGER,
                    cost DECIMAL(10, 6),
                    duration_ms INTEGER,
                    user_id INTEGER,
                    created_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_ai_feature ON ai_usage_logs(feature);
                CREATE INDEX IF NOT EXISTS idx_ai_created ON ai_usage_logs(created_at DESC);
            """)
            
            logger.info("✅ All tables initialized")
            
            # 可選：插入初始資料
            await self._init_seed_data(conn)
    
    async def _init_seed_data(self, conn):
        """插入初始資料（如果需要）"""
        # 檢查是否已有資料
        count = await conn.fetchval("SELECT COUNT(*) FROM blog_posts")
        
        if count == 0:
            logger.info("📝 Seeding initial blog posts...")
            # 可以在這裡插入初始的 blog 文章
            # 或是從現有的 constants/blogData.ts 遷移
            pass

# 全域實例
db = Database(database_url="")  # 會在 main.py 初始化
```

---

## 🚀 開發階段規劃

### Phase 1: 基礎設施（1-2 天）
```
✅ 專案結構建立
✅ FastAPI 基本設定
✅ Database 連線 & 自動建表
✅ 環境變數管理
✅ CORS 設定
```

### Phase 2: 核心 API（2-3 天）
```
✅ Blog API (CRUD)
✅ Contact Form API
✅ Newsletter API
✅ Publisher Application API
✅ Error handling
✅ Input validation
```

### Phase 3: 進階功能（1-2 天）
```
✅ Rate limiting
✅ Email 整合
✅ 搜尋功能
✅ 分頁
✅ 檔案上傳（如果需要）
```

### Phase 4: 部署（1 天）
```
✅ Railway 部署
✅ 環境變數設定
✅ 資料庫連線測試
✅ 前端整合測試
```

---

## 📦 Dependencies

```txt
# requirements.txt
fastapi==0.115.0
uvicorn[standard]==0.32.1
asyncpg==0.30.0
pydantic==2.10.5
pydantic-settings==2.7.0
python-dotenv==1.0.1
python-multipart==0.0.20
email-validator==2.2.0

# Email (選一個)
aiosmtplib==3.0.2  # SMTP
# 或
httpx==0.28.1  # 如果用 Resend API

# 安全性
python-jose[cryptography]==3.3.0  # JWT (未來)
passlib[bcrypt]==1.7.4  # 密碼加密 (未來)

# 工具
python-slugify==8.0.4  # 生成 URL slug
```

---

## 🔐 環境變數

```bash
# .env.example
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/vortixpr

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@vortixpr.com

# 或使用 Resend
RESEND_API_KEY=re_...

# 未來 AI
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Security (未來)
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 🎯 API 端點規劃

### Blog
```
GET    /api/blog/posts              # 取得文章列表（分頁）
GET    /api/blog/posts/:slug        # 取得單篇文章
POST   /api/blog/posts              # 創建文章（未來需認證）
PUT    /api/blog/posts/:id          # 更新文章（未來需認證）
DELETE /api/blog/posts/:id          # 刪除文章（未來需認證）
GET    /api/blog/categories         # 取得分類列表
```

### Contact
```
POST   /api/contact/submit          # 提交聯絡表單
GET    /api/contact/submissions     # 取得提交列表（需認證）
```

### Newsletter
```
POST   /api/newsletter/subscribe    # 訂閱
POST   /api/newsletter/unsubscribe  # 取消訂閱
GET    /api/newsletter/subscribers  # 訂閱者列表（需認證）
```

### Publisher
```
POST   /api/publisher/apply         # 提交申請
GET    /api/publisher/applications  # 申請列表（需認證）
PUT    /api/publisher/applications/:id  # 更新狀態（需認證）
```

---

## ✅ 成功標準

- [ ] 所有 API 正常運作
- [ ] 資料庫自動初始化
- [ ] Email 通知正常發送
- [ ] 前端可以正確呼叫 API
- [ ] 部署到 Railway 成功
- [ ] 回應時間 < 200ms
- [ ] 錯誤處理完善
- [ ] API 文件自動生成（FastAPI /docs）

---

## 🚀 下一步

1. 創建基礎專案結構
2. 實作 `database.py`
3. 實作各個 API endpoint
4. 本地測試
5. 部署到 Railway
6. 前端整合

---

## 📝 備註

- 使用 `asyncpg` 而非 ORM，保持簡單
- 所有 SQL 使用參數化查詢，防止 SQL Injection
- 啟動時自動建表，無需手動 migration
- 使用 FastAPI 的自動 API 文件（/docs）
- 預留 AI 功能擴展空間




import asyncpg
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class Database:
    """資料庫管理類別 - 自動初始化所有資料表"""
    
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
        """初始化所有資料表（冪等性 - 可重複執行）"""
        async with self.pool.acquire() as conn:
            
            # ==================== Blog Posts ====================
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
                    
                    -- SEO
                    meta_title VARCHAR(255),
                    meta_description TEXT,
                    
                    -- Status
                    status VARCHAR(20) DEFAULT 'draft',
                    
                    -- Timestamps
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW(),
                    published_at TIMESTAMP
                );
                
                CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_posts(category);
                CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
                CREATE INDEX IF NOT EXISTS idx_blog_published_at ON blog_posts(published_at DESC);
                CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
            """)
            
            # ==================== Pricing Packages ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS pricing_packages (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    slug VARCHAR(100) UNIQUE NOT NULL,
                    description TEXT,
                    price DECIMAL(10, 2) NOT NULL,
                    currency VARCHAR(3) DEFAULT 'USD',
                    billing_period VARCHAR(20) DEFAULT 'monthly',
                    
                    -- Features (JSON array)
                    features JSONB NOT NULL DEFAULT '[]'::jsonb,
                    
                    -- Highlight
                    is_popular BOOLEAN DEFAULT FALSE,
                    badge_text VARCHAR(50),
                    
                    -- Display Order
                    display_order INTEGER DEFAULT 0,
                    
                    -- Status
                    status VARCHAR(20) DEFAULT 'active',
                    
                    -- Timestamps
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_pricing_status ON pricing_packages(status);
                CREATE INDEX IF NOT EXISTS idx_pricing_order ON pricing_packages(display_order);
            """)
            
            # ==================== Contact Submissions ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS contact_submissions (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    company VARCHAR(255),
                    phone VARCHAR(50),
                    message TEXT NOT NULL,
                    
                    -- Status
                    status VARCHAR(20) DEFAULT 'new',
                    
                    -- Metadata
                    ip_address VARCHAR(50),
                    user_agent TEXT,
                    
                    created_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
                CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at DESC);
            """)
            
            # ==================== Newsletter Subscribers ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS newsletter_subscribers (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    
                    -- Status
                    status VARCHAR(20) DEFAULT 'active',
                    
                    -- Metadata
                    source VARCHAR(50),
                    ip_address VARCHAR(50),
                    
                    -- Timestamps
                    subscribed_at TIMESTAMP DEFAULT NOW(),
                    unsubscribed_at TIMESTAMP
                );
                
                CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
                CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);
            """)
            
            # ==================== Publisher Applications ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS publisher_applications (
                    id SERIAL PRIMARY KEY,
                    
                    -- Contact Info
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    company VARCHAR(255),
                    website VARCHAR(255),
                    
                    -- Application Info
                    audience_size INTEGER,
                    content_topics TEXT[],
                    monthly_traffic INTEGER,
                    social_media JSONB,
                    additional_info TEXT,
                    
                    -- Status
                    status VARCHAR(20) DEFAULT 'pending',
                    reviewed_at TIMESTAMP,
                    notes TEXT,
                    
                    created_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_publisher_status ON publisher_applications(status);
                CREATE INDEX IF NOT EXISTS idx_publisher_created ON publisher_applications(created_at DESC);
            """)
            
            # ==================== PR Packages (首頁使用) ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS pr_packages (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    slug VARCHAR(100) UNIQUE NOT NULL,
                    price VARCHAR(50) NOT NULL,
                    description TEXT,
                    badge VARCHAR(100),
                    guaranteed_publications INTEGER,
                    
                    -- Category (global-pr, asia-packages, founder-pr)
                    category_id VARCHAR(50) NOT NULL,
                    category_order INTEGER DEFAULT 0,  -- 分類顯示順序
                    
                    -- JSON fields
                    media_logos JSONB DEFAULT '[]'::jsonb,
                    features JSONB NOT NULL DEFAULT '[]'::jsonb,
                    detailed_info JSONB,
                    
                    -- Display Order (within category)
                    display_order INTEGER DEFAULT 0,
                    
                    -- Status
                    status VARCHAR(20) DEFAULT 'active',
                    
                    -- Timestamps
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_pr_packages_category ON pr_packages(category_id);
                CREATE INDEX IF NOT EXISTS idx_pr_packages_status ON pr_packages(status);
                CREATE INDEX IF NOT EXISTS idx_pr_packages_order ON pr_packages(category_order, display_order);
            """)
            
            # Media Files Table（媒體檔案管理）
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS media_files (
                    id SERIAL PRIMARY KEY,
                    filename VARCHAR(255) NOT NULL,
                    original_filename VARCHAR(255) NOT NULL,
                    file_key VARCHAR(500) UNIQUE NOT NULL,
                    file_url TEXT NOT NULL,
                    file_size INTEGER NOT NULL,
                    mime_type VARCHAR(100) NOT NULL,
                    folder VARCHAR(100) DEFAULT 'uploads',
                    width INTEGER,
                    height INTEGER,
                    alt_text VARCHAR(500),
                    caption TEXT,
                    uploaded_by VARCHAR(100),
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            """)
            
            # Media Files Indexes
            await conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_media_folder 
                ON media_files(folder)
            """)
            await conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_media_created 
                ON media_files(created_at DESC)
            """)
            await conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_media_mime 
                ON media_files(mime_type)
            """)
            
            # ==================== PR Package Categories ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS pr_package_categories (
                    id SERIAL PRIMARY KEY,
                    category_id VARCHAR(50) UNIQUE NOT NULL,
                    title VARCHAR(100) NOT NULL,
                    badges JSONB DEFAULT '[]'::jsonb,
                    display_order INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            """)
            
            await conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_pr_categories_display_order 
                ON pr_package_categories(display_order)
            """)
            
            # 插入預設分類（如果不存在）
            await conn.execute("""
                INSERT INTO pr_package_categories (category_id, title, badges, display_order)
                VALUES 
                    ('global-pr', 'GLOBAL PR', '["🚀 Launches", "💰 Funding", "🤝 Partnerships"]'::jsonb, 1),
                    ('asia-packages', 'ASIA PACKAGES', '["🇨🇳 CN", "🇰🇷 KR", "🇯🇵 JP", "🌏 SEA"]'::jsonb, 2),
                    ('founder-pr', 'FOUNDER PR', '["👤 Founders", "💼 CMOs", "⭐ Key Leaders"]'::jsonb, 3)
                ON CONFLICT (category_id) DO NOTHING
            """)
            
            logger.info("✅ All tables initialized")
            
            # 插入初始資料（如果需要）
            await self._init_seed_data(conn)
    
    async def _init_seed_data(self, conn):
        """插入初始資料（僅在資料表為空時）"""
        import json
        
        # 檢查 pricing_packages 是否有資料
        count = await conn.fetchval("SELECT COUNT(*) FROM pricing_packages")
        
        if count == 0:
            logger.info("📝 Seeding pricing packages...")
            
            # 插入初始的 pricing packages（JSONB 需要 JSON 字串）
            await conn.execute("""
                INSERT INTO pricing_packages (name, slug, description, price, features, is_popular, display_order, status)
                VALUES
                    ($1, $2, $3, $4, $5::jsonb, $6, $7, $8),
                    ($9, $10, $11, $12, $13::jsonb, $14, $15, $16),
                    ($17, $18, $19, $20, $21::jsonb, $22, $23, $24)
            """,
                'Starter', 'starter', 'Perfect for small projects and startups', 999.00,
                json.dumps(["5 Press Releases/Month", "Media Database Access", "Basic Analytics", "Email Support"]),
                False, 1, 'active',
                
                'Professional', 'professional', 'Ideal for growing businesses', 2999.00,
                json.dumps(["15 Press Releases/Month", "Premium Media Database", "Advanced Analytics", "Priority Support", "Social Media Integration"]),
                True, 2, 'active',
                
                'Enterprise', 'enterprise', 'For large organizations', 5999.00,
                json.dumps(["Unlimited Press Releases", "Dedicated Account Manager", "Custom Analytics Dashboard", "24/7 Support", "API Access", "White Label Options"]),
                False, 3, 'active'
            )
            
            logger.info("✅ Pricing packages seeded")


# 全域資料庫實例
db = Database(database_url="")  # 會在 main.py 初始化


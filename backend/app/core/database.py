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
            
            # ==================== Users ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    hashed_password VARCHAR(255),
                    name VARCHAR(100) NOT NULL,
                    avatar_url TEXT,
                    
                    -- Auth Provider (email, google, github)
                    provider VARCHAR(50) DEFAULT 'email',
                    provider_id VARCHAR(255),
                    
                    -- Role (user, publisher, admin, super_admin)
                    role VARCHAR(20) DEFAULT 'user',
                    
                    -- Account Status (active, user_deactivated, admin_suspended, banned)
                    account_status VARCHAR(20) DEFAULT 'active',
                    
                    -- Legacy fields (保留向後兼容)
                    is_active BOOLEAN DEFAULT TRUE,
                    is_verified BOOLEAN DEFAULT FALSE,
                    
                    -- Status Details
                    deactivated_at TIMESTAMP,
                    deactivation_reason TEXT,
                    banned_at TIMESTAMP,
                    banned_reason TEXT,
                    banned_by INTEGER,
                    
                    -- Timestamps
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW(),
                    last_login_at TIMESTAMP
                );
                
                CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
                CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider, provider_id);
                CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
            """)
            
            # ==================== Banned Emails ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS banned_emails (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    reason TEXT,
                    banned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
                    banned_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_banned_emails_email ON banned_emails(email);
            """)
            
            # ==================== System Settings ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS system_settings (
                    id SERIAL PRIMARY KEY,
                    setting_key VARCHAR(100) UNIQUE NOT NULL,
                    setting_value TEXT NOT NULL,
                    setting_type VARCHAR(20) DEFAULT 'string',
                    description TEXT,
                    updated_at TIMESTAMP DEFAULT NOW(),
                    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
                );
                
                CREATE INDEX IF NOT EXISTS idx_settings_key ON system_settings(setting_key);
            """)
            
            # 插入預設設定（包含 CMS 設定）
            await conn.execute("""
                INSERT INTO system_settings (setting_key, setting_value, setting_type, description)
                VALUES 
                    ('auto_delete_deactivated_users', 'false', 'boolean', '是否自動刪除停用超過 N 天的用戶'),
                    ('auto_delete_days', '30', 'integer', '自動刪除的天數（當啟用自動刪除時）'),
                    ('site_logo_light', '', 'url', 'Logo 圖片 URL (淺色版)'),
                    ('site_logo_dark', '', 'url', 'Logo 圖片 URL (深色版)'),
                    ('site_name', 'VortixPR', 'text', '網站名稱'),
                    ('site_slogan', 'Your Crypto&AI News Partner', 'text', '網站 Slogan'),
                    ('contact_email', 'hello@vortixpr.com', 'email', '聯絡信箱'),
                    ('contact_phone', '', 'text', '聯絡電話'),
                    ('social_twitter', '', 'url', 'Twitter 連結'),
                    ('social_linkedin', '', 'url', 'LinkedIn 連結'),
                    ('social_facebook', '', 'url', 'Facebook 連結'),
                    ('social_instagram', '', 'url', 'Instagram 連結'),
                    ('carousel_subtitle', 'Selected crypto, tech, AI and regional outlets we work with.', 'text', '首頁跑馬燈區域副標題')
                ON CONFLICT (setting_key) DO NOTHING
            """)
            
            # 確保 carousel_subtitle 設定存在（針對已有資料庫的情況）
            carousel_setting_exists = await conn.fetchval("""
                SELECT EXISTS(SELECT 1 FROM system_settings WHERE setting_key = 'carousel_subtitle')
            """)
            if not carousel_setting_exists:
                logger.info("📝 Adding carousel_subtitle setting...")
                await conn.execute("""
                    INSERT INTO system_settings (setting_key, setting_value, setting_type, description)
                    VALUES ('carousel_subtitle', 'Selected crypto, tech, AI and regional outlets we work with.', 'text', '首頁跑馬燈區域副標題')
                """)
                logger.info("✅ Carousel subtitle setting added")
            
            # ==================== FAQs ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS faqs (
                    id SERIAL PRIMARY KEY,
                    question TEXT NOT NULL,
                    answer TEXT NOT NULL,
                    display_order INTEGER DEFAULT 0,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_faqs_active_order ON faqs(is_active, display_order);
            """)
            
            # ==================== Testimonials ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS testimonials (
                    id SERIAL PRIMARY KEY,
                    quote TEXT NOT NULL,
                    author_name VARCHAR(100) NOT NULL,
                    author_title VARCHAR(200),
                    author_company VARCHAR(200),
                    author_avatar_url TEXT,
                    display_order INTEGER DEFAULT 0,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_testimonials_active_order ON testimonials(is_active, display_order);
            """)
            
            # ==================== Team Members ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS team_members (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    position VARCHAR(200) NOT NULL,
                    avatar_url TEXT,
                    bio TEXT,
                    linkedin_url TEXT,
                    twitter_url TEXT,
                    display_order INTEGER DEFAULT 0,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_team_members_active_order ON team_members(is_active, display_order);
            """)
            
            # ==================== Services ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS services (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(200) NOT NULL,
                    description TEXT NOT NULL,
                    icon VARCHAR(50),
                    display_order INTEGER DEFAULT 0,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_services_active_order ON services(is_active, display_order);
            """)
            
            # ==================== Differentiators ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS differentiators (
                    id SERIAL PRIMARY KEY,
                    text TEXT NOT NULL,
                    display_order INTEGER DEFAULT 0,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_differentiators_active_order ON differentiators(is_active, display_order);
            """)
            
            # ==================== Stats ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS stats (
                    id SERIAL PRIMARY KEY,
                    label VARCHAR(100) NOT NULL,
                    value INTEGER NOT NULL,
                    suffix VARCHAR(10) DEFAULT '+',
                    description TEXT,
                    display_order INTEGER DEFAULT 0,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_stats_active_order ON stats(is_active, display_order);
            """)
            
            # ==================== Client Logos ====================
            # 顯示在首頁 "Trusted by industry leaders" 區塊
            # ⚠️ 遷移處理：如果舊的 partner_logos 表存在，先重命名
            partner_table_exists = await conn.fetchval("""
                SELECT EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name='partner_logos'
                )
            """)
            
            if partner_table_exists:
                logger.info("🔄 Migrating: Renaming partner_logos → client_logos...")
                await conn.execute("ALTER TABLE partner_logos RENAME TO client_logos")
                
                # 重命名索引（如果存在）
                index_exists = await conn.fetchval("""
                    SELECT EXISTS (
                        SELECT 1 FROM pg_indexes 
                        WHERE indexname = 'idx_partner_logos_active_order'
                    )
                """)
                if index_exists:
                    await conn.execute("ALTER INDEX idx_partner_logos_active_order RENAME TO idx_client_logos_active_order")
                
                logger.info("✅ Table renamed successfully")
            
            # 現在創建表（如果還不存在）
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS client_logos (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(200) NOT NULL,
                    logo_url TEXT NOT NULL,
                    website_url TEXT,
                    display_order INTEGER DEFAULT 0,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_client_logos_active_order ON client_logos(is_active, display_order);
            """)
            
            # ==================== Publisher Features ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS publisher_features (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(200) NOT NULL,
                    description TEXT NOT NULL,
                    display_order INTEGER DEFAULT 0,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_publisher_features_active_order ON publisher_features(is_active, display_order);
            """)
            
            # ==================== Carousel Logos ====================
            # 顯示在首頁跑馬燈區塊
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS carousel_logos (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(200) NOT NULL,
                    logo_url TEXT NOT NULL,
                    alt_text VARCHAR(200),
                    website_url TEXT,
                    display_order INTEGER DEFAULT 0,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_carousel_logos_display_order ON carousel_logos(display_order);
                CREATE INDEX IF NOT EXISTS idx_carousel_logos_is_active ON carousel_logos(is_active);
                CREATE INDEX IF NOT EXISTS idx_carousel_logos_active_order ON carousel_logos(is_active, display_order);
            """)
            
            # 插入初始 Logo 數據（僅在表為空時）
            carousel_count = await conn.fetchval("SELECT COUNT(*) FROM carousel_logos")
            if carousel_count == 0:
                logger.info("📝 Inserting initial carousel logos...")
                await conn.execute("""
                    INSERT INTO carousel_logos (name, logo_url, alt_text, display_order, is_active) VALUES
                    ('BlockTempo', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/blocktempo%20logo_white_%E6%A9%AB.png', 'BlockTempo Logo', 1, true),
                    ('Media Partner 2', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/Logo.png', 'Media Logo', 2, true),
                    ('Media Partner 3', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(57).png', 'Media Logo', 3, true),
                    ('Media Partner 4', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(58).png', 'Media Logo', 4, true),
                    ('Media Partner 5', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(59).png', 'Media Logo', 5, true),
                    ('Business Insider', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/business-insider.png', 'Business Insider Logo', 6, true),
                    ('Media Partner 7', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(60).png', 'Media Logo', 7, true),
                    ('Media Partner 8', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(61).png', 'Media Logo', 8, true),
                    ('Media Partner 9', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/output-onlinepngtools%20(9).png', 'Media Logo', 9, true)
                """)
                logger.info("✅ Initial carousel logos inserted")
            
            # ==================== Hero Sections ====================
            # ⚠️ 只定義原始的穩定欄位（遵循 DATABASE_ARCHITECTURE.md 原則）
            # 新增欄位應該在 _add_new_columns() 中處理
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS hero_sections (
                    id SERIAL PRIMARY KEY,
                    page VARCHAR(50) NOT NULL,
                    
                    -- 基本 CTA 按鈕（原始欄位）
                    cta_primary_text VARCHAR(100),
                    cta_primary_url VARCHAR(500),
                    cta_secondary_text VARCHAR(100),
                    cta_secondary_url VARCHAR(500),
                    
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW(),
                    UNIQUE(page)
                );
            """)
            
            # ==================== Hero Media Logos ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS hero_media_logos (
                    id SERIAL PRIMARY KEY,
                    hero_page VARCHAR(50) NOT NULL,
                    
                    -- Logo 資訊
                    name VARCHAR(200) NOT NULL,
                    logo_url TEXT NOT NULL,
                    website_url TEXT,
                    
                    -- 視覺屬性
                    opacity DECIMAL(3,2) DEFAULT 0.5,
                    size VARCHAR(20) DEFAULT 'md',
                    
                    -- 位置（自定義 CSS 值）
                    position_top VARCHAR(20),
                    position_left VARCHAR(20),
                    position_right VARCHAR(20),
                    position_bottom VARCHAR(20),
                    
                    -- 動畫
                    animation_speed INTEGER DEFAULT 5,
                    
                    display_order INTEGER DEFAULT 0,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_hero_media_page ON hero_media_logos(hero_page);
                CREATE INDEX IF NOT EXISTS idx_hero_media_active_order ON hero_media_logos(is_active, display_order);
            """)
            
            # ==================== Lyro Section ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS lyro_section (
                    id SERIAL PRIMARY KEY,
                    
                    -- 內容
                    label VARCHAR(100),
                    title TEXT NOT NULL,
                    subtitle TEXT,
                    description TEXT,
                    
                    -- 圖片
                    background_image_url TEXT,
                    
                    -- 狀態
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
            """)
            
            # ==================== Lyro Features ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS lyro_features (
                    id SERIAL PRIMARY KEY,
                    text TEXT NOT NULL,
                    display_order INTEGER DEFAULT 0,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_lyro_features_active_order ON lyro_features(is_active, display_order);
            """)
            
            # ==================== User Invitations ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS user_invitations (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) NOT NULL,
                    role VARCHAR(20) NOT NULL,
                    
                    -- 邀請 Token
                    token VARCHAR(255) UNIQUE NOT NULL,
                    
                    -- 邀請者（ON DELETE SET NULL - 刪除邀請者時不影響邀請記錄）
                    invited_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
                    
                    -- 狀態 (pending, accepted, expired, cancelled)
                    status VARCHAR(20) DEFAULT 'pending',
                    
                    -- 過期時間（7 天）
                    expires_at TIMESTAMP NOT NULL,
                    
                    -- Timestamps
                    created_at TIMESTAMP DEFAULT NOW(),
                    accepted_at TIMESTAMP,
                    accepted_by INTEGER REFERENCES users(id) ON DELETE SET NULL
                );
                
                CREATE INDEX IF NOT EXISTS idx_invitations_email ON user_invitations(email);
                CREATE INDEX IF NOT EXISTS idx_invitations_token ON user_invitations(token);
                CREATE INDEX IF NOT EXISTS idx_invitations_status ON user_invitations(status);
            """)
            
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
            
            # ==================== Navigation Items ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS navigation_items (
                    id SERIAL PRIMARY KEY,
                    
                    -- Multi-language labels
                    label_en VARCHAR(100) NOT NULL,
                    label_zh VARCHAR(100),
                    label_ja VARCHAR(100),
                    
                    -- URL for desktop and mobile (flexible: can be #section or /page)
                    desktop_url VARCHAR(255) NOT NULL,
                    mobile_url VARCHAR(255),
                    target VARCHAR(20) DEFAULT '_self',
                    
                    -- Hierarchy support
                    parent_id INTEGER REFERENCES navigation_items(id) ON DELETE CASCADE,
                    
                    -- Display
                    display_order INTEGER DEFAULT 0,
                    is_active BOOLEAN DEFAULT true,
                    
                    -- Timestamps
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_nav_items_active_order ON navigation_items(is_active, display_order);
                CREATE INDEX IF NOT EXISTS idx_nav_items_parent ON navigation_items(parent_id);
            """)
            
            # Navigation CTA Button
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS navigation_cta (
                    id SERIAL PRIMARY KEY,
                    
                    -- Multi-language text
                    text_en VARCHAR(100) NOT NULL,
                    text_zh VARCHAR(100),
                    text_ja VARCHAR(100),
                    
                    -- URL
                    url VARCHAR(255) NOT NULL,
                    
                    -- Status
                    is_active BOOLEAN DEFAULT true,
                    
                    -- Timestamps
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
            """)
            
            # ==================== Footer Sections ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS footer_sections (
                    id SERIAL PRIMARY KEY,
                    
                    -- Multi-language titles
                    title_en VARCHAR(100) NOT NULL,
                    title_zh VARCHAR(100),
                    title_ja VARCHAR(100),
                    
                    -- Section identifier
                    section_key VARCHAR(50) NOT NULL UNIQUE,
                    
                    -- Display
                    display_order INTEGER DEFAULT 0,
                    is_active BOOLEAN DEFAULT true,
                    
                    -- Timestamps
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_footer_sections_active_order ON footer_sections(is_active, display_order);
            """)
            
            # Footer Links
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS footer_links (
                    id SERIAL PRIMARY KEY,
                    
                    -- Parent section
                    section_id INTEGER REFERENCES footer_sections(id) ON DELETE CASCADE,
                    
                    -- Multi-language labels
                    label_en VARCHAR(100) NOT NULL,
                    label_zh VARCHAR(100),
                    label_ja VARCHAR(100),
                    
                    -- URL and behavior
                    url VARCHAR(255) NOT NULL,
                    target VARCHAR(20) DEFAULT '_self',
                    
                    -- Display
                    display_order INTEGER DEFAULT 0,
                    is_active BOOLEAN DEFAULT true,
                    
                    -- Timestamps
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_footer_links_section ON footer_links(section_id);
                CREATE INDEX IF NOT EXISTS idx_footer_links_active_order ON footer_links(is_active, display_order);
            """)
            
            # Footer Text Settings
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS footer_text_settings (
                    id SERIAL PRIMARY KEY,
                    
                    -- Setting identifier
                    setting_key VARCHAR(50) NOT NULL UNIQUE,
                    
                    -- Multi-language values
                    value_en TEXT,
                    value_zh TEXT,
                    value_ja TEXT,
                    
                    -- Timestamps
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
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
            
            # ==================== PR Templates ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS pr_templates (
                    id SERIAL PRIMARY KEY,
                    
                    -- 基本資訊
                    title VARCHAR(200) NOT NULL,
                    description TEXT NOT NULL,
                    category VARCHAR(50) NOT NULL,
                    category_color VARCHAR(20) DEFAULT '#FF7400',
                    icon VARCHAR(50) DEFAULT 'FileText',
                    
                    -- 內容（Markdown 格式）
                    content TEXT NOT NULL,
                    
                    -- 分類與標籤（JSONB for flexibility）
                    industry_tags JSONB DEFAULT '[]'::jsonb,
                    use_cases JSONB DEFAULT '[]'::jsonb,
                    includes JSONB DEFAULT '[]'::jsonb,
                    
                    -- 統計數據
                    download_count INTEGER DEFAULT 0,
                    email_request_count INTEGER DEFAULT 0,
                    preview_count INTEGER DEFAULT 0,
                    waitlist_count INTEGER DEFAULT 0,
                    
                    -- 狀態與排序
                    is_active BOOLEAN DEFAULT TRUE,
                    display_order INTEGER DEFAULT 0,
                    
                    -- 時間戳
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            """)
            
            await conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_pr_templates_category ON pr_templates(category);
                CREATE INDEX IF NOT EXISTS idx_pr_templates_active ON pr_templates(is_active);
                CREATE INDEX IF NOT EXISTS idx_pr_templates_order ON pr_templates(display_order);
            """)
            
            # ==================== Template Waitlist ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS template_waitlist (
                    id SERIAL PRIMARY KEY,
                    template_id INTEGER REFERENCES pr_templates(id) ON DELETE CASCADE,
                    
                    -- 用戶資訊
                    email VARCHAR(255) NOT NULL,
                    name VARCHAR(200),
                    
                    -- 偏好設定
                    subscribe_newsletter BOOLEAN DEFAULT TRUE,
                    
                    -- 來源追蹤
                    source_template_title VARCHAR(200),
                    ip_address VARCHAR(50),
                    user_agent TEXT,
                    
                    -- 狀態
                    status VARCHAR(20) DEFAULT 'pending',
                    invited_at TIMESTAMP,
                    activated_at TIMESTAMP,
                    
                    -- 時間戳
                    created_at TIMESTAMP DEFAULT NOW()
                )
            """)
            
            await conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_waitlist_email ON template_waitlist(email);
                CREATE INDEX IF NOT EXISTS idx_waitlist_template ON template_waitlist(template_id);
                CREATE INDEX IF NOT EXISTS idx_waitlist_status ON template_waitlist(status);
                CREATE INDEX IF NOT EXISTS idx_waitlist_created ON template_waitlist(created_at DESC);
            """)
            
            # ==================== Template Email Requests ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS template_email_requests (
                    id SERIAL PRIMARY KEY,
                    template_id INTEGER REFERENCES pr_templates(id) ON DELETE CASCADE,
                    
                    -- 用戶資訊
                    email VARCHAR(255) NOT NULL,
                    
                    -- 發送狀態
                    status VARCHAR(20) DEFAULT 'pending',
                    sent_at TIMESTAMP,
                    opened_at TIMESTAMP,
                    clicked_at TIMESTAMP,
                    
                    -- 追蹤（用於開信率統計）
                    tracking_id VARCHAR(100) UNIQUE,
                    
                    -- 來源追蹤
                    ip_address VARCHAR(50),
                    user_agent TEXT,
                    
                    -- 時間戳
                    created_at TIMESTAMP DEFAULT NOW()
                )
            """)
            
            await conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_email_requests_email ON template_email_requests(email);
                CREATE INDEX IF NOT EXISTS idx_email_requests_template ON template_email_requests(template_id);
                CREATE INDEX IF NOT EXISTS idx_email_requests_status ON template_email_requests(status);
                CREATE INDEX IF NOT EXISTS idx_email_requests_tracking ON template_email_requests(tracking_id);
            """)
            
            logger.info("✅ All tables initialized")
            
            # 安全地添加新欄位（向後兼容）
            await self._add_new_columns(conn)
            
            # 插入初始資料（如果需要）
            await self._init_seed_data(conn)
            
            # 提升 Super Admin（每次啟動時檢查）
            await self._promote_super_admin(conn)
    
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
        
        # === Seed FAQs ===
        faq_count = await conn.fetchval("SELECT COUNT(*) FROM faqs")
        if faq_count == 0:
            logger.info("📝 Seeding FAQs...")
            await conn.execute("""
                INSERT INTO faqs (question, answer, display_order, is_active)
                VALUES
                    ('How fast can you distribute a PR?', 'Most releases are scheduled within 24–48 hours after final approval.\n\nRush options may be available depending on the package.', 1, true),
                    ('What media outlets are included?', 'We work with a mix of crypto, AI, tech and Asia-regional publications, including news sites, niche media and aggregators.\n\nOutlet access varies by package and market targeting.', 2, true),
                    ('Do you guarantee placements?', 'Certain packages include guaranteed publication based on predefined outlet categories.\n\nEditorial features, interviews or headlines are not guaranteed and depend on publisher discretion.', 3, true),
                    ('How many revisions are included?', 'Packages include one round of revisions before distribution.\n\nAdditional edits or rewrites are available as add-ons.', 4, true),
                    ('What''s the Asia localization process?', 'Localization includes regional messaging alignment, optional language adaptation, and distribution to relevant Asia media lists depending on your tier.', 5, true),
                    ('Do you help with strategy?', 'Strategy support is available as an add-on.\n\nSome packages include light headline or angle refinement prior to distribution.', 6, true)
            """)
            logger.info("✅ FAQs seeded")
        
        # === Seed Testimonials ===
        testimonial_count = await conn.fetchval("SELECT COUNT(*) FROM testimonials")
        if testimonial_count == 0:
            logger.info("📝 Seeding testimonials...")
            await conn.execute("""
                INSERT INTO testimonials (quote, author_name, author_title, author_company, display_order, is_active)
                VALUES
                    ('Professional, results-driven, and incredibly well-connected. VortixPR delivered beyond our expectations for our token launch.', 'Michael Kim', 'Head of Marketing', 'BlockchainVentures', 1, true),
                    ('Their strategic approach to AI PR positioning helped us stand out in a crowded market. The media coverage exceeded all expectations.', 'Emily Watson', 'CEO', 'FinTech Innovations', 2, true),
                    ('VortixPR''s deep understanding of the crypto space and regulatory landscape made our exchange launch seamless and successful.', 'David Park', 'Marketing Director', 'CryptoExchange Pro', 3, true),
                    ('The team''s expertise in DeFi marketing helped us reach the right investors at the perfect time. Truly exceptional service and results.', 'Sarah Chen', 'Co-founder', 'DeFi Protocol Labs', 4, true),
                    ('From concept to launch, VortixPR guided our NFT project with precision and creativity. The community response was incredible.', 'Alex Rodriguez', 'Creative Director', 'MetaArt Studios', 5, true),
                    ('Outstanding work on our Web3 gaming platform launch. Their understanding of both gaming and crypto audiences is unmatched.', 'Jordan Taylor', 'CEO', 'GameChain Interactive', 6, true)
            """)
            logger.info("✅ Testimonials seeded")
        
        # === Seed Services ===
        service_count = await conn.fetchval("SELECT COUNT(*) FROM services")
        if service_count == 0:
            logger.info("📝 Seeding services...")
            await conn.execute("""
                INSERT INTO services (title, description, icon, display_order, is_active)
                VALUES
                    ('Global Press Distribution', 'Targeted distribution across top crypto, tech and AI media.', 'globe', 1, true),
                    ('Asia-Market Localization & Outreach', 'CN, KR, JP & SEA outreach with language + narrative adaptation.', 'language', 2, true),
                    ('PR & Narrative Strategy', 'Angle shaping, headline advice, and editorial review.', 'strategy', 3, true),
                    ('Founder & Personal Branding PR', 'Articles, interviews and content for founder authority.', 'user', 4, true),
                    ('Influencer Marketing & Community Activation', 'Leverage key opinion leaders and build engaged communities around your project.', 'users', 5, true)
            """)
            logger.info("✅ Services seeded")
        
        # === Seed Differentiators ===
        diff_count = await conn.fetchval("SELECT COUNT(*) FROM differentiators")
        if diff_count == 0:
            logger.info("📝 Seeding differentiators...")
            await conn.execute("""
                INSERT INTO differentiators (text, display_order, is_active)
                VALUES
                    ('Distribution + strategy under one roof', 1, true),
                    ('Asia-native editorial network', 2, true),
                    ('AI-backed narrative & LLM optimization', 3, true),
                    ('Transparent pricing, no hidden fees', 4, true),
                    ('Founder-friendly packages + add-ons', 5, true)
            """)
            logger.info("✅ Differentiators seeded")
        
        # === Seed Stats ===
        stats_count = await conn.fetchval("SELECT COUNT(*) FROM stats")
        if stats_count == 0:
            logger.info("📝 Seeding stats...")
            await conn.execute("""
                INSERT INTO stats (label, value, suffix, description, display_order, is_active)
                VALUES
                    ('Publications', 900, '+', 'Media outlets in our global network', 1, true),
                    ('Brands', 300, '+', 'Clients successfully served', 2, true),
                    ('Countries', 20, '+', 'Global reach across continents', 3, true),
                    ('Media Reach', 1003, 'M+', 'Total audience impressions delivered', 4, true)
            """)
            logger.info("✅ Stats seeded")
        
        # === Seed Publisher Features ===
        pub_count = await conn.fetchval("SELECT COUNT(*) FROM publisher_features")
        if pub_count == 0:
            logger.info("📝 Seeding publisher features...")
            await conn.execute("""
                INSERT INTO publisher_features (title, description, display_order, is_active)
                VALUES
                    ('Premium Media Access', 'Connect with 500+ verified crypto & AI outlets instantly', 1, true),
                    ('Revenue Share Model', 'Earn up to 40% commission on successful placements', 2, true),
                    ('Publisher Dashboard', 'Track performance, earnings, and content in real-time', 3, true),
                    ('Priority Support', 'Dedicated support team for all your publishing needs', 4, true)
            """)
            logger.info("✅ Publisher features seeded")
        
        # === Seed Hero Sections ===
        hero_count = await conn.fetchval("SELECT COUNT(*) FROM hero_sections")
        if hero_count == 0:
            logger.info("📝 Seeding hero sections...")
            await conn.execute("""
                INSERT INTO hero_sections (page, title_prefix, title_highlights, subtitle, cta_primary_text, cta_primary_url, cta_secondary_text, cta_secondary_url, center_logo_url, is_active)
                VALUES
                    ('home', 
                     'Strategic PR & Global Press Distribution for', 
                     ARRAY['Web3 & AI']::text[],
                     'Fast, reliable coverage — global & Asia — with optional narrative support and founder visibility.', 
                     'View Packages', 
                     '/packages', 
                     'Submit Press Release', 
                     '/contact',
                     'https://img.vortixpr.com/VortixPR_Website/Vortix%20Logo%20mark.png',
                     true)
            """)
            logger.info("✅ Hero sections seeded")
        
        # === Seed Hero Media Logos（首頁的 8 個 logo）===
        hero_logo_count = await conn.fetchval("SELECT COUNT(*) FROM hero_media_logos")
        if hero_logo_count == 0:
            logger.info("📝 Seeding hero media logos...")
            await conn.execute("""
                INSERT INTO hero_media_logos (hero_page, name, logo_url, opacity, size, position_top, position_right, display_order, is_active)
                VALUES
                    ('home', 'BlockTempo', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/blocktempo%20logo_white_%E6%A9%AB.png', 0.6, 'lg', '8%', '22%', 1, true),
                    ('home', 'The Block', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(57).png', 0.45, 'md', '20%', null, 2, true),
                    ('home', 'Investing.com', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/Logo.png', 0.4, 'sm', '30%', '2%', 3, true),
                    ('home', 'CoinTelegraph', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(58).png', 0.55, 'lg', '52%', '-7%', 4, true),
                    ('home', 'CoinDesk', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(59).png', 0.5, 'md', '62%', null, 5, true),
                    ('home', 'Business Insider', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/business-insider.png', 0.42, 'sm', '84%', null, 6, true),
                    ('home', 'Decrypt', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(60).png', 0.4, 'sm', '80%', '12%', 7, true),
                    ('home', 'Bitcoin Magazine', 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(61).png', 0.45, 'md', '68%', '28%', 8, true)
            """)
            
            # 設置 left 位置（需要另外 UPDATE，因為有些是 left 有些是 right）
            await conn.execute("""
                UPDATE hero_media_logos SET position_left = '-8%' WHERE name = 'The Block';
                UPDATE hero_media_logos SET position_left = '-5%' WHERE name = 'CoinDesk';
                UPDATE hero_media_logos SET position_left = '20%' WHERE name = 'Business Insider';
                UPDATE hero_media_logos SET position_left = '13%' WHERE name = 'Bitcoin.com';
            """)
            
            logger.info("✅ Hero media logos seeded")
        
        # === Seed Lyro Section ===
        lyro_count = await conn.fetchval("SELECT COUNT(*) FROM lyro_section")
        if lyro_count == 0:
            logger.info("📝 Seeding lyro section...")
            await conn.execute("""
                INSERT INTO lyro_section (label, title, subtitle, description, background_image_url, is_active)
                VALUES
                    ('#lyro_engine', 
                     'Lyro — AI Narrative Engine', 
                     '(Coming Soon)',
                     'Lyro is our internal AI tool that analyzes your announcement before distribution. It checks for clarity, angle suitability, and how well LLMs can surface your story in search, news, and AI feeds.',
                     'https://img.vortixpr.com/VortixPR_Website/Left_Point_Cat-2.png',
                     true)
            """)
            logger.info("✅ Lyro section seeded")
        
        # === Seed Lyro Features ===
        lyro_feat_count = await conn.fetchval("SELECT COUNT(*) FROM lyro_features")
        if lyro_feat_count == 0:
            logger.info("📝 Seeding lyro features...")
            await conn.execute("""
                INSERT INTO lyro_features (text, display_order, is_active)
                VALUES
                    ('Narrative optimization', 1, true),
                    ('Media angle suggestions', 2, true),
                    ('LLM visibility forecasting', 3, true),
                    ('Asia geo-angle adjustments', 4, true)
            """)
            logger.info("✅ Lyro features seeded")
        
        # === Seed Navigation Items ===
        # 使用原有的 navigationData.ts 資料
        # desktop_url: 桌面版（#section 或 /page）
        # mobile_url: 手機版（通常是 /page）
        nav_count = await conn.fetchval("SELECT COUNT(*) FROM navigation_items")
        if nav_count == 0:
            logger.info("📝 Seeding navigation items...")
            await conn.execute("""
                INSERT INTO navigation_items (label_en, desktop_url, mobile_url, target, display_order, is_active)
                VALUES
                    ('About', '#about-section', '/about', '_self', 1, true),
                    ('Services', '#services-section', '/services', '_self', 2, true),
                    ('Packages', '#packages-section', '/pricing', '_self', 3, true),
                    ('Publisher', '#publisher-section', '/publisher', '_self', 4, true),
                    ('Contact', '#contact-section', '/contact', '_self', 5, true),
                    ('Lyro', '#lyro-section', '/lyro', '_self', 6, true)
            """)
            logger.info("✅ Navigation items seeded")
        elif nav_count > 6:
            # 清理重複資料（如果有的話）
            logger.info("🧹 Cleaning duplicate navigation items...")
            await conn.execute("""
                DELETE FROM navigation_items
                WHERE id NOT IN (
                    SELECT MIN(id)
                    FROM navigation_items
                    GROUP BY label_en, desktop_url
                )
            """)
            logger.info("✅ Duplicates cleaned")
        
        # === Seed Navigation CTA ===
        nav_cta_count = await conn.fetchval("SELECT COUNT(*) FROM navigation_cta")
        if nav_cta_count == 0:
            logger.info("📝 Seeding navigation CTA...")
            await conn.execute("""
                INSERT INTO navigation_cta (text_en, url, is_active)
                VALUES ('Get Started', '/contact', true)
            """)
            logger.info("✅ Navigation CTA seeded")
        
        # === Seed Footer Sections ===
        # 使用原有的 footerData.ts 資料
        footer_section_count = await conn.fetchval("SELECT COUNT(*) FROM footer_sections")
        if footer_section_count == 0:
            logger.info("📝 Seeding footer sections...")
            await conn.execute("""
                INSERT INTO footer_sections (section_key, title_en, display_order, is_active)
                VALUES
                    ('map', 'Map', 1, true),
                    ('resources', 'Resources', 2, true),
                    ('policies', 'Policies', 3, true)
            """)
            logger.info("✅ Footer sections seeded")
        
        # === Seed Footer Links ===
        # 使用原有的 footerData.ts 資料
        footer_link_count = await conn.fetchval("SELECT COUNT(*) FROM footer_links")
        if footer_link_count == 0:
            logger.info("📝 Seeding footer links...")
            # 取得 section IDs
            map_id = await conn.fetchval("SELECT id FROM footer_sections WHERE section_key = 'map'")
            resources_id = await conn.fetchval("SELECT id FROM footer_sections WHERE section_key = 'resources'")
            policies_id = await conn.fetchval("SELECT id FROM footer_sections WHERE section_key = 'policies'")
            
            await conn.execute("""
                INSERT INTO footer_links (section_id, label_en, url, target, display_order, is_active)
                VALUES
                    ($1, 'Home', '/', '_self', 1, true),
                    ($1, 'Services', '/services', '_self', 2, true),
                    ($1, 'Packages', '/pricing', '_self', 3, true),
                    ($1, 'Our Client', '/clients', '_self', 4, true),
                    ($1, 'Publisher', '/publisher', '_self', 5, true),
                    ($1, 'About', '/about', '_self', 6, true),
                    ($1, 'Contact', '/contact', '_self', 7, true),
                    ($2, 'Blog', '/blog', '_self', 1, true),
                    ($2, 'Template', '/template', '_self', 2, true),
                    ($2, 'Concept', '/concept', '_self', 3, true),
                    ($3, 'Editorial Policy', '#', '_self', 1, true),
                    ($3, 'Privacy Policy', '#', '_self', 2, true),
                    ($3, 'Terms of Service', '#', '_self', 3, true),
                    ($3, 'Credit Card Policy', '#', '_self', 4, true),
                    ($3, 'Cookies Settings', '#', '_self', 5, true)
            """, map_id, resources_id, policies_id)
            logger.info("✅ Footer links seeded")
        
        # === Seed Footer Text Settings ===
        footer_text_count = await conn.fetchval("SELECT COUNT(*) FROM footer_text_settings")
        if footer_text_count == 0:
            logger.info("📝 Seeding footer text settings...")
            await conn.execute("""
                INSERT INTO footer_text_settings (setting_key, value_en)
                VALUES
                    ('tagline', 'Your PR Partner for Web3 & AI'),
                    ('description', 'VortixPR helps blockchain and AI companies amplify their message through strategic media distribution and PR services.'),
                    ('copyright', '© 2025 VortixPR. All rights reserved.'),
                    ('newsletter_title', 'Stay Updated'),
                    ('newsletter_description', 'Get the latest news and insights from the world of Web3 and AI.')
            """)
            logger.info("✅ Footer text settings seeded")
    
    async def _add_new_columns(self, conn):
        """
        安全地添加新欄位到現有表（符合 DATABASE_ARCHITECTURE.md 原則）
        
        原則：
        1. ✅ 檢查欄位是否存在
        2. ✅ 只在不存在時添加
        3. ✅ 生產環境安全
        4. ✅ 冪等性保證
        """
        
        # === Migration 1: Users table - account_status ===
        account_status_exists = await conn.fetchval("""
            SELECT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name='users' AND column_name='account_status'
            )
        """)
        
        if not account_status_exists:
            logger.info("🔄 Adding account_status column to users table...")
            await conn.execute("""
                ALTER TABLE users ADD COLUMN account_status VARCHAR(20) DEFAULT 'active';
                ALTER TABLE users ADD COLUMN deactivated_at TIMESTAMP;
                ALTER TABLE users ADD COLUMN deactivation_reason TEXT;
                ALTER TABLE users ADD COLUMN banned_at TIMESTAMP;
                ALTER TABLE users ADD COLUMN banned_reason TEXT;
                ALTER TABLE users ADD COLUMN banned_by INTEGER;
            """)
            
            # 為現有用戶設定預設狀態
            await conn.execute("""
                UPDATE users 
                SET account_status = CASE 
                    WHEN is_active = TRUE THEN 'active'
                    ELSE 'admin_suspended'
                END
                WHERE account_status IS NULL
            """)
            
            # 添加索引（在確保欄位存在後）
            await conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status)
            """)
            
            logger.info("✅ account_status columns and index added")
        
        # === Migration 2: Hero Sections table ===
        
        # Step 1: 處理舊的 title 欄位（如果存在）- 獨立執行
        old_title_exists = await conn.fetchval("""
            SELECT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name='hero_sections' AND column_name='title'
            )
        """)
        
        if old_title_exists:
            # 檢查是否有 NOT NULL 約束
            title_is_not_null = await conn.fetchval("""
                SELECT is_nullable = 'NO'
                FROM information_schema.columns 
                WHERE table_name='hero_sections' AND column_name='title'
            """)
            
            if title_is_not_null:
                logger.info("🔄 Removing NOT NULL constraint from old title column...")
                await conn.execute("""
                    ALTER TABLE hero_sections ALTER COLUMN title DROP NOT NULL;
                """)
                logger.info("✅ Old title column constraint removed")
        
        # Step 2: 添加新欄位
        title_prefix_exists = await conn.fetchval("""
            SELECT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name='hero_sections' AND column_name='title_prefix'
            )
        """)
        
        if not title_prefix_exists:
            logger.info("🔄 Adding new title fields to hero_sections table...")
            await conn.execute("""
                ALTER TABLE hero_sections 
                ADD COLUMN IF NOT EXISTS title_prefix TEXT,
                ADD COLUMN IF NOT EXISTS title_highlights TEXT[],
                ADD COLUMN IF NOT EXISTS title_suffix TEXT,
                ADD COLUMN IF NOT EXISTS subtitle TEXT,
                ADD COLUMN IF NOT EXISTS description TEXT,
                ADD COLUMN IF NOT EXISTS center_logo_url TEXT,
                ADD COLUMN IF NOT EXISTS cta_primary_url_mobile VARCHAR(500),
                ADD COLUMN IF NOT EXISTS cta_secondary_url_mobile VARCHAR(500),
                ADD COLUMN IF NOT EXISTS background_image_url TEXT,
                ADD COLUMN IF NOT EXISTS background_video_url TEXT;
            """)
            logger.info("✅ Hero sections new fields added")
        
        # 檢查並添加/轉換 navigation_items 的 URL 欄位
        # 舊設計：url + section_id
        # 新設計：desktop_url + mobile_url（更靈活）
        desktop_url_exists = await conn.fetchval("""
            SELECT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name='navigation_items' AND column_name='desktop_url'
            )
        """)
        
        if not desktop_url_exists:
            logger.info("🔄 Converting navigation_items to desktop_url/mobile_url structure...")
            
            # 如果有舊的 url 欄位，先遷移資料
            old_url_exists = await conn.fetchval("""
                SELECT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='navigation_items' AND column_name='url'
                )
            """)
            
            if old_url_exists:
                # 添加新欄位
                await conn.execute("""
                    ALTER TABLE navigation_items 
                    ADD COLUMN IF NOT EXISTS desktop_url VARCHAR(255),
                    ADD COLUMN IF NOT EXISTS mobile_url VARCHAR(255);
                """)
                
                # 遷移資料：如果有 section_id，desktop 用 #section，否則用 url
                section_id_exists = await conn.fetchval("""
                    SELECT EXISTS (
                        SELECT 1 FROM information_schema.columns 
                        WHERE table_name='navigation_items' AND column_name='section_id'
                    )
                """)
                
                if section_id_exists:
                    await conn.execute("""
                        UPDATE navigation_items 
                        SET desktop_url = CASE 
                            WHEN section_id IS NOT NULL AND section_id != '' 
                            THEN '#' || section_id 
                            ELSE url 
                        END,
                        mobile_url = url
                        WHERE desktop_url IS NULL;
                    """)
                else:
                    await conn.execute("""
                        UPDATE navigation_items 
                        SET desktop_url = url,
                        mobile_url = url
                        WHERE desktop_url IS NULL;
                    """)
                
                # 刪除舊欄位
                await conn.execute("""
                    ALTER TABLE navigation_items 
                    DROP COLUMN IF EXISTS url,
                    DROP COLUMN IF EXISTS section_id;
                """)
                
                logger.info("✅ Navigation items converted to desktop_url/mobile_url structure")
            else:
                # 沒有舊欄位，只添加新欄位
                await conn.execute("""
                    ALTER TABLE navigation_items 
                    ADD COLUMN IF NOT EXISTS desktop_url VARCHAR(255),
                    ADD COLUMN IF NOT EXISTS mobile_url VARCHAR(255);
                """)
                logger.info("✅ Navigation items desktop_url/mobile_url fields added")
    
    async def _promote_super_admin(self, conn):
        """
        提升或創建 Super Admin（安全、冪等）
        
        原則：
        1. ✅ 只有當 SUPER_ADMIN_EMAIL 有設定時才執行
        2. ✅ 如果用戶不存在 → 自動創建（使用預設密碼或 OAuth）
        3. ✅ 如果用戶存在但非 super_admin → 強制提升
        4. ✅ 冪等性 - 多次執行結果相同
        5. ✅ 生產環境安全 - 不會破壞任何資料
        """
        from ..config import settings
        from ..utils.security import hash_password
        import secrets
        
        # 如果沒有設定 SUPER_ADMIN_EMAIL，跳過
        if not settings.SUPER_ADMIN_EMAIL or settings.SUPER_ADMIN_EMAIL.strip() == "":
            return
        
        super_admin_email = settings.SUPER_ADMIN_EMAIL.strip().lower()
        
        # 檢查用戶是否存在
        user = await conn.fetchrow("""
            SELECT id, email, role, account_status FROM users 
            WHERE LOWER(email) = $1
        """, super_admin_email)
        
        if user:
            # 用戶存在
            # 如果已經是 super_admin 且帳號正常，跳過
            if user["role"] == "super_admin" and user["account_status"] == "active":
                logger.info(f"✅ Super Admin already set: {user['email']}")
                return
            
            # 強制提升為 super_admin 並啟用帳號（即使被停用或封禁）
            await conn.execute("""
                UPDATE users 
                SET role = 'super_admin',
                    account_status = 'active',
                    is_active = TRUE,
                    banned_at = NULL,
                    banned_reason = NULL,
                    updated_at = NOW()
                WHERE id = $1
            """, user["id"])
            
            # 如果在封禁名單，也移除
            await conn.execute("""
                DELETE FROM banned_emails WHERE email = $1
            """, user["email"])
            
            logger.info(f"🔑 Promoted to Super Admin: {user['email']} (from {user['role']}, status: {user['account_status']})")
        
        else:
            # 用戶不存在 → 自動創建
            # 生成隨機密碼（用戶需要通過「忘記密碼」重設，或使用 Google 登入）
            random_password = secrets.token_urlsafe(32)
            hashed_pw = hash_password(random_password)
            
            # 創建 Super Admin 帳號
            new_user = await conn.fetchrow("""
                INSERT INTO users (
                    email, 
                    hashed_password, 
                    name, 
                    role, 
                    account_status,
                    is_active,
                    is_verified,
                    provider
                )
                VALUES ($1, $2, $3, 'super_admin', 'active', TRUE, TRUE, 'email')
                RETURNING id, email
            """, super_admin_email, hashed_pw, super_admin_email.split('@')[0].title())
            
            logger.warning(f"🔑 Created new Super Admin account: {new_user['email']}")
            logger.warning(f"⚠️  Please use 'Forgot Password' to set your password, or login with Google")


# 全域資料庫實例
db = Database(database_url="")  # 會在 main.py 初始化


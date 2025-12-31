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
                    ('social_instagram', '', 'url', 'Instagram 連結')
                ON CONFLICT (setting_key) DO NOTHING
            """)
            
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
            
            # ==================== Partner Logos ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS partner_logos (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(200) NOT NULL,
                    logo_url TEXT NOT NULL,
                    website_url TEXT,
                    display_order INTEGER DEFAULT 0,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_partner_logos_active_order ON partner_logos(is_active, display_order);
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
            
            # ==================== Hero Sections ====================
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS hero_sections (
                    id SERIAL PRIMARY KEY,
                    page VARCHAR(50) NOT NULL,
                    title TEXT NOT NULL,
                    subtitle TEXT,
                    description TEXT,
                    cta_primary_text VARCHAR(100),
                    cta_primary_url VARCHAR(500),
                    cta_secondary_text VARCHAR(100),
                    cta_secondary_url VARCHAR(500),
                    background_image_url TEXT,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW(),
                    UNIQUE(page)
                );
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
    
    async def _add_new_columns(self, conn):
        """
        安全地添加新欄位到現有表（符合 DATABASE_ARCHITECTURE.md 原則）
        
        原則：
        1. ✅ 檢查欄位是否存在
        2. ✅ 只在不存在時添加
        3. ✅ 生產環境安全
        4. ✅ 冪等性保證
        """
        
        # 檢查 account_status 欄位是否存在
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


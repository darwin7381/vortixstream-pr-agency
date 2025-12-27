"""
導入**所有** PR Packages（8個）
"""
import asyncio
import asyncpg
import json

# 完整的 8 個 PR Packages
PR_PACKAGES_COMPLETE = [
    # ========== Global PR (3 個) ==========
    {
        "category_id": "global-pr",
        "name": "Foundation",
        "price": "$1,200 USD",
        "description": "LAUNCH-READY VISIBILITY",
        "badge": "10 GUARANTEED PUBLICATIONS",
        "guaranteed_publications": 10,
        "media_logos": [
            {"url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(58).png", "name": "CoinTelegraph"},
            {"url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(59).png", "name": "CoinDesk"}
        ],
        "features": [
            "Distribution to 10 curated crypto & tech outlets",
            "Homepage placement where available",
            "Same-day distribution after final approval",
            "Editorial suggestions & light copy editing",
            "Standard email support"
        ],
        "detailed_info": {
            "sections": [
                {"title": "10 GUARANTEED PUBLICATIONS", "items": ["CoinTelegraph", "Bitcoin.com News", "CryptoPotato", "NewsBTC", "U.Today", "Bitcoinist", "CoinGape", "ZyCrypto", "CryptoDaily", "Blockchain Reporter"]},
                {"title": "INCLUDED FEATURES", "items": ["Professional press release writing", "SEO optimization", "Multimedia support (images, logos)", "Distribution tracking", "Publication report within 48h"]}
            ],
            "note": "Perfect for seed / Series A, launch or partnership news.",
            "cta_text": "Start with Foundation"
        },
        "display_order": 1
    },
    {
        "category_id": "global-pr",
        "name": "Global Core",
        "price": "From $3,800",
        "description": "Balanced coverage for product launches and major ecosystem news.",
        "badge": "30+ GUARANTEED PUBLICATIONS",
        "guaranteed_publications": 30,
        "media_logos": [
            {"url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/blocktempo%20logo_white_%E6%A9%AB.png", "name": "BlockTempo"},
            {"url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/Logo.png", "name": "Investing.com"},
            {"url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(60).png", "name": "Decrypt"}
        ],
        "features": [
            "Distribution to 30+ tier 1-2 outlets",
            "Multi-wave scheduling",
            "Premium placement opportunities",
            "Full editorial support",
            "Priority support team"
        ],
        "detailed_info": {
            "sections": [
                {"title": "DISTRIBUTION", "items": ["30+ guaranteed publications", "Mix of tier 1 & tier 2 outlets", "Premium placement priority", "Multi-day scheduling options", "Regional targeting available"]},
                {"title": "EDITORIAL SUPPORT", "items": ["Comprehensive copy editing", "Quote optimization", "Multiple revision rounds", "Strategic messaging guidance", "AP style compliance"]},
                {"title": "ADDITIONAL FEATURES", "items": ["Social media snippets", "SEO optimization", "Media contact database access", "Dedicated account manager", "Real-time distribution updates"]}
            ],
            "note": "Ideal for product launches and major announcements.",
            "cta_text": "Get Started"
        },
        "display_order": 2
    },
    {
        "category_id": "global-pr",
        "name": "Global Premium",
        "price": "From $8,000",
        "description": "Tier-1 focus, extended coverage and multi-wave scheduling.",
        "badge": "50+ TIER-1 PUBLICATIONS",
        "guaranteed_publications": 50,
        "media_logos": [
            {"url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/output-onlinepngtools%20(9).png", "name": "Bitcoin.com"}
        ],
        "features": [
            "50+ tier-1 focused distribution",
            "Exclusive outlet relationships",
            "Custom multi-wave strategy",
            "C-suite interview coordination",
            "White-glove service"
        ],
        "detailed_info": {
            "sections": [
                {"title": "PREMIUM DISTRIBUTION", "items": ["50+ guaranteed tier-1 publications", "Exclusive media relationships", "Custom timing strategy", "Follow-up coverage support", "Tier-1 homepage guarantees"]},
                {"title": "ELITE SERVICES", "items": ["C-suite media training", "Interview coordination", "Custom thought leadership", "Crisis management support", "Investor relations messaging"]},
                {"title": "COMPREHENSIVE SUPPORT", "items": ["Dedicated team of 3+", "24/7 availability", "Real-time monitoring", "Monthly strategy sessions", "Quarterly performance review"]}
            ],
            "note": "Maximum visibility for high-impact announcements and campaigns.",
            "cta_text": "Get Started"
        },
        "display_order": 3
    },
    
    # ========== Asia Packages (3 個) ==========
    {
        "category_id": "asia-packages",
        "name": "Southeast Asia",
        "price": "$2,000",
        "description": "Regional narrative-optimized PR across key SEA outlets.",
        "badge": "SEA REGIONAL COVERAGE",
        "media_logos": [
            {"url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(61).png", "name": "Bitcoin Magazine"}
        ],
        "features": [
            "Distribution to major SEA crypto media",
            "Localized messaging for regional markets",
            "Coverage in Singapore, Vietnam, Thailand markets",
            "Native language adaptation available",
            "Regional time zone optimization"
        ],
        "detailed_info": {
            "sections": [
                {"title": "REGIONAL COVERAGE", "items": ["Singapore tier-1 outlets", "Vietnam crypto media", "Thailand publications", "Indonesia coverage", "Philippines outlets", "Malaysia media partners"]},
                {"title": "LOCALIZATION", "items": ["Cultural adaptation", "Regional terminology", "Market-specific angles", "Local compliance review", "Time zone optimized distribution"]},
                {"title": "FEATURES", "items": ["Native language translation available", "Regional social media support", "Local influencer connections", "Market research insights"]}
            ],
            "note": "Ideal for projects targeting Southeast Asian markets.",
            "cta_text": "Get Started"
        },
        "display_order": 1
    },
    {
        "category_id": "asia-packages",
        "name": "Korea & Japan",
        "price": "$5,000",
        "description": "Includes both language translation and narrative adaptation.",
        "badge": "DUAL-MARKET COVERAGE",
        "media_logos": [
            {"url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(57).png", "name": "The Block"}
        ],
        "features": [
            "Full Korean translation & distribution",
            "Full Japanese translation & distribution",
            "Native speaker editorial review",
            "Cultural narrative adaptation",
            "Top-tier outlets in both markets"
        ],
        "detailed_info": {
            "sections": [
                {"title": "KOREA COVERAGE", "items": ["Professional Korean translation", "Distribution to Korean crypto media", "Kakao/Telegram community support", "Korean influencer outreach", "Naver SEO optimization"]},
                {"title": "JAPAN COVERAGE", "items": ["Professional Japanese translation", "Distribution to Japanese outlets", "Cultural sensitivity review", "Japan market timing optimization", "Yahoo Japan optimization"]},
                {"title": "COMBINED BENEFITS", "items": ["Cross-market strategy", "Regional thought leadership", "Dual-market media contacts", "Combined reporting dashboard"]}
            ],
            "note": "Essential for projects targeting Korean and Japanese markets.",
            "cta_text": "Get Started"
        },
        "display_order": 2
    },
    {
        "category_id": "asia-packages",
        "name": "Chinese Speaking",
        "price": "$5,000",
        "description": "6-outlet distribution with Mandarin narrative adaptation.",
        "badge": "6 CHINESE OUTLETS",
        "media_logos": [
            {"url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/blocktempo%20logo_white_%E6%A9%AB.png", "name": "BlockTempo"}
        ],
        "features": [
            "Professional Mandarin translation",
            "6 major Chinese crypto outlets",
            "Mainland + Hong Kong + Taiwan coverage",
            "WeChat distribution support",
            "Simplified & Traditional Chinese versions"
        ],
        "detailed_info": {
            "sections": [
                {"title": "DISTRIBUTION NETWORK", "items": ["Mainland China outlets (VPN-accessible)", "Hong Kong tier-1 media", "Taiwan crypto publications", "Singapore Chinese media", "Malaysian Chinese outlets", "Global Chinese diaspora media"]},
                {"title": "CHINESE MARKET SERVICES", "items": ["Simplified Chinese translation", "Traditional Chinese translation", "WeChat article formatting", "Chinese SEO optimization", "Baidu indexing support", "Weibo social amplification"]},
                {"title": "CULTURAL ADAPTATION", "items": ["Market-appropriate messaging", "Regulatory compliance review", "Cultural sensitivity check", "Regional terminology usage"]}
            ],
            "note": "Perfect for projects targeting Chinese-speaking markets globally.",
            "cta_text": "Get Started"
        },
        "display_order": 3
    },
    
    # ========== Founder PR (2 個) ==========
    {
        "category_id": "founder-pr",
        "name": "Starter",
        "price": "$2,000",
        "description": "Personal branding narrative + 1–2 articles and AI visibility support.",
        "badge": "FOUNDER BRANDING",
        "media_logos": [
            {"url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(60).png", "name": "Decrypt"}
        ],
        "features": [
            "Personal brand narrative development",
            "1-2 thought leadership articles",
            "AI-optimized founder bio",
            "LinkedIn profile optimization",
            "Personal PR strategy session"
        ],
        "detailed_info": {
            "sections": [
                {"title": "BRAND BUILDING", "items": ["Founder story development", "Personal messaging framework", "AI visibility optimization", "Social media presence audit", "Professional headshot guidance"]},
                {"title": "CONTENT CREATION", "items": ["1-2 bylined articles", "LinkedIn post templates", "Quote bank creation", "Media kit preparation", "Bio optimization for all platforms"]},
                {"title": "VISIBILITY", "items": ["Google search optimization", "Social media profile enhancement", "Speaking opportunity guidance", "Media training basics"]}
            ],
            "note": "Build your personal brand and establish thought leadership.",
            "cta_text": "Get Started"
        },
        "display_order": 1
    },
    {
        "category_id": "founder-pr",
        "name": "Key Leader",
        "price": "$2,000",
        "description": "Narrative, 2–3 articles, 1 interview + 1 shorts, plus AI visibility.",
        "badge": "LEADERSHIP PACKAGE",
        "media_logos": [
            {"url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(61).png", "name": "Bitcoin Magazine"}
        ],
        "features": [
            "Comprehensive leader narrative",
            "2-3 thought leadership articles",
            "1 podcast/media interview",
            "Short-form video content",
            "Advanced AI visibility package"
        ],
        "detailed_info": {
            "sections": [
                {"title": "ENHANCED CONTENT", "items": ["2-3 bylined articles in tier-1 outlets", "Podcast interview coordination", "1 short-form video content", "Interview media training", "Ongoing content strategy"]},
                {"title": "VISIBILITY BOOST", "items": ["Multi-platform AI optimization", "Wikipedia page consultation", "Google Knowledge Panel setup", "Ongoing media opportunities", "Press mention tracking"]},
                {"title": "PROFESSIONAL DEVELOPMENT", "items": ["Media training session", "Speaking engagement support", "Conference speaker applications", "Award nomination submissions", "Industry recognition strategy"]}
            ],
            "note": "Elevate your leadership presence and industry recognition.",
            "cta_text": "Get Started"
        },
        "display_order": 2
    }
]


async def main():
    import os
    from dotenv import load_dotenv
    
    # 載入環境變數（本地開發時）
    load_dotenv()
    
    # 從環境變數讀取資料庫 URL，如果沒有則使用本地預設值
    database_url = os.getenv("DATABASE_URL", "postgresql://JL@localhost:5432/vortixpr")
    
    print(f"🔗 連接資料庫...")
    print(f"   URL: {database_url[:30]}..." if len(database_url) > 30 else f"   URL: {database_url}")
    
    conn = await asyncpg.connect(database_url)
    
    print("🗑️  清空現有 PR Packages...")
    await conn.execute("DELETE FROM pr_packages")
    
    print(f"📦 導入所有 {len(PR_PACKAGES_COMPLETE)} 個 PR Packages...\n")
    
    for i, package in enumerate(PR_PACKAGES_COMPLETE, 1):
        slug = package["name"].lower().replace(" ", "-").replace("&", "and")
        
        await conn.execute("""
            INSERT INTO pr_packages (
                name, slug, price, description, badge, guaranteed_publications,
                category_id, media_logos, features, detailed_info,
                display_order, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb, $11, $12)
        """,
            package["name"],
            slug,
            package["price"],
            package["description"],
            package.get("badge"),
            package.get("guaranteed_publications"),
            package["category_id"],
            json.dumps(package.get("media_logos", [])),
            json.dumps(package["features"]),
            json.dumps(package.get("detailed_info")) if package.get("detailed_info") else None,
            package.get("display_order", 0),
            "active"
        )
        
        print(f"  {i}/8 ✅ {package['name']} ({package['category_id']})")
    
    print(f"\n✅ 成功導入 {len(PR_PACKAGES_COMPLETE)} 個 PR Packages")
    
    # 統計
    rows = await conn.fetch("""
        SELECT category_id, COUNT(*) as count
        FROM pr_packages
        GROUP BY category_id
        ORDER BY category_id
    """)
    
    print(f"\n📊 資料庫統計:")
    for row in rows:
        print(f"  {row['category_id']}: {row['count']} 個 packages")
    
    total = await conn.fetchval("SELECT COUNT(*) FROM pr_packages")
    print(f"\n  總計: {total} 個 PR Packages")
    
    await conn.close()
    print("\n✅ PR Packages 完整導入完成!")


if __name__ == "__main__":
    asyncio.run(main())




"""
導入前端 pricingDataV2.ts 的 PR Packages 資料
"""
import asyncio
import asyncpg
import json

# 從前端 pricingDataV2.ts 的資料（簡化版，包含關鍵資料）
PR_PACKAGES_V2 = [
    # Global PR - Foundation
    {
        "category_id": "global-pr",
        "name": "Foundation",
        "price": "$1,200 USD",
        "description": "LAUNCH-READY VISIBILITY",
        "badge": "10 GUARANTEED PUBLICATIONS",
        "guaranteed_publications": 10,
        "media_logos": [
            {
                "url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(58).png",
                "name": "CoinTelegraph"
            },
            {
                "url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(59).png",
                "name": "CoinDesk"
            }
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
                {
                    "title": "10 GUARANTEED PUBLICATIONS",
                    "items": [
                        "CoinTelegraph",
                        "Bitcoin.com News",
                        "CryptoPotato",
                        "NewsBTC",
                        "U.Today",
                        "Bitcoinist",
                        "CoinGape",
                        "ZyCrypto",
                        "CryptoDaily",
                        "Blockchain Reporter"
                    ]
                },
                {
                    "title": "INCLUDED FEATURES",
                    "items": [
                        "Professional press release writing",
                        "SEO optimization",
                        "Multimedia support (images, logos)",
                        "Distribution tracking",
                        "Publication report within 48h"
                    ]
                }
            ],
            "note": "Perfect for seed / Series A, launch or partnership news.",
            "cta_text": "Start with Foundation"
        },
        "display_order": 1
    },
    # Global PR - Global Core
    {
        "category_id": "global-pr",
        "name": "Global Core",
        "price": "From $3,800",
        "description": "Balanced coverage for product launches and major ecosystem news.",
        "badge": "30+ GUARANTEED PUBLICATIONS",
        "guaranteed_publications": 30,
        "media_logos": [
            {
                "url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/blocktempo%20logo_white_%E6%A9%AB.png",
                "name": "BlockTempo"
            },
            {
                "url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/Logo.png",
                "name": "Investing.com"
            },
            {
                "url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(60).png",
                "name": "Decrypt"
            }
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
                {
                    "title": "DISTRIBUTION",
                    "items": [
                        "30+ guaranteed publications",
                        "Mix of tier 1 & tier 2 outlets",
                        "Premium placement priority",
                        "Multi-day scheduling options",
                        "Regional targeting available"
                    ]
                },
                {
                    "title": "EDITORIAL SUPPORT",
                    "items": [
                        "Comprehensive copy editing",
                        "Quote optimization",
                        "Multiple revision rounds",
                        "Strategic messaging guidance",
                        "AP style compliance"
                    ]
                }
            ],
            "note": "Ideal for product launches and major announcements.",
            "cta_text": "Get Started"
        },
        "display_order": 2
    },
    # Global PR - Global Premium
    {
        "category_id": "global-pr",
        "name": "Global Premium",
        "price": "From $8,000",
        "description": "Tier-1 focus, extended coverage and multi-wave scheduling.",
        "badge": "50+ TIER-1 PUBLICATIONS",
        "guaranteed_publications": 50,
        "media_logos": [
            {
                "url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/output-onlinepngtools%20(9).png",
                "name": "Bitcoin.com"
            }
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
                {
                    "title": "PREMIUM DISTRIBUTION",
                    "items": [
                        "50+ guaranteed tier-1 publications",
                        "Exclusive media relationships",
                        "Custom timing strategy",
                        "Follow-up coverage support",
                        "Tier-1 homepage guarantees"
                    ]
                }
            ],
            "note": "Maximum visibility for high-impact announcements and campaigns.",
            "cta_text": "Get Started"
        },
        "display_order": 3
    },
    # Asia Packages - Southeast Asia
    {
        "category_id": "asia-packages",
        "name": "Southeast Asia",
        "price": "$2,000",
        "description": "Regional narrative-optimized PR across key SEA outlets.",
        "badge": "SEA REGIONAL COVERAGE",
        "media_logos": [
            {
                "url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(61).png",
                "name": "Bitcoin Magazine"
            }
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
                {
                    "title": "REGIONAL COVERAGE",
                    "items": [
                        "Singapore tier-1 outlets",
                        "Vietnam crypto media",
                        "Thailand publications",
                        "Indonesia coverage",
                        "Philippines outlets",
                        "Malaysia media partners"
                    ]
                }
            ],
            "note": "Ideal for projects targeting Southeast Asian markets.",
            "cta_text": "Get Started"
        },
        "display_order": 1
    },
    # Founder PR - Starter
    {
        "category_id": "founder-pr",
        "name": "Starter",
        "price": "$2,000",
        "description": "Personal branding narrative + 1–2 articles and AI visibility support.",
        "badge": "FOUNDER BRANDING",
        "media_logos": [
            {
                "url": "https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(60).png",
                "name": "Decrypt"
            }
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
                {
                    "title": "BRAND BUILDING",
                    "items": [
                        "Founder story development",
                        "Personal messaging framework",
                        "AI visibility optimization",
                        "Social media presence audit",
                        "Professional headshot guidance"
                    ]
                }
            ],
            "note": "Build your personal brand and establish thought leadership.",
            "cta_text": "Get Started"
        },
        "display_order": 1
    }
]


async def main():
    conn = await asyncpg.connect("postgresql://JL@localhost:5432/vortixpr")
    
    print("🗑️  清空現有 PR Packages...")
    await conn.execute("DELETE FROM pr_packages")
    
    print("📦 導入 PR Packages...")
    
    for package in PR_PACKAGES_V2:
        slug = package["name"].lower().replace(" ", "-")
        
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
            package["badge"],
            package.get("guaranteed_publications"),
            package["category_id"],
            json.dumps(package.get("media_logos", [])),
            json.dumps(package["features"]),
            json.dumps(package.get("detailed_info")) if package.get("detailed_info") else None,
            package.get("display_order", 0),
            "active"
        )
        
        print(f"  ✅ {package['name']} ({package['category_id']})")
    
    print(f"\n✅ 成功導入 {len(PR_PACKAGES_V2)} 個 PR Packages")
    
    # 統計
    count = await conn.fetchval("SELECT COUNT(*) FROM pr_packages")
    print(f"\n📊 資料庫統計: {count} 個 PR Packages")
    
    await conn.close()
    print("\n✅ PR Packages 導入完成!")


if __name__ == "__main__":
    asyncio.run(main())




"""
導入前端真實資料到資料庫
"""
import asyncio
import asyncpg
from datetime import datetime
import json

# 從前端 blogData.ts 複製的資料
BLOG_ARTICLES = [
    {
        "id": 1,
        "title": "How to Write Effective Crypto PR Press Releases",
        "category": "PR Strategy",
        "readTime": "5 min read",
        "date": "2024-01-15",
        "image": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
        "excerpt": "Learn the essential elements of writing compelling press releases that get results in the crypto industry."
    },
    {
        "id": 2,
        "title": "Complete Guide to AI Industry Media Placement",
        "category": "Media Strategy",
        "readTime": "8 min read",
        "date": "2024-01-10",
        "image": "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
        "excerpt": "Comprehensive strategies for securing media coverage in the rapidly evolving AI landscape."
    },
    {
        "id": 3,
        "title": "Building Brand Authority: Content Marketing for Tech Companies",
        "category": "Brand Building",
        "readTime": "6 min read",
        "date": "2024-01-05",
        "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
        "excerpt": "Establish thought leadership and build trust through strategic content marketing approaches."
    },
    {
        "id": 4,
        "title": "Crisis PR Management: Strategies When Negative News Hits",
        "category": "Crisis Management",
        "readTime": "7 min read",
        "date": "2023-12-28",
        "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
        "excerpt": "Essential tactics for managing reputation during challenging times and turning crisis into opportunity."
    },
    {
        "id": 5,
        "title": "Global Media Networks: Reaching International Audiences",
        "category": "Globalization",
        "readTime": "9 min read",
        "date": "2023-12-20",
        "image": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
        "excerpt": "Navigate cultural nuances and media landscapes to achieve global PR success."
    },
    {
        "id": 6,
        "title": "Data-Driven PR Strategies: Measuring Success & Optimization",
        "category": "Data Analytics",
        "readTime": "4 min read",
        "date": "2023-12-15",
        "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
        "excerpt": "Leverage analytics to optimize PR campaigns and demonstrate measurable business impact."
    },
    {
        "id": 7,
        "title": "Influencer Partnerships in Tech: PR Collaboration Strategies",
        "category": "PR Strategy",
        "readTime": "5 min read",
        "date": "2023-12-10",
        "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
        "excerpt": "Build strategic partnerships with key influencers to amplify your tech PR initiatives."
    },
    {
        "id": 8,
        "title": "Social Media Crisis Response: Real-Time PR Management",
        "category": "Crisis Management",
        "readTime": "8 min read",
        "date": "2023-12-05",
        "image": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
        "excerpt": "Master the art of swift, effective crisis communication across social media platforms."
    },
    {
        "id": 9,
        "title": "Content Strategy for B2B Tech Marketing",
        "category": "Media Strategy",
        "readTime": "7 min read",
        "date": "2023-11-30",
        "image": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
        "excerpt": "Create compelling content that resonates with decision-makers in the B2B technology space."
    },
    {
        "id": 10,
        "title": "Crypto Market Analysis: PR Timing & Media Cycles",
        "category": "Data Analytics",
        "readTime": "6 min read",
        "date": "2023-11-25",
        "image": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
        "excerpt": "Master the art of timing your PR campaigns with crypto market cycles for maximum impact."
    },
    {
        "id": 11,
        "title": "Building Strategic Partnerships in AI Ecosystem",
        "category": "Brand Building",
        "readTime": "8 min read",
        "date": "2023-11-20",
        "image": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
        "excerpt": "Navigate complex AI partnerships and create mutually beneficial PR strategies that amplify reach."
    },
    {
        "id": 12,
        "title": "Cross-Border PR: Navigating Regulatory Communications",
        "category": "Globalization",
        "readTime": "9 min read",
        "date": "2023-11-15",
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
        "excerpt": "Expert guidance on communicating across different regulatory environments in global markets."
    },
    {
        "id": 13,
        "title": "Advanced PR Metrics: ROI Measurement & Attribution",
        "category": "Data Analytics",
        "readTime": "5 min read",
        "date": "2023-11-10",
        "image": "https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
        "excerpt": "Implement sophisticated measurement frameworks to prove PR impact on business outcomes."
    },
    {
        "id": 14,
        "title": "Thought Leadership in Emerging Technologies",
        "category": "Brand Building",
        "readTime": "7 min read",
        "date": "2023-11-05",
        "image": "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
        "excerpt": "Position your executives as industry visionaries in rapidly evolving tech landscapes."
    },
    {
        "id": 15,
        "title": "Crisis Communication in Decentralized Organizations",
        "category": "Crisis Management",
        "readTime": "6 min read",
        "date": "2023-11-01",
        "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&w=400&h=300&fit=crop&crop=center",
        "excerpt": "Special strategies for managing crisis communications in blockchain and DAO environments."
    }
]

# 從前端 pricingData.ts 的資料
PRICING_PLANS_OLD = [
    {
        "id": "lite",
        "name": "Lite",
        "price": 999,
        "description": "Perfect for startups and small businesses",
        "features": [
            "5 Guaranteed Press Release",
            "Same-day delivery",
            "Editorial recommendations",
            "Dedicated Support Team",
            "SEO Optimization Included",
            "Optional add-ons: Multilingual Releases (translation to 10+ languages)"
        ]
    },
    {
        "id": "pro",
        "name": "Pro",
        "price": 1999,
        "description": "Ideal for growing companies",
        "is_popular": True,
        "features": [
            "10 Guaranteed Press Release",
            "Same-day delivery",
            "Editorial recommendations",
            "Dedicated Support Team",
            "SEO Optimization Included",
            "Optional add-ons: Global distribution (translation included)",
            "Optional add-ons: Social Media Promotion"
        ]
    },
    {
        "id": "premium",
        "name": "Premium",
        "price": 5000,
        "description": "For enterprises and large organizations",
        "features": [
            "30 Guaranteed Press Release",
            "Same-day delivery",
            "Editorial recommendations",
            "Dedicated Support Team",
            "SEO Optimization Included",
            "Optional add-ons:Global distribution (translation included)",
            "Optional add-ons:Social Media Promotion"
        ]
    }
]


async def main():
    import os
    from dotenv import load_dotenv
    
    # 載入環境變數（本地開發時）
    load_dotenv()
    
    # 從環境變數讀取資料庫 URL
    database_url = os.getenv("DATABASE_URL", "postgresql://JL@localhost:5432/vortixpr")
    
    print(f"🔗 連接資料庫...")
    print(f"   URL: {database_url[:30]}..." if len(database_url) > 30 else f"   URL: {database_url}")
    
    # 連線到資料庫
    conn = await asyncpg.connect(database_url)
    
    print("🗑️  清空現有資料...")
    await conn.execute("DELETE FROM blog_posts")
    await conn.execute("DELETE FROM pricing_packages")
    
    print("📝 導入 Blog 文章...")
    
    for article in BLOG_ARTICLES:
        # 提取閱讀時間的數字
        read_time = int(article["readTime"].split()[0]) if article["readTime"] else 5
        
        # 生成簡單的內容（實際應該有完整文章）
        content = f"""# {article['title']}

{article['excerpt']}

## Introduction

This is a comprehensive guide about {article['title'].lower()}.

## Key Points

1. Understanding the fundamentals
2. Best practices and strategies  
3. Real-world applications
4. Measuring success

## Conclusion

By following these strategies, you can achieve better results in your PR campaigns.
"""
        
        # 插入文章
        await conn.execute("""
            INSERT INTO blog_posts (
                title, slug, category, excerpt, content, author,
                read_time, image_url, status, published_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        """,
            article["title"],
            article["title"].lower().replace(" ", "-").replace(":", "").replace("&", "and"),
            article["category"],
            article["excerpt"],
            content,
            "VortixPR Team",
            read_time,
            article["image"],
            "published",
            datetime.fromisoformat(article["date"])
        )
        print(f"  ✅ {article['title']}")
    
    print(f"\n✅ 成功導入 {len(BLOG_ARTICLES)} 篇文章")
    
    print("\n📦 導入 Pricing Packages...")
    
    for plan in PRICING_PLANS_OLD:
        display_order = 1 if plan["id"] == "lite" else (2 if plan["id"] == "pro" else 3)
        
        await conn.execute("""
            INSERT INTO pricing_packages (
                name, slug, description, price, currency, billing_period,
                features, is_popular, display_order, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10)
        """,
            plan["name"],
            plan["id"],
            plan["description"],
            plan["price"],
            "USD",
            "monthly",
            json.dumps(plan["features"]),
            plan.get("is_popular", False),
            display_order,
            "active"
        )
        print(f"  ✅ {plan['name']} - ${plan['price']}")
    
    print(f"\n✅ 成功導入 {len(PRICING_PLANS_OLD)} 個 Pricing Packages")
    
    # 顯示統計
    blog_count = await conn.fetchval("SELECT COUNT(*) FROM blog_posts")
    pricing_count = await conn.fetchval("SELECT COUNT(*) FROM pricing_packages")
    
    print(f"\n📊 資料庫統計:")
    print(f"  Blog 文章: {blog_count}")
    print(f"  Pricing Packages: {pricing_count}")
    
    await conn.close()
    print("\n✅ 資料導入完成!")


if __name__ == "__main__":
    asyncio.run(main())




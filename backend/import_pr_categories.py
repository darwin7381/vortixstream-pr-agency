"""
導入 PR Package Categories 資料
"""
import asyncio
import asyncpg
import json
import os
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

# PR Package Categories 資料
PR_CATEGORIES = [
    {
        "category_id": "global-pr",
        "title": "Global PR",
        "badges": ["Tier-1 Media", "Global Coverage", "Fast Distribution"],
        "display_order": 1
    },
    {
        "category_id": "asia-packages",
        "title": "Asia Packages",
        "badges": ["Regional Focus", "Localized Content", "Native Language"],
        "display_order": 2
    },
    {
        "category_id": "founder-pr",
        "title": "Founder PR",
        "badges": ["Personal Branding", "Thought Leadership", "AI Visibility"],
        "display_order": 3
    }
]


async def main():
    database_url = os.getenv("DATABASE_URL", "postgresql://JL@localhost:5432/vortixpr")
    
    print(f"🔗 連接資料庫...")
    print(f"   URL: {database_url[:30]}..." if len(database_url) > 30 else f"   URL: {database_url}")
    
    conn = await asyncpg.connect(database_url)
    
    # 創建資料表（如果不存在）
    print("\n📋 創建 pr_package_categories 資料表...")
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS pr_package_categories (
            id SERIAL PRIMARY KEY,
            category_id VARCHAR(50) UNIQUE NOT NULL,
            title VARCHAR(100) NOT NULL,
            badges JSONB DEFAULT '[]',
            display_order INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_pr_categories_order 
        ON pr_package_categories(display_order);
    """)
    print("   ✅ 資料表創建成功")
    
    # 清空現有資料
    print("\n🗑️  清空現有分類...")
    await conn.execute("DELETE FROM pr_package_categories")
    
    # 導入分類
    print(f"\n📦 導入 {len(PR_CATEGORIES)} 個 PR Package Categories...\n")
    
    for category in PR_CATEGORIES:
        await conn.execute("""
            INSERT INTO pr_package_categories (
                category_id, title, badges, display_order
            )
            VALUES ($1, $2, $3::jsonb, $4)
        """,
            category["category_id"],
            category["title"],
            json.dumps(category["badges"]),
            category["display_order"]
        )
        
        print(f"  ✅ {category['title']} ({category['category_id']})")
    
    # 統計
    total = await conn.fetchval("SELECT COUNT(*) FROM pr_package_categories")
    
    print(f"\n✅ 成功導入 {total} 個分類")
    
    # 顯示結果
    print(f"\n📊 分類列表:")
    categories = await conn.fetch("""
        SELECT category_id, title, badges
        FROM pr_package_categories
        ORDER BY display_order
    """)
    
    for cat in categories:
        badges = json.loads(cat['badges']) if isinstance(cat['badges'], str) else cat['badges']
        print(f"  - {cat['title']}: {', '.join(badges)}")
    
    await conn.close()
    print("\n✅ PR Categories 導入完成!")


if __name__ == "__main__":
    asyncio.run(main())



# 🗄️ VortixPR 資料庫架構文檔

**專案：** VortixPR Backend  
**架構決策：** 程式碼即資料庫（Code as Database Schema）  
**參考專案：** Tempo 30 Awards

---

## 📌 核心原則

### ✅ 我們的做法：單一 `database.py` 自動初始化

**所有資料表定義都在 `app/core/database.py` 中：**

```python
class Database:
    async def connect(self):
        # 連接資料庫
        self.pool = await asyncpg.create_pool(...)
        
        # 🎯 自動初始化所有表（啟動時執行）
        await self.init_tables()
    
    async def init_tables(self):
        # 所有 CREATE TABLE IF NOT EXISTS 語句
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS blog_posts (...)
        """)
        
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS pricing_packages (...)
        """)
        
        # ... 其他表
```

**關鍵特性：**
- ✅ **冪等性**（`IF NOT EXISTS`）- 可重複執行
- ✅ **自動執行**（應用啟動時）
- ✅ **程式碼即文檔**（所有結構在一處）
- ✅ **無需手動操作**（開發、測試、生產都自動）

---

## 🎯 為什麼選擇這個方案？

### 適合我們專案的原因

#### 1. **快速迭代**
- 修改表結構：直接改 `database.py`
- 重啟應用：自動應用變更
- 無需維護遷移檔案

#### 2. **單人/小團隊開發**
- 無合併衝突問題
- 所有結構在一處，易於理解
- Git 追蹤程式碼變更即可

#### 3. **開發和生產一致**
- 相同的程式碼
- 相同的初始化邏輯
- 無需區分環境

#### 4. **安全的漸進式更新**
```python
# 新增欄位（安全）
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255),
    new_field VARCHAR(100)  # ← 直接加，不影響現有資料
);
```

---

## 📊 目前的資料表

### 1. blog_posts（Blog 文章）
```sql
- id, title, slug, category, content
- author, read_time, image_url
- meta_title, meta_description
- status, created_at, published_at
```

### 2. pricing_packages（Pricing 方案）
```sql
- id, name, slug, description
- price, currency, billing_period
- features（JSONB）
- is_popular, badge_text
- display_order, status
```

### 3. pr_packages（PR Packages）
```sql
- id, name, slug, price, description
- category_id, category_order
- media_logos（JSONB）
- features（JSONB）
- detailed_info（JSONB）
- display_order, status
```

### 4. pr_package_categories（PR 分類）
```sql
- id, category_id, title
- badges（JSONB）
- display_order
```

### 5. contact_submissions（聯絡表單）
```sql
- id, name, email, company, phone, message
- status, ip_address, user_agent
- created_at
```

### 6. newsletter_subscribers（Newsletter）
```sql
- id, email, status
- source, ip_address
- subscribed_at, unsubscribed_at
```

### 7. media_files（媒體檔案）
```sql
- id, filename, original_filename
- file_key, file_url
- file_size, mime_type, folder
- width, height
- alt_text, caption
- uploaded_by, created_at
```

---

## 🚀 部署流程

### 本地開發
```bash
1. 啟動後端：uv run uvicorn app.main:app --reload
2. database.py 自動執行
3. ✅ 所有表自動創建
```

### 生產環境（Railway）
```bash
1. Git push 觸發部署
2. Railway 啟動應用
3. database.py 自動執行
4. ✅ 所有表自動創建（如果不存在）
```

**無需手動執行任何 SQL 腳本！**

---

## ⚠️ 未來考慮遷移系統的時機

**只有在以下情況才需要：**

### 觸發條件
1. ❌ 需要複雜的資料轉換（例如：分拆欄位，重組資料）
2. ❌ 需要重組表結構（例如：建新表、遷移資料、刪舊表）
3. ❌ 團隊擴大到 3+ 人同時開發資料庫
4. ❌ 需要追蹤每次變更的獨立歷史
5. ❌ 需要回滾到特定版本

**目前狀況：** ✅ 以上條件都不滿足，繼續使用簡單方案

---

## 💡 安全的擴展方式

### 如果未來需要新增欄位：

```python
async def init_tables(self):
    # 創建表
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(255)
        )
    """)
    
    # 檢查並新增欄位（安全）
    column_exists = await conn.fetchval("""
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='users' AND column_name='phone'
        )
    """)
    
    if not column_exists:
        logger.info("🔄 Adding phone column to users table...")
        await conn.execute("""
            ALTER TABLE users ADD COLUMN phone VARCHAR(50)
        """)
```

**這種做法：**
- ✅ 生產環境安全
- ✅ 不破壞現有資料
- ✅ 仍然保持在 `database.py` 中

---

---

## 🎲 假資料與初始資料管理

### 初始資料插入機制

**我們的做法：`_init_seed_data()` 方法**

```python
async def _init_seed_data(self, conn):
    """插入初始資料（僅在資料表為空時）"""
    
    # 檢查是否已有資料
    count = await conn.fetchval("SELECT COUNT(*) FROM pricing_packages")
    
    if count == 0:
        logger.info("📝 Seeding pricing packages...")
        
        # 插入初始資料
        await conn.execute("""
            INSERT INTO pricing_packages (...)
            VALUES (...)
        """)
        
        logger.info("✅ Seed data inserted")
```

**關鍵原則：**
1. ✅ **只在表為空時插入**（避免重複）
2. ✅ **使用 `COUNT(*) = 0` 檢查**
3. ✅ **可以在開發和生產環境使用**
4. ✅ **冪等性**（多次執行結果相同）

---

### 初始資料 vs 假資料

#### **初始資料（Seed Data）**
```python
# 用途：系統必需的基礎資料
# 範例：
- 預設分類（PR Package Categories）
- 系統角色（Admin, User）
- 預設設定值

# 特性：
✅ 生產環境需要
✅ 不應該刪除
✅ 在 database.py 中管理
```

#### **假資料（Mock Data）**
```python
# 用途：開發和測試
# 範例：
- 測試用的 Blog 文章
- 範例 PR Packages
- 測試用戶

# 特性：
⚠️ 僅用於開發環境
❌ 不應該出現在生產環境
✅ 可以用獨立的 seed 腳本
```

**實現方式：**
```python
async def _init_seed_data(self, conn):
    # 檢查環境
    from ..config import settings
    
    if settings.ENVIRONMENT == "development":
        # 插入假資料（僅開發環境）
        count = await conn.fetchval("SELECT COUNT(*) FROM blog_posts")
        if count == 0:
            logger.info("📝 Seeding development data...")
            await self._seed_blog_posts(conn)
    
    # 插入初始資料（所有環境）
    await self._seed_categories(conn)  # PR 分類等必要資料
```

---

## 🔒 生產環境安全性考慮

### 1. **冪等性保證**

**所有操作都應該是冪等的：**
```python
# ✅ 好的做法
CREATE TABLE IF NOT EXISTS users (...)
INSERT INTO categories (...) ON CONFLICT (id) DO NOTHING

# ❌ 不好的做法
CREATE TABLE users (...)  # 如果表已存在會失敗
INSERT INTO categories (...)  # 如果資料已存在會衝突
```

### 2. **資料完整性保護**

**使用 UNIQUE 和 CHECK 約束：**
```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,  -- 防止重複
    status VARCHAR(20) CHECK (status IN ('active', 'inactive')),  -- 限制值
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### 3. **索引策略**

**建立索引的時機：**
```python
# ✅ 經常查詢的欄位
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);

# ✅ 外鍵欄位
CREATE INDEX IF NOT EXISTS idx_packages_category ON pr_packages(category_id);

# ✅ 排序欄位
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published_at DESC);
```

**注意：**
- ⚠️ 索引會增加寫入成本
- ⚠️ 只為真正需要的欄位建索引
- ⚠️ 使用 `IF NOT EXISTS` 避免重複建立

---

## 🔄 漸進式更新範例

### 安全地新增欄位到現有表

```python
async def init_tables(self):
    # 1. 創建表（已存在則跳過）
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            name VARCHAR(100)
        )
    """)
    
    # 2. 檢查新欄位是否存在
    phone_exists = await conn.fetchval("""
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='users' AND column_name='phone'
        )
    """)
    
    # 3. 安全地新增欄位
    if not phone_exists:
        logger.info("🔄 Adding phone column to users table...")
        await conn.execute("""
            ALTER TABLE users ADD COLUMN phone VARCHAR(50)
        """)
        logger.info("✅ Column added")
```

**為什麼這樣安全：**
- ✅ 不影響現有資料
- ✅ 不需要停機
- ✅ 可以在百萬用戶的生產環境執行
- ✅ 失敗不會破壞資料庫

---

## 📊 決策流程圖

```
需要修改資料庫？
  ↓
只是新增欄位？
  ├─ 是 → 在 init_tables() 中加 ALTER TABLE + 檢查
  │         ✅ 使用簡單方案
  │
  └─ 否 → 需要轉換資料？
      ├─ 是 → 需要獨立遷移腳本
      │         ⚠️ 考慮複雜方案
      │
      └─ 否 → 只是新增表？
          └─ 是 → 在 init_tables() 中加 CREATE TABLE IF NOT EXISTS
                    ✅ 使用簡單方案
```

---

## 🛡️ 防禦性程式設計

### 處理 JSONB 欄位

```python
# ✅ 安全的 JSONB 插入
import json

await conn.execute("""
    INSERT INTO pr_packages (name, features)
    VALUES ($1, $2::jsonb)
""", 
    package_name,
    json.dumps(features_list)  # Python list → JSON string
)

# ✅ 安全的 JSONB 讀取
row = await conn.fetchrow("SELECT * FROM pr_packages WHERE id = $1", pkg_id)
features = row['features']
if isinstance(features, str):
    features = json.loads(features)  # 確保是 Python list
```

### 處理時區問題

```python
# ✅ 移除時區資訊（避免衝突）
from datetime import datetime

last_modified = datetime.now()
await conn.execute("""
    INSERT INTO media_files (created_at)
    VALUES ($1)
""", last_modified.replace(tzinfo=None))
```

---

## 📝 實際案例：VortixPR 的資料庫結構

### 表結構概覽

```
blog_posts              # Blog 文章
pricing_packages        # Pricing 方案
pr_packages            # PR Packages（首頁展示）
pr_package_categories  # PR 分類（動態管理）
contact_submissions    # 聯絡表單提交
newsletter_subscribers # Newsletter 訂閱者
media_files           # 媒體檔案（R2 索引）
```

### 為什麼這樣設計

**1. 分類獨立表（pr_package_categories）**
```sql
-- 之前：分類寫死在程式碼
-- 問題：無法動態管理

-- 現在：獨立表
CREATE TABLE pr_package_categories (
    category_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100),
    badges JSONB
);

-- 好處：
✅ 可以在後台新增/編輯分類
✅ 可以調整顯示順序
✅ 資料驅動，不是程式碼驅動
```

**2. 媒體檔案索引（media_files）**
```sql
-- 為什麼需要：
-- R2 只存圖片，但我們需要：
✅ 快速搜尋（按檔名、Alt Text）
✅ 按資料夾篩選
✅ 統計分析（總大小、檔案數）
✅ SEO 資訊（Alt Text, Caption）

-- 所以：
-- R2 = 實際檔案存儲
-- PostgreSQL = 檔案元數據索引
```

---

## 🔗 參考資料

- **你的專案：** `/Users/JL/Development/microservice-system/token-manager/backend/database.py`
- **本專案實作：** `app/core/database.py`
- **Tempo 30 Awards：** 相同架構模式
- **asyncpg 文檔：** https://github.com/MagicStack/asyncpg

---

## 📋 未來決策檢查清單

**當你考慮是否需要複雜遷移系統時，問自己：**

- [ ] 是否需要複雜的資料轉換？（不只是加欄位）
- [ ] 是否有 3+ 人同時開發資料庫功能？
- [ ] 是否需要追蹤每次資料庫變更的獨立歷史？
- [ ] 是否需要針對特定版本回滾？
- [ ] 是否有多個環境需要同步遷移狀態？
- [ ] 是否需要停機維護窗口進行遷移？

**如果以上都是 "否"，繼續使用 `database.py` 就好！**

---

## ✅ 總結

**我們的方案（參考 Tempo 30 Awards）：**
- ✅ 簡單、快速、安全
- ✅ 適合當前專案規模
- ✅ 生產環境可用
- ✅ 冪等性保證
- ✅ 自動初始化
- ✅ 程式碼即文檔

**核心理念：**
> 不要過早優化。保持簡單，直到複雜性真正成為必要。
> 
> —— 參考自你的 token-manager 和 Tempo 30 Awards 專案

**現在重新部署，生產環境會自動創建所有表！** 🚀


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

## ✅ 總結

**我們的方案：**
- 簡單、快速、安全
- 適合當前專案規模
- 與 Tempo 30 Awards 相同做法
- 生產環境可用

**不要過早優化，等到真正需要時再升級！**


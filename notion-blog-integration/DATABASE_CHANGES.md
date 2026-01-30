# Database 變更說明

## 📋 需要擴展的表

**表名**: `blog_posts` (已存在)

**位置**: `backend/app/core/database.py` 第 477-505 行

---

## 🔧 需要新增的欄位

在 `backend/app/core/database.py` 的 `_add_new_columns()` 方法中添加以下檢查和欄位：

### 完整的代碼（加在 `_add_new_columns()` 方法最後）

```python
# === Blog Posts - Notion Integration ===

notion_page_id_exists = await conn.fetchval("""
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='blog_posts' AND column_name='notion_page_id'
    )
""")

if not notion_page_id_exists:
    logger.info("🔄 Adding Notion integration fields to blog_posts...")
    
    # 新增欄位
    await conn.execute("""
        ALTER TABLE blog_posts 
        ADD COLUMN notion_page_id VARCHAR(100),
        ADD COLUMN notion_last_edited_time TIMESTAMP,
        ADD COLUMN sync_source VARCHAR(20) DEFAULT 'admin';
    """)
    
    # 新增唯一約束
    await conn.execute("""
        ALTER TABLE blog_posts
        ADD CONSTRAINT uq_blog_posts_notion_page_id UNIQUE (notion_page_id);
    """)
    
    # 新增檢查約束
    await conn.execute("""
        ALTER TABLE blog_posts
        ADD CONSTRAINT chk_blog_posts_sync_source 
        CHECK (sync_source IN ('notion', 'admin', 'api'));
    """)
    
    # 新增索引（在欄位存在後）
    await conn.execute("""
        CREATE INDEX IF NOT EXISTS idx_blog_posts_notion_page_id 
        ON blog_posts(notion_page_id);
    """)
    
    await conn.execute("""
        CREATE INDEX IF NOT EXISTS idx_blog_posts_sync_source 
        ON blog_posts(sync_source);
    """)
    
    await conn.execute("""
        CREATE INDEX IF NOT EXISTS idx_blog_posts_notion_last_edited 
        ON blog_posts(notion_last_edited_time DESC);
    """)
    
    logger.info("✅ Notion integration fields added to blog_posts")
else:
    logger.info("✅ Notion integration fields already exist in blog_posts")
```

---

## 📊 新增欄位說明

| 欄位名稱 | 類型 | 約束 | 說明 |
|---------|------|------|------|
| `notion_page_id` | VARCHAR(100) | UNIQUE | Notion page ID，用於識別和關聯文章 |
| `notion_last_edited_time` | TIMESTAMP | - | Notion 最後編輯時間，用於版本控制 |
| `sync_source` | VARCHAR(20) | CHECK | 文章來源：'notion', 'admin', 'api' |

---

## 🔍 索引說明

| 索引名稱 | 欄位 | 用途 |
|---------|------|------|
| `idx_blog_posts_notion_page_id` | notion_page_id | 快速查詢文章是否已同步 |
| `idx_blog_posts_sync_source` | sync_source | 篩選不同來源的文章 |
| `idx_blog_posts_notion_last_edited` | notion_last_edited_time DESC | 查詢最近同步的文章 |

---

## ✅ 符合專案標準

**遵循 `standards/DATABASE_ARCHITECTURE.md`**:

1. ✅ 所有變更在 `database.py` 中
2. ✅ 使用 `_add_new_columns()` 方法（已存在的標準方法）
3. ✅ 檢查欄位是否存在再添加
4. ✅ 使用 ALTER TABLE（不是 CREATE TABLE）
5. ✅ 索引在欄位存在後才創建
6. ✅ 冪等性保證（可重複執行）
7. ✅ 生產環境安全（不破壞現有資料）

---

## 🚀 執行方式

**無需手動執行 SQL！**

1. 編輯 `backend/app/core/database.py`
2. 在 `_add_new_columns()` 方法中添加上述代碼
3. 重啟 backend：
   ```bash
   cd backend
   ./run_dev.sh
   ```
4. 啟動時自動執行，檢查日誌：
   ```
   🔄 Adding Notion integration fields to blog_posts...
   ✅ Notion integration fields added to blog_posts
   ✅ Database initialized
   ```

---

## 🧪 驗證

**檢查欄位是否新增**：

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
AND column_name IN ('notion_page_id', 'sync_source', 'notion_last_edited_time')
ORDER BY column_name;
```

**應該看到**：
```
       column_name        |     data_type      | is_nullable 
--------------------------+--------------------+-------------
 notion_last_edited_time  | timestamp          | YES
 notion_page_id          | character varying  | YES
 sync_source             | character varying  | YES
```

---

**準備就緒！** 🎉

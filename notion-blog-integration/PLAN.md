# Notion Blog 整合計畫

## 📌 專案目標

將 VortixPR 的 Blog 系統與 Notion Database 整合，讓行銷團隊能在 Notion 中管理內容，自動同步到網站。

---

## 🏗️ 架構設計

### 核心原則

1. **Notion 作為 CMS**：行銷團隊在 Notion 編輯文章
2. **N8N 作為中間層**：監聽 Notion 變更，觸發同步
3. **PostgreSQL 保持效能**：前端仍從資料庫讀取（<100ms）
4. **事件驅動**：狀態改變時才同步，不浪費資源

### 資料流程

```
Notion Database (編輯內容)
    ↓
    狀態改為 "Published" / "Updated"
    ↓
N8N (每 1-2 分鐘輪詢)
    ↓
    偵測到狀態變更
    ↓
呼叫 Backend API (/api/admin/blog/sync-from-notion)
    ↓
PostgreSQL (儲存資料)
    ↓
前端顯示 (React)
```

---

## 🗄️ Notion Database 設計

### 現有資訊

- **Database 名稱**: Insights (Vortix PR)
- **Database ID**: `50c95bf23e7f839e838601aff3163c7f`
- **URL**: https://www.notion.so/50c95bf23e7f839e838601aff3163c7f

### 已設定好的欄位 ✅

| 欄位 | 類型 | 對應 blog_posts | 說明 |
|------|------|----------------|------|
| Title | title | title | 文章標題 |
| Pillar | select | category | 文章分類 |
| **Meta Description** | text | excerpt + meta_description | SEO 描述（同時用作網站摘要） |
| Author | text | author | 作者名稱 |
| Cover Image | file | image_url | 封面圖片 |
| Publish Date | date | published_at | 發布日期 |
| **Article URL** | url | - | **Backend 回傳**（文章完整連結） |
| tag | multi_select | - | 文章標籤 |
| Goal | select | - | 內容目標（內部用） |

### Content（文章內容）處理方式

**⚠️ 重要**：Content **不是欄位**，而是在 **Notion 頁面內容**中撰寫！

**流程**：
1. 行銷人員在 Notion 頁面中用 rich text 編輯器撰寫文章
2. N8N 讀取頁面內容（Notion blocks API）
3. 轉換 blocks 為 Markdown 或 HTML
4. 儲存到 `blog_posts.content` 欄位

### Status 狀態定義（關鍵！）

| Status | 顏色 | 說明 | N8N 動作 |
|--------|------|------|----------|
| Idea | 灰色 | 靈感階段 | 無動作 |
| Draft | 灰色 | 草稿 | 無動作 |
| Writing | 藍色 | 撰寫中 | 無動作 |
| Ready for Review | 紫色 | 待審核 | 可選：發 Telegram 通知 |
| Approved | 藍色 | 已批准 | 無動作 |
| Scheduled | 藍色 | 已排程 | Notion 自動化處理（時間到 → Publish） |
| **Publish** | **黃色** | **觸發發布** | **✅ 創建新文章 → 成功後改為 Published** |
| **Update** | **黃色** | **觸發更新** | **✅ 更新現有文章 → 成功後改為 Updated** |
| **Published** | **綠色** | **已發布** | 無動作（最終狀態） |
| **Updated** | **綠色** | **已更新** | 無動作（最終狀態） |
| **Archived** | **預設** | **已封存** | **✅ 標記為 archived** |

**⚠️ 重要邏輯**：
- **Publish** → N8N 創建文章 → 成功後 **N8N 自動將狀態改為 Published**
- **Update** → N8N 更新文章 → 成功後 **N8N 自動將狀態改為 Updated**
- **Scheduled** → 由 Notion 內建自動化處理（時間到自動改為 Publish）

---

## 🔧 Backend 實作

### 現有 blog_posts 表結構

**已有的欄位**（位於 `backend/app/core/database.py` 477-505行）：

```sql
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,              -- ← Notion 頁面內容會存這裡
    author VARCHAR(100) DEFAULT 'VortixPR Team',
    read_time INTEGER,
    image_url TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP
);
```

### 需要擴展的欄位

**在 database.py 中新增**（使用 ALTER TABLE）：

```sql
-- 新增 Notion 整合欄位
notion_page_id VARCHAR(100) UNIQUE        -- Notion page ID（關鍵！用於識別文章）
notion_last_edited_time TIMESTAMP         -- Notion 最後編輯時間
sync_source VARCHAR(20) DEFAULT 'admin'   -- 來源：'notion', 'admin', 'api'
```

**約束和索引**：
```sql
-- 唯一約束
UNIQUE (notion_page_id)

-- 檢查約束  
CHECK (sync_source IN ('notion', 'admin', 'api'))

-- 索引
CREATE INDEX idx_blog_posts_notion_page_id ON blog_posts(notion_page_id);
CREATE INDEX idx_blog_posts_sync_source ON blog_posts(sync_source);
```

### API Endpoint（Backend 處理轉換）

**新增同步端點**：

```python
POST /api/admin/blog/sync-from-notion

Headers:
  X-Notion-Webhook-Secret: {{$env.NOTION_WEBHOOK_SECRET}}
  Content-Type: application/json

Body (N8N 只需傳這些):
{
  "notion_page_id": "...",              // Notion page ID（關鍵！）
  "title": "...",                       // 從 Title 欄位
  "pillar": "PR Strategy",             // 從 Pillar 欄位
  "excerpt": "...",                     // 從 Excerpt 欄位
  "author": "VortixPR Team",           // 從 Author 欄位
  "cover_image_url": "...",            // 從 Cover Image
  "publish_date": "2026-01-29T..."     // 從 Publish Date 欄位
}

⚠️ 不需要傳 content！Backend 會自己去 Notion 取得並轉換！
```

**Backend 功能**：
1. 驗證 webhook secret
2. **用 notion-client SDK 取得 page blocks**
3. **轉換 blocks 為 HTML**（20 行代碼）
4. 檢查文章是否已存在（by notion_page_id）
5. 創建新文章或更新現有文章
6. 返回結果

**Response**：
```json
{
  "id": 123,
  "title": "...",
  "slug": "how-to-break-into-asian-crypto-media",
  "notion_page_id": "...",
  "_sync_action": "created"  // 或 "updated"
}
```

**N8N 收到成功後**：
- 將 Notion Status 改為 "Published" 或 "Updated"

---

## 🤖 N8N Workflow 設計

### 核心流程

```
1. Notion Trigger (Database Query)
   → 偵測 Status = "Publish" 或 "Update"
   → 取得 page ID、Title、Pillar、Excerpt 等欄位
   ↓
2. Get Page Blocks ⚠️ 必須用 HTTP Request！
   → N8N Notion node 無法取得 blocks
   → 必須用 HTTP Request: GET /v1/blocks/{page_id}/children
   → 取得頁面內容（blocks）
   ↓
3. Transform Blocks to HTML (Code node)
   → 轉換 Notion blocks 為 HTML
   → 整理所有欄位
   ↓
4. HTTP POST to Backend
   → 呼叫 Backend API
   → Headers: X-Notion-Webhook-Secret = {{$env.NOTION_WEBHOOK_SECRET}}
   ↓
5. Update Notion Status (HTTP Request to Notion)
   → 成功後將 Status 改為 "Published" 或 "Updated"
   ↓
6. Notification (可選)
   → 成功/失敗發 Telegram
```

**⚠️ 官方確認**: 根據 [Notion API 文件](https://developers.notion.com/reference/retrieve-a-page)，所有 Get Page API 只返回 properties，必須用 "Retrieve block children" API 才能取得內容。

**簡化方案**: 先在 Notion 新增 "Content" 欄位（Text），暫時用欄位存內容，可省略 Step 2-3。詳見 `N8N_GUIDE.md`。

**⚠️ 官方確認**: 根據 [Notion API 文件](https://developers.notion.com/reference/retrieve-a-page)，所有 Get Page API 只返回 properties，必須用 HTTP Request 呼叫 "Retrieve block children" API 才能取得內容。

**簡化方案**: 先在 Notion 新增 "Content" 欄位（Text），暫時用欄位存內容，可省略 blocks 轉換。詳見 `N8N_GUIDE.md`。

### 關鍵的 HTTP 調用

**Endpoint**: `POST {{$env.BACKEND_API_URL}}/api/admin/blog/sync-from-notion`

**Headers**（在 N8N HTTP Request node 中設定）:
```
X-Notion-Webhook-Secret: {{$env.NOTION_WEBHOOK_SECRET}}
Content-Type: application/json
```

**環境變數設定**：
- Backend: 在 `backend/.env` 中已設定 `NOTION_WEBHOOK_SECRET`
- N8N: 在 N8N 環境變數中設定相同的 `NOTION_WEBHOOK_SECRET`

**Request Body**（N8N 需要組裝）:
```json
{
  "notion_page_id": "{{從 Notion 取得的 page ID}}",
  "title": "{{Title 欄位}}",
  "content": "{{轉換後的 HTML}}",
  "category": "{{Pillar 欄位}}",
  "excerpt": "{{Excerpt 欄位}}",
  "author": "{{Author 欄位}}",
  "image_url": "{{Cover Image URL}}",
  "status": "published",
  "notion_last_edited_time": "{{last_edited_time}}",
  "published_at": "{{Publish Date 欄位}}"
}
```

**Response**（成功時）:
```json
{
  "id": 123,
  "title": "...",
  "slug": "how-to-break-into-asian-crypto-media",
  "notion_page_id": "...",
  "_sync_action": "created" // 或 "updated"
}
```

**N8N 收到成功 response 後**：
- 使用 Notion Update Page API
- 將文章的 Status 改為 "Published" 或 "Updated"

### 環境變數對應

**Backend (`backend/.env`)**:
```bash
NOTION_WEBHOOK_SECRET=<your-webhook-secret>
NOTION_API_KEY=<your-notion-integration-token>
NOTION_DATABASE_ID=50c95bf23e7f839e838601aff3163c7f
```

**N8N (環境變數設定)**:
```bash
NOTION_DATABASE_ID=50c95bf23e7f839e838601aff3163c7f
NOTION_WEBHOOK_SECRET=<same-as-backend>
BACKEND_API_URL=https://api.vortixpr.com
```

**在 N8N HTTP Request node 中引用**:
```
URL: {{$env.BACKEND_API_URL}}/api/admin/blog/sync-from-notion
Header: X-Notion-Webhook-Secret = {{$env.NOTION_WEBHOOK_SECRET}}
```

**（你很擅長 N8N，這部分細節你自己處理即可）**

---

## 📋 實施步驟

### Phase 1: Notion Database 準備

**任務**：
- [x] Notion Database 欄位設定完成（Title, Pillar, Author, Excerpt, Cover Image, Publish Date）
- [x] Status 欄位正確（Publish, Update, Published, Updated, Archived）
- [ ] 建立 Notion Integration
- [ ] 分享 Database 給 Integration
- [ ] 取得 Integration Token

### Phase 2: Backend 開發

**任務**：
- [ ] 安裝 Python SDK：在 `requirements.txt` 新增 `notion-client==2.7.0`
- [ ] 在 `database.py` 的 `_add_new_columns()` 方法中新增 Notion 欄位檢查
- [ ] 在 `blog.py` (models) 中新增 `NotionBlogSync` model（簡化版，不含 content）
- [ ] 在 `blog_admin.py` 中實作 `POST /api/admin/blog/sync-from-notion` endpoint
  - 包含 blocks 取得和轉換邏輯（參考 `BEST_SOLUTION.md`）
- [x] `.env` 設定完成（NOTION_WEBHOOK_SECRET, NOTION_API_KEY, NOTION_DATABASE_ID）
- [ ] 重啟 backend（`./run_dev.sh`）並驗證欄位已新增
- [ ] 測試 API endpoint（使用 `test_notion_sync.py`）

### Phase 3: N8N Workflow 設定

**任務**：
- [ ] 在 N8N 中建立 Notion API credential
- [ ] 建立 Workflow（根據實際需求逐步建立）
- [ ] 設定環境變數
- [ ] 測試 Workflow
- [ ] 啟用 Workflow

### Phase 4: 測試與驗證

**任務**：
- [ ] 在 Notion 中建立測試文章
- [ ] 設定狀態為 Published
- [ ] 確認 1-2 分鐘內同步成功
- [ ] 檢查 PostgreSQL 資料
- [ ] 檢查前端顯示
- [ ] 測試更新文章（Updated 狀態）
- [ ] 測試封存文章（Archived 狀態）

### Phase 5: 監控與優化

**任務**：
- [ ] 設定 N8N execution log 監控
- [ ] 設定錯誤通知（Telegram）
- [ ] 優化輪詢頻率（根據實際使用情況）
- [ ] 文件化操作流程給行銷團隊

---

## 🎯 成功指標

- ✅ 文章在 Notion 中改為 Published 後，1-2 分鐘內出現在網站
- ✅ 文章更新後能正確同步
- ✅ 封存文章後不再顯示
- ✅ 前端效能維持 <100ms
- ✅ 同步成功率 >99%

---

## ⚠️ 注意事項

### 1. 遵循專案標準

**重要**：參考 `standards/DATABASE_ARCHITECTURE.md`

- ✅ 所有資料庫變更在 `database.py` 中
- ✅ 使用 ALTER TABLE + 欄位檢查
- ❌ 不創建 migration 文件
- ❌ 不使用 Redis（專案沒有）

### 2. 正確的啟動方式

```bash
# ✅ 正確
cd backend
./run_dev.sh

# ❌ 錯誤
sudo systemctl restart vortixpr-backend
```

### 3. 資料安全

- 在 Notion 中編輯 = 權威資料來源
- PostgreSQL = 快取 + 效能
- 衝突處理：Notion 優先

---

## 🔍 故障排查

### 文章沒有同步？

**檢查清單**：
1. Notion 文章狀態是否為 Published/Updated？
2. N8N workflow 是否已啟用？
3. N8N execution log 是否有錯誤？
4. Backend 是否正常運行？
5. Webhook secret 是否正確？

### Backend 啟動失敗？

```bash
cd backend
./run_dev.sh

# 查看錯誤訊息
# 確認 .env 設定正確
# 確認 database.py 語法無誤
```

---

## 📁 相關文件

- `SETUP_GUIDE.md` - 詳細設定步驟
- `test_notion_sync.py` - API 測試腳本
- `standards/DATABASE_ARCHITECTURE.md` - 資料庫標準

---

## 📝 變更記錄

| 日期 | 版本 | 變更內容 |
|------|------|----------|
| 2026-01-29 | 1.0 | 初版計畫 |

---

**專案負責人**：Joey  
**技術支援**：AI Team  
**狀態**：Phase 1 - 準備階段

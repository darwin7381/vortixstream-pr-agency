# Notion Blog 整合

> Backend 自動同步 Notion Database 到 PostgreSQL

**狀態**: ✅ 已完成並測試通過

---

## 🎯 架構

```
Notion Database
  ↓ (行銷人員改狀態為 "Publish" / "Update" / "Archive")
N8N (Railway)
  ↓ (HTTP POST: 只傳 notion_page_id)
Backend API
  ↓ 讀取 Notion 頁面狀態
  ├─ Publish / Update → 取得 properties + blocks → 轉 HTML → 存 DB
  └─ Archive → 封存文章
  ↓ 後端自動更新 Notion 狀態（Processing... → Published / Archived）
  ↓ 後端自動回填 Article URL
PostgreSQL → 前端網站
```

**N8N 只需傳送**：
```json
{
  "notion_page_id": "{{ $json.id }}"
}
```

**N8N 不需要做**（後端自己處理）：
- ❌ 不需要 Processing Status 節點
- ❌ 不需要 Update database page 節點（更新狀態 / Article URL）
- ✅ 只需要：Trigger → Filter → HTTP → Telegram

---

## 📋 Notion Database 欄位

### 觸發用 Status 值

| 行銷人員設定 | 說明 | 系統完成後變為 |
|------------|------|-------------|
| `Publish` | 發布新文章 | `Published` |
| `Update` | 更新已發布文章 | `Published` |
| `Archive` | 封存文章（下架） | `Archived` |

> 以下為系統回寫的完成狀態，N8N Filter 不應觸發這些：
> `Published`, `Updated`, `Archived`, `Processing...`

### 必填欄位

| 欄位 | 類型 | 用途 |
|------|------|------|
| Title | title | 文章標題 |
| Pillar | select | 分類 |
| Meta Description | text | SEO 描述（150-160 字，同時用作網站摘要） |
| Status | select | 工作流程狀態（見上表） |

### 選填欄位

| 欄位 | 類型 | 用途 |
|------|------|------|
| Author | text | 作者（預設：VortixPR Team） |
| Cover Image | file | 封面圖 |
| Publish Date | date | 發布日期（預設：現在） |
| tag | multi_select | 文章標籤 |

### Backend 自動填寫

| 欄位 | 用途 |
|------|------|
| Article URL | 文章完整連結（Backend 同步完成後自動填入） |
| Status | 處理中 → Processing...，完成後 → Published / Archived |

### 內容撰寫

**在 Notion 頁面內容中撰寫文章**（不是欄位）
- 使用 Notion 的 rich text 編輯器
- 支援：標題、段落、列表、圖片、分隔線
- Backend 自動轉換為 HTML

---

## 🔧 Backend API

### Endpoint

```
POST https://api.vortixpr.com/api/admin/blog/sync-from-notion
```

### Headers

```
X-Notion-Webhook-Secret: <your-webhook-secret>
Content-Type: application/json
```

### Request Body

```json
{
  "notion_page_id": "01c95bf2-3e7f-8222-ba1d-01f4e4f334f9"
}
```

### Response

```json
{
  "id": 20,
  "title": "How to Break Into Asian Crypto Media...",
  "slug": "how-to-break-into-asian-crypto-media...",
  "notion_page_id": "01c95bf2-3e7f-8222-ba1d-01f4e4f334f9",
  "article_url": "https://vortixpr.com/blog/...",
  "_sync_action": "created"
}
```

**`_sync_action` 值**：
- `"created"` → 新文章（第一次 Publish）
- `"updated"` → 更新現有文章
- `"archived"` → 文章已封存

### Backend 自動處理的事

- ✅ 即時把 Notion 狀態改為 `Processing...`
- ✅ 取得所有 Notion properties（title, pillar, meta_description, author...）
- ✅ 取得頁面 blocks 並轉換為 HTML
- ✅ 下載所有圖片（Notion 臨時 URL + 外部圖片）並上傳到 Cloudflare R2（永久 URL）
- ✅ 自動計算 read_time
- ✅ 自動設定 meta_title（加品牌 `| VortixPR`）
- ✅ 完成後把 Notion 狀態改為 `Published` 或 `Archived`
- ✅ 完成後把 Article URL 填回 Notion

---

## 🤖 N8N 設定（最簡版本）

### Workflow 結構

```
1. Notion Trigger (Database)
2. Status Filter (Publish / Update / Archive)
3. HTTP Request (POST to Backend)  ← 只傳 notion_page_id
4. Switch (_sync_action)
   ├─ created  → Telegram 發佈通知
   ├─ updated  → Telegram 更新通知
   └─ archived → Telegram 封存通知
5. Telegram 錯誤通知（HTTP 失敗時）
```

**詳細設定參考**：
- HTTP 設定 → `N8N_HTTP_SETUP.md`
- Telegram 通知 → `TELEGRAM_NOTIFICATION.md`

**N8N 環境變數**：
```bash
BACKEND_API_URL=https://api.vortixpr.com
NOTION_WEBHOOK_SECRET=<same-as-backend>
NOTION_DATABASE_ID=50c95bf23e7f839e838601aff3163c7f
```

---

## ✅ 完成狀態

### Database
- ✅ 新增 Notion 欄位（notion_page_id, sync_source, notion_last_edited_time）
- ✅ 新增 tags JSONB 欄位
- ✅ 符合 DATABASE_ARCHITECTURE.md 標準

### API
- ✅ `POST /api/admin/blog/sync-from-notion`（Notion → Website，含 Archive）
- ✅ `PUT /api/admin/blog/posts/{id}`（Website → Notion 狀態同步）
- ✅ `DELETE /api/admin/blog/posts/{id}`（刪除 → Notion 設為 Archived）
- ✅ `POST /api/admin/blog/posts/{id}/export-to-notion`（手動匯出到 Notion）
- ✅ `GET /api/admin/blog/posts`（Admin 列表，含所有狀態）

### 測試
- ✅ Publish 流程：`_sync_action: created` ✅
- ✅ Update 流程：`_sync_action: updated` ✅
- ✅ Archive 流程：`_sync_action: archived` + Notion → `Archived` ✅

---

## 🧪 手動測試

```bash
# Publish / Update
curl -X POST "http://localhost:8000/api/admin/blog/sync-from-notion" \
  -H "X-Notion-Webhook-Secret: <your-secret>" \
  -H "Content-Type: application/json" \
  -d '{"notion_page_id": "01c95bf2-3e7f-8222-ba1d-01f4e4f334f9"}'

# Archive（頁面需先在 Notion 設為 Archive 狀態）
curl -X POST "http://localhost:8000/api/admin/blog/sync-from-notion" \
  -H "X-Notion-Webhook-Secret: <your-secret>" \
  -H "Content-Type: application/json" \
  -d '{"notion_page_id": "<archive-page-id>"}'
```

---

## 📁 文件說明

```
notion-blog-integration/
├── README.md                  # 本文件（總覽）
├── SYNC_DIRECTION.md          # 同步機制設計（單向 + 半雙向）
├── N8N_HTTP_SETUP.md          # N8N HTTP 設定
├── TELEGRAM_NOTIFICATION.md   # Telegram 四套通知範本
└── ARTICLE_EXAMPLE.md         # 文章範例
```

---

## 🎯 Notion 資訊

- **Database ID**: `50c95bf23e7f839e838601aff3163c7f`
- **URL**: https://www.notion.so/50c95bf23e7f839e838601aff3163c7f

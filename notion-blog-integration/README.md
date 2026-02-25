# Notion Blog 整合

> Backend 自動同步 Notion Database 到 PostgreSQL

**狀態**: ✅ 已完成並測試通過

---

## 🎯 架構

```
Notion Database
  ↓ (行銷人員改狀態為 "Publish")
N8N (Railway)
  ↓ (HTTP POST: 只傳 notion_page_id)
Backend API
  ↓ (自動取得 Notion properties 和 blocks)
  ↓ (轉換 blocks 為 HTML)
PostgreSQL
  ↓
前端網站
```

**N8N 只需傳送**：
```json
{
  "notion_page_id": "01c95bf2-3e7f-8222-ba1d-01f4e4f334f9"
}
```

**Backend 自動處理**：
- 取得所有 Notion properties（title, pillar, meta_description, author...）
- 取得頁面 blocks 並轉換為 HTML
- **下載所有圖片（Notion + 外部）並上傳到 Cloudflare R2（永久 URL）**
- 自動計算 read_time
- 自動設定 meta_title（加品牌）
- 回傳 article_url 和 _sync_action（created / updated）

---

## 📋 Notion Database 欄位

### 必填欄位

| 欄位 | 類型 | 用途 |
|------|------|------|
| Title | title | 文章標題 |
| Pillar | select | 分類（PR Strategy, Founder Branding, Asia PR, AI & Platform） |
| Meta Description | text | SEO 描述（150-160 字元，同時用作網站摘要） |
| Status | select | 工作流程狀態 |

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
| Article URL | 文章完整連結（Backend 回傳後 N8N 回填） |

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

### Request Body（超簡單！）

```json
{
  "notion_page_id": "01c95bf2-3e7f-8222-ba1d-01f4e4f334f9"
}
```

### Response

```json
{
  "id": 20,
  "title": "...",
  "slug": "...",
  "category": "...",
  "image_url": "https://img.vortixpr.com/blog-covers/...",
  "article_url": "https://vortixpr.com/blog/...",
  "_sync_action": "created"  // 或 "updated"
}
```

### 圖片處理

**所有圖片都會自動上傳到 Cloudflare R2**：
- ✅ Notion 圖片（會過期的臨時 URL）
- ✅ 外部圖片（Unsplash, 其他網站）
- ✅ 封面圖 → `blog-covers/` 資料夾
- ✅ 內容圖 → `blog-images/` 資料夾
- ✅ 支援格式：jpg, png, gif, webp
- ✅ 永久 URL，完全掌控

---

## 🤖 N8N 設定

### Workflow 結構

```
1. Notion Trigger (Database)
2. Filter (Status = "Publish" or "Update")
3. HTTP Request (POST to Backend)  ← 只傳 notion_page_id
4. Update Notion (Status + Article URL)
5A. Telegram - 發佈成功通知
5B. Telegram - 更新成功通知
6. Telegram - 錯誤通知
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

## ✅ Backend 已完成

### Database
- ✅ 新增 3 個 Notion 欄位（notion_page_id, sync_source, notion_last_edited_time）
- ✅ 約束和索引已設定
- ✅ 符合 DATABASE_ARCHITECTURE.md 標準

### API
- ✅ `/api/admin/blog/sync-from-notion` endpoint
- ✅ Notion SDK 整合（notion-client）
- ✅ Blocks 轉 HTML
- ✅ 圖片自動下載並上傳到 R2（Notion + 外部圖片）
- ✅ 自動處理：read_time, meta_title, excerpt, article_url, _sync_action

### Models
- ✅ NotionBlogSync（簡化，只需 page_id）
- ✅ BlogPost（包含 Notion 欄位）

### 測試
- ✅ 本地測試通過
- ✅ 創建和更新都成功

---

## 🧪 測試

### 本地測試

```bash
cd notion-blog-integration
./TEST_API.sh
```

### 手動測試

```bash
curl -X POST "http://localhost:8000/api/admin/blog/sync-from-notion" \
  -H "X-Notion-Webhook-Secret: <your-secret>" \
  -H "Content-Type: application/json" \
  -d '{"notion_page_id": "01c95bf2-3e7f-8222-ba1d-01f4e4f334f9"}'
```

---

## 📁 文件說明

```
notion-blog-integration/
├── README.md                  # 本文件（總覽）
├── SYNC_DIRECTION.md          # 同步機制設計（單向 + 半雙向）
├── N8N_HTTP_SETUP.md          # N8N HTTP 設定 + 測試指令
├── TELEGRAM_NOTIFICATION.md   # Telegram 三套通知範本
├── TEST_API.sh                # API 測試腳本
└── ARTICLE_EXAMPLE.md         # 文章範例
```

---

## 🎯 Notion 資訊

- **Database 名稱**: Insights (Vortix PR)
- **Database ID**: `50c95bf23e7f839e838601aff3163c7f`
- **URL**: https://www.notion.so/50c95bf23e7f839e838601aff3163c7f

---

## 🚀 下一步

### 生產環境設定

1. **Backend 已部署** ✅
2. **在 Railway N8N 設定 Workflow** ← 參考 `N8N_HTTP_SETUP.md`
3. **設定 Telegram 通知** ← 參考 `TELEGRAM_NOTIFICATION.md`
4. **測試完整流程**

---

**準備好使用了！** 🎉

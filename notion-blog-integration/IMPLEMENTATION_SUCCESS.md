# ✅ Notion Blog 整合實作成功！

## 🎉 測試結果

### 測試 1: 創建新文章 ✅

**測試資料**：
- Notion Page ID: `01c95bf2-3e7f-8222-ba1d-01f4e4f334f9`
- Title: "How to Break Into Asian Crypto Media (Korea, Japan, SEA)"
- Category: "Asia PR"

**結果**：
- ✅ 文章 ID: 17
- ✅ Slug: `how-to-break-into-asian-crypto-media-korea-japan-sea`
- ✅ sync_source: `notion`
- ✅ Content: 7810 字元（完整 HTML，包含 4 張圖片）
- ✅ _sync_action: `created`

### 測試 2: 更新文章 ✅

**測試資料**：
- 相同的 notion_page_id
- 更新標題、分類、作者

**結果**：
- ✅ 標題更新：【已更新】How to Break Into Asian Crypto Media
- ✅ 分類更新：PR Strategy
- ✅ 作者更新：VortixPR Team - Updated
- ✅ _sync_action: `updated`
- ✅ updated_at 正確更新

---

## ✅ 已完成的實作

### 1. Backend 代碼

**database.py** ✅
- 新增 `_add_notion_fields_to_blog_posts()` 檢查
- 在 `_add_new_columns()` 中執行
- 自動添加 3 個 Notion 欄位

**config.py** ✅
- 新增 Notion 環境變數定義

**blog.py (models)** ✅
- 新增 `NotionBlogSync` model

**blog_admin.py** ✅
- 新增 `POST /api/admin/blog/sync-from-notion` endpoint
- 實作 Notion blocks 取得和轉換
- 實作創建/更新邏輯
- 20 行轉換代碼

### 2. 依賴

**requirements.txt** ✅
- 新增 `notion-client==2.7.0`
- 已安裝

### 3. 測試

**TEST_API.sh** ✅
- 模擬 N8N HTTP 請求
- 測試創建、更新、錯誤處理
- 全部通過

---

## 🔧 Backend API 使用方式

### Endpoint

```
POST http://localhost:8000/api/admin/blog/sync-from-notion
```

### Headers

```
X-Notion-Webhook-Secret: <your-webhook-secret>
Content-Type: application/json
```

### Request Body（N8N 需要傳送）

```json
{
  "notion_page_id": "01c95bf2-3e7f-8222-ba1d-01f4e4f334f9",
  "title": "文章標題",
  "pillar": "PR Strategy",
  "meta_description": "SEO 描述（同時用作文章摘要）",
  "author": "VortixPR Team",
  "cover_image_url": "https://...",
  "publish_date": "2026-01-29T20:11:00.000Z"
}
```

**⚠️ 重要**: 不需要傳 `content`！Backend 會自動：
1. 用 `notion_page_id` 呼叫 Notion API
2. 取得頁面 blocks
3. 轉換為 HTML
4. 儲存到資料庫

### Response

```json
{
  "id": 17,
  "title": "...",
  "slug": "...",
  "category": "...",
  "content": "<h2>...</h2>...",
  "notion_page_id": "...",
  "sync_source": "notion",
  "_sync_action": "created"  // 或 "updated"
}
```

---

## 🤖 N8N Workflow 設定（簡化版）

### 完整流程（5 個 Nodes）

```
1. Notion Trigger (Database)
   ↓
2. IF (Filter)
   Status === 'Publish' || Status === 'Update'
   ↓
3. Set Variables
   {
     notion_page_id: {{ $json.id }},
     title: {{ $json.Title }},
     pillar: {{ $json.Pillar }},
     meta_description: {{ $json['Meta Description'] }},
     author: {{ $json.Author }},
     cover_image_url: {{ $json['Cover Image'][0]?.url }},
     publish_date: {{ $json['Publish Date'] }}
   }
   ↓
4. HTTP Request (POST to Backend)
   URL: {{$env.BACKEND_API_URL}}/api/admin/blog/sync-from-notion
   Headers: X-Notion-Webhook-Secret = {{$env.NOTION_WEBHOOK_SECRET}}
   Body: {{ $json }}
   ↓
5. HTTP Request (Update Notion Status)
   PATCH https://api.notion.com/v1/pages/{{$json.notion_page_id}}
   Body: { "properties": { "Status": { "select": { "name": "Published" } } } }
```

**詳細設定**: 參考 `N8N_HTTP_SETUP.md`

---

## 🎯 環境變數設定

### Backend (.env) ✅ 已設定

```bash
NOTION_WEBHOOK_SECRET=<your-webhook-secret>
NOTION_API_KEY=<your-notion-integration-token>
NOTION_DATABASE_ID=50c95bf23e7f839e838601aff3163c7f
```

### N8N (Railway) 待設定

```bash
BACKEND_API_URL=https://api.vortixpr.com  # 正式環境
NOTION_WEBHOOK_SECRET=<your-webhook-secret>
NOTION_DATABASE_ID=50c95bf23e7f839e838601aff3163c7f
```

**⚠️ 重要**: `NOTION_WEBHOOK_SECRET` 在 Backend 和 N8N 中必須完全相同！

---

## 📊 功能驗證

### ✅ 已驗證

- [x] Database 欄位正確添加（notion_page_id, sync_source, notion_last_edited_time）
- [x] Backend API 接收請求
- [x] Webhook secret 驗證
- [x] Notion API 調用成功
- [x] Blocks 轉換為 HTML
- [x] 創建新文章
- [x] 更新現有文章  
- [x] Slug 自動生成
- [x] 錯誤處理（403 for invalid secret）

### ⚠️ 待測試（生產環境）

- [ ] N8N Railway → Backend API 調用
- [ ] N8N 更新 Notion Status
- [ ] 完整的 Publish → Published 流程
- [ ] 完整的 Update → Updated 流程
- [ ] Telegram 通知設定

---

## 🚀 生產環境部署

### 1. Backend 部署

**已完成**：
- ✅ 代碼已實作
- ✅ 依賴已安裝
- ✅ .env 已設定

**部署到 Railway**：
- 推送代碼
- 確保 Railway 環境變數有 Notion 相關設定
- 重啟服務

### 2. N8N 設定

**參考**: `N8N_HTTP_SETUP.md`

**步驟**：
1. 在 Railway N8N 設定環境變數
2. 建立 Workflow（5 個 nodes）
3. 設定 HTTP Request node（參考文件）
4. 測試執行
5. 啟用 Workflow

---

## 📝 快速參考

### 測試指令（本地）

```bash
cd notion-blog-integration
./TEST_API.sh
```

### 檢查資料庫

```sql
SELECT id, title, category, sync_source, notion_page_id 
FROM blog_posts 
WHERE sync_source = 'notion';
```

### 清理測試資料

```sql
DELETE FROM blog_posts 
WHERE notion_page_id = '01c95bf2-3e7f-8222-ba1d-01f4e4f334f9';
```

---

## 🎓 技術總結

### 架構決策

**為何選擇 Backend 處理轉換？**

1. ✅ N8N workflow 簡單（5 nodes vs 8 nodes）
2. ✅ Python 代碼易維護（20 行 vs 50+ 行）
3. ✅ 官方 SDK 支援（notion-client）
4. ✅ 容易測試和 debug
5. ✅ 可擴展（未來加更多 block types）

### 資料流程

```
Notion → N8N (傳 page_id) → Backend (取得+轉換) → PostgreSQL
```

### 轉換支援

**目前支援的 block types**：
- heading_1, heading_2, heading_3
- paragraph
- bulleted_list_item, numbered_list_item
- image
- divider

**可以之後再加**：
- quote, code, callout
- table, toggle
- 等等

---

**實作完成！準備好部署到生產環境！** 🚀

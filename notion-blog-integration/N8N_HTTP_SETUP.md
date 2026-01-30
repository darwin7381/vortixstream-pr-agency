# N8N HTTP Request 設定指南

> N8N HTTP node 完整設定 + 本地測試指令

---

## 🧪 本地測試（在設定 N8N 之前先測試）

### 完整的 curl 命令（可直接複製）

```bash
# 測試創建新文章（模擬 N8N 的 HTTP POST）
# ⚠️ 超級簡單！只需要傳送 notion_page_id！

curl -X POST "http://localhost:8000/api/admin/blog/sync-from-notion" \
  -H "X-Notion-Webhook-Secret: <your-webhook-secret>" \
  -H "Content-Type: application/json" \
  -d '{
    "notion_page_id": "01c95bf2-3e7f-8222-ba1d-01f4e4f334f9"
  }' | python3 -m json.tool
```

**Backend 會自動**：
- 用 notion_page_id 取得所有 Notion properties
- 取得頁面 blocks 並轉換為 HTML
- 自動計算 read_time
- 自動設定 meta_title, excerpt
- 回傳完整文章資料

**成功的回應**（含自動處理）：
```json
{
  "id": 18,
  "slug": "how-to-break-into-asian-crypto-media-korea-japan-sea",
  "article_url": "http://localhost:3000/blog/...",  // ✅ 給 Notion 回填
  "excerpt": "The ultimate guide...",  // ✅ 自動用 meta_description
  "meta_title": "... | VortixPR",  // ✅ 自動加品牌
  "meta_description": "...",  // ✅ 從 Notion
  "read_time": 4,  // ✅ 自動計算
  "_sync_action": "created"
}
```

**成功的回應**：
```json
{
  "id": 17,
  "title": "How to Break Into Asian Crypto Media...",
  "slug": "how-to-break-into-asian-crypto-media-korea-japan-sea",
  "category": "Asia PR",
  "content": "<h2>...</h2>...",
  "sync_source": "notion",
  "_sync_action": "created"
}
```

### 測試更新文章

```bash
# 測試更新（相同的 notion_page_id，Backend 自動取得最新資訊）
curl -X POST "http://localhost:8000/api/admin/blog/sync-from-notion" \
  -H "X-Notion-Webhook-Secret: <your-webhook-secret>" \
  -H "Content-Type: application/json" \
  -d '{
    "notion_page_id": "01c95bf2-3e7f-8222-ba1d-01f4e4f334f9"
  }' | python3 -m json.tool | grep _sync_action
```

**應該返回**: `"_sync_action": "updated"`

### 測試錯誤的 Secret

```bash
# 應該返回 403
curl -X POST "http://localhost:8000/api/admin/blog/sync-from-notion" \
  -H "X-Notion-Webhook-Secret: wrong-secret" \
  -H "Content-Type: application/json" \
  -d '{"notion_page_id": "test", "title": "Test", "pillar": "Test"}'
```

**應該返回**: `{"detail":"Invalid webhook secret"}`

### 快速測試腳本

或者直接執行測試腳本：
```bash
cd notion-blog-integration
./TEST_API.sh
```

---

## 📝 N8N 在生產環境的設定

---

## 🎯 完整的 N8N Workflow

### Node 1: Notion Trigger

**Type**: Notion Trigger (Database)

**設定**:
- Database ID: `50c95bf23e7f839e838601aff3163c7f`
- Poll Interval: `60` seconds (1 分鐘)

---

### Node 2: IF (Filter)

**Type**: IF

**Condition**:
```
{{ $json.Status === 'Publish' || $json.Status === 'Update' }}
```

---

### Node 3: HTTP Request (POST to Backend)

**Type**: HTTP Request

#### 基本設定

**Method**: `POST`

**URL**: 
```
{{$env.BACKEND_API_URL}}/api/admin/blog/sync-from-notion
```

**環境變數**（在 N8N Railway 中設定）:
```bash
BACKEND_API_URL=https://你的正式API網址.com
# 或開發環境：http://localhost:8000
```

#### Authentication

**Type**: `None` (我們用自訂 Header 驗證)

#### Headers

**添加 2 個 Headers**:

1. **X-Notion-Webhook-Secret**
   ```
   Name: X-Notion-Webhook-Secret
   Value: {{$env.NOTION_WEBHOOK_SECRET}}
   ```

2. **Content-Type**
   ```
   Name: Content-Type
   Value: application/json
   ```

#### Body

**Send Body**: ✅ Yes

**Body Content Type**: `JSON`

**JSON**（超級簡單！）:
```json
{
  "notion_page_id": "{{ $json.id }}"
}
```

**就這樣！只需要一個欄位！**

**Backend 會自動**：
- ✅ 取得所有 Notion properties（title, pillar, meta_description, author, cover_image, publish_date, tags）
- ✅ 取得頁面 blocks 並轉換為 HTML
- ✅ 自動計算 read_time
- ✅ 自動設定 meta_title（加品牌）
- ✅ 自動設定 excerpt
- ✅ 回傳 article_url（給 Notion 回填）

#### Options

**Timeout**: `30000` ms (30 秒)

**Retry On Fail**: ✅ Yes
- Max Tries: `3`
- Wait Between Tries: `2000` ms

---

### Node 4: HTTP Request (Update Notion Status)

**Type**: HTTP Request

**條件**: 只在上一個 node 成功時執行

#### 基本設定

**Method**: `PATCH`

**URL**:
```
https://api.notion.com/v1/pages/{{ $json.notion_page_id }}
```

**⚠️ 注意**: 用上一步返回的 `notion_page_id`

#### Authentication

**Type**: `Predefined Credential Type`

**Credential Type**: `Notion API`

**Notion API Credential**: 選擇你的 Notion API credential

#### Headers

**添加 1 個 Header**:

**Notion-Version**
```
Name: Notion-Version
Value: 2022-06-28
```

#### Body

**Send Body**: ✅ Yes

**Body Content Type**: `JSON`

**JSON** (根據原始狀態決定):
```json
{
  "properties": {
    "Status": {
      "select": {
        "name": "{{ $('Notion Trigger').first().json.Status === 'Publish' ? 'Published' : 'Updated' }}"
      }
    }
  }
}
```

**說明**: 
- 如果原始狀態是 "Publish" → 改為 "Published"
- 如果原始狀態是 "Update" → 改為 "Updated"

---

### Node 6: Telegram Notification (可選)

**Type**: Telegram

**條件**: 上一步成功

**Chat ID**: 你的群組或私人 Chat ID

**Text**:
```
✅ *DEPLOYMENT SUCCESSFUL*

📝 Title: {{ $('HTTP Request').first().json.title }}
🔗 URL: {{ $('HTTP Request').first().json.article_url }}
📂 Category: {{ $('HTTP Request').first().json.category }}
⏱️ Read Time: {{ $('HTTP Request').first().json.read_time }} min
🎯 Action: {{ $('HTTP Request').first().json._sync_action }}

⚡ SUPERVISOR OUT.
```

**Parse Mode**: `Markdown`

---

## 🔧 環境變數設定

### Railway N8N 環境變數

在 Railway N8N 服務中設定：

```bash
# Backend API
BACKEND_API_URL=https://api.vortixpr.com
# 開發時用：http://localhost:8000

# Webhook Secret (與 Backend 相同)
NOTION_WEBHOOK_SECRET=<your-webhook-secret>

# Notion Database ID
NOTION_DATABASE_ID=50c95bf23e7f839e838601aff3163c7f
```

---

## ✅ 檢查清單

### 設定前

- [ ] Backend 已部署並運行
- [ ] Backend `.env` 有 `NOTION_WEBHOOK_SECRET`
- [ ] Notion Integration 已建立
- [ ] Database 已分享給 Integration

### 設定中

- [ ] N8N 環境變數已設定
- [ ] Notion API credential 已添加
- [ ] Workflow 已建立
- [ ] 所有 nodes 設定正確

### 設定後

- [ ] 測試執行 workflow（手動觸發）
- [ ] 檢查 execution log
- [ ] 檢查 Backend logs
- [ ] 檢查 PostgreSQL 資料
- [ ] 啟用 workflow

---

## 🧪 測試方式

### 1. 在 N8N UI 中手動測試

1. 打開 workflow
2. 點擊 "Execute Workflow"
3. 查看每個 node 的輸出
4. 確認沒有錯誤

### 2. 真實測試

1. 在 Notion 中建立測試文章
2. 設定狀態為 "Publish"
3. 等待 1-2 分鐘
4. 檢查：
   - N8N execution log
   - Backend logs
   - PostgreSQL
   - Notion（狀態應該變為 "Published"）

---

## 🚨 常見錯誤

### Error: 403 Forbidden

**原因**: Webhook secret 不正確

**檢查**:
- Backend `.env` 中的 `NOTION_WEBHOOK_SECRET`
- N8N 環境變數中的 `NOTION_WEBHOOK_SECRET`
- 兩者是否完全相同？

### Error: Connection refused

**原因**: Backend URL 不正確

**檢查**:
- Railway N8N 無法訪問 `localhost`
- 需要使用正式的 API URL（例如：`https://api.vortixpr.com`）

### Error: 500 Internal Server Error

**原因**: Backend 處理失敗

**檢查**:
- Backend logs（Railway 或本地）
- 可能是 Notion API token 無效
- 可能是 page_id 不正確

---

## 📝 快速複製（生產環境）

### HTTP Request Node 設定（快速複製）

```
URL: {{$env.BACKEND_API_URL}}/api/admin/blog/sync-from-notion

Headers:
  X-Notion-Webhook-Secret: {{$env.NOTION_WEBHOOK_SECRET}}
  Content-Type: application/json

Body:
{
  "notion_page_id": "{{ $json.id }}",
  "title": "{{ $json.Title }}",
  "pillar": "{{ $json.Pillar }}",
  "meta_description": "{{ $json['Meta Description'] || '' }}",
  "author": "{{ $json.Author || 'VortixPR Team' }}",
  "cover_image_url": "{{ $json['Cover Image'][0]?.url || '' }}",
  "publish_date": "{{ $json['Publish Date'] || '' }}"
}
```

---

## 🧪 測試 N8N Workflow（在生產環境）

### 測試前準備

1. 確認 Backend API 可訪問：
   ```bash
   curl https://api.vortixpr.com/health
   ```

2. 測試 sync endpoint（用你的正式 API URL）：
   ```bash
   curl -X POST "https://api.vortixpr.com/api/admin/blog/sync-from-notion" \
     -H "X-Notion-Webhook-Secret: <your-webhook-secret>" \
     -H "Content-Type: application/json" \
     -d '{
       "notion_page_id": "01c95bf2-3e7f-8222-ba1d-01f4e4f334f9",
       "title": "Test Article",
       "pillar": "PR Strategy",
       "author": "VortixPR Team"
     }' | jq '.'
   ```

### N8N 手動測試

1. 在 N8N UI 中點擊 "Execute Workflow"
2. 查看每個 node 的輸出
3. 確認沒有錯誤

### 真實測試

1. 在 Notion 建立測試文章
2. 狀態改為 "Publish"
3. 等待 1-2 分鐘
4. 檢查：
   - N8N execution log
   - Backend logs (Railway)
   - PostgreSQL
   - 前端網站

---

## 🔍 常見問題排查

### Backend 返回 403

**檢查**：
```bash
# 確認 Backend 的 secret
echo $NOTION_WEBHOOK_SECRET  # 應該顯示你的 secret

# 確認 N8N 的 secret
# 在 N8N UI → Settings → Environment Variables 檢查
```

### Backend 返回 500

**查看 Backend logs**：
```bash
# Railway 上
# Dashboard → Backend Service → Logs

# 本地
# 終端機輸出
```

### Notion API 錯誤

**可能原因**：
- Notion API token 過期或無效
- Page ID 不正確
- Integration 沒有存取權限

---

**設定完成後，啟用 workflow 即可！** 🎉

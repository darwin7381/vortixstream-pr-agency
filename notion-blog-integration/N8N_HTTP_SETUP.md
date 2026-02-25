# N8N HTTP 設定

> N8N 只傳送 notion_page_id，Backend 自動處理所有事情（含更新 Notion 狀態）

---

## ⚡ 關鍵重點

**N8N 只需要傳送**：
```json
{
  "notion_page_id": "{{ $json.id }}"
}
```

**不需要在 N8N 做的事**：
- ❌ 不需要 Processing Status 節點（Backend 收到即自動設定）
- ❌ 不需要 Update database page 節點（Backend 同步完成後自動更新 Notion 狀態 + Article URL）

---

## 📋 N8N Workflow 結構

```
1. Notion Trigger
2. Status Filter (Publish / Update / Archive)
3. HTTP Request (POST to Backend)
4. Switch (_sync_action: created / updated / archived)
   ├─ created  → Telegram 發佈通知
   ├─ updated  → Telegram 更新通知
   └─ archived → Telegram 封存通知
5. Telegram 錯誤通知（HTTP 失敗路徑）
```

---

### Node 1: Notion Trigger

- **Type**: Notion Trigger (Database)
- **Database ID**: `50c95bf23e7f839e838601aff3163c7f`
- **Poll Interval**: `60` seconds

---

### Node 2: Status Filter

篩選三個觸發狀態：

```
Status = "Publish" OR Status = "Update" OR Status = "Archive"
```

> 完成狀態（`Published`, `Updated`, `Archived`, `Processing...`）不會觸發，天然防止迴圈。

---

### Node 3: HTTP Request ← 核心

**Method**: `POST`

**URL**:
```
{{$env.BACKEND_API_URL}}/api/admin/blog/sync-from-notion
```

**Headers**:
```
X-Notion-Webhook-Secret: {{$env.NOTION_WEBHOOK_SECRET}}
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "notion_page_id": "{{ $json.id }}"
}
```

**Options**:
- Timeout: `120000` ms（圖片上傳需要時間）
- Retry On Fail: ✅ Max 2 tries

---

### Node 4: Switch（依 `_sync_action` 分流）

條件：`{{ $json._sync_action }}`

- `created` → Telegram 發佈通知
- `updated` → Telegram 更新通知
- `archived` → Telegram 封存通知

---

### Node 5: Telegram 通知

**詳細文案參考**: `TELEGRAM_NOTIFICATION.md`

---

## 🔧 N8N 環境變數

```bash
BACKEND_API_URL=https://api.vortixpr.com
NOTION_WEBHOOK_SECRET=<same-as-backend>
NOTION_DATABASE_ID=50c95bf23e7f839e838601aff3163c7f
```

---

## 📊 Backend 回應格式

### Publish / Update 成功

```json
{
  "id": 20,
  "title": "How to Break Into Asian Crypto Media...",
  "slug": "how-to-break-into-asian-crypto-media-korea-japan-sea",
  "category": "Asia PR",
  "read_time": 4,
  "image_url": "https://img.vortixpr.com/blog-covers/xxxxx.jpg",
  "notion_page_id": "01c95bf2-3e7f-8222-ba1d-01f4e4f334f9",
  "article_url": "https://vortixpr.com/blog/how-to-break-into-asian-crypto-media-korea-japan-sea",
  "_sync_action": "created"
}
```

### Archive 成功

```json
{
  "id": 27,
  "slug": "v2-how-to-build-credibility-before-token-launch-1",
  "notion_page_id": "2ff95bf2-3e7f-80cc-bdb7-ef6a59e6a9b4",
  "article_url": "https://vortixpr.com/blog/v2-how-to-build-credibility-before-token-launch-1",
  "_sync_action": "archived"
}
```

---

## 🧪 本地測試

```bash
# Publish / Update 測試
curl -X POST "http://localhost:8000/api/admin/blog/sync-from-notion" \
  -H "X-Notion-Webhook-Secret: <your-webhook-secret>" \
  -H "Content-Type: application/json" \
  -d '{"notion_page_id": "01c95bf2-3e7f-8222-ba1d-01f4e4f334f9"}'

# Archive 測試（頁面需先在 Notion 設為 Archive 狀態）
curl -X POST "http://localhost:8000/api/admin/blog/sync-from-notion" \
  -H "X-Notion-Webhook-Secret: <your-webhook-secret>" \
  -H "Content-Type: application/json" \
  -d '{"notion_page_id": "<page-id-with-archive-status>"}'
```

---

## 🚨 常見錯誤

### 403 Forbidden
→ Webhook secret 不一致，檢查 Backend `.env` 和 N8N 環境變數

### 404 Not Found（Archive 時）
→ 該 notion_page_id 在資料庫中找不到對應文章

### 500 Internal Server Error
→ 查看 Railway Backend logs

### Timeout
→ 正常現象（圖片上傳需要時間），Timeout 設為 120 秒

# N8N HTTP 設定

> N8N 只傳送一個欄位，Backend 自動處理所有事情

---

## ⚡ 關鍵重點

**N8N 只需要傳送**：
```json
{
  "notion_page_id": "{{ $json.id }}"
}
```

**Backend 會自動**：
- 取得所有 Notion properties
- 取得頁面 blocks 並轉換為 HTML
- 下載所有圖片（Notion + 外部）並上傳到 R2
- 計算 read_time、設定 meta_title
- 回傳 article_url 和 _sync_action

---

## 🧪 本地測試

### Curl 指令（直接複製）

```bash
curl -X POST "http://localhost:8000/api/admin/blog/sync-from-notion" \
  -H "X-Notion-Webhook-Secret: <your-webhook-secret>" \
  -H "Content-Type: application/json" \
  -d '{"notion_page_id": "01c95bf2-3e7f-8222-ba1d-01f4e4f334f9"}' \
  | python3 -m json.tool
```

### 成功回應

```json
{
  "id": 21,
  "title": "How to Break Into Asian Crypto Media...",
  "slug": "how-to-break-into-asian-crypto-media-korea-japan-sea",
  "category": "Asia PR",
  "image_url": "https://img.vortixpr.com/blog-covers/xxxxx.jpg",
  "article_url": "https://vortixpr.com/blog/how-to-break-into...",
  "read_time": 4,
  "_sync_action": "created"
}
```

**`_sync_action`**：
- `"created"` → 第一次發布（新文章）
- `"updated"` → 更新現有文章

---

## 📋 N8N Workflow 完整設定

### Workflow 結構

```
1. Notion Trigger
2. IF Filter (Status = Publish / Update)
3. HTTP Request (POST to Backend)  ← 核心
4. Update Notion (Status + Article URL)
5A. Telegram - 發佈通知 (created)
5B. Telegram - 更新通知 (updated)
6.  Telegram - 錯誤通知 (失敗)
```

---

### Node 1: Notion Trigger

- **Type**: Notion Trigger (Database)
- **Database ID**: `50c95bf23e7f839e838601aff3163c7f`
- **Poll Interval**: `60` seconds

---

### Node 2: IF Filter

- **Condition**: `{{ $json.Status === 'Publish' || $json.Status === 'Update' }}`

---

### Node 3: HTTP Request ← 最重要

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
- Timeout: `60000` ms（圖片上傳需要較長時間）
- Retry On Fail: ✅ Max 3 tries

---

### Node 4: Update Notion Status + Article URL

**Method**: `PATCH`

**URL**:
```
https://api.notion.com/v1/pages/{{ $('HTTP Request').first().json.notion_page_id }}
```

**Auth**: Notion API credential

**Headers**:
```
Notion-Version: 2022-06-28
```

**Body (JSON)**:
```json
{
  "properties": {
    "Status": {
      "select": {
        "name": "{{ $('Notion Trigger').first().json.Status === 'Publish' ? 'Published' : 'Updated' }}"
      }
    },
    "Article URL": {
      "url": "{{ $('HTTP Request').first().json.article_url }}"
    }
  }
}
```

---

### Nodes 5A / 5B / 6: Telegram 通知

**詳細設定參考**: `TELEGRAM_NOTIFICATION.md`

**三套通知**：
- **5A**: 發佈成功（`_sync_action === 'created'`）
- **5B**: 更新成功（`_sync_action === 'updated'`）
- **6**: 失敗（HTTP Request error）

---

## 🔧 N8N 環境變數

```bash
BACKEND_API_URL=https://api.vortixpr.com
NOTION_WEBHOOK_SECRET=<same-as-backend>
NOTION_DATABASE_ID=50c95bf23e7f839e838601aff3163c7f
```

---

## 🚨 常見錯誤

### 403 Forbidden
→ Webhook secret 不一致，檢查 Backend `.env` 和 N8N 環境變數

### 500 Internal Server Error
→ 查看 Railway Backend logs

### Timeout
→ 正常現象（圖片上傳需要時間），Timeout 設為 60 秒

### Notion API 錯誤
→ 確認 Integration token 有效且 Database 已分享給 Integration

---

**設定完成後啟用 Workflow！** ⚡

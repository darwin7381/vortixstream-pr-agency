# Notion Database 欄位對應表

> 最終確認版本（2026-01-30）

---

## 📋 完整欄位對應

| Notion 欄位 | 類型 | blog_posts 欄位 | 處理方式 | 說明 |
|------------|------|----------------|---------|------|
| **Title** | title | title | N8N → Backend | 文章標題 |
| **Meta Description** | text | excerpt + meta_description | N8N → Backend | SEO 描述，同時用作網站摘要 |
| **Pillar** | select | category | N8N → Backend | 文章分類 |
| **Author** | text | author | N8N → Backend | 作者名稱 |
| **Cover Image** | file | image_url | N8N → Backend | 封面圖片 URL |
| **Publish Date** | date | published_at | N8N → Backend | 發布日期 |
| **Status** | select | - | N8N 觸發條件 | 工作流程狀態 |
| **Article URL** | url | - | **Backend → Notion** | 文章完整 URL（Backend 回傳） |
| **tag** | multi_select | - | N8N → Backend | 文章標籤（未來可用） |
| **Goal** | select | - | Notion 內部用 | 內容目標（Traffic/Authority/Sales） |
| **頁面內容** | blocks | content | Backend 自動取得 | Notion 頁面 blocks → HTML |

---

## 🔄 N8N 傳送給 Backend（超級簡化！）

### Request Body

```json
{
  "notion_page_id": "01c95bf2-3e7f-8222-ba1d-01f4e4f334f9"
}
```

**就這樣！只需要一個欄位！**

**Backend 會自動去 Notion 取得**：
- ✅ 所有 page properties（title, pillar, meta_description, author, cover_image, publish_date, tags）
- ✅ 所有 page blocks（content）
- ✅ 並自動處理：read_time, meta_title, excerpt, article_url

---

## ↩️ Backend 回傳給 N8N

### Response Body

```json
{
  "id": 18,
  "title": "...",
  "slug": "how-to-break-into-asian-crypto-media",
  "category": "Asia PR",
  "excerpt": "The ultimate guide...",  // 自動用 meta_description
  "content": "<h2>...</h2>...",  // 自動轉換的 HTML
  "author": "VortixPR Team",
  "read_time": 4,  // 自動計算
  "meta_title": "... | VortixPR",  // 自動加品牌
  "meta_description": "...",
  "article_url": "http://localhost:3000/blog/...",  // ✅ 給 Notion 回填
  "_sync_action": "created"
}
```

---

## 🤖 N8N 需要做的事

### 1. 接收 Notion 資料 → 傳送給 Backend

```
{
  notion_page_id: {{ $json.id }},
  title: {{ $json.Title }},
  pillar: {{ $json.Pillar }},
  meta_description: {{ $json['Meta Description'] }},
  author: {{ $json.Author }},
  cover_image_url: {{ $json['Cover Image'][0]?.url }},
  publish_date: {{ $json['Publish Date'] }},
  tags: {{ $json.tag }}
}
```

### 2. 接收 Backend 回應 → 回填 Notion

**更新 Notion 的兩個欄位**：
```json
{
  "properties": {
    "Status": {
      "select": {
        "name": "Published"  // 或 "Updated"
      }
    },
    "Article URL": {
      "url": "{{ $('HTTP Request').first().json.article_url }}"
    }
  }
}
```

---

## ✨ Backend 自動處理

Backend 會自動處理以下欄位（不需要 Notion 提供）：

| 欄位 | 自動處理方式 |
|------|------------|
| **excerpt** | 用 `meta_description` |
| **read_time** | 計算內容長度（250 字/分鐘） |
| **meta_title** | `{title} \| VortixPR` |
| **slug** | 自動生成（slugify title） |
| **content** | 從 Notion 取得 blocks 並轉換為 HTML |
| **article_url** | `{FRONTEND_URL}/blog/{slug}` |

---

## 📝 Notion 欄位最終設定

### 必填欄位

- **Title** - 文章標題
- **Pillar** - 分類（PR Strategy, Founder Branding, Asia PR, AI & Platform）
- **Meta Description** - SEO 描述（150-160 字元，同時用作網站摘要）
- **Status** - 工作流程狀態

### 選填欄位

- **Author** - 作者（預設：VortixPR Team）
- **Cover Image** - 封面圖
- **Publish Date** - 發布日期（預設：現在）
- **tag** - 標籤（可選）

### Backend 自動填寫

- **Article URL** - 文章連結（Backend 回傳後 N8N 回填）

### 內部使用（不傳給 Backend）

- **Goal** - 內容目標（Traffic, Authority, Sales）

---

**文件更新完成！** ✅

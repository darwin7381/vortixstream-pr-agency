# Notion ↔ 網站 同步機制設計

---

## 核心原則

1. **Notion 是唯一的真相來源**（Source of Truth）
2. **兩個方向完全獨立，不會互相觸發**（天然避免無限循環）
3. **Website → Notion 由 Backend 直接呼叫 Notion API**，不經過 N8N
4. **Notion → Website 由 N8N 偵測觸發**，Backend 執行同步

---

## 方向一：Notion → 網站

**觸發者**：行銷人員在 Notion 手動改狀態

**觸發狀態**（行銷人員設定）：
- `Publish` → 發布新文章
- `Update` → 更新已發布的文章

**流程**：
```
行銷人員改 Status → Publish / Update
  ↓
N8N 偵測（每 60 秒輪詢）
  ↓
POST /api/admin/blog/sync-from-notion
  body: { "notion_page_id": "..." }
  ↓
Backend 取得 Notion properties + blocks
Backend 下載圖片上傳 R2
Backend 創建或更新 PostgreSQL
Backend 回傳 article_url + _sync_action
  ↓
N8N 回填 Notion：
  - Article URL
  - Status → "Published" 或 "Updated"
```

**觸發後 Notion 的最終狀態**：`Published` 或 `Updated`

---

## 方向二：網站 → Notion

**觸發者**：管理員在 Admin 後台操作

**觸發方式**：Admin 後台呼叫 API，Backend **直接呼叫 Notion API**，**完全不經過 N8N**

**狀態對應**：

| 網站操作 | 網站 status | Notion Status | 說明 |
|---------|------------|---------------|------|
| 重新發布 | `published` | `Published` | 把下架的文章重新上架 |
| 改為草稿 | `draft` | `Draft` | 暫時下架，保留內容 |
| 封存文章 | `archived` | `Archived` | 永久下架 |
| **刪除文章** | （刪除） | `Archived` | 網站刪除 → Notion 改封存（不刪除 Notion 原稿） |

**API**：
```
PUT /api/admin/blog/posts/{id}
body: { "status": "archived" }   // 或 "published" / "draft"

DELETE /api/admin/blog/posts/{id}
```

**條件**：
- 只有 `notion_page_id != NULL` 的文章才會同步到 Notion
- 沒有 `notion_page_id` 的文章（手動建立）直接操作，不呼叫 Notion

**失敗處理（問題 6）**：
- Notion 同步失敗 **不影響網站操作**（狀態已更新）
- API Response 會包含 `_notion_sync_warning` 欄位提示
- 管理員看到 warning 後可手動到 Notion 更新狀態
- **不自動回退網站狀態**（因為 Notion 可能只是暫時不可用）

```json
// 失敗時的 Response 範例
{
  "id": 22,
  "title": "...",
  "status": "archived",   // 網站狀態已更新
  "_notion_sync_warning": "文章狀態已更新為 archived，但 Notion 狀態同步失敗。請手動在 Notion 更新狀態，或稍後重試。"
}
```

---

## 為何不會無限循環？

這是最關鍵的設計點：

**兩個方向使用不同的狀態值**：

| 方向 | 觸發條件（N8N Filter） | 非觸發狀態（Backend 設定） |
|------|---------------------|----------------------|
| Notion → Website | `Publish`, `Update` | `Published`, `Updated` |
| Website → Notion | — | `Published`, `Draft`, `Archived` |

- **行銷人員設定**：`Publish`、`Update`（這些觸發 N8N）
- **系統設定**：`Published`、`Updated`、`Draft`、`Archived`（這些不觸發 N8N）

因此：
1. 行銷人員把 Notion 改為 `Publish` → N8N 觸發 → Backend 同步 → Backend 把 Notion 改回 `Published`
2. `Published` 不在 N8N Filter 中 → **不觸發**
3. 循環終止 ✅

同樣地，當管理員從網站把狀態改為 `published` → Backend 把 Notion 改為 `Published` → N8N 不觸發 ✅

---

## 認證保護（問題 5 的真正問題）

**背景**：blog_admin.py 之前所有端點都沒有 `Depends(require_admin)`，等於任何人不需要登入就能刪除文章。

**現已修正**：所有 Admin Blog 端點都加上 `Depends(require_admin)`：
- `GET /api/admin/blog/posts/by-id/{id}` ✅
- `POST /api/admin/blog/posts` ✅
- `PUT /api/admin/blog/posts/{id}` ✅
- `DELETE /api/admin/blog/posts/{id}` ✅

`POST /api/admin/blog/sync-from-notion` 使用 `X-Notion-Webhook-Secret` header 驗證（N8N 專用），不使用 JWT。

---

## 方向三：手動匯出到 Notion（已實作 ✅）

**對象**：`notion_page_id = NULL` 的文章（Admin 後台手動建立的舊文章）

**API**：
```
POST /api/admin/blog/posts/{id}/export-to-notion
```
需要 Admin JWT 認證。

**流程**：
1. 取得文章資料
2. 在 Notion Database 建立新 page
3. 填入欄位：Title, Pillar, Status, Meta Description, Author, Publish Date
4. 把文章內容（HTML → 純文字段落）填入頁面 blocks
5. 把 `notion_page_id` 寫回 `blog_posts`，`sync_source` 改為 `notion`

**分類自動對齊機制**：

Notion 的 `select` 欄位特性：傳入不存在的選項名稱時，Notion 會**自動新增**該選項。

因此：
- 網站有任何 category 值 → 直接傳入 Notion Pillar
- 如果 Notion 沒有該分類 → 自動新增（含隨機顏色）
- **兩邊的分類永遠保持對等**，不需要維護對應表

```python
# 直接使用 category 值，Notion 自動處理不存在的選項
pillar = post_dict.get("category", "PR Strategy") or "PR Strategy"
```

**注意事項**：
- 如果文章已有 `notion_page_id`，會返回 400 錯誤（不重複建立）
- 內容從 HTML 轉為純文字段落（行銷人員可在 Notion 重新排版）
- 匯出後即可用「Update」狀態觸發 N8N 重新同步（含圖片上傳 R2）

**Response 範例**：
```json
{
  "success": true,
  "post_id": 5,
  "notion_page_id": "31195bf2-3e7f-8122-8510-ef9fbf735b71",
  "notion_url": "https://www.notion.so/Crisis-PR-Management-...",
  "message": "已成功在 Notion 建立對應 card。"
}
```

**已測試**：
- `Crisis Management` 分類 → Notion 自動新增此 Pillar 選項 ✅
- `Media Strategy` 分類 → Notion 自動新增此 Pillar 選項 ✅

**匯出後建議工作流**：
```
匯出到 Notion → 行銷人員在 Notion 補充排版
→ 改 Status 為 "Update" → N8N 觸發
→ 網站重新同步（含重新下載圖片上傳 R2）
```

---

## 現有定時任務

**目前沒有任何 Cron**。

現有自動執行：
- 啟動時 `init_tables()`（DB schema 初始化）
- N8N polling 每 60 秒（Notion → Website 方向，在 N8N 設定）

---

## 完整雙向狀態流程圖

```
行銷人員
  │
  ▼
Notion Status → Publish ──────► N8N 偵測
                                   │
                                   ▼
              Website ◄─── Backend 同步（圖片上傳 R2）
                │               │
                │               ▼
                │         Notion Status ← Published
                │
                ▼
           管理員後台
                │
       ┌────────┼─────────┐
       ▼        ▼         ▼
    archived  draft    deleted
       │        │         │
       ▼        ▼         ▼
  Notion     Notion    Notion
 Archived    Draft    Archived
（網站同步）（網站同步）（網站刪除）
```

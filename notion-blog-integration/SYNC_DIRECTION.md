# Notion ↔ 網站 同步機制設計

---

## 狀態速覽表

### 方向一：Notion → 網站（行銷人員操作）

| Notion 狀態 | 觸發 N8N？ | 網站結果 | Notion 最終狀態 |
|------------|-----------|---------|----------------|
| `Publish` | ✅ | 建立或更新文章 | `Published` / `Updated` |
| `Update` | ✅ | 建立或更新文章 | `Published` / `Updated` |
| `Archive` | ✅ | 封存文章 | `Archived` |
| `Draft` | ❌ | 無操作 | 不變 |
| `Published` / `Updated` / `Archived` / `Processing...` | ❌ | 無操作（防止循環） | 不變 |

### 方向二：網站 → Notion（管理員操作）

| 網站操作 | 同步 Notion？ | Notion 最終狀態 |
|---------|-------------|----------------|
| 改為 `published` | ✅ | `Published` |
| 改為 `draft` | ✅ | `Draft` |
| 改為 `archived` | ✅ | `Archived` |
| 刪除文章 | ✅ | `Archived` |
| 無 `notion_page_id` 的文章（手動建立）| ❌ | 不同步 |

---

## 核心原則

1. **Notion 是唯一的真相來源**（Source of Truth）
2. **兩個方向完全獨立，不會互相觸發**（天然避免無限循環）
3. **Notion → Website 由 N8N 偵測觸發，Backend 執行所有操作**（含更新 Notion 狀態）
4. **Website → Notion 由 Backend 直接呼叫 Notion API**，不經過 N8N

---

## 方向一：Notion → 網站

**觸發者**：行銷人員在 Notion 手動改狀態

**觸發狀態**（行銷人員設定）：
- `Publish` → 發布新文章
- `Update` → 更新已發布的文章
- `Archive` → 封存文章（下架）

**流程**：
```
行銷人員改 Status → Publish / Update / Archive
  ↓
N8N 偵測（每 60 秒輪詢）
  ↓
Status Filter 放行
  ↓
POST /api/admin/blog/sync-from-notion
  body: { "notion_page_id": "..." }
  ↓
Backend 立即把 Notion 狀態改為 Processing...
  ↓
  ├─ Publish / Update：取得 properties + blocks，轉 HTML，存 DB
  └─ Archive：在 DB 封存文章（不讀取頁面內容）
  ↓
Backend 把 Notion 狀態改為 Published / Archived
Backend 把 Article URL 填回 Notion（Archive 時不更新）
  ↓
回傳 _sync_action 給 N8N
  ↓
N8N 根據 _sync_action 發送 Telegram 通知
```

**完整 Notion 狀態變化**：
```
Publish  → Processing... → Published   (_sync_action: created)
Update   → Processing... → Updated     (_sync_action: updated)
Archive  → Processing... → Archived    (_sync_action: archived)
```

**觸發後 N8N 的工作**：只發 Telegram 通知，不需要更新 Notion。

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

> ⚠️ **Draft 重要說明**：網站 → Notion 的 Draft 同步是有效的（Notion 會顯示 `Draft`）。
> 但 Notion 上把狀態改為 `Draft` **不會觸發任何操作**，因為 N8N Filter 不包含 `Draft`。
> Notion 的 `Draft` 純粹是顯示用——讓行銷人員知道「這篇在網站上是草稿狀態」。

**API**：
```
PUT /api/admin/blog/posts/{id}
body: { "status": "archived" }   // 或 "published" / "draft"

DELETE /api/admin/blog/posts/{id}
```

**條件**：
- 只有 `notion_page_id != NULL` 的文章才會同步到 Notion
- 沒有 `notion_page_id` 的文章（手動建立）直接操作，不呼叫 Notion

**失敗處理**：
- Notion 同步失敗**不影響網站操作**（狀態已更新）
- API Response 會包含 `_notion_sync_warning` 欄位提示
- 管理員看到 warning 後可手動到 Notion 更新狀態

---

## 方向三：手動匯出到 Notion

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
5. 把 `notion_page_id` 寫回 `blog_posts`

**分類自動對齊**：
Notion `select` 欄位傳入不存在的選項時，會自動新增。兩邊分類永遠對等，不需要維護對應表。

---

## 所有情境的預期結果

### Notion → 網站（方向一）

| 情境 | 觸發 | DB 狀況 | 網站結果 | Notion 最終狀態 | `_sync_action` |
|------|------|--------|---------|----------------|----------------|
| 新文章第一次發布 | `Publish` | 無對應文章 | 建立新文章 | `Published` | `created` |
| 已發布文章重新 Publish（誤用） | `Publish` | 已有對應文章 | 更新內容 | `Updated` | `updated` |
| 更新已發布文章 | `Update` | 已有對應文章 | 更新內容 | `Updated` | `updated` |
| 用 Update 觸發但文章不存在（誤用） | `Update` | 無對應文章 | 建立新文章 | `Published` | `created` |
| 封存已發布文章 | `Archive` | 已有對應文章 | 文章 archived | `Archived` | `archived` |
| 封存但 DB 無對應文章 | `Archive` | 無對應文章 | 無操作 | `Archived` | `archived` |
| 設為草稿 | `Draft` | 任何 | **無任何操作**（N8N Filter 不放行） | 不變 | — |

> **關鍵設計**：`Publish` vs `Update` 觸發在後端是完全一樣的路徑。
> 最終 Notion 狀態（`Published` vs `Updated`）是由**資料庫有無對應文章**決定，不是由觸發狀態決定。

---

### 網站 → Notion（方向二）

| 情境 | 網站操作 | 有 `notion_page_id`？ | 網站結果 | Notion 最終狀態 |
|------|---------|---------------------|---------|----------------|
| 重新上架文章 | 改 status → `published` | ✅ | 文章上線 | `Published` |
| 暫時下架 | 改 status → `draft` | ✅ | 文章下架 | `Draft` |
| 封存文章 | 改 status → `archived` | ✅ | 文章封存 | `Archived` |
| 刪除文章 | DELETE | ✅ | 文章從 DB 刪除 | `Archived` |
| 以上任何操作 | 任何 | ❌（手動建立的舊文章） | 網站正常操作 | **不更新 Notion** |
| Notion 同步失敗 | 任何 | ✅ | 網站操作**仍成功** | 可能未更新（附 `_notion_sync_warning`）|

> ⚠️ **Notion Draft 是顯示用的**：網站改為 draft 會同步到 Notion，但 Notion 上改為 `Draft` 不會觸發任何操作。

---

## 為何 Draft 不加入 Notion 觸發？

行銷人員從 Notion 設為 `Draft` 不會觸發任何操作，這是刻意的設計。

**根本原因：Draft 沒有乾淨的「完成狀態」**

其他三個觸發都有明確的觸發 / 完成狀態分工，讓系統天然不會循環：

| 觸發狀態 | 完成狀態 |
|---------|---------|
| `Publish` | `Published` |
| `Update` | `Updated` |
| `Archive` | `Archived` |
| `Draft` | `Draft`（和觸發狀態一樣！）|

若把 `Draft` 加入 N8N Filter，當管理員從**網站後台**把文章設為草稿時，Backend 會把 Notion 狀態改為 `Draft`。N8N 偵測到這個變化 → 觸發 → Backend 把網站設為 draft（已經是了）→ 把 Notion 設為 `Draft`（又觸發一次）→ 無限循環。

要解決這個問題，需要新增一個 `Drafted` 完成狀態。但這會：
1. 讓 Notion 的 Status 欄位多出一個奇怪的 `Drafted` 選項
2. 增加行銷人員的認知負擔
3. 讓整套狀態系統更難理解

**實際需求的替代方案**：
- 想暫時下架文章 → 管理員從網站後台直接操作（兩秒完成）
- 想永久下架 → 使用 `Archive`
- 想繼續編輯已發布文章 → 直接在 Notion 編輯內容，完成後設 `Update` 觸發同步

---

## 為何不會無限循環？

**兩個方向使用不同的狀態值**：

| 方向 | 觸發條件（N8N Filter） | 非觸發狀態（Backend 設定） |
|------|---------------------|----------------------|
| Notion → Website | `Publish`, `Update`, `Archive` | `Published`, `Updated`, `Archived`, `Processing...` |
| Website → Notion | — | `Published`, `Draft`, `Archived` |

- **行銷人員設定**：`Publish`、`Update`、`Archive`（這些觸發 N8N）
- **系統設定**：`Published`、`Archived`、`Draft`、`Processing...`（這些不觸發 N8N）

因此：
1. 行銷人員改 `Publish` → N8N 觸發 → Backend 同步 → Backend 把 Notion 改回 `Published`
2. `Published` 不在 N8N Filter → **不觸發** ✅

---

## 完整雙向狀態流程圖

```
行銷人員
  │
  ├─ Publish ──► N8N ──► Backend ──► DB(published)
  │                              └──► Notion: Published
  │
  ├─ Update ───► N8N ──► Backend ──► DB(更新內容)
  │                              └──► Notion: Updated
  │
  └─ Archive ──► N8N ──► Backend ──► DB(archived)
                                 └──► Notion: Archived

管理員後台
  │
  ├─ 改狀態(published/draft/archived) ──► Backend ──► Notion 同步
  └─ 刪除文章 ──────────────────────────► Backend ──► Notion: Archived
```

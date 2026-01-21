# CMS JSONB 架構標準

**版本：** 1.0  
**制定日期：** 2026-01-21  
**狀態：** ✅ 現行標準  
**適用範圍：** 所有未來 CMS Section 開發

---

## 📌 核心決策

### 為什麼選擇 JSONB？

**決策：** 所有新的 CMS Section 使用 JSONB 模式，不再使用表格分離模式

**理由：**

1. **現代主流做法**
   - 2024-2026 年 70% 新創公司的選擇
   - Linear, Notion, Cal.com 等都使用類似架構
   - 符合現代 Web 開發趨勢

2. **大幅減少代碼量**
   - 表格分離：每個 section 需要 8+ classes, 8+ endpoints
   - JSONB：所有 sections 共用 4 classes, 3 endpoints
   - **減少 60% 的 boilerplate 代碼**

3. **極高的靈活性**
   - 新增欄位：直接在 JSON 中加，無需 database migration
   - 調整結構：立即生效
   - 適合快速迭代的 AI 開發模式

4. **PostgreSQL JSONB 效能優秀**
   - 二進位格式，查詢快速
   - 支援 GIN 索引
   - 可查詢 JSON 內部欄位
   - 10 年成熟技術（2014 年推出）

---

## 🗄️ 架構設計

### 資料庫結構

**單一表管理所有 Sections：**

```sql
CREATE TABLE section_contents (
    id SERIAL PRIMARY KEY,
    section_key VARCHAR(100) UNIQUE NOT NULL,  -- 'services', 'lyro', 'publisher'
    content JSONB NOT NULL,                     -- 所有內容
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**索引策略：**
```sql
-- GIN 索引（重要！）
CREATE INDEX idx_section_content_gin 
ON section_contents USING GIN (content);

-- section_key 索引
CREATE INDEX idx_section_key 
ON section_contents (section_key);
```

---

## 🔍 GIN 索引完整說明

### 什麼是 GIN？

**GIN = Generalized Inverted Index（通用倒排索引）**

### 基本概念

**傳統索引（B-Tree）：**
```
適合：單一欄位查詢
範例：WHERE id = 5, WHERE email = 'test@example.com'
```

**GIN 索引：**
```
適合：複雜資料結構（JSONB, Array, 全文搜尋）
範例：WHERE content->>'title' = 'Services'
     WHERE content @> '{"label": "Services"}'
     WHERE tags && ARRAY['crypto', 'web3']
```

### 為什麼需要 GIN 索引？

**沒有 GIN 索引：**
- PostgreSQL 需要**逐行掃描**整個表
- 每一行都要解析 JSONB
- 10,000 筆資料可能需要 500ms+

**有 GIN 索引：**
- PostgreSQL 直接查詢索引
- 不需要掃描表
- 10,000 筆資料只需要 5-10ms

**效能提升：** 50-100 倍！

---

### GIN 索引的工作原理

**倒排索引（Inverted Index）概念：**

**原始資料：**
```json
Row 1: {"label": "Services", "title": "What We Offer"}
Row 2: {"label": "Publisher", "title": "For Publishers"}
Row 3: {"label": "Services", "title": "Our Services"}
```

**GIN 索引建立的映射：**
```
"Services" → [Row 1, Row 3]
"Publisher" → [Row 2]
"What We Offer" → [Row 1]
"For Publishers" → [Row 2]
"Our Services" → [Row 3]
```

**查詢時：**
```sql
WHERE content->>'label' = 'Services'

1. 查詢 GIN 索引："Services" → [Row 1, Row 3]
2. 直接返回 Row 1 和 Row 3
3. 不需要掃描其他 rows！
```

---

### 支援的查詢類型

**1. 鍵值查詢**
```sql
-- 查詢 label = 'Services'
WHERE content->>'label' = 'Services'
```

**2. 包含查詢（@>）**
```sql
-- 查詢包含特定鍵值對的文檔
WHERE content @> '{"label": "Services"}'
```

**3. 存在查詢（?）**
```sql
-- 查詢是否存在某個 key
WHERE content ? 'cta_primary'
```

**4. 陣列查詢**
```sql
-- 查詢陣列中的元素
WHERE content->'items' @> '[{"icon": "globe"}]'
```

---

### GIN 索引的成本

**優點：**
- ✅ 查詢速度極快
- ✅ 支援複雜查詢
- ✅ 適合讀取密集的應用

**缺點：**
- ⚠️ 索引體積較大（約為資料的 1.5-2 倍）
- ⚠️ 寫入速度較慢（需要更新索引）
- ⚠️ 更新 JSONB 時需要重建索引

**適用場景：**
- ✅ CMS 內容（讀多寫少）
- ✅ 配置資料
- ✅ 產品目錄

**不適用：**
- ❌ 高頻寫入的資料（如日誌、訊息）
- ❌ 經常全量更新的資料

---

## 🎯 JSONB vs 表格分離

### 效能比較

| 操作 | 表格分離 | JSONB (無索引) | JSONB (GIN 索引) |
|------|---------|---------------|-----------------|
| 讀取整個 Section | 2 次查詢 | 1 次查詢 ✅ | 1 次查詢 ✅ |
| 查詢特定欄位 | 0.1ms ✅ | 0.5ms | 0.2ms |
| 更新單一欄位 | 0.2ms | 0.8ms | 0.8ms |
| 新增欄位 | 需要 migration ❌ | 立即生效 ✅ | 立即生效 ✅ |
| 表數量 | N sections = 2N 表 | 1 表 ✅ | 1 表 ✅ |
| 代碼量 | 每個 section 重複 | 共用 ✅ | 共用 ✅ |

### 代碼量比較

**表格分離模式（每個 Section）：**
- Backend Models: 8 個 classes
- Backend APIs: 8 個 endpoints
- Frontend: 每個 section 獨立管理頁面
- **總計：** N sections = 16N classes + 16N endpoints

**JSONB 模式（所有 Sections 共用）：**
- Backend Models: 4 個 classes（所有 section 共用）
- Backend APIs: 3 個 endpoints（所有 section 共用）
- Frontend: 可使用通用組件
- **總計：** 4 classes + 3 endpoints（不論幾個 sections）

**代碼減少：** 60-80%

---

## ⚠️ 關鍵原則

### 1. 禁止 Fallback

**❌ 絕對禁止：**
```typescript
// 錯誤！會隱藏配置問題
onClick={onContactClick || defaultHandler}
url={sectionData?.url || '/default'}
```

**✅ 正確做法：**
```typescript
// 讓問題明顯，方便 debug
onClick={() => {
  const url = sectionData?.cta_primary?.url;
  if (!url) return;  // 沒有 URL 就什麼都不做
  // 處理 URL...
}}
```

**理由：**
- 配置錯誤時應該明顯表現（不執行動作）
- 不要用 fallback 掩蓋問題
- 方便行銷人員發現配置遺漏

---

### 2. 明確的資料結構

**定義清晰的 JSON Schema：**

```json
{
  "label": string,           // Section 小標
  "title": string,           // Section 主標題
  "description": string,     // Section 描述
  "cta_primary": {           // 主要 CTA
    "text": string,
    "url": string
  },
  "cta_secondary": {         // 次要 CTA（可選）
    "text": string,
    "url": string
  },
  "items": [                 // 列表項目
    {
      "id": number,
      "title": string,
      "description": string,
      "icon": string,
      "display_order": number
    }
  ]
}
```

**在文檔中明確定義，不要任意發揮！**

---

### 3. 資料驗證

**雖然 JSONB 靈活，但必須驗證：**

**Backend 驗證（Pydantic）：**
```python
# 可以選擇性地定義嚴格的 schema
class ServicesContentSchema(BaseModel):
    label: str
    title: str
    description: str
    cta_primary: CTASchema
    cta_secondary: Optional[CTASchema]
    items: List[ServiceItemSchema]
```

**或保持靈活（當前做法）：**
```python
class SectionContentUpdate(BaseModel):
    content: dict  # 任意結構，由前端驗證
```

**Frontend 驗證：**
- 在 Admin 表單中設定 required 欄位
- 提供清楚的 placeholder 說明格式

---

### 4. 查詢最佳實踐

**✅ 使用 GIN 索引的查詢：**
```sql
-- 高效查詢
WHERE content->>'label' = 'Services'
WHERE content @> '{"label": "Services"}'
WHERE content ? 'cta_primary'
```

**❌ 無法使用 GIN 的查詢：**
```sql
-- 這些查詢無法使用索引
WHERE content->>'title' LIKE '%Service%'  -- LIKE 查詢
WHERE (content->>'display_order')::int > 5  -- 型別轉換
```

---

## 📐 標準 JSONB 結構範本

### Section 基本結構

**所有 Section 應遵循的基本結構：**

```json
{
  // === 基本資訊 ===
  "label": "string",           // 小標（可選）
  "title": "string",           // 主標題（必填）
  "subtitle": "string",        // 副標題（可選）
  "description": "string",     // 描述（可選）
  
  // === CTA 按鈕 ===
  "cta_primary": {             // 主要 CTA（可選）
    "text": "string",
    "url": "string"            // 可以是 /page 或 #section
  },
  "cta_secondary": {           // 次要 CTA（可選）
    "text": "string",
    "url": "string"
  },
  
  // === 列表項目 ===
  "items": [                   // 如果有列表（可選）
    {
      "id": number,
      "title": "string",
      "description": "string",
      "display_order": number
      // ... 其他欄位視需求而定
    }
  ],
  
  // === 媒體資源 ===
  "background_image": "string",  // 背景圖（可選）
  "featured_image": "string"     // 特色圖（可選）
}
```

**原則：**
- 只定義真正需要的欄位
- 保持結構扁平（避免過度嵌套）
- 使用一致的命名慣例

---

## 🔧 實作標準

### Backend API 標準

**通用 API Endpoints：**

```python
# Public API（前台讀取）
GET /api/public/content/sections/{section_key}
→ 返回 content JSONB

# Admin API（後台管理）
GET /api/admin/content/sections/{section_key}
→ 返回完整資料（id, section_key, content, timestamps）

PUT /api/admin/content/sections/{section_key}
→ 更新 content JSONB

POST /api/admin/content/sections
→ 創建新 section
```

**所有 sections 共用這些 APIs！**

---

### Frontend 標準

**前台顯示組件：**

```typescript
const [sectionData, setSectionData] = useState<any>(null);

useEffect(() => {
  fetch(`${API_URL}/public/content/sections/{section_key}`)
    .then(r => r.json())
    .then(setSectionData);
}, []);

// 使用
<h2>{sectionData?.title}</h2>
<p>{sectionData?.description}</p>
```

**後台管理組件：**

```typescript
const handleSave = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  
  const updatedContent = {
    ...sectionData,
    label: formData.get('label'),
    title: formData.get('title'),
    // ... 其他欄位
  };
  
  await authenticatedPut(
    `${ADMIN_API}/content/sections/{section_key}`, 
    { content: updatedContent }
  );
  
  await fetchData();  // 先重新載入
  alert('Updated');    // 再提示
};
```

---

## ⚠️ 重要注意事項

### 1. asyncpg 返回的 JSONB 是字串

**問題：**
```python
row = await conn.fetchrow("SELECT content FROM section_contents ...")
# row['content'] 是 string，不是 dict！
```

**解決：**
```python
import json

content = row['content']
if isinstance(content, str):
    content = json.loads(content)

return content  # 現在是 dict
```

**所有 API 都要處理！**

---

### 2. React Form 的 defaultValue 問題

**問題：**
```typescript
// React 只在初次渲染時讀取 defaultValue
<input defaultValue={sectionData?.label} />

// 資料更新後不會重新渲染
```

**解決：**
```typescript
// 添加 key prop 強制重新渲染
<input 
  key={`label-${sectionData?.label}`}
  defaultValue={sectionData?.label} 
/>
```

---

### 3. 儲存順序很重要

**❌ 錯誤順序：**
```typescript
await saveAPI();
alert('Saved');
fetchData();  // 太晚了！
```

**✅ 正確順序：**
```typescript
await saveAPI();
await fetchData();  // 先重新載入
alert('Saved');      // 再提示
```

**理由：**
- fetchData 會更新 state
- state 更新會觸發 re-render
- re-render 配合 key prop 更新表單

---

### 4. 禁止 Fallback

**❌ 絕對禁止：**
```typescript
onClick={sectionData?.url || onDefaultClick}
text={sectionData?.title || 'Default Title'}
url={mobileUrl || desktopUrl}  // 使用 || 運算符
```

**✅ 正確做法：**
```typescript
onClick={() => {
  const url = sectionData?.url;
  if (!url) return;  // 沒有值就不執行
  // 處理...
}}

// 如果需要 fallback，明確檢查
url={mobileUrl && mobileUrl.trim() !== '' ? mobileUrl : desktopUrl}
```

**理由：**
- 配置問題應該明顯（不執行）
- 方便 debug
- 避免行銷人員困惑

---

## 🚀 新增 Section 的標準流程

### Step 1: 插入初始資料

```sql
INSERT INTO section_contents (section_key, content) VALUES
('new_section', '{
  "label": "New Section",
  "title": "Section Title",
  "description": "Description",
  "items": []
}'::jsonb);
```

### Step 2: 前端讀取

```typescript
fetch(`${API_URL}/public/content/sections/new_section`)
  .then(r => r.json())
  .then(setData);
```

### Step 3: Admin 管理

```typescript
<GenericSectionEditor sectionKey="new_section" />
// 或創建專門的編輯頁面
```

**就這樣！不需要：**
- ❌ 創建新表
- ❌ 寫 migration
- ❌ 創建新 models
- ❌ 創建新 APIs

---

## 📊 遷移策略

### 舊 Sections 處理

**現有的表格分離 Sections（lyro_section, hero_sections 等）：**

**選項 A：** 保持不動
- ✅ 如果運作良好，不需要遷移
- ✅ 可以與 JSONB 並存
- ⚠️ 但會有兩種模式並存

**選項 B：** 逐步遷移
- ✅ 一次遷移一個 section
- ✅ 降低風險
- ✅ 最終統一為 JSONB

**建議：** 選項 A（保持並存）
- 舊的如果沒問題就不動
- 新的全部用 JSONB
- 避免不必要的風險

---

### 新 Sections 處理

**所有新的 Section 必須使用 JSONB！**

**流程：**
1. 定義 JSON 結構（參考範本）
2. 插入初始資料到 `section_contents`
3. 前端使用通用 API
4. Admin 使用通用 API

**不允許創建新的獨立表！**

---

## 🛡️ 最佳實踐

### 1. 資料完整性

**雖然 JSONB 靈活，但要確保資料品質：**

- ✅ 在 Admin UI 設定必填欄位
- ✅ 提供清楚的 placeholder
- ✅ 前端驗證資料格式
- ✅ 定義並遵循 JSON Schema

### 2. 效能優化

**確保建立 GIN 索引：**
```sql
CREATE INDEX idx_section_content_gin 
ON section_contents USING GIN (content);
```

**查詢優化：**
- 優先使用 `->>`（提取文字）
- 使用 `@>` 進行包含查詢
- 避免 LIKE 和型別轉換

### 3. 版本控制

**JSONB 沒有內建版本控制：**

**選項 A：** 應用層實現
```json
{
  "version": 2,
  "updated_by": "user_id",
  "updated_at": "timestamp",
  "content": {...}
}
```

**選項 B：** 使用 updated_at 時間戳（當前做法）

**選項 C：** 不做版本控制（適合簡單 CMS）

---

## 📋 檢查清單

### 新增 JSONB Section 時必須檢查：

**Backend：**
- [ ] 資料已插入 `section_contents` 表
- [ ] GIN 索引已建立
- [ ] Public API 返回正確 JSON（不是字串）
- [ ] Admin API 需要認證
- [ ] PUT API 正確更新資料

**Frontend：**
- [ ] 使用 `/sections/{section_key}` API
- [ ] 沒有 fallback 邏輯
- [ ] CTA 按鈕使用 JSONB 中的 URL
- [ ] React form 添加 key prop
- [ ] 儲存後先 fetchData 再 alert

**測試：**
- [ ] 後端 API 測試通過（用 curl + token）
- [ ] 資料庫儲存驗證
- [ ] 前台顯示測試
- [ ] 後台編輯測試
- [ ] 重新整理後資料保持

---

## 🎓 技術要點總結

### JSONB 的本質

**不是：**
- ❌ NoSQL 資料庫
- ❌ 文件資料庫
- ❌ Key-Value 存儲

**是：**
- ✅ PostgreSQL 的一個**欄位型別**
- ✅ 在關聯式資料庫中存 JSON
- ✅ 結合 SQL 和 NoSQL 的優點

### GIN 索引的本質

**GIN = Generalized Inverted Index**

**倒排索引的概念：**
- 傳統索引：Row ID → Data
- 倒排索引：Data → Row IDs

**為什麼叫「倒排」：**
- 傳統：用 ID 找資料
- 倒排：用資料找 IDs（顛倒過來）

**為什麼叫「通用」（Generalized）：**
- 不只支援 JSONB
- 也支援 Array, 全文搜尋, hstore 等
- 通用的倒排索引實現

---

## 💡 何時使用 JSONB？

### ✅ 適合使用 JSONB

1. **CMS 內容管理**
   - 讀多寫少
   - 結構會變動
   - 需要靈活性

2. **配置資料**
   - 系統設定
   - 用戶偏好
   - Feature Flags

3. **產品屬性**
   - 電商產品的可變屬性
   - 不同產品有不同欄位

4. **事件日誌（Metadata）**
   - 事件的附加資訊
   - 每種事件欄位不同

### ❌ 不適合使用 JSONB

1. **核心業務資料**
   - 用戶、訂單、付款
   - 需要強型別檢查
   - 需要嚴格的關聯性

2. **高頻寫入資料**
   - 即時訊息
   - 日誌記錄
   - 統計數據

3. **複雜關聯查詢**
   - 需要多表 JOIN
   - 需要複雜的聚合查詢

---

## 🎯 總結

### 我們的決策

**CMS Section 全面採用 JSONB 模式**

**原因：**
1. ✅ 符合現代趨勢（70% 市場佔有率）
2. ✅ 大幅減少代碼（60-80%）
3. ✅ 提升開發速度
4. ✅ 適合 AI 輔助開發
5. ✅ PostgreSQL JSONB 成熟穩定
6. ✅ GIN 索引效能優秀

**禁止：**
- ❌ 新增獨立的 Section 表
- ❌ 使用 Fallback 邏輯
- ❌ 保留 deprecated APIs

**強制：**
- ✅ 所有新 Sections 使用 JSONB
- ✅ 明確的 JSON 結構
- ✅ 建立 GIN 索引
- ✅ 遵循本文檔標準

---

**此標準適用於所有未來專案的 CMS 開發。**

**最後更新：** 2026-01-21  
**維護者：** AI Team  
**參考實現：** Services Section（首個 JSONB Section）


# 開發經驗教訓與最佳實踐

## 🚨 常見錯誤與解決方案

### 1. 前後端命名規範不一致

#### 問題描述
前端（TypeScript）使用 **camelCase**，後端（Python）使用 **snake_case**，導致：
- API 返回的欄位名稱前端無法直接使用
- 需要在 API 層進行轉換
- 容易遺漏轉換某些欄位

#### 具體案例
```typescript
// 前端期望（TypeScript）
interface PRPackage {
  guaranteedPublications: number;  // camelCase
  mediaLogos: MediaLogo[];         // camelCase
  detailedInfo: {
    ctaText: string;               // camelCase
  }
}
```

```python
# 後端資料庫（PostgreSQL + Python）
CREATE TABLE pr_packages (
    guaranteed_publications INTEGER,  # snake_case
    media_logos JSONB,                # snake_case
    detailed_info JSONB               # snake_case
)
```

#### 解決方案

**方案 A: API 層轉換（當前採用）**
```python
# 在 API 返回時轉換
frontend_package = {
    "guaranteedPublications": db_row['guaranteed_publications'],
    "mediaLogos": db_row['media_logos'],
    "detailedInfo": {
        "ctaText": db_row['detailed_info']['cta_text']
    }
}
```

**方案 B: 使用專用的 Frontend Models（推薦）**
```python
# backend/app/models/pr_package_frontend.py
class PRPackageFrontend(BaseModel):
    """前端專用格式"""
    guaranteedPublications: Optional[int] = None
    mediaLogos: Optional[List[MediaLogo]] = None
    detailedInfo: Optional[DetailedInfo] = None
```

**方案 C: Pydantic alias（最優雅）**
```python
class PRPackage(BaseModel):
    guaranteed_publications: int = Field(alias="guaranteedPublications")
    media_logos: List = Field(alias="mediaLogos")
    
    class Config:
        populate_by_name = True  # 允許兩種名稱
```

#### 最佳實踐
1. ✅ 為前端創建專用的 response models
2. ✅ 在 API 文件中明確標註欄位名稱
3. ✅ 使用 TypeScript 自動生成工具（如需要）
4. ✅ 在文件中記錄所有欄位對應關係

---

### 2. JSONB 欄位處理不當

#### 問題描述
PostgreSQL JSONB 欄位在 asyncpg 中可能返回：
- 字串（需手動解析）
- Python dict（已自動解析）

#### 具體案例
```python
# 錯誤：假設 asyncpg 會自動解析
row = await conn.fetchrow("SELECT features FROM pricing_packages")
return row['features']  # 可能是字串 "['item1', 'item2']"

# 正確：明確處理
features = row['features']
if isinstance(features, str):
    features = json.loads(features)
return features
```

#### 解決方案
```python
# 統一的 JSONB 處理函數
def parse_jsonb_field(value):
    """安全解析 JSONB 欄位"""
    if value is None:
        return None
    if isinstance(value, str):
        return json.loads(value)
    return value

# 使用
package_dict['features'] = parse_jsonb_field(package_dict['features'])
```

#### 最佳實踐
1. ✅ 所有 JSONB 欄位都明確檢查型別
2. ✅ 使用統一的解析函數
3. ✅ 插入時使用 `$1::jsonb` 明確指定型別
4. ✅ 測試時驗證返回的資料型別

---

### 3. 資料導入不完整

#### 問題描述
從前端常數檔案導入資料時：
- 沒有仔細核對所有欄位
- 只導入部分資料（5/8）
- 沒有驗證導入的資料完整性

#### 具體案例
```python
# 錯誤：只導入部分 packages
PR_PACKAGES = [
    # ... 只有 5 個
]

# 正確：導入所有 packages
# 1. 先計算前端有多少個
# 2. 確保全部導入
# 3. 驗證數量和內容
```

#### 解決方案
```python
# 1. 使用自動化腳本從前端資料生成
# 2. 導入後立即驗證
async def verify_import():
    count = await conn.fetchval("SELECT COUNT(*) FROM pr_packages")
    assert count == 8, f"Expected 8 packages, got {count}"
    
    # 驗證每個分類
    categories = await conn.fetch("""
        SELECT category_id, COUNT(*) 
        FROM pr_packages 
        GROUP BY category_id
    """)
    expected = {'global-pr': 3, 'asia-packages': 3, 'founder-pr': 2}
    for cat in categories:
        assert cat['count'] == expected[cat['category_id']]
```

#### 最佳實踐
1. ✅ 導入前先計算預期的資料量
2. ✅ 導入後立即驗證數量和結構
3. ✅ 對比前端資料和後端資料的每個欄位
4. ✅ 使用自動化測試確保資料完整性

---

### 4. API Response Model 錯誤

#### 問題描述
定義的 response_model 包含後端專用欄位，導致：
- FastAPI 驗證失敗
- 返回 500 錯誤
- 需要的欄位缺失

#### 具體案例
```python
# 錯誤：使用後端 model 作為 response
@router.get("/", response_model=List[PRPackageCategory])
# PRPackageCategory 包含 id, slug, status, created_at 等後端欄位
# 但返回的資料只有前端需要的欄位 → 驗證失敗

# 正確：使用前端專用 model
@router.get("/", response_model=List[PRPackageCategoryFrontend])
# PRPackageCategoryFrontend 只包含前端需要的欄位
```

#### 解決方案
```python
# backend/app/models/pr_package_frontend.py
# 創建前端專用的 models
class PRPackageFrontend(BaseModel):
    """只包含前端需要的欄位"""
    id: str  # 對應 slug
    name: str
    price: str
    # ... 只有前端需要的欄位

# 在 API 中轉換
def to_frontend_format(db_row):
    return {
        "id": db_row['slug'],
        "name": db_row['name'],
        # ... 轉換所有欄位
    }
```

#### 最佳實踐
1. ✅ 區分 Database Models, API Models, Frontend Models
2. ✅ 在 API 層明確轉換格式
3. ✅ 測試 API 回應是否符合前端期望
4. ✅ 使用 TypeScript 定義驗證 API 回應

---

## 📋 API 路徑設計與快取策略

### API 分類原則

基於 Cloudflare 快取政策，API 應該按照資料性質分類：

#### 1. `/api/public/` - 公開資料（可大量快取）

**特性：**
- ✅ 所有人看到的內容相同
- ✅ 變動頻率低
- ✅ 不需要認證
- ✅ 可以長時間快取（1 小時 - 24 小時）

**適用 API：**
```
GET /api/public/blog/posts             # Blog 文章列表
GET /api/public/blog/posts/{slug}      # 單篇文章
GET /api/public/blog/categories        # 文章分類
GET /api/public/pricing/packages       # 定價方案
GET /api/public/pr-packages/           # PR Packages
```

**Cloudflare 快取設定：**
```
Cache-Control: public, max-age=3600, s-maxage=7200
```

---

#### 2. `/api/private/` - 個人化資料（不快取或短時快取）

**特性：**
- ⚠️ 每個使用者看到的不同
- ⚠️ 需要認證
- ⚠️ 包含個人資訊
- ⚠️ 不能快取或僅短時快取（60 秒）

**適用 API：**
```
GET /api/private/user/profile          # 使用者個人資料
GET /api/private/user/subscriptions    # 使用者訂閱
GET /api/private/analytics/dashboard   # 個人儀表板
```

**Cloudflare 快取設定：**
```
Cache-Control: private, no-cache
或
Cache-Control: private, max-age=60
```

---

#### 3. `/api/write/` - 寫入操作（絕對不快取）

**特性：**
- ❌ POST/PUT/DELETE 操作
- ❌ 改變資料狀態
- ❌ 可能需要認證
- ❌ 絕對不能快取

**適用 API：**
```
POST /api/write/contact/submit         # 聯絡表單提交
POST /api/write/newsletter/subscribe   # Newsletter 訂閱
POST /api/write/blog/posts             # 創建文章（需認證）
PUT  /api/write/blog/posts/{id}        # 更新文章（需認證）
DELETE /api/write/blog/posts/{id}      # 刪除文章（需認證）
```

**Cloudflare 快取設定：**
```
Cache-Control: no-store, no-cache, must-revalidate
```

---

#### 4. `/api/admin/` - 管理操作（需認證，不快取）

**特性：**
- 🔐 需要管理員認證
- ❌ 絕對不快取
- ⚠️ 敏感操作

**適用 API：**
```
GET  /api/admin/contact/submissions    # 查看聯絡表單
GET  /api/admin/newsletter/subscribers # 查看訂閱者
PUT  /api/admin/blog/posts/{id}/status # 更新文章狀態
```

**Cloudflare 快取設定：**
```
Cache-Control: private, no-store
```

---

### 當前 API 分類建議

#### Public (可快取 1-24 小時)
```
✅ GET /api/public/blog/posts
✅ GET /api/public/blog/posts/{slug}
✅ GET /api/public/blog/categories
✅ GET /api/public/pricing/packages
✅ GET /api/public/pricing/packages/{slug}
✅ GET /api/public/pr-packages/
✅ GET /api/public/pr-packages/{slug}
```

#### Write (絕不快取)
```
✅ POST /api/write/contact/submit
✅ POST /api/write/newsletter/subscribe
✅ POST /api/write/newsletter/unsubscribe
✅ POST /api/write/publisher/apply
```

#### Admin (需認證，不快取)
```
✅ GET  /api/admin/contact/submissions
✅ GET  /api/admin/newsletter/subscribers
✅ POST /api/admin/blog/posts
✅ PUT  /api/admin/blog/posts/{id}
✅ DELETE /api/admin/blog/posts/{id}
✅ POST /api/admin/pricing/packages
✅ PUT  /api/admin/pricing/packages/{id}
```

---

### Cloudflare Workers 快取實作範例

```javascript
// Cloudflare Worker
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Public API - 長時間快取
    if (url.pathname.startsWith('/api/public/')) {
      const cache = caches.default;
      let response = await cache.match(request);
      
      if (!response) {
        response = await fetch(request);
        // 快取 1 小時
        response = new Response(response.body, {
          ...response,
          headers: {
            ...response.headers,
            'Cache-Control': 'public, max-age=3600, s-maxage=7200',
            'CDN-Cache-Control': 'max-age=7200'
          }
        });
        await cache.put(request, response.clone());
      }
      
      return response;
    }
    
    // Write API - 不快取
    if (url.pathname.startsWith('/api/write/')) {
      const response = await fetch(request);
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return response;
    }
    
    // Admin API - 不快取 + 檢查認證
    if (url.pathname.startsWith('/api/admin/')) {
      // 檢查認證
      const token = request.headers.get('Authorization');
      if (!token) {
        return new Response('Unauthorized', { status: 401 });
      }
      
      const response = await fetch(request);
      response.headers.set('Cache-Control', 'private, no-store');
      return response;
    }
    
    return fetch(request);
  }
};
```

---

### 快取策略總結表

| API 類型 | 路徑 | 快取時間 | Cloudflare 設定 | 用途 |
|---------|------|---------|----------------|------|
| **Public** | `/api/public/` | 1-24 小時 | `max-age=3600` | Blog, Pricing 等公開內容 |
| **Private** | `/api/private/` | 0-60 秒 | `private, max-age=60` | 使用者個人資料 |
| **Write** | `/api/write/` | 不快取 | `no-store` | 表單提交、訂閱 |
| **Admin** | `/api/admin/` | 不快取 | `private, no-store` | 管理操作 |

---

### 實施步驟

1. **重構 API 路由**
```python
# 舊的
app.include_router(blog.router, prefix="/api")

# 新的
app.include_router(blog_public.router, prefix="/api/public")
app.include_router(blog_admin.router, prefix="/api/admin")
```

2. **更新前端 API Client**
```typescript
const API_BASE_URL = 'http://localhost:8000/api';

export const blogAPI = {
  // Public APIs
  getPosts: () => fetch(`${API_BASE_URL}/public/blog/posts`),
  
  // Admin APIs (需認證)
  createPost: (data, token) => 
    fetch(`${API_BASE_URL}/admin/blog/posts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
};
```

3. **部署 Cloudflare Workers**
```bash
# 在 Cloudflare Pages 設定中加入 Worker
wrangler deploy
```

---

## 🎯 檢查清單（每次開發新 API 時）

### 資料導入階段
- [ ] 仔細閱讀前端資料結構的**所有欄位**
- [ ] 計算前端資料的確切數量
- [ ] 逐一對照每個欄位名稱
- [ ] 特別注意嵌套結構（如 detailedInfo.sections）
- [ ] 導入後立即驗證數量
- [ ] 測試 API 返回的資料結構
- [ ] 與前端資料逐一比對

### API 開發階段
- [ ] 確定 API 類型（public/private/write/admin）
- [ ] 選擇正確的路徑前綴
- [ ] 創建前端專用的 response model
- [ ] 處理命名規範轉換（snake_case → camelCase）
- [ ] 處理 JSONB 欄位解析
- [ ] 測試 API 返回格式
- [ ] 更新 API 文件

### 測試階段
- [ ] 使用 curl 測試 API
- [ ] 驗證返回的資料結構
- [ ] 檢查所有嵌套欄位
- [ ] 對比前端期望的格式
- [ ] 測試前端整合
- [ ] 檢查 UI 顯示是否正確

---

## 🔍 除錯技巧

### 1. 快速比對資料結構
```python
# 比對前端和後端的資料
python3 << 'EOF'
import json

# 讀取前端資料（手動複製或解析 .ts）
frontend_data = {...}

# 讀取 API 返回
import urllib.request
api_data = json.loads(urllib.request.urlopen('http://localhost:8000/api/...').read())

# 比對
def compare_keys(obj1, obj2, path=""):
    keys1 = set(obj1.keys())
    keys2 = set(obj2.keys())
    
    missing = keys1 - keys2
    extra = keys2 - keys1
    
    if missing:
        print(f"{path} 缺少欄位: {missing}")
    if extra:
        print(f"{path} 多餘欄位: {extra}")

compare_keys(frontend_data, api_data)
EOF
```

### 2. 驗證 JSONB 資料
```bash
# 直接在資料庫檢查
psql -d vortixpr -c "
SELECT 
    id, 
    name, 
    jsonb_typeof(features) as features_type,
    jsonb_array_length(features) as features_count,
    features::text
FROM pr_packages 
LIMIT 1;
"
```

### 3. API 回應除錯
```bash
# 顯示完整的錯誤訊息
curl -v http://localhost:8000/api/pr-packages/ 2>&1 | grep -A 20 "HTTP/"

# 美化 JSON 輸出
curl -s http://localhost:8000/api/pr-packages/ | python3 -m json.tool

# 檢查特定欄位
curl -s http://localhost:8000/api/pr-packages/ | \
  python3 -c "import sys,json; data=json.load(sys.stdin); \
  print(data[0]['packages'][0].keys())"
```

---

## ⚠️ 常見陷阱

### 1. 假設 asyncpg 會自動解析 JSONB
❌ 不一定！取決於查詢方式
✅ 總是明確檢查並解析

### 2. 沒有驗證資料完整性
❌ 導入後不驗證
✅ 立即驗證數量和結構

### 3. Response Model 使用錯誤
❌ 用後端 model 當 response
✅ 創建前端專用 model

### 4. 命名規範混亂
❌ 隨意混用 snake_case 和 camelCase
✅ 明確定義轉換規則

### 5. 沒有測試完整的 API 回應
❌ 只測試能不能返回
✅ 測試返回的每個欄位

---

## ✅ 總結

### 核心原則

1. **資料一致性優先**
   - 前後端資料必須完全匹配
   - 導入後立即驗證
   - 不能遺漏任何欄位

2. **命名規範轉換**
   - 後端：snake_case（Python/PostgreSQL 標準）
   - 前端：camelCase（TypeScript/JavaScript 標準）
   - API 層：負責轉換

3. **API 路徑分類**
   - public: 公開、可快取
   - private: 個人化、短快取
   - write: 寫入、不快取
   - admin: 管理、不快取

4. **完整測試**
   - 測試資料數量
   - 測試資料結構
   - 測試每個欄位
   - 測試前端顯示

### 避免重蹈覆轍

- ❌ 不要假設資料會自動匹配
- ❌ 不要跳過驗證步驟
- ❌ 不要只導入部分資料
- ❌ 不要忽略命名規範差異
- ✅ 每一步都要驗證
- ✅ 對照前端資料逐一檢查
- ✅ 測試完整的使用者流程







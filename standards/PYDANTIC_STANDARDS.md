# 🔧 Pydantic 使用標準與最佳實踐

**版本**: v1.0  
**建立日期**: 2026-01-30  
**狀態**: ✅ 強制執行  
**目的**: 避免 Pydantic 驗證導致的生產環境錯誤

---

## ⚠️ 為何需要這個標準？

### 已知問題

**2026-01-30 事件**：
- 資料庫空 content 欄位 + `min_length=1` 驗證
- 導致整個 Blog 系統癱瘓
- 看起來像 CORS 錯誤，實際是 Pydantic 驗證失敗
- 耗時 2+ 小時才找到問題
- 詳見：`LESSONS_PYDANTIC_VALIDATION_DISASTER.md`

**核心問題**：
- Pydantic 驗證失敗會導致 500 錯誤
- 錯誤訊息會被誤判為其他問題
- 本地正常，生產異常（資料差異）

---

## 📌 核心原則

### 原則 1：Response Model 要寬鬆

**❌ 錯誤**：
```python
class BlogPost(BaseModel):
    """Response Model - 從資料庫返回"""
    content: str = Field(..., min_length=1)  # ← 太嚴格！
    title: str = Field(..., min_length=1, max_length=100)
    email: EmailStr = Field(..., min_length=5)
```

**✅ 正確**：
```python
class BlogPost(BaseModel):
    """Response Model - 從資料庫返回"""
    content: str  # 寬鬆，允許空字串
    title: str = Field(..., max_length=255)  # 只限最大長度
    email: str  # 不強制 EmailStr
```

**理由**：
- 歷史資料可能不符合新規則
- 測試資料可能有空值
- Response 是「讀取」，應該容忍各種資料
- 驗證應該在寫入時做，不是讀取時

---

### 原則 2：Create/Update Model 才嚴格

**❌ 錯誤**：
```python
# 所有 Model 都用同一個
class BlogPost(BaseModel):
    content: str = Field(..., min_length=1)
```

**✅ 正確**：
```python
# Response Model（寬鬆）
class BlogPost(BaseModel):
    content: str  # 允許空值

# Create Model（嚴格）
class BlogPostCreate(BaseModel):
    content: str = Field(..., min_length=1)  # 創建時驗證

# Update Model（寬鬆）
class BlogPostUpdate(BaseModel):
    content: Optional[str] = None  # 可選
```

**理由**：
- Create：確保新資料品質
- Response：容忍現有資料
- Update：只驗證提供的欄位

---

### 原則 3：Optional 優於必填

**❌ 危險**：
```python
class User(BaseModel):
    avatar_url: str  # 如果資料庫是 NULL 會爆炸
    phone: str       # 如果沒有會爆炸
```

**✅ 安全**：
```python
class User(BaseModel):
    avatar_url: Optional[str] = None  # 安全
    phone: Optional[str] = None       # 安全
```

**理由**：
- 資料庫的 NULL → Python 的 None
- 如果定義為必填，NULL 會導致驗證失敗

---

## 🚨 常見錯誤與解決

### 錯誤 1：Response Model 過度驗證

**問題**：
```python
@router.get("/posts", response_model=List[BlogPost])
async def get_posts():
    posts = db.query_all()
    return posts  # ← Pydantic 嚴格驗證，有問題就 500
```

**解決**：
```python
# 方案 A：寬鬆的 Response Model
class BlogPostResponse(BaseModel):
    content: str  # 不設 min_length
    
# 方案 B：不用 response_model（最寬鬆）
@router.get("/posts")  # 不設 response_model
async def get_posts():
    return [dict(row) for row in rows]  # 直接返回
```

---

### 錯誤 2：必填欄位設定錯誤

**問題**：
```python
class User(BaseModel):
    name: str          # 必填，但資料庫可能是 NULL
    avatar_url: str    # 必填，但很多用戶沒有頭像
```

**解決**：
```python
class User(BaseModel):
    name: str                        # 真的必填
    avatar_url: Optional[str] = None # 可選
```

---

### 錯誤 3：EmailStr 過度使用

**問題**：
```python
class User(BaseModel):
    email: EmailStr  # Response Model 用 EmailStr
    
# 如果資料庫有格式不對的舊 email → 500 錯誤
```

**解決**：
```python
# Response Model（寬鬆）
class UserResponse(BaseModel):
    email: str  # 不強制驗證格式

# Create Model（嚴格）
class UserCreate(BaseModel):
    email: EmailStr  # 創建時才驗證格式
```

---

### 錯誤 4：JSONB 欄位型別錯誤

**問題**：
```python
class Package(BaseModel):
    features: List[str]  # 期望是 list
    
# 但 asyncpg 可能返回字串 "['item1', 'item2']"
# Pydantic 驗證失敗
```

**解決**：
```python
# 在 API 層處理
row = await conn.fetchrow("SELECT * FROM packages")
package_dict = dict(row)

# 明確解析 JSONB
if isinstance(package_dict['features'], str):
    package_dict['features'] = json.loads(package_dict['features'])

return package_dict
```

---

### 錯誤 5：datetime 時區問題

**問題**：
```python
# 資料庫返回 timezone-aware datetime
# 但 Pydantic 期望 timezone-naive
# 導致驗證錯誤或比較失敗
```

**解決**：
```python
# 寫入時移除時區
dt = datetime.now()
await conn.execute(
    "INSERT INTO table (created_at) VALUES ($1)",
    dt.replace(tzinfo=None)  # 移除時區
)
```

---

## 🏗️ Model 設計模式

### 模式 1：三層 Model 架構（推薦）

```python
# 1. Base Model（共用欄位）
class BlogPostBase(BaseModel):
    title: str = Field(..., max_length=255)
    category: str = Field(..., max_length=100)
    content: str  # 寬鬆

# 2. Create Model（嚴格驗證）
class BlogPostCreate(BlogPostBase):
    content: str = Field(..., min_length=10)  # 創建時要求至少 10 字元
    status: str = Field(default="draft")

# 3. Update Model（可選欄位）
class BlogPostUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = None  # 可選
    # ...

# 4. Response Model（從資料庫）
class BlogPost(BlogPostBase):
    id: int
    slug: str
    created_at: datetime
    # Notion 整合欄位（可選）
    notion_page_id: Optional[str] = None
    
    class Config:
        from_attributes = True  # 允許從 ORM 物件創建
```

---

### 模式 2：分離 Request 和 Response

```python
# Request Models（寫入）
class CreateUserRequest(BaseModel):
    email: EmailStr = Field(..., min_length=5)  # 嚴格
    password: str = Field(..., min_length=8)    # 嚴格
    name: str = Field(..., min_length=1)        # 嚴格

# Response Models（讀取）
class UserResponse(BaseModel):
    id: int
    email: str         # 寬鬆，不用 EmailStr
    name: str          # 寬鬆，不用 min_length
    avatar_url: Optional[str] = None
    
    class Config:
        from_attributes = True
```

---

## 📋 驗證規則設計指南

### 欄位類型選擇

| 情況 | Response Model | Create Model | Update Model |
|------|---------------|--------------|--------------|
| 必填文字欄位 | `str` | `str = Field(..., min_length=1)` | `Optional[str]` |
| 可選文字欄位 | `Optional[str] = None` | `Optional[str] = None` | `Optional[str] = None` |
| Email | `str` | `EmailStr` | `Optional[str]` |
| 數字 | `int` 或 `Optional[int]` | `int = Field(..., ge=0)` | `Optional[int]` |
| 布林值 | `bool` | `bool = False` | `Optional[bool]` |
| 日期時間 | `datetime` | `datetime` | `Optional[datetime]` |
| JSONB | `dict` 或 `List` | `dict` 或 `List` | `Optional[dict]` |

---

### 長度限制原則

**Response Model**：
- ✅ 設定 `max_length`（防止資料過大）
- ❌ 不設 `min_length`（容忍空值）

**Create Model**：
- ✅ 設定 `min_length`（確保資料品質）
- ✅ 設定 `max_length`（防止濫用）

**範例**：
```python
# Response
title: str = Field(..., max_length=255)  # 只限最大

# Create
title: str = Field(..., min_length=1, max_length=255)  # 兩者都限
```

---

## 🔍 Debug 技巧

### 快速測試 Model 驗證

```python
# 測試極端情況
test_cases = [
    {'title': '', 'content': '', 'category': ''},  # 空字串
    {'title': 'A', 'content': None, 'category': 'Test'},  # None
    {'title': 'Test' * 100, 'content': 'X' * 100000, 'category': 'Test'},  # 超長
]

for data in test_cases:
    try:
        post = BlogPost(**data)
        print(f'✅ 通過：{data}')
    except ValidationError as e:
        print(f'❌ 失敗：{data}')
        print(f'   錯誤：{e}')
```

---

### 檢查生產資料是否符合 Model

```sql
-- 檢查空 content
SELECT id, title, LENGTH(content) as content_length
FROM blog_posts 
WHERE content = '' OR content IS NULL;

-- 檢查超長資料
SELECT id, title, LENGTH(content) as content_length
FROM blog_posts 
WHERE LENGTH(content) > 100000;

-- 檢查格式錯誤的 email
SELECT id, email 
FROM users 
WHERE email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$';
```

---

## ⚠️ 危險的驗證規則

### 絕對避免在 Response Model 中使用

1. **❌ `min_length` 限制**
   ```python
   content: str = Field(..., min_length=1)  # 危險！
   ```
   **理由**：資料庫可能有空字串

2. **❌ 嚴格的 `pattern` 驗證**
   ```python
   email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')  # 危險！
   ```
   **理由**：歷史資料可能不符合新格式

3. **❌ `EmailStr` 型別**
   ```python
   email: EmailStr  # 危險！
   ```
   **理由**：舊資料可能有格式問題

4. **❌ 過於嚴格的數值範圍**
   ```python
   age: int = Field(..., ge=0, le=120)  # 危險！
   ```
   **理由**：測試資料可能是 999 或 -1

---

## ✅ 安全的 Response Model 設計

### 標準模板

```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class EntityResponse(BaseModel):
    """
    Response Model 標準模板
    
    原則：
    1. ✅ 只設定 max_length（防止過大）
    2. ❌ 不設定 min_length（容忍空值）
    3. ✅ 盡量用 Optional（容忍 NULL）
    4. ❌ 不用 EmailStr、HttpUrl 等嚴格型別
    5. ✅ 允許額外欄位（from_attributes）
    """
    
    # 主鍵（必填）
    id: int
    
    # 文字欄位（寬鬆）
    title: str = Field(..., max_length=255)  # 只限最大
    content: str  # 不限長度
    description: Optional[str] = None  # 可選
    
    # Email（寬鬆）
    email: str  # 不用 EmailStr
    
    # 數值（寬鬆）
    count: Optional[int] = None  # 可選
    price: Optional[float] = None  # 可選
    
    # 布林值
    is_active: bool = True  # 有預設值
    
    # 日期時間（可選）
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
    
    # 資料庫可能有的額外欄位（可選）
    notion_page_id: Optional[str] = None
    sync_source: Optional[str] = None
    
    class Config:
        from_attributes = True  # 允許從 ORM/dict 創建
```

---

### Create Model 模板

```python
class EntityCreate(BaseModel):
    """
    Create Model 標準模板
    
    原則：
    1. ✅ 嚴格驗證（確保資料品質）
    2. ✅ 設定 min_length 和 max_length
    3. ✅ 使用 EmailStr、HttpUrl 等
    4. ✅ 必填欄位不用 Optional
    """
    
    # 文字欄位（嚴格）
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=10)  # 至少 10 字元
    
    # Email（嚴格）
    email: EmailStr  # 強制格式驗證
    
    # 數值（嚴格）
    price: float = Field(..., ge=0)  # 不能是負數
    count: int = Field(default=0, ge=0, le=1000000)
    
    # 狀態（嚴格）
    status: str = Field(
        default="draft",
        pattern="^(draft|published|archived)$"
    )
```

---

## 🔧 Config 設定標準

### Response Model Config

```python
class BlogPost(BaseModel):
    # ... 欄位定義 ...
    
    class Config:
        from_attributes = True  # ✅ 必須！允許從 DB row 創建
        # extra = "ignore"  # 可選，忽略額外欄位
```

### Create/Update Model Config

```python
class BlogPostCreate(BaseModel):
    # ... 欄位定義 ...
    
    class Config:
        # 不需要 from_attributes（來自前端 JSON）
        json_schema_extra = {  # API 文檔範例
            "example": {
                "title": "Example Post",
                "content": "Content here..."
            }
        }
```

---

## 📊 Model 分層架構

### 完整範例

```python
# ==================== Base Model ====================
class BlogPostBase(BaseModel):
    """共用欄位（不含 ID 和時間戳）"""
    title: str = Field(..., max_length=255)
    category: str = Field(..., max_length=100)
    excerpt: Optional[str] = None
    content: str  # 寬鬆
    author: str = Field(default="VortixPR Team")

# ==================== Create Model ====================
class BlogPostCreate(BlogPostBase):
    """創建時的驗證（嚴格）"""
    content: str = Field(..., min_length=10)  # 覆蓋 Base，加嚴格驗證
    status: str = Field(
        default="draft",
        pattern="^(draft|published|archived)$"
    )

# ==================== Update Model ====================
class BlogPostUpdate(BaseModel):
    """更新時的驗證（所有可選）"""
    title: Optional[str] = Field(None, max_length=255)
    category: Optional[str] = Field(None, max_length=100)
    excerpt: Optional[str] = None
    content: Optional[str] = None  # 可選，不強制驗證
    status: Optional[str] = Field(
        None,
        pattern="^(draft|published|archived)$"
    )

# ==================== Response Model ====================
class BlogPost(BlogPostBase):
    """從資料庫返回（包含所有欄位）"""
    id: int
    slug: str
    status: str
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
    
    # 可能的額外欄位（Optional）
    notion_page_id: Optional[str] = None
    sync_source: Optional[str] = None
    notion_last_edited_time: Optional[datetime] = None
    
    class Config:
        from_attributes = True
```

---

## 🚫 絕對禁止

### 在 Response Model 中

1. **❌ 禁止使用 `min_length`**
   ```python
   content: str = Field(..., min_length=1)  # 禁止！
   ```

2. **❌ 禁止過度使用 EmailStr**
   ```python
   email: EmailStr  # 在 Response Model 中禁止
   ```

3. **❌ 禁止嚴格的 pattern**
   ```python
   phone: str = Field(..., pattern=r'^\+?1?\d{9,15}$')  # 禁止！
   ```

4. **❌ 禁止必填非主要欄位**
   ```python
   avatar_url: str  # 應該是 Optional[str]
   ```

---

### 在 Create/Update Model 中

1. **❌ 禁止過於複雜的驗證**
   ```python
   # 太複雜，難以理解
   content: str = Field(
       ...,
       min_length=10,
       max_length=50000,
       pattern=r'^[^<>]*$',  # 禁止 HTML
       description="Must be plain text"
   )
   ```

2. **❌ 禁止重複 Base Model 的定義**
   ```python
   class BlogPostCreate(BlogPostBase):
       title: str = Field(...)  # ❌ Base 已經定義了
   ```

---

## 🎯 檢查清單

### 新增 Model 時

- [ ] Response Model 是否夠寬鬆？
- [ ] 是否移除了 `min_length` 限制？
- [ ] 是否所有可選欄位都用 `Optional`？
- [ ] 是否避免使用 `EmailStr` 在 Response？
- [ ] 是否設定了 `from_attributes = True`？
- [ ] 是否考慮了額外欄位（如 Notion 整合）？

### 部署前

- [ ] 是否檢查生產資料庫的資料品質？
- [ ] 是否有空字串/NULL 的欄位？
- [ ] 是否有不符合新驗證規則的舊資料？
- [ ] 是否測試了極端情況？

### 遇到 500 錯誤時

- [ ] 是否查看了 Backend logs？
- [ ] 是否看到 `ResponseValidationError`？
- [ ] 是否檢查了對應的 Model 定義？
- [ ] 是否檢查了資料庫的實際資料？

---

## 💡 最佳實踐

### 1. 驗證分離原則

```
寫入時嚴格 ✅
讀取時寬鬆 ✅
```

### 2. 漸進式嚴格化

```
初期：寬鬆（快速開發）
中期：逐步加驗證
後期：嚴格驗證（資料品質穩定後）
```

### 3. 容錯優先

```
寧可允許髒資料返回（前端過濾）
也不要因為驗證失敗導致 500 錯誤
```

### 4. 文檔化驗證規則

```python
class BlogPost(BaseModel):
    """
    Blog Post Response Model
    
    ⚠️ 注意：
    - content 允許空字串（歷史資料相容）
    - email 不強制格式驗證（容忍舊資料）
    - notion_page_id 為 Optional（整合功能可選）
    """
    content: str
    email: str
    notion_page_id: Optional[str] = None
```

---

## 🔥 常見場景與解決方案

### 場景 1：新增資料庫欄位

**問題**：
```
1. 在資料庫加新欄位：notion_page_id
2. 忘記在 Response Model 加
3. FastAPI 返回時包含此欄位
4. Pydantic 不認識 → 可能忽略或報錯
```

**解決**：
```python
# 在 Response Model 加為 Optional
notion_page_id: Optional[str] = None
```

---

### 場景 2：資料庫有髒資料

**問題**：
```
1. 舊資料 content = ''
2. 新 Model content: str = Field(..., min_length=1)
3. API 返回時驗證失敗
4. 500 錯誤
```

**解決**：
```python
# 方案 A：Model 寬鬆化
content: str  # 移除 min_length

# 方案 B：清理資料
UPDATE blog_posts SET content = 'N/A' WHERE content = '';
```

---

### 場景 3：JSONB 型別不一致

**問題**：
```python
# Model 定義
features: List[str]

# asyncpg 返回
features = "['item1', 'item2']"  # 字串！

# Pydantic 驗證失敗
```

**解決**：
```python
# API 層處理
if isinstance(dict_data['features'], str):
    dict_data['features'] = json.loads(dict_data['features'])

return dict_data
```

---

## 📚 參考案例

### 成功案例

**Pricing Model**（正確）：
```python
class PricingPackage(BaseModel):
    name: str = Field(..., max_length=100)  # 只限最大
    description: Optional[str] = None       # 可選
    features: List[str]                     # 不過度限制
```

**Contact Model**（正確）：
```python
class ContactSubmission(BaseModel):
    email: str  # 不用 EmailStr（Response）
    message: str  # 不限長度
```

---

### 失敗案例

**Blog Model**（錯誤）：
```python
class BlogPost(BaseModel):
    content: str = Field(..., min_length=1)  # ❌ 導致 500 錯誤
```

**修正後**（正確）：
```python
class BlogPost(BaseModel):
    content: str  # ✅ 移除限制
```

---

## 🎓 進階主題

### 自訂 Validator

**何時使用**：
- 複雜的業務邏輯驗證
- 跨欄位驗證
- 格式轉換

**範例**：
```python
from pydantic import validator

class BlogPost(BaseModel):
    title: str
    slug: str
    
    @validator('slug')
    def slug_must_be_lowercase(cls, v):
        if v != v.lower():
            raise ValueError('slug must be lowercase')
        return v
    
    @validator('slug')
    def slug_from_title(cls, v, values):
        # 如果沒有 slug，從 title 生成
        if not v and 'title' in values:
            from slugify import slugify
            return slugify(values['title'])
        return v
```

**⚠️ 注意**：只在 Create Model 使用，不要在 Response Model！

---

### 處理遺留欄位

**問題**：
```
資料庫有舊欄位：old_status
新欄位：account_status

兩個欄位同時存在一段時間
```

**解決**：
```python
class User(BaseModel):
    account_status: str
    old_status: Optional[str] = None  # 遺留欄位，暫時保留
    
    @validator('account_status', pre=True, always=True)
    def migrate_status(cls, v, values):
        # 如果沒有 account_status，用 old_status
        if not v and values.get('old_status'):
            return 'active' if values['old_status'] == 'enabled' else 'inactive'
        return v
```

---

## 📝 總結

### 黃金規則

1. **Response Model 寬鬆，Create Model 嚴格**
2. **只在 Response Model 設定 max_length，不設 min_length**
3. **盡量使用 Optional，避免必填**
4. **避免在 Response Model 使用 EmailStr 等嚴格型別**
5. **部署前檢查生產資料是否符合 Model**
6. **遇到 ResponseValidationError 先看 Backend logs**

### 快速診斷口訣

```
看到 CORS 錯誤？
→ 先看 HTTP 狀態碼
→ 500 錯誤？
→ 查 Backend logs
→ ResponseValidationError？
→ 檢查 Model 定義
→ 修正驗證規則
```

### 避免的心態

- ❌ 「應該是 CORS 問題」
- ❌ 「可能是環境變數」
- ❌ 「也許是路徑錯誤」

### 正確的心態

- ✅ 「讓我先看 logs」
- ✅ 「錯誤訊息具體說什麼？」
- ✅ 「用證據診斷，不要猜測」

---

**維護者**: VortixPR Team  
**狀態**: ✅ 強制執行  
**相關**: `LESSONS_PYDANTIC_VALIDATION_DISASTER.md`

---

**此標準適用於所有使用 Pydantic 的專案。**

**遵循此標準，可避免 90% 的 Pydantic 相關問題。**

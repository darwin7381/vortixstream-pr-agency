# 🎯 VortixPR API 設計規範

**版本**: v1.0  
**建立日期**: 2025-12-29  
**目的**: 統一 API 設計風格，避免路由和協議問題

---

## 📊 兩種 API 設計風格

### 方案 A：Resource-Oriented（資源導向 - RESTful）

```python
# 後端
router = APIRouter(prefix="/api/users")

@router.get("/")        # GET /api/users/        - 列表
@router.post("/")       # POST /api/users/       - 創建
@router.get("/{id}")    # GET /api/users/123     - 單一資源
@router.put("/{id}")    # PUT /api/users/123     - 更新
@router.delete("/{id}") # DELETE /api/users/123  - 刪除
```

```typescript
// 前端
fetch(`${API_BASE_URL}/users/`)
fetch(`${API_BASE_URL}/users/${id}/`)
```

**特點**：
- ✅ 標準 RESTful 風格
- ✅ 資源為中心
- ✅ 語義清晰
- ⚠️ **需要注意結尾斜線**

---

### 方案 B：Path-Based（路徑導向 - Hierarchical）

```python
# 後端
router = APIRouter(prefix="/api/admin")

@router.get("/users")        # GET /api/admin/users        - 列表
@router.post("/users")       # POST /api/admin/users       - 創建
@router.get("/users/{id}")   # GET /api/admin/users/123    - 單一資源
@router.put("/users/{id}")   # PUT /api/admin/users/123    - 更新
@router.delete("/users/{id}")# DELETE /api/admin/users/123 - 刪除
```

```typescript
// 前端
fetch(`${API_BASE_URL}/admin/users`)
fetch(`${API_BASE_URL}/admin/users/${id}`)
```

**特點**：
- ✅ 路徑層級清晰
- ✅ **避免結尾斜線問題**
- ✅ 與 VortixPR 現有風格一致
- ✅ 更直觀

---

## 🎯 VortixPR 的選擇

### 採用方案 B：Path-Based

**理由**：
1. ✅ 與專案現有風格一致（blog, pricing, pr-packages 都用這種）
2. ✅ 避免 307 redirect 問題
3. ✅ 路徑更明確
4. ✅ 新手更容易理解

---

## 📝 詳細規範

### 後端 API 路由設計

#### ✅ 推薦寫法

```python
# 1. Router 定義 - 使用模組/功能層級的 prefix
router = APIRouter(prefix="/api/admin")  # 或 /api/public, /api/write

# 2. 端點定義 - 使用明確的資源名稱
@router.get("/users")           # 列表
@router.get("/users/{id}")      # 單一
@router.post("/users")          # 創建
@router.patch("/users/{id}")    # 更新
@router.delete("/users/{id}")   # 刪除

# 3. 子資源
@router.get("/users/{id}/posts")  # 用戶的文章列表
@router.post("/users/{id}/posts") # 創建用戶的文章
```

**完整路徑範例**：
- `GET /api/admin/users` - 用戶列表
- `GET /api/admin/users/123` - 特定用戶
- `POST /api/admin/users` - 創建用戶

---

#### ❌ 避免的寫法

```python
# ❌ 不要用根路徑（會有斜線問題）
router = APIRouter(prefix="/api/admin/users")
@router.get("/")  # 會變成 /api/admin/users/（有斜線）

# ❌ 不要混用風格
router = APIRouter(prefix="/api/admin")
@router.get("/")  # 不明確，是什麼資源？

# ❌ 不要在 prefix 中包含完整路徑
router = APIRouter(prefix="/api/admin/users/list")  # 太深
```

---

### 前端 API 調用規範

#### ✅ 推薦寫法

**1. 使用統一的 API client**（api/client.ts）：

```typescript
// api/client.ts
export const usersAPI = {
  async getUsers(params: { status?: string, role?: string }) {
    const query = new URLSearchParams(params);
    const response = await fetch(`${ADMIN_API}/users?${query}`);
    return response.json();
  },
  
  async getUser(id: number) {
    const response = await fetch(`${ADMIN_API}/users/${id}`);
    return response.json();
  },
};

// 組件中使用
import { usersAPI } from '../../api/client';
const users = await usersAPI.getUsers({ status: 'active' });
```

**好處**：
- ✅ 統一管理所有 API
- ✅ 型別安全
- ✅ 易於維護
- ✅ 避免重複代碼

---

#### ⚠️ 可接受的寫法（小型功能）

```typescript
// 組件中直接 fetch（僅限簡單情況）
import { API_BASE_URL } from '../../config/api';

const response = await fetch(`${API_BASE_URL}/admin/users`);
```

**限制**：
- ⚠️ 路徑必須與後端定義完全一致
- ⚠️ 不要忘記斜線規則

---

#### ❌ 避免的寫法

```typescript
// ❌ 每個組件重新定義 API_BASE_URL
const API = 'http://localhost:8000/api';  // 硬編碼！

// ❌ 不一致的路徑格式
fetch('/admin/users')   // 有的沒斜線
fetch('/admin/posts/')  // 有的有斜線
```

---

## 🔧 結尾斜線統一規則

### 規則

**選擇一種，全專案統一**：

**選項 1：都不加斜線**（推薦）
```python
# 後端
@router.get("/users")  # → /api/admin/users

# 前端
fetch(`${API_BASE_URL}/admin/users`)
```

**選項 2：都加斜線**
```python
# 後端
@router.get("/users/")  # → /api/admin/users/

# 前端
fetch(`${API_BASE_URL}/admin/users/`)
```

**VortixPR 採用**：選項 1（不加斜線）

---

## 📋 開發檢查清單

### 新增 API 時

- [ ] 參照現有 API 的風格（blog, pricing, pr-packages）
- [ ] Router prefix 使用模組層級（`/api/admin`，不是 `/api/admin/users`）
- [ ] 端點使用明確路徑（`/users`，不是 `/`）
- [ ] 檢查前端 URL 與後端定義一致
- [ ] 檢查結尾斜線規則
- [ ] 本地端測試
- [ ] 檢查 Railway 日誌（確認沒有 307）

---

## ⚠️ 常見錯誤

### 錯誤 1：使用根路徑

```python
# ❌
router = APIRouter(prefix="/api/admin/users")
@router.get("/")  # 產生 /api/admin/users/（斜線問題）

# ✅
router = APIRouter(prefix="/api/admin")
@router.get("/users")  # 產生 /api/admin/users（清晰）
```

### 錯誤 2：前後端不一致

```python
# 後端
@router.get("/users")  # /api/admin/users

# 前端（錯誤）
fetch(`${API_BASE_URL}/admin/users/`)  # 有斜線！
```

### 錯誤 3：混用風格

```python
# ❌ 不要這樣
router1 = APIRouter(prefix="/api/users")
@router1.get("/")  # RESTful 風格

router2 = APIRouter(prefix="/api/admin")
@router2.get("/posts")  # Path-based 風格
```

---

## 🎓 技術背景

### 這兩種寫法的名稱

**方案 A**：
- 名稱：Resource-Oriented（資源導向）
- 別名：RESTful Style
- 來源：REST API 設計原則

**方案 B**：
- 名稱：Path-Based（路徑導向）
- 別名：Hierarchical Routing（層級路由）
- 來源：傳統 Web 路由設計

### 在不同框架中

**這是後端（FastAPI）的設計，與前端框架無關**。

**React/Vite/Next.js 的角色**：
- 前端只是調用 API
- 不影響後端的路由設計
- 但需要確保 URL 正確

**兩種寫法都是正規的**：
- ✅ Express.js、NestJS、Django、Flask 都支援兩種
- ✅ 選擇取決於團隊偏好和專案需求
- ✅ 關鍵是**保持一致性**

---

## 🚀 VortixPR 的標準

**採用 Path-Based（方案 B）**：
- 與現有 code 一致
- 避免斜線問題
- 路徑清晰易懂

**檢查指令**：
```bash
# 確保沒有根路徑定義
grep -r "@router.get\(\"/\"\)" backend/app/api/
# 應該只有 settings, invitations 等少數特殊情況

# 或者確保前端都加斜線
grep -r "API_BASE_URL.*admin.*/" frontend/src/
```

---

**維護者**: VortixPR Team  
**更新**: 發現新問題就補充

---

**總結**：統一使用 Path-Based，避免根路徑，保持一致性。


# 🎯 VortixPR API 路徑風格指南

**版本**: v2.0  
**建立日期**: 2025-12-29  
**更新日期**: 2026-01-12  
**狀態**: ✅ 已完全實施  
**目的**: 統一 API 路徑設計風格，避免路由和協議問題

---

## 🚨 重要提醒

**如果遇到「本地正常，生產失敗」且出現 HTTP/HTTPS 相關錯誤**：

```
症狀：Console 顯示 "Mixed Content" 或 "Preflight 301/307"
本地：功能完全正常 ✅
生產：API 請求失敗 ❌

❌ 不是環境變數問題（100% 確定後再查這個）
✅ 高機率是 API 路徑斜線不一致（混合風格造成 307 redirect）

解決方向：
1. 檢查後端日誌（找 307 redirect）
2. 對比正常和異常頁面的 API 調用
3. 檢查路徑是否符合本規範（Path-Based，無斜線）
```

**案例**：2026-01-12 生產環境用戶權限更新失敗 → 原因：混用風格 → 統一後修復 ✅

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

### ✅ 採用方案 B：Path-Based（已於 2026-01-12 完全統一）

**理由**：
1. ✅ 與專案現有風格一致（blog, pricing, pr-packages 都用這種）
2. ✅ 避免 307 redirect 問題
3. ✅ 路徑更明確
4. ✅ 新手更容易理解
5. ✅ 避免結尾斜線混淆

**實施狀態**：
- ✅ 2026-01-12 完成統一改造
- ✅ 23 個後端文件 100% 使用 Path-Based
- ✅ 所有前端調用已同步更新
- ✅ 零混合風格

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

**實施日期**：2026-01-12  
**實施範圍**：100% 後端 + 前端  
**詳細記錄**：`/API_STYLE_UNIFICATION_COMPLETE.md`

---

## ✅ 統一規範（2026-01-12 更新）

### 完整規則

**後端路由定義**：
```python
# ✅ 正確（統一 Path-Based）
router = APIRouter(prefix="/api/admin")
@router.get("/users")               # → /api/admin/users
@router.get("/users/stats")         # → /api/admin/users/stats
@router.patch("/users/{id}/role")   # → /api/admin/users/123/role

# ❌ 禁止（Resource-Oriented 已廢棄）
router = APIRouter(prefix="/api/admin/users")
@router.get("/")                    # → /api/admin/users/（產生斜線）
```

**前端 API 調用**：
```typescript
// ✅ 正確（統一無斜線）
fetch(`${API_BASE_URL}/admin/users`)
fetch(`${API_BASE_URL}/admin/users/stats`)
fetch(`${API_BASE_URL}/admin/users/123/role`)

// ❌ 禁止（不要加斜線）
fetch(`${API_BASE_URL}/admin/users/`)
fetch(`${API_BASE_URL}/admin/users/stats/`)
```

**黃金規則**：
```
🟢 所有路徑都不加結尾斜線（除非 query parameters）
🟢 Query parameters 前不加斜線：/users?status=active ✅
🔴 禁止使用根路徑 @router.get("/")
```

---

## 📋 開發檢查清單

### 新增 API 時

- [ ] Router prefix 使用**模組層級**（`/api/admin`，不是 `/api/admin/users`）
- [ ] 端點使用**明確路徑**（`/users`，不是 `/`）
- [ ] **絕對禁止** `@router.get("/")`（會產生斜線）
- [ ] 前端 URL **不加結尾斜線**
- [ ] 參照現有 API 的風格（所有都是 Path-Based）
- [ ] 本地端測試（確認 200 OK，不是 307）
- [ ] 檢查 Railway 日誌（確認沒有 redirect）

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

## 📊 改造歷史（2026-01-12）

### 統一前的狀態

```
後端混合風格：
- Resource-Oriented: 4 個文件（user, invitation, settings, auth）
- Path-Based: 19 個文件（其他所有）

問題：
- 開發者困惑（要不要加斜線？）
- 容易出錯（如 2026-01-12 的 bug）
- 文檔矛盾
```

### 統一後的狀態

```
✅ 100% Path-Based：
- 23 個後端文件全部統一
- 所有前端調用已同步
- 零混合風格
- 零斜線問題
```

**改造記錄**：`/API_STYLE_UNIFICATION_COMPLETE.md`

---

## 🚨 常見錯誤範例（已修復）

### 錯誤 1：使用根路徑（已廢棄）

```python
# ❌ 舊寫法（2025-12-29 之前）
router = APIRouter(prefix="/api/admin/users")
@router.get("/")  # 產生 /api/admin/users/（有斜線，造成問題）

# ✅ 新寫法（2026-01-12 統一後）
router = APIRouter(prefix="/api/admin")
@router.get("/users")  # 產生 /api/admin/users（無斜線，清晰）
```

### 錯誤 2：前端加斜線（已修復）

```typescript
// ❌ 舊寫法
fetch(`${API_BASE_URL}/admin/users/stats/`)  // 多餘的斜線

// ✅ 新寫法
fetch(`${API_BASE_URL}/admin/users/stats`)  // 統一無斜線
```

---

**維護者**: VortixPR Team  
**版本**: v2.0（2026-01-12 完全統一）  
**狀態**: ✅ 已實施並強制執行  
**更新**: 發現新問題就補充

---

**總結**：
1. 統一使用 Path-Based（方案 B）
2. 絕對禁止根路徑 `@router.get("/")`
3. 所有路徑不加結尾斜線
4. 保持 100% 一致性


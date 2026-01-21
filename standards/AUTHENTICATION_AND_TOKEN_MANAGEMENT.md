# 認證與 Token 管理標準

## 版本資訊
- **版本**: 2.0
- **實施日期**: 2026-01-20
- **狀態**: ✅ 現行標準
- **適用範圍**: 所有前後端代碼

---

## 一、Token 配置標準

### 1.1 Token 時間設定

**後端配置（`backend/.env` 和 `backend/app/config.py`）：**

```python
# Token 時間配置（基於業界最佳實踐）
ACCESS_TOKEN_EXPIRE_MINUTES: int = 15  # 短期 token
REFRESH_TOKEN_EXPIRE_DAYS: int = 7     # 長期 token
```

**設定理由：**
- **15 分鐘 Access Token**：
  - ✅ 業界標準（5-30 分鐘）
  - ✅ 限制安全風險（攻擊窗口小）
  - ✅ 配合自動刷新機制，用戶無感知
  
- **7 天 Refresh Token**：
  - ✅ 管理系統標準（7-30 天）
  - ✅ 平衡安全性和便利性
  - ✅ 適合內部工具使用場景

**⚠️ 禁止：**
- ❌ Access Token > 30 分鐘（安全風險）
- ❌ Refresh Token > 30 天（除非有特殊需求）
- ❌ Token 永不過期（嚴重安全問題）

---

## 二、前端 API 調用標準

### 2.1 統一 API Client 原則

**核心原則：所有需要認證的 API 調用必須使用統一的 `authenticated*` 方法**

#### 正確做法 ✅

**Import：**
```typescript
import { 
  authenticatedGet, 
  authenticatedPost, 
  authenticatedPut, 
  authenticatedPatch, 
  authenticatedDelete,
  authenticatedFetch  // 特殊需求（如 FormData）
} from '../../utils/apiClient';
```

**使用：**
```typescript
// GET 請求
const response = await authenticatedGet(`${ADMIN_API}/users`);
const data = await response.json();

// POST 請求（自動處理 JSON）
const response = await authenticatedPost(`${ADMIN_API}/users`, {
  name: 'John',
  email: 'john@example.com'
});

// PUT 請求
const response = await authenticatedPut(`${ADMIN_API}/users/${id}`, data);

// PATCH 請求
const response = await authenticatedPatch(`${ADMIN_API}/users/${id}`, { name: 'New Name' });

// DELETE 請求
const response = await authenticatedDelete(`${ADMIN_API}/users/${id}`);
```

#### 錯誤做法 ❌

**禁止：手動管理 token**
```typescript
// ❌ 絕對禁止！
const token = localStorage.getItem('access_token');
const response = await fetch(url, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**禁止：直接使用 fetch 調用 ADMIN_API**
```typescript
// ❌ 絕對禁止！
const response = await fetch(`${ADMIN_API}/users`);
```

**禁止：在 API Client 函數中要求 token 參數**
```typescript
// ❌ 錯誤
async getUsers(token: string) {
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// ✅ 正確
async getUsers() {
  const response = await authenticatedGet(url);
}
```

---

### 2.2 特殊情況處理

#### FormData 上傳

**使用 `authenticatedFetch`（支持 FormData）：**
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('folder', 'uploads');

const response = await authenticatedFetch(`${ADMIN_API}/media/upload`, {
  method: 'POST',
  body: formData,  // 不要 JSON.stringify
});
```

**⚠️ 注意：**
- 不要手動設定 `Content-Type`（FormData 需要瀏覽器自動設定 boundary）
- `authenticatedFetch` 會自動添加 Authorization header

#### Public API（不需要認證）

**可以直接使用 fetch：**
```typescript
// ✅ 正確（Public API 不需要認證）
const response = await fetch(`${PUBLIC_API}/blog/posts`);
const data = await response.json();
```

#### Auth API（特殊情況）

**login/register 不需要認證：**
```typescript
// ✅ 正確
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

**getMe 必須使用 authenticatedGet：**
```typescript
// ✅ 正確
async getMe(): Promise<User> {
  const response = await authenticatedGet(`${API_BASE_URL}/auth/me`);
  return response.json();
}

// ❌ 錯誤
async getMe(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

---

## 三、錯誤處理標準

### 3.1 錯誤類型區分

**核心原則：區分網路錯誤和認證錯誤**

#### 網路錯誤檢測

```typescript
const isNetworkError = (error: any): boolean => {
  // 1. 檢查錯誤訊息
  const errorMessage = error?.message?.toLowerCase() || '';
  if (
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('network') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('econnrefused') ||
    errorMessage.includes('timeout')
  ) {
    return true;
  }
  
  // 2. 檢查錯誤類型
  if (error?.name === 'TypeError' || error?.name === 'NetworkError') {
    return true;
  }
  
  // 3. 檢查 HTTP 狀態碼（5xx 是伺服器錯誤）
  if (error?.status >= 500) {
    return true;
  }
  
  return false;
};
```

#### 錯誤處理標準

**網路錯誤：保留 tokens** ✅
```typescript
if (isNetworkError(error)) {
  console.warn('[Component] 網路錯誤，保留登入狀態');
  setUser(null);  // 只清除 user state
  // 不清除 localStorage tokens！
}
```

**認證錯誤：清除 tokens** ✅
```typescript
else {
  console.error('[Component] 認證錯誤，清除登入狀態');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  setUser(null);
}
```

### 3.2 開發環境特殊處理

**開發環境提示：**
```typescript
if (import.meta.env.DEV) {
  console.info('[DEV] 後端可能正在重啟，tokens 已保留，刷新頁面即可恢復');
}
```

**⚠️ 重要：** 開發環境不要輕易清除 tokens，因為：
- 後端經常重啟
- HMR 頻繁觸發
- 網路請求可能在不穩定的時間點發送

---

## 四、React 組件標準

### 4.1 Admin 頁面模板

**標準 Admin 頁面結構：**

```typescript
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { API_BASE_URL } from '../../config/api';
import { authenticatedGet, authenticatedPost, authenticatedPut, authenticatedDelete } from '../../utils/apiClient';

export default function AdminExample() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 正確：useEffect 無不必要的依賴
  useEffect(() => {
    loadData();
  }, []);  // 只在 mount 時執行

  const loadData = async () => {
    try {
      const response = await authenticatedGet(`${API_BASE_URL}/admin/example`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (newData: any) => {
    try {
      const response = await authenticatedPost(`${API_BASE_URL}/admin/example`, newData);
      if (response.ok) {
        alert('Created successfully');
        loadData();
      }
    } catch (error) {
      console.error('Failed to create:', error);
      alert('Create failed');
    }
  };

  const handleUpdate = async (id: number, data: any) => {
    try {
      const response = await authenticatedPut(`${API_BASE_URL}/admin/example/${id}`, data);
      if (response.ok) {
        alert('Updated successfully');
        loadData();
      }
    } catch (error) {
      console.error('Failed to update:', error);
      alert('Update failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    
    try {
      const response = await authenticatedDelete(`${API_BASE_URL}/admin/example/${id}`);
      if (response.ok) {
        alert('Deleted successfully');
        loadData();
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Delete failed');
    }
  };

  return (
    <AdminLayout>
      {/* UI 組件 */}
    </AdminLayout>
  );
}
```

### 4.2 useEffect 依賴標準

**原則：最小化依賴**

```typescript
// ✅ 正確：只在 mount 時執行
useEffect(() => {
  loadData();
}, []);

// ❌ 錯誤：不必要的依賴
useEffect(() => {
  loadData();
}, [token, user, someFunction]);  // 會導致重複執行
```

**例外情況：**
```typescript
// ✅ 正確：監聽特定狀態變化
useEffect(() => {
  if (selectedId) {
    loadDetails(selectedId);
  }
}, [selectedId]);  // 當 selectedId 變化時重新載入
```

---

## 五、API Client 層標準

### 5.1 API 函數定義標準

**contentAPI 範例：**

```typescript
export const contentAPI = {
  // ===== Public APIs（不需要認證）=====
  async getFAQs(): Promise<FAQ[]> {
    const response = await fetch(`${PUBLIC_API}/content/faqs`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },

  // ===== Admin APIs（需要認證）=====
  
  // ✅ 正確：無 token 參數
  async getAllFAQs(): Promise<FAQ[]> {
    const response = await authenticatedGet(`${ADMIN_API}/content/faqs`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },

  // ✅ 正確：使用 authenticated 方法
  async createFAQ(data: CreateFAQData): Promise<FAQ> {
    const response = await authenticatedPost(`${ADMIN_API}/content/faqs`, data);
    if (!response.ok) throw new Error('Failed to create');
    return response.json();
  },

  async updateFAQ(id: number, data: Partial<FAQ>): Promise<FAQ> {
    const response = await authenticatedPut(`${ADMIN_API}/content/faqs/${id}`, data);
    if (!response.ok) throw new Error('Failed to update');
    return response.json();
  },

  async deleteFAQ(id: number): Promise<void> {
    const response = await authenticatedDelete(`${ADMIN_API}/content/faqs/${id}`);
    if (!response.ok) throw new Error('Failed to delete');
  },
};
```

**❌ 反模式（禁止）：**

```typescript
// ❌ 要求 token 參數
async getAllFAQs(token: string): Promise<FAQ[]> {
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

// ❌ 手動 fetch
async getAllFAQs(): Promise<FAQ[]> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

---

## 六、AuthContext 標準

### 6.1 錯誤處理標準

**初始化錯誤處理：**

```typescript
useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authAPI.getMe();
      setUser(convertUser(userData));
    } catch (error) {
      // ✅ 區分錯誤類型
      if (isNetworkError(error)) {
        // 網路錯誤：保留 tokens
        console.warn('[AuthContext] 網路錯誤，保留登入狀態');
        setUser(null);
        
        if (import.meta.env.DEV) {
          console.info('[DEV] 後端可能正在重啟，tokens 已保留');
        }
      } else {
        // 認證錯誤：清除 tokens
        console.error('[AuthContext] Token 無效，清除登入狀態');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  initAuth();
}, []); // ✅ 最小依賴：只在 mount 時執行
```

**❌ 反模式：**
```typescript
// ❌ 所有錯誤都清除 tokens
catch (error) {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  setUser(null);
}

// ❌ 不必要的依賴
}, [convertUser, someOtherDep]);
```

---

## 七、自動刷新機制標準

### 7.1 核心實現（`frontend/src/utils/apiClient.ts`）

**必須實現的功能：**

1. ✅ **自動添加 Authorization header**
2. ✅ **自動捕獲 401 錯誤**
3. ✅ **自動使用 refresh_token 刷新**
4. ✅ **自動重試原始請求**
5. ✅ **處理並發請求隊列**（避免重複刷新）
6. ✅ **區分網路錯誤和認證錯誤**
7. ✅ **跨標籤頁狀態同步**
8. ✅ **刷新失敗時適當處理**

### 7.2 工作流程

```
用戶請求 API
    ↓
authenticatedFetch 自動添加 token
    ↓
發送請求到後端
    ↓
收到回應
    ├─ 200 OK → 返回數據 ✅
    ├─ 401 Unauthorized
    │   ↓
    │  檢查是否正在刷新
    │   ├─ 是 → 加入等待隊列
    │   └─ 否 → 開始刷新
    │       ↓
    │   調用 /api/auth/refresh
    │       ├─ 成功 → 更新 tokens → 重試請求 ✅
    │       └─ 失敗
    │           ├─ 網路錯誤 → 保留 tokens → 拋出錯誤 ⚠️
    │           └─ 認證錯誤 → 清除 tokens → 登出 ❌
    └─ 其他錯誤 → 直接返回
```

---

## 八、後端標準

### 8.1 Token 創建

**使用配置參數：**

```python
def create_access_token(data: dict) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = data.copy()
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(data: dict) -> str:
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = data.copy()
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
```

### 8.2 認證端點

**必須提供：**

1. **POST /api/auth/login** - 登入
2. **POST /api/auth/register** - 註冊
3. **GET /api/auth/me** - 獲取當前用戶（需要認證）
4. **POST /api/auth/refresh** - 刷新 token ⭐ 關鍵

**refresh 端點標準：**
```python
@router.post("/auth/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str):
    # 1. 驗證 refresh_token
    token_data = verify_token(refresh_token)
    
    # 2. 查詢用戶（確保仍然存在且活躍）
    user = await get_user(token_data.user_id)
    
    # 3. 生成新的 tokens（兩個都更新）
    new_access_token = create_access_token(...)
    new_refresh_token = create_refresh_token(...)
    
    # 4. 返回新 tokens 和用戶資料
    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        user=user_response
    )
```

---

## 九、測試標準

### 9.1 必須測試的場景

**基礎功能：**
- [ ] 登入成功後可訪問所有 Admin 頁面
- [ ] 所有 CRUD 操作正常
- [ ] 15 分鐘後操作自動刷新 token
- [ ] 刷新成功後操作繼續（無中斷）

**錯誤處理：**
- [ ] Refresh token 過期（7天後）自動登出
- [ ] Refresh token 無效自動登出
- [ ] 網路錯誤時保留登入狀態
- [ ] 後端重啟時保留登入狀態

**跨標籤頁：**
- [ ] 多個標籤頁登入狀態同步
- [ ] 一個標籤頁刷新，其他也更新
- [ ] 一個標籤頁登出，其他也登出

**開發環境：**
- [ ] HMR 不會導致登出
- [ ] 修改前端代碼不會登出
- [ ] 修改後端代碼（重啟）不會登出

---

## 十、常見問題和解決方案

### Q1: 為何修改代碼後會被登出？

**可能原因：**
1. ❌ authAPI.getMe 沒有使用 authenticatedGet
2. ❌ AuthContext 錯誤處理太激進
3. ❌ 後端重啟時被誤判為認證錯誤
4. ❌ useEffect 依賴導致重複執行

**解決方案：**
- ✅ 使用 authenticatedGet
- ✅ 區分錯誤類型
- ✅ 網路錯誤保留 tokens
- ✅ 最小化 useEffect 依賴

### Q2: 為何不用 Axios Interceptor？

**答案：**
- 專案已使用 fetch（不混用）
- 只需要一個功能（自動刷新）
- 輕量化（零依賴）
- 符合現代趨勢

### Q3: FormData 上傳怎麼處理？

**答案：**
使用 `authenticatedFetch`，它支持 FormData：

```typescript
const formData = new FormData();
formData.append('file', file);

const response = await authenticatedFetch(`${ADMIN_API}/upload`, {
  method: 'POST',
  body: formData,
});
```

### Q4: Public API 也要用 authenticated 方法嗎？

**答案：**
不用！Public API 可以直接使用 fetch：

```typescript
// ✅ 正確
const response = await fetch(`${PUBLIC_API}/blog/posts`);
```

---

## 十一、代碼審查清單

### 新增 Admin 頁面時必須檢查：

- [ ] ✅ 是否導入 `authenticated*` 方法？
- [ ] ✅ 是否所有 ADMIN_API 調用都使用 authenticated？
- [ ] ✅ 是否沒有 `const token = localStorage.getItem('access_token')`？
- [ ] ✅ 是否沒有手動 `Bearer ${token}`？
- [ ] ✅ useEffect 依賴是否最小化？
- [ ] ✅ 錯誤處理是否適當？

### 修改 API Client 時必須檢查：

- [ ] ✅ Admin 方法是否移除 token 參數？
- [ ] ✅ 是否使用 authenticated 方法？
- [ ] ✅ 錯誤處理是否適當？
- [ ] ✅ TypeScript 類型是否正確？

### 修改 AuthContext 時必須檢查：

- [ ] ✅ 是否區分錯誤類型？
- [ ] ✅ 網路錯誤是否保留 tokens？
- [ ] ✅ useEffect 依賴是否最小？
- [ ] ✅ 是否有適當的日誌？

---

## 十二、遷移指南（給未來的開發者）

### 如果發現舊代碼（手動管理 token）

**步驟 1：添加 import**
```typescript
import { authenticatedGet, authenticatedPost, authenticatedPut, authenticatedPatch, authenticatedDelete } from '../../utils/apiClient';
```

**步驟 2：移除 token 定義**
```typescript
// ❌ 刪除這一行
const token = localStorage.getItem('access_token');
```

**步驟 3：替換所有 fetch**
```typescript
// ❌ 舊
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
});

// ✅ 新
const response = await authenticatedPost(url, data);
```

**步驟 4：移除 token 檢查**
```typescript
// ❌ 刪除
if (!token) return;
if (!token || !confirm(...)) return;

// ✅ 改為
if (!confirm(...)) return;
```

**步驟 5：更新 useEffect 依賴**
```typescript
// ❌ 舊
useEffect(() => loadData(), [token]);

// ✅ 新
useEffect(() => loadData(), []);
```

---

## 十三、禁止事項

### 絕對禁止的做法

1. ❌ **手動管理 token**
   ```typescript
   const token = localStorage.getItem('access_token');
   ```

2. ❌ **手動添加 Authorization header**
   ```typescript
   headers: { 'Authorization': `Bearer ${token}` }
   ```

3. ❌ **在 API 函數中要求 token 參數**
   ```typescript
   async getData(token: string) { ... }
   ```

4. ❌ **直接 fetch 調用 ADMIN_API**
   ```typescript
   await fetch(`${ADMIN_API}/...`)
   ```

5. ❌ **所有錯誤都清除 tokens**
   ```typescript
   catch (error) {
     localStorage.removeItem('access_token');
   }
   ```

6. ❌ **不區分錯誤類型**
   ```typescript
   // 應該區分網路錯誤 vs 認證錯誤
   ```

7. ❌ **在 useEffect 中添加不必要的依賴**
   ```typescript
   useEffect(() => ..., [token, user, ...]);
   ```

---

## 十四、最佳實踐

### 1. 統一管理

**原則：** 所有 token 相關邏輯集中在 `apiClient.ts`

- ✅ Token 讀取
- ✅ Token 刷新
- ✅ 錯誤處理
- ✅ 重試邏輯

**好處：**
- 修改一個地方即可
- 邏輯一致
- 易於測試
- 易於維護

### 2. 錯誤處理

**原則：** 保守地清除 tokens

- ✅ 網路錯誤：保留 tokens
- ✅ 後端重啟：保留 tokens
- ✅ 5xx 錯誤：保留 tokens
- ✅ 只有明確的認證錯誤（401/403）才清除

**理由：**
- 避免誤判
- 提升用戶體驗
- 減少重新登入次數

### 3. 開發環境

**原則：** 開發環境更寬鬆

- ✅ 更詳細的日誌
- ✅ 更寬鬆的錯誤處理
- ✅ 提示用戶問題原因

**理由：**
- 後端經常重啟
- HMR 頻繁觸發
- 需要快速迭代

### 4. 日誌標準

**必須的日誌：**
```typescript
// ✅ 成功時
console.log('[Component] 操作成功');

// ✅ 網路錯誤時
console.warn('[Component] 網路錯誤，保留登入狀態');

// ✅ 認證錯誤時
console.error('[Component] 認證錯誤，清除登入狀態');

// ✅ 開發環境提示
if (import.meta.env.DEV) {
  console.info('[DEV] 額外資訊');
}
```

---

## 十五、架構決策記錄

### 為何選擇 Fetch Wrapper 而非 Axios？

**決策：** 使用原生 fetch + wrapper

**理由：**
1. ✅ 專案已使用 fetch（不引入新依賴）
2. ✅ 輕量化（零依賴）
3. ✅ 完全掌控邏輯
4. ✅ 符合現代趨勢（Next.js, Vercel 都用 fetch）
5. ✅ React Server Components 只支援 fetch

**取捨：**
- ✅ 獲得：零依賴、完全掌控、輕量化
- ❌ 失去：Axios 的進階功能（但目前不需要）

### 為何不用 SDK 封裝？

**決策：** 暫不使用 SDK

**理由：**
- 專案規模還不需要（< 100 個頁面）
- 複雜度和收益不成正比
- 目前的 wrapper 已足夠

**未來考慮：**
- 當專案 > 100 個頁面時
- 或需要更完整的類型系統時
- 可以升級到 SDK 封裝

---

## 十六、版本歷史

### v1.0（已廢棄）
- 手動管理 token
- 每個檔案自己處理
- 沒有自動刷新
- Access Token: 30 分鐘

### v2.0（現行標準）⭐
- 統一 API Client
- 自動刷新機制
- 錯誤類型區分
- Access Token: 15 分鐘
- Refresh Token: 7 天

**遷移完成日期：** 2026-01-20  
**修改檔案數：** 26 個

---

## 十七、參考資源

### 業界標準參考

- **JWT Best Practices**: https://datatracker.ietf.org/doc/html/rfc8725
- **OWASP Authentication**: https://cheatsheetseries.owasp.org/
- **Next.js Auth Patterns**: https://nextjs.org/docs/authentication
- **Supabase Auth**: https://supabase.com/docs/guides/auth

### 類似實現

- **Next.js**: 使用 fetch wrapper
- **Supabase**: 使用 fetch wrapper
- **Firebase**: 使用 SDK 封裝
- **Auth0**: 使用 SDK 封裝

---

## 十八、總結

### 核心原則

1. **統一管理** - 所有 token 邏輯集中在一處
2. **自動刷新** - 用戶無感知
3. **區分錯誤** - 不要誤清除 tokens
4. **保守處理** - 寧可保留也不要輕易清除
5. **詳細日誌** - 方便除錯

### 成功指標

- ✅ 7 天內無需重新登入
- ✅ 15 分鐘後操作無中斷
- ✅ 修改代碼不會登出
- ✅ 後端重啟不會登出
- ✅ 只有真正的認證錯誤才登出

### 禁止事項

- ❌ 手動管理 token
- ❌ 所有錯誤都清除 tokens
- ❌ 不區分錯誤類型
- ❌ 在組件中直接操作 localStorage
- ❌ 混用 fetch 和 axios

---

**遵循此標準，可確保認證系統穩定、安全、用戶體驗良好。**

**最後更新：** 2026-01-20  
**維護者：** AI Team  
**狀態：** ✅ 現行有效標準


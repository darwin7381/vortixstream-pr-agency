# 🎯 前端 API Client 管理規範

**版本：** v1.0  
**建立日期：** 2026-01-08  
**目的：** 統一前端 API 調用方式，避免單一檔案過大導致意外副作用

---

## 📌 核心原則

### 原則 1：單一檔案大小限制

```
🟢 < 500 行   - 健康狀態，維持現狀
🟡 500-1000 行 - 注意狀態，考慮分割
🟠 1000-1500 行 - 警告狀態，應該分割
🔴 > 1500 行   - 危險狀態，必須分割
```

**VortixPR 規則：**
- ✅ 任何新功能的 API，如果主 `client.ts` > 1000 行，**必須**創建獨立檔案
- ✅ 獨立檔案命名：`{功能}Client.ts`（如 `templateClient.ts`）

---

### 原則 2：按功能領域模組化

**檔案結構：**
```
src/api/
  ├── client.ts          # 主要 API（逐步縮減）
  ├── templateClient.ts  # Template 功能 ✅
  ├── blogClient.ts      # Blog 功能（待分割）
  ├── pricingClient.ts   # Pricing 功能（待分割）
  └── ...
```

**分割標準：**
- 功能獨立（如 Blog, Pricing, Template）
- API 數量 > 5 個
- 邏輯複雜度高

---

### 原則 3：避免型別名稱衝突

**❌ 不好的做法：**
```typescript
// client.ts
export interface PRTemplate { ... }

// templateData.ts
export interface PRTemplate { ... }  // ← 衝突！
```

**✅ 正確做法：**
```typescript
// templateClient.ts（唯一定義處）
export interface PRTemplate { ... }

// 其他檔案只 import，不定義
import { PRTemplate } from '@/api/templateClient';
```

**規則：**
- 每個型別只在**一個地方**定義
- 優先在對應的 API client 中定義
- 避免通用名稱（如 `Data`, `Item`）

---

## 🏗️ **標準架構**

### **方案選擇（根據專案規模）：**

#### 方案 A：單一檔案（不推薦 - VortixPR 已超過）
```
src/api/client.ts (所有 API)
```
- 適用：< 1000 行
- VortixPR：❌ 已達 1588 行

#### 方案 B：功能模組化 ✅ **VortixPR 採用**
```
src/api/
  ├── client.ts (共用 + 遺留 API)
  ├── templateClient.ts
  ├── blogClient.ts (待分割)
  └── ...
```
- 適用：1000-5000 行
- VortixPR：✅ 當前方案

#### 方案 C：完整資料夾結構（未來）
```
src/api/
  ├── blog/
  │   ├── types.ts
  │   ├── client.ts
  │   └── hooks.ts
  ├── template/
  │   ├── types.ts
  │   ├── client.ts
  │   └── hooks.ts
  └── ...
```
- 適用：> 5000 行
- VortixPR：⏳ 未來考慮

---

## 📋 **實作規範**

### **創建新的 API Client 檔案：**

**1. 檔案命名：**
```
{功能名稱}Client.ts
例：blogClient.ts, templateClient.ts, userClient.ts
```

**2. 檔案結構：**
```typescript
/**
 * {功能名稱} API Client
 * 管理所有 {功能} 相關的 API 調用
 */

import { API_BASE_URL, PUBLIC_API, ADMIN_API } from '../config/api';

// ========== Types ==========
export interface {功能}Data {
  id: number;
  // ...
}

// ========== API Methods ==========
export const {功能}API = {
  async get{功能}s(): Promise<{功能}Data[]> {
    const response = await fetch(`${PUBLIC_API}/{功能}s`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },
  
  // ... 其他方法
};
```

**3. 使用方式：**
```typescript
// 在組件中
import { templateAPI, PRTemplate } from '@/api/templateClient';

const templates = await templateAPI.getTemplates();
```

---

### **共用配置：**

**統一使用 `config/api.ts`：**
```typescript
// config/api.ts
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_BASE_URL = BASE;
export const PUBLIC_API = `${BASE}/public`;
export const ADMIN_API = `${BASE}/admin`;
export const WRITE_API = `${BASE}/write`;
```

**所有 client 都從這裡 import！**

---

## ⚠️ **重要警告**

### **禁止事項：**

1. **❌ 在超過 1500 行的檔案中新增大量程式碼**
   - 可能產生意外的全域副作用
   - 影響其他看似無關的功能
   - TypeScript 編譯器可能混亂

2. **❌ 重複定義相同名稱的 interface**
   ```typescript
   // 檔案 A
   export interface UserData { ... }
   
   // 檔案 B  
   export interface UserData { ... }  // ← 衝突！
   ```

3. **❌ 在 API client 中執行業務邏輯**
   ```typescript
   // ❌ 不要這樣
   async getUsers() {
     const users = await fetch(...);
     // 複雜的資料轉換、過濾、計算
     return processedUsers;
   }
   
   // ✅ 應該這樣
   async getUsers() {
     const response = await fetch(...);
     return response.json();  // 只負責 API 調用
   }
   ```

---

## ✅ **最佳實踐**

### **1. 檔案大小管理**
```bash
# 定期檢查檔案大小
wc -l src/api/*.ts

# 當發現 > 1000 行時，立即分割
```

### **2. 功能隔離**
- 每個功能領域有獨立的 client
- 避免交叉依賴
- 保持模組獨立可測試

### **3. 型別定義位置**
```
優先順序：
1. API Client 檔案本身（推薦）
2. 獨立的 types.ts
3. ❌ 不要在多處定義相同型別
```

### **4. 測試新 API 時**
- ✅ 先測試 API 功能正常
- ✅ 測試時注意其他功能（如用戶頭像）
- ✅ 確認沒有意外副作用

---

## 📊 **VortixPR 遷移計劃**

### **當前狀態：**
```
client.ts - 1588 行（包含 Blog, Pricing, User, Auth, etc.）
```

### **已完成：**
✅ `templateClient.ts` - 133 行（Template 功能獨立）

### **建議未來分割：**
```
1. blogClient.ts (預估 200 行)
2. pricingClient.ts (預估 150 行)
3. prPackageClient.ts (預估 180 行)
4. userClient.ts (預估 120 行)
5. authClient.ts (預估 100 行)
6. mediaClient.ts (預估 150 行)
7. siteClient.ts (預估 200 行)

保留 client.ts 作為：
- 共用工具函數
- 向後兼容
- 逐步遷移
```

---

## 🔍 **檢查清單**

### **新增 API 前：**
- [ ] 檢查 `client.ts` 目前行數
- [ ] 如果 > 1000 行 → 創建獨立檔案
- [ ] 確認型別名稱不衝突
- [ ] 規劃好 import 路徑

### **新增 API 後：**
- [ ] 測試 API 功能
- [ ] 測試其他現有功能（特別是用戶相關）
- [ ] 檢查是否有 TypeScript 錯誤
- [ ] 確認頁面正常渲染

---

## 📚 **參考資料**

- **本專案案例：** `LESSONS_FRONTEND_API_CLIENT_MANAGEMENT.md`
- **業界標準：** 
  - Next.js API Routes
  - tRPC Client
  - React Query

---

## ✅ **規範摘要**

| 規則 | 說明 |
|------|------|
| 檔案大小 | < 500 行為佳，絕不超過 1500 行 |
| 分割時機 | 超過 1000 行或新增大功能時 |
| 命名規範 | `{功能}Client.ts` |
| 型別定義 | 每個型別只定義一次 |
| 測試要求 | 測試新功能 + 驗證現有功能 |

---

**維護者：** VortixPR Team  
**狀態：** ✅ 強制執行  
**更新：** 發現新問題時補充



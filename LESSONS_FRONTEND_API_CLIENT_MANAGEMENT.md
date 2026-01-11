# 🚨 前端 API Client 管理教訓

**事件日期：** 2026-01-08  
**影響範圍：** 全站用戶頭像破圖  
**根本原因：** 在大型 client.ts 中新增程式碼導致意外副作用

---

## ⚠️ **問題描述**

### **症狀：**
- 所有用戶頭像同時破圖（前台 + 後台）
- 圖片 URL 本身正確（直接打開可見）
- 但在頁面中無法顯示
- 沒有明顯的錯誤訊息

### **觸發原因：**
在主要的 `client.ts` (1710行) 中新增了 ~120行 Template API 相關程式碼

### **為何會影響頭像？**
1. `client.ts` 包含所有 API 方法（Blog, Pricing, User, Auth, etc.）
2. 當此文件被修改時，**所有 import 此文件的組件都會重新編譯**
3. 新增大量程式碼可能觸發：
   - TypeScript 模組重新解析
   - React 組件重新渲染
   - 某些隱藏的型別衝突
   - 意外的全域副作用

---

## 🎯 **解決方案**

### **立即修復：**
✅ 將 Template API 獨立到 `api/templateClient.ts`
✅ 從主 `client.ts` 中移除 Template 相關程式碼
✅ 避免污染主要 API 文件

### **長期策略：**
當 `client.ts` 超過 1000 行時，應該開始模組化。

---

## 📚 **什麼是 client.ts？**

### **作用：**
`client.ts` 是**統一的 API 調用層**，負責：

1. **統一管理所有後端 API 調用**
   ```typescript
   // 不好的做法：每個組件自己寫 fetch
   fetch('http://localhost:8000/api/blog/posts')
   
   // 好的做法：使用統一的 API client
   import { blogAPI } from '@/api/client';
   blogAPI.getPosts();
   ```

2. **提供型別安全**
   ```typescript
   // 自動型別推斷和檢查
   const posts: BlogPost[] = await blogAPI.getPosts();
   ```

3. **集中處理**
   - 認證 token
   - 錯誤處理
   - Loading 狀態
   - API 基礎 URL

4. **易於維護**
   - API 端點改變時只需改一處
   - 不需要在每個組件中搜尋和替換

---

## 🏗️ **正規做法對比**

### **方案 A：單一 client.ts**（小型專案）
```
src/api/
  └── client.ts (所有 API)
```

**適用：**
- ✅ API 數量 < 20 個
- ✅ 檔案 < 1000 行
- ✅ 團隊 1-2 人

**優點：**
- 簡單直接
- 所有 API 在一處

**缺點：**
- ❌ 檔案過大時難以維護
- ❌ 修改可能影響所有 import

---

### **方案 B：按功能模組化**（中型專案）✅ **推薦**
```
src/api/
  ├── client.ts (共用工具 + 基礎配置)
  ├── blogClient.ts
  ├── pricingClient.ts
  ├── templateClient.ts ← 我們現在的做法
  ├── userClient.ts
  └── authClient.ts
```

**適用：**
- ✅ API 數量 20-100 個
- ✅ 檔案分散，每個 < 500 行
- ✅ 團隊 2-5 人

**優點：**
- ✅ 模組化清晰
- ✅ 修改隔離，不影響其他模組
- ✅ 容易找到對應的 API

**缺點：**
- 需要管理多個檔案

---

### **方案 C：資料夾結構**（大型專案）
```
src/api/
  ├── blog/
  │   ├── types.ts
  │   ├── client.ts
  │   └── hooks.ts
  ├── pricing/
  │   ├── types.ts
  │   └── client.ts
  └── template/
      ├── types.ts
      ├── client.ts
      └── hooks.ts
```

**適用：**
- ✅ API 數量 > 100 個
- ✅ 每個功能都很複雜
- ✅ 大型團隊

---

### **方案 D：使用工具**（企業級）
```
- tRPC (端到端型別安全)
- React Query (資料快取管理)
- RTK Query (Redux 生態)
- SWR (Vercel 出品)
```

**適用：**
- 需要複雜的快取策略
- 需要樂觀更新
- 需要自動重新驗證

---

## 🎯 **VortixPR 的選擇**

### **目前狀態：**
採用 **方案 B（模組化）**

**原因：**
1. ✅ `client.ts` 已達 1700+ 行（太大了）
2. ✅ 功能領域明確（Blog, Pricing, Template, etc.）
3. ✅ 團隊規模適中
4. ✅ 避免單一文件過大的副作用

---

## ✅ **最佳實踐原則**

### **1. 單一文件大小限制**
```
❌ 避免：單一 API client > 1500 行
✅ 建議：每個檔案 < 500 行
```

### **2. 按功能領域分割**
```
✅ blogClient.ts - Blog 相關 API
✅ templateClient.ts - Template 相關 API
✅ authClient.ts - 認證相關 API
```

### **3. 共用配置統一管理**
```typescript
// config/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL;
export const PUBLIC_API = `${API_BASE_URL}/public`;
export const ADMIN_API = `${API_BASE_URL}/admin`;
```

### **4. 型別定義**
```
選項 A：定義在同檔案（簡單）
選項 B：獨立 types.ts（大型專案）

VortixPR：選項 A（夠用）
```

---

## 🚨 **重要教訓**

### **❌ 不要做的事：**

1. **在巨大的共用檔案中新增大量程式碼**
   ```
   ❌ client.ts (1700行) + 新增 120行 = 意外副作用
   ```

2. **重複定義相同名稱的 interface**
   ```
   ❌ client.ts: export interface PRTemplate
   ❌ templateData.ts: export interface PRTemplate
   → TypeScript 混淆 → 全域影響
   ```

3. **忽略檔案大小警訊**
   ```
   ⚠️ 當檔案 > 1000 行，考慮分割
   ⚠️ 當檔案 > 1500 行，必須分割
   ```

### **✅ 應該做的事：**

1. **新功能使用獨立檔案**
   ```
   ✅ 新增 templateClient.ts
   ✅ 保持 client.ts 穩定
   ```

2. **避免型別名稱衝突**
   ```
   ✅ 統一的型別定義位置
   ✅ 使用明確的命名（避免通用名稱）
   ```

3. **逐步重構大檔案**
   ```
   ✅ 將現有的 1700 行 client.ts 分割：
      - blogClient.ts
      - pricingClient.ts
      - userClient.ts
      - etc.
   ```

---

## 📋 **檢查清單**

### **新增 API 時：**

- [ ] 檢查 `client.ts` 目前行數
- [ ] 如果 > 1500 行 → 創建獨立 client
- [ ] 如果 < 1500 行 → 可以加入，但注意影響
- [ ] 測試時注意是否影響其他功能
- [ ] 檢查是否有型別名稱衝突

### **重構時機：**

- [ ] 單一檔案 > 1500 行
- [ ] 修改導致意外副作用
- [ ] 編譯時間明顯變長
- [ ] 團隊成員抱怨難以維護

---

## 🎓 **技術背景**

### **為什麼大檔案會有副作用？**

1. **TypeScript 編譯器**
   - 檔案越大，型別推斷越複雜
   - 可能產生意外的型別聯合或交集
   - 影響所有 import 此檔案的組件

2. **Webpack/Vite 打包**
   - 模組依賴關係複雜
   - 熱更新時可能觸發連鎖反應
   - 影響 tree-shaking 效率

3. **React 渲染**
   - import 關係改變可能觸發重新渲染
   - 型別改變可能導致 props 不匹配
   - 影響 memo 和 useMemo 的效果

---

## 📊 **VortixPR 當前架構**

### **現狀：**
```
src/api/
  ├── client.ts (1588 行) ← 仍然很大，但已移除 Template
  └── templateClient.ts (133 行) ← 新增，獨立乾淨
```

### **建議未來重構：**
```
src/api/
  ├── config.ts (API URLs)
  ├── types.ts (共用型別)
  ├── utils.ts (共用工具函數)
  ├── blogClient.ts
  ├── pricingClient.ts
  ├── prPackageClient.ts
  ├── templateClient.ts ✅
  ├── userClient.ts
  ├── authClient.ts
  ├── mediaClient.ts
  └── siteClient.ts
```

---

## ✅ **總結**

### **關鍵教訓：**
> **大型共用檔案是危險的！修改可能產生意外的全域副作用。**
> 
> **新功能應使用獨立模組，保持隔離，避免污染現有系統。**

### **行動準則：**
1. ✅ 新 API → 新檔案（如果主檔案 > 1000 行）
2. ✅ 測試時注意副作用（特別是看似無關的功能）
3. ✅ 保持模組小而專注
4. ❌ 永遠不要在 1500+ 行的檔案中新增大量程式碼

---

**維護者：** VortixPR Team  
**更新日期：** 2026-01-08  
**事件級別：** 🔴 Critical（影響全站功能）



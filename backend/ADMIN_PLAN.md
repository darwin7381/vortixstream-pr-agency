# 管理後台計劃

## 📋 階段性實作

### 階段 1: 使用內建 API 文件（立即可用）

**FastAPI Swagger UI** 已經提供了完整的管理介面！

訪問：http://localhost:8000/docs

**功能：**
- ✅ 測試所有 API
- ✅ 創建/更新/刪除文章
- ✅ 管理定價方案
- ✅ 查看聯絡表單提交
- ✅ 查看 Newsletter 訂閱者

**優點：**
- 無需額外開發
- 自動生成文件
- 可以直接用於管理內容

**缺點：**
- UI 較為技術性
- 無法批量操作
- 沒有豐富的編輯器

---

### 階段 2: 簡單的 React 管理後台（建議）

創建一個輕量級的 React 管理介面。

#### 技術棧
```
React + Vite
TailwindCSS（復用前端樣式）
React Query（API 呼叫）
React Hook Form（表單）
React Router（路由）
```

#### 專案結構
```
admin/                          # 新資料夾
├── src/
│   ├── components/
│   │   ├── BlogEditor.tsx     # Blog 編輯器
│   │   ├── PricingEditor.tsx  # Pricing 編輯器
│   │   ├── ContactList.tsx    # 聯絡表單列表
│   │   └── NewsletterList.tsx # Newsletter 列表
│   ├── pages/
│   │   ├── Dashboard.tsx      # 儀表板
│   │   ├── BlogPage.tsx       # Blog 管理
│   │   └── PricingPage.tsx    # Pricing 管理
│   ├── api/
│   │   └── client.ts          # API 呼叫
│   └── App.tsx
├── package.json
└── vite.config.ts
```

#### 核心功能
```
1. Blog 管理
   - 文章列表（分頁、搜尋）
   - 創建/編輯文章
   - Markdown 編輯器
   - 圖片上傳（未來）
   - 草稿/發布切換

2. Pricing 管理
   - 方案列表
   - 創建/編輯方案
   - 調整顯示順序
   - 啟用/停用方案

3. 聯絡表單管理
   - 查看提交列表
   - 標記狀態（新/已讀/已回覆）
   - 快速回覆功能

4. Newsletter 管理
   - 訂閱者列表
   - 匯出功能
   - 統計資訊
```

#### 開發時間估計
- 基礎架構：2-3 小時
- Blog 管理：3-4 小時
- Pricing 管理：2-3 小時
- Contact/Newsletter：2-3 小時
- **總計：約 1-2 天**

---

### 階段 3: 進階功能（未來）

```
✅ 認證系統（登入/登出）
✅ 角色權限管理
✅ 圖片上傳到 Cloudflare R2
✅ 批量操作
✅ 資料匯出（CSV, JSON）
✅ 統計圖表
✅ AI 輔助寫作
✅ SEO 分析工具
```

---

## 🎯 目前建議

### 立即使用（今天）：
**使用 FastAPI Swagger UI** (http://localhost:8000/docs)

優點：
- ✅ 零開發時間
- ✅ 完整功能
- ✅ 已經可以管理所有內容
- ✅ 專注於前端整合

### 下一步（完成前端整合後）：
**建立簡單的 React 管理後台**

原因：
- 更友善的 UI
- 更好的編輯體驗
- 可以給非技術人員使用
- 可以加入自訂功能

---

## 📝 快速開始指南

### 使用 Swagger UI 管理內容

#### 1. 創建 Blog 文章

1. 訪問 http://localhost:8000/docs
2. 找到 `POST /api/blog/posts`
3. 點擊 "Try it out"
4. 填入 JSON：

```json
{
  "title": "我的第一篇文章",
  "category": "PR Strategy",
  "excerpt": "這是摘要...",
  "content": "這是完整內容...",
  "author": "VortixPR Team",
  "read_time": 5,
  "image_url": "https://...",
  "status": "published"
}
```

5. 點擊 "Execute"
6. 完成！

#### 2. 查看文章列表

1. 找到 `GET /api/blog/posts`
2. 點擊 "Try it out"
3. 設定參數（page, category, 等）
4. 點擊 "Execute"
5. 看到所有文章！

#### 3. 更新定價方案

1. 找到 `PUT /api/pricing/packages/{id}`
2. 輸入 package ID
3. 填入要更新的欄位
4. Execute

---

## 🚀 React 管理後台實作（如果需要）

### 快速腳手架

```bash
# 在根目錄創建 admin 資料夾
cd /Users/JL/Development/bd/a-new-pr-agency
mkdir admin
cd admin

# 使用 Vite 創建 React 專案
npm create vite@latest . -- --template react-ts

# 安裝依賴
npm install
npm install @tanstack/react-query axios react-router-dom
npm install -D tailwindcss postcss autoprefixer

# 啟動
npm run dev
```

### API Client 範例

```typescript
// admin/src/api/client.ts
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const blogAPI = {
  getPosts: (params?: any) => 
    axios.get(`${API_URL}/blog/posts`, { params }),
  
  createPost: (data: any) => 
    axios.post(`${API_URL}/blog/posts`, data),
  
  updatePost: (id: number, data: any) => 
    axios.put(`${API_URL}/blog/posts/${id}`, data),
  
  deletePost: (id: number) => 
    axios.delete(`${API_URL}/blog/posts/${id}`),
};

export const pricingAPI = {
  getPackages: () => 
    axios.get(`${API_URL}/pricing/packages`),
  
  createPackage: (data: any) => 
    axios.post(`${API_URL}/pricing/packages`, data),
  
  updatePackage: (id: number, data: any) => 
    axios.put(`${API_URL}/pricing/packages/${id}`, data),
};
```

---

## ✅ 結論

**立即行動：**
1. 使用 Swagger UI 管理內容 (http://localhost:8000/docs)
2. 完成前端整合
3. 評估是否需要專用的管理後台

**未來擴展：**
- 如果需要給非技術人員使用 → 建立 React 管理後台
- 如果只有技術團隊使用 → Swagger UI 已經足夠


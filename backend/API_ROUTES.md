# API 路徑規劃

## 🎯 路徑分類策略

基於 Cloudflare 快取政策，所有 API 按資料性質分類：

### `/api/public/` - 公開資料（可大量快取）
所有人看到的內容相同，變動頻率低，適合長時間快取。

### `/api/write/` - 寫入操作（絕不快取）
改變資料狀態的操作，絕對不能快取。

### `/api/admin/` - 管理操作（需認證，不快取）
管理員專用，包含敏感操作，需要認證。

---

## 📡 完整 API 清單

### Public APIs (可快取 1-24 小時)

#### Blog
```
GET  /api/public/blog/posts              # 文章列表（分頁、搜尋、分類）
GET  /api/public/blog/posts/{slug}       # 單篇文章
GET  /api/public/blog/categories         # 分類列表
```

#### Pricing (基礎方案)
```
GET  /api/public/pricing/packages        # 方案列表
GET  /api/public/pricing/packages/{slug} # 單個方案
```

#### PR Packages (首頁使用)
```
GET  /api/public/pr-packages/            # 所有 Packages（按分類）
GET  /api/public/pr-packages/{slug}      # 單個 Package
```

---

### Write APIs (絕不快取)

#### Contact
```
POST /api/write/contact/submit           # 提交聯絡表單
```

#### Newsletter
```
POST /api/write/newsletter/subscribe     # 訂閱
POST /api/write/newsletter/unsubscribe   # 取消訂閱
```

#### Publisher
```
POST /api/write/publisher/apply          # 提交 Publisher 申請
```

---

### Admin APIs (需認證，不快取)

#### Blog 管理
```
POST   /api/admin/blog/posts             # 創建文章
PUT    /api/admin/blog/posts/{id}        # 更新文章
DELETE /api/admin/blog/posts/{id}        # 刪除文章
```

#### Pricing 管理
```
POST   /api/admin/pricing/packages       # 創建方案
PUT    /api/admin/pricing/packages/{id}  # 更新方案
DELETE /api/admin/pricing/packages/{id}  # 刪除方案
```

#### PR Packages 管理
```
POST   /api/admin/pr-packages/           # 創建 PR Package
DELETE /api/admin/pr-packages/{id}       # 刪除 PR Package
```

#### 內容管理
```
GET  /api/admin/contact/submissions      # 查看聯絡表單提交
GET  /api/admin/newsletter/subscribers   # 查看訂閱者列表
GET  /api/admin/publisher/applications   # 查看 Publisher 申請
```

---

## 🔧 Cloudflare Workers 快取設定

### 基礎設定

```javascript
// cloudflare-worker.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cache = caches.default;
    
    // Public API - 快取 1 小時
    if (url.pathname.startsWith('/api/public/')) {
      const cacheKey = new Request(url.toString(), request);
      let response = await cache.match(cacheKey);
      
      if (!response) {
        response = await env.BACKEND.fetch(request);
        response = new Response(response.body, response);
        response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=7200');
        response.headers.set('CDN-Cache-Control', 'max-age=7200');
        await cache.put(cacheKey, response.clone());
      }
      
      return response;
    }
    
    // Write API - 不快取
    if (url.pathname.startsWith('/api/write/')) {
      const response = await env.BACKEND.fetch(request);
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return response;
    }
    
    // Admin API - 檢查認證，不快取
    if (url.pathname.startsWith('/api/admin/')) {
      const token = request.headers.get('Authorization');
      if (!token || !await verifyToken(token, env)) {
        return new Response('Unauthorized', { status: 401 });
      }
      
      const response = await env.BACKEND.fetch(request);
      response.headers.set('Cache-Control', 'private, no-store');
      return response;
    }
    
    return env.BACKEND.fetch(request);
  }
};
```

### 進階快取策略

```javascript
// 不同類型的快取時間
const CACHE_SETTINGS = {
  '/api/public/blog/posts': {
    maxAge: 1800,      // 30 分鐘
    sMaxAge: 3600      // CDN 快取 1 小時
  },
  '/api/public/pricing/packages': {
    maxAge: 7200,      // 2 小時
    sMaxAge: 14400     // CDN 快取 4 小時
  },
  '/api/public/pr-packages/': {
    maxAge: 7200,      // 2 小時
    sMaxAge: 14400     // CDN 快取 4 小時
  }
};

// 動態設定快取時間
function getCacheControl(pathname) {
  for (const [path, settings] of Object.entries(CACHE_SETTINGS)) {
    if (pathname.startsWith(path)) {
      return `public, max-age=${settings.maxAge}, s-maxage=${settings.sMaxAge}`;
    }
  }
  return 'public, max-age=3600';  // 預設 1 小時
}
```

---

## 📊 快取效益預估

### 假設流量
- 每月 100,000 次 API 請求
- 60% 為 Blog 相關（60,000 次）
- 30% 為 Pricing 相關（30,000 次）
- 10% 為 Newsletter/Contact（10,000 次）

### 使用快取後
```
Public APIs (90%):
  快取命中率 90% (使用 Cloudflare Edge Cache)
  → 實際到達後端: 9,000 次
  → 節省: 81,000 次 (90%)

Write APIs (10%):
  不快取，全部到達後端: 10,000 次

總計:
  後端實際處理: 19,000 次
  節省: 81% 的後端負載
```

### 成本節省
```
無快取:
  100,000 次 × $0.0001 = $10/月

有快取:
  19,000 次 × $0.0001 = $1.90/月

節省: $8.10/月 (81%)
```

---

## ✅ 實施檢查清單

### 後端
- [x] API 路徑重構為 /public/, /write/, /admin/
- [x] 更新所有 router 註冊
- [x] 測試所有 API 端點
- [ ] 未來加入認證中間件（/admin/）

### 前端
- [x] 更新 API Client 使用新路徑
- [x] 測試所有 API 呼叫

### 部署
- [ ] 設定 Cloudflare Workers
- [ ] 配置快取規則
- [ ] 測試快取效果
- [ ] 監控快取命中率

---

## 🚀 未來擴展

### 當需要新 API 時，問自己：

1. **這個 API 回傳的資料是公開的嗎？**
   - 是 → `/api/public/`
   - 否 → 繼續下一步

2. **這個 API 是寫入操作嗎？**
   - 是 → `/api/write/`
   - 否 → 繼續下一步

3. **這個 API 需要認證嗎？**
   - 是 → `/api/admin/` 或 `/api/private/`
   - 否 → 重新檢查分類

### 範例決策流程

```
Q: 新增「取得文章瀏覽統計」API
A: 
  - 公開？否（每個文章的統計不同）
  - 寫入？否（只是讀取）
  - 認證？否（公開統計）
  → 放在 /api/public/ 但短快取（5 分鐘）

Q: 新增「提交評論」API
A:
  - 公開？否
  - 寫入？是
  → 放在 /api/write/

Q: 新增「刪除評論」API
A:
  - 公開？否
  - 寫入？是
  - 認證？是（只有管理員可刪除）
  → 放在 /api/admin/
```



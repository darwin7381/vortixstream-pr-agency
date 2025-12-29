# 🚀 部署前檢查清單 - 避免常見錯誤

**目的**: 確保上線前沒有硬編碼、環境變數問題、HTTP/HTTPS 混用等愚蠢錯誤  
**使用時機**: 每次部署到生產環境前

---

## 🔥 最關鍵的規則（必讀）

### ⚠️ 絕對不要使用 fallback

**❌ 錯誤（會靜靜地使用錯誤的 URL）**：
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                                                ↑ 危險的 fallback
```

**✅ 正確（沒設定就報錯，立即發現問題）**：
```typescript
const API_URL = import.meta.env.VITE_API_URL;
// 如果沒設定 → undefined → 請求失敗 → 立即發現
```

**為什麼？**
- 有 fallback：生產端沒設環境變數 → 靜靜用 localhost → Mixed Content → 難以發現
- 沒 fallback：生產端沒設環境變數 → 立即報錯 → 馬上修正

**檢查方式**：
```bash
# 搜尋所有 fallback
grep -r "|| 'http" frontend/src/
# 不應該有任何結果！
```

---

## ⚠️ 常見愚蠢錯誤列表

### 1. 硬編碼 URL（最常見！）

**❌ 絕對禁止**：
```typescript
// 前端
const API_URL = 'http://localhost:8000/api';  // ❌
const API_URL = 'http://api.vortixpr.com';    // ❌
const FRONTEND_URL = 'http://localhost:3000'; // ❌

// 後端
frontend_url = "http://localhost:3000"        # ❌
redirect_uri = "http://localhost:8000"        # ❌
```

**✅ 正確做法**：
```typescript
// 前端：統一使用 config/api.ts
import { API_BASE_URL } from '../config/api';

// 後端：使用 settings
from app.config import settings
frontend_url = settings.FRONTEND_URL
```

---

### 2. HTTP vs HTTPS 混用

**問題**：
```
前端：https://vortixpr.com
API：http://api.vortixpr.com  ← 錯誤！
結果：Mixed Content，請求被瀏覽器阻擋
```

**✅ 檢查項目**：
- [ ] `.env.production` 中的 URL 都是 HTTPS
- [ ] `VITE_API_URL` 是 HTTPS
- [ ] `GOOGLE_REDIRECT_URI` 是 HTTPS
- [ ] `FRONTEND_URL` 是 HTTPS

---

### 3. 環境變數沒有設定

**常見遺漏**：
```bash
# 本地端有設定，生產端忘記設
VITE_API_URL=https://api.vortixpr.com/api
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
SECRET_KEY=xxx
SUPER_ADMIN_EMAIL=xxx
```

---

### 4. CORS 設定錯誤

**問題**：
```python
# 後端 .env
ALLOWED_ORIGINS=http://localhost:3000  ← 生產端無法訪問
```

**✅ 正確**：
```python
# 生產端
ALLOWED_ORIGINS=https://vortixpr.com,https://www.vortixpr.com
```

---

### 5. Pydantic 模型沒更新

**問題**：
```python
# 加了資料庫欄位
ALTER TABLE users ADD COLUMN account_status VARCHAR(20);

# 但忘記更新模型
class UserResponse(BaseModel):
    # account_status 沒定義 ← 欄位會被過濾掉
```

**✅ 檢查**：
- [ ] 新增資料庫欄位時，同步更新對應的 Pydantic 模型

---

## 📋 部署前完整檢查清單

### 前端檢查

```bash
# 1. 檢查是否有 fallback（最重要！）
grep -r "|| 'http" frontend/src/
# 不應該有任何結果

# 2. 搜尋硬編碼 URL
grep -r "localhost:3000\|localhost:5173\|localhost:8000" frontend/src/
# 應該很少或沒有

# 3. 檢查本地環境變數
cat frontend/.env.local
# 確認 VITE_API_URL 有設定

# 4. 測試 build
npm run build
# 應該成功
```

---

### 後端檢查

```bash
# 1. 搜尋硬編碼 URL
grep -r "localhost\|http://" backend/app/ | grep -v ".pyc\|__pycache__"
# 應該只在 fallback 中出現

# 2. 檢查環境變數
cat backend/.env
# 確認所有 URL 都正確

# 3. 檢查生產端環境變數（Railway/Vercel）
# - DATABASE_URL
# - SECRET_KEY（不同於本地！）
# - FRONTEND_URL（HTTPS）
# - GOOGLE_REDIRECT_URI（HTTPS）
# - ALLOWED_ORIGINS（HTTPS）
# - SUPER_ADMIN_EMAIL

# 4. 檢查 Pydantic 模型
# 如果有新增資料庫欄位，確認對應的 response_model 也有更新
```

---

### 資料庫檢查

```bash
# 1. 檢查生產端資料庫結構
# 確認所有新表和新欄位都已創建

# 2. 檢查 Super Admin
SELECT email, role, account_status FROM users WHERE email = '<你的email>';
# 確認角色是 super_admin

# 3. 檢查資料一致性
SELECT COUNT(*) FROM users WHERE account_status IS NULL;
# 應該是 0
```

---

## 🎯 快速檢查腳本

**創建檢查腳本**：

```bash
#!/bin/bash
# check-before-deploy.sh

echo "🔍 部署前檢查..."

echo "\n1. 檢查前端硬編碼 URL..."
grep -r "localhost:3000\|localhost:5173\|localhost:8000" frontend/src/ --exclude-dir=node_modules | grep -v "fallback\|config/api"

echo "\n2. 檢查前端 HTTP URL..."
grep -r 'http://' frontend/src/ --exclude-dir=node_modules | grep -v localhost | grep -v "config/api"

echo "\n3. 檢查後端硬編碼 URL..."
grep -r "localhost" backend/app/ --include="*.py" | grep -v ".pyc" | grep -v "fallback"

echo "\n4. 檢查環境變數檔案..."
if [ -f "frontend/.env.production" ]; then
    echo "✅ frontend/.env.production 存在"
    grep "VITE_API_URL" frontend/.env.production
else
    echo "⚠️  frontend/.env.production 不存在"
fi

echo "\n5. 測試前端 build..."
cd frontend && npm run build && echo "✅ Build 成功" || echo "❌ Build 失敗"

echo "\n✅ 檢查完成"
```

---

## 📝 環境變數範本

### 前端（簡單方案）

**本地端 (.env.local)**：
```env
VITE_API_URL=http://localhost:8000/api
```

**範本 (.env.example)**：
```env
VITE_API_URL=http://localhost:8000/api
```

**生產端**：
- Vercel: 在 Dashboard 設定環境變數
- Netlify: 在 Dashboard 設定環境變數
- 不需要 .env.production 檔案

### 後端本地 (backend/.env)
```env
DATABASE_URL=postgresql://...
SECRET_KEY=dev-secret-key-123
FRONTEND_URL=http://localhost:3000
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
ALLOWED_ORIGINS=http://localhost:3000
```

### 後端生產 (Railway 環境變數)
```env
DATABASE_URL=postgresql://...（Railway 提供）
SECRET_KEY=<生產專用，不同於本地>
FRONTEND_URL=https://vortixpr.com
GOOGLE_REDIRECT_URI=https://api.vortixpr.com/api/auth/google/callback
ALLOWED_ORIGINS=https://vortixpr.com,https://www.vortixpr.com
SUPER_ADMIN_EMAIL=your@email.com
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

---

## 🔥 緊急修復指南

### 如果生產端出現 Mixed Content

**症狀**：
```
Mixed Content: The page at 'https://...' was loaded over HTTPS, 
but requested an insecure resource 'http://...'
```

**診斷**：
```bash
# 前端 build 目錄檢查
grep -r "http://" frontend/build/ | grep -v localhost
```

**修復**：
1. 檢查 `.env.production`
2. 確認 `VITE_API_URL` 是 HTTPS
3. 重新 build
4. 重新部署

---

### 如果生產端 403 Forbidden

**可能原因**：
1. Token 無效（SECRET_KEY 不同）
2. CORS 設定錯誤
3. 用戶角色在生產端不是 admin/super_admin

**診斷**：
```sql
-- 連到生產端資料庫
SELECT email, role, account_status FROM users WHERE email = 'your@email.com';
```

**修復**：
1. 確認生產端 `SUPER_ADMIN_EMAIL` 設定
2. 重啟後端（觸發 Super Admin 提升）
3. 登出重新登入（取得新 token）

---

### 如果前端請求本地端 API

**症狀**：
```
生產端請求 http://localhost:8000 或 http://api.vortixpr.com
```

**原因**：
- 某個組件硬編碼了 URL
- 沒有使用環境變數

**修復**：
```bash
# 搜尋所有硬編碼
grep -r "localhost:8000\|http://api" frontend/src/

# 全部改用
import { API_BASE_URL } from '../config/api';
```

---

## 🎓 最佳實踐

### DO（該做的）

✅ **統一配置**
```typescript
// 前端：只在一個地方定義
// src/config/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// 其他地方：import
import { API_BASE_URL } from '../config/api';
```

✅ **後端：使用 settings**
```python
from app.config import settings
url = settings.FRONTEND_URL  # 不要硬編碼
```

✅ **環境變數文件化**
- `.env.example` - 範本
- `.env.local` - 本地開發
- `.env.production` - 生產環境

---

### DON'T（禁止做的）

❌ **每個文件各自定義 API_URL**
```typescript
// 禁止！
const API = 'http://localhost:8000';
```

❌ **寫死協議（http/https）**
```typescript
// 禁止！
const url = `http://${domain}`;
```

❌ **環境判斷寫死**
```typescript
// 禁止！
const API = process.env.NODE_ENV === 'production' 
  ? 'https://api.vortixpr.com' 
  : 'http://localhost:8000';
```

---

## 📱 快速自檢命令

**部署前執行**：
```bash
# 前端
cd frontend
grep -r "localhost" src/ | wc -l  # 應該很少（只在 config）
npm run build                      # 應該成功

# 後端  
cd backend
grep -r "localhost" app/ --include="*.py" | wc -l  # 應該很少
python -m pytest                   # 測試通過（如果有）
```

---

**維護者**: VortixPR Team  
**更新**: 每次遇到新問題就補充


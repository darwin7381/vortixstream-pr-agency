# 🚀 生產環境配置指南

## ⚠️ 嚴重警告

**絕對不能在生產環境使用任何包含 `localhost` 或 `127.0.0.1` 的網址！**

這會導致：
- ✗ OAuth 登入後重定向到本地端
- ✗ 郵件中的連結指向本地端
- ✗ API 請求失敗
- ✗ CORS 錯誤

## 📋 環境變數檢查清單

### 後端環境變數 (`backend/.env`)

```bash
# ==================== 必填項目 ====================

# 資料庫連線（Railway 自動提供）
DATABASE_URL=postgresql://user:password@host:port/database

# CORS 設定（必須包含實際前端網址）
ALLOWED_ORIGINS=https://vortixpr.com,https://www.vortixpr.com

# 前端網址（用於 OAuth 重定向和郵件連結）
FRONTEND_URL=https://vortixpr.com

# Google OAuth Redirect URI
GOOGLE_REDIRECT_URI=https://your-backend-api.com/api/auth/google/callback

# 安全密鑰（必須更換！）
SECRET_KEY=your-strong-secret-key-here

# ==================== 可選項目 ====================

# Email 服務
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=hello@mail.vortixpr.com
ADMIN_EMAIL=admin@vortixpr.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Super Admin
SUPER_ADMIN_EMAIL=your_email@example.com

# Environment
ENVIRONMENT=production

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=img.vortixpr.com
```

### 前端環境變數 (`frontend/.env` 或 Railway 環境變數)

```bash
# API 網址（必須是實際的後端 API 網址）
VITE_API_URL=https://your-backend-api.com/api
```

## 🔧 Railway 部署設定

### 後端設定

1. **環境變數設定**
   - 在 Railway Dashboard → Variables 中設定所有環境變數
   - 特別注意 `FRONTEND_URL` 和 `GOOGLE_REDIRECT_URI` 必須使用實際域名

2. **Google OAuth 設定**
   - 前往 [Google Cloud Console](https://console.cloud.google.com/)
   - 在 OAuth 2.0 Client ID 中添加授權重定向 URI：
     - `https://your-backend-api.com/api/auth/google/callback`
   - 更新 `GOOGLE_REDIRECT_URI` 環境變數

### 前端設定

1. **環境變數設定**
   - 在 Railway Dashboard → Variables 中設定 `VITE_API_URL`
   - 或在部署前創建 `frontend/.env` 文件

2. **Build 設定**
   - Build Command: `npm run build`
   - Start Command: `npx serve -s build -l 3000`（或使用其他靜態服務器）

3. **重新 Build**
   - 每次修改環境變數後必須重新 build
   - Vite 會在 build 時將環境變數嵌入到編譯後的代碼中

## ✅ 部署前檢查

執行以下檢查，確保沒有寫死的本地端網址：

```bash
# 檢查後端代碼
cd backend
grep -r "localhost" app/
grep -r "127.0.0.1" app/

# 檢查前端代碼（源碼，不是 build 目錄）
cd ../frontend
grep -r "localhost" src/
grep -r "127.0.0.1" src/

# 檢查環境變數文件
cat backend/.env | grep localhost
cat frontend/.env | grep localhost
```

如果發現任何包含 `localhost` 的內容（除了註解），必須修正！

## 🔄 更新流程

### 後端更新

1. 在 Railway 更新環境變數
2. 重新部署（Railway 會自動重啟）
3. 檢查日誌確認環境變數已載入

### 前端更新

1. 在 Railway 更新 `VITE_API_URL` 環境變數
2. 觸發重新部署（Railway 會重新 build）
3. 清除瀏覽器緩存後測試

## 🧪 測試檢查

部署後必須測試以下功能：

- [ ] Google OAuth 登入
- [ ] OAuth 登入後的重定向是否正確
- [ ] 聯絡表單郵件中的連結是否正確
- [ ] Newsletter 郵件中的連結是否正確
- [ ] 前端 API 請求是否成功
- [ ] 管理後台是否能正常訪問

## 📞 常見問題

### Q: OAuth 登入後被重定向到 localhost

**A:** 檢查後端的 `FRONTEND_URL` 環境變數是否設定正確

### Q: 前端無法連接後端 API

**A:** 
1. 檢查前端的 `VITE_API_URL` 環境變數
2. 確認已重新 build 前端
3. 清除瀏覽器緩存

### Q: 郵件中的連結指向 localhost

**A:** 檢查後端的 `FRONTEND_URL` 環境變數

### Q: CORS 錯誤

**A:** 檢查後端的 `ALLOWED_ORIGINS` 是否包含前端的實際網址

## 🔐 安全建議

1. **SECRET_KEY**: 使用 `openssl rand -hex 32` 生成強密碼
2. **不要提交 .env 文件**: 確保 `.gitignore` 包含 `.env`
3. **定期更新密鑰**: 建議每季度更新 SECRET_KEY
4. **環境隔離**: 本地開發和生產環境使用不同的 OAuth Client

## 📝 相關文檔

- [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) - Google OAuth 設定說明
- [RAILWAY_DEPLOYMENT_SUMMARY.md](./RAILWAY_DEPLOYMENT_SUMMARY.md) - Railway 部署摘要

---

**最後更新**: 2025-12-28




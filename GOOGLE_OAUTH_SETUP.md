# Google OAuth 設定指南

## 📋 設定步驟

### 1. 前往 Google Cloud Console

前往：https://console.cloud.google.com/

### 2. 創建專案（如果還沒有）

1. 點擊頂部的專案選擇器
2. 點擊「新增專案」
3. 輸入專案名稱（例如：VortixPR）
4. 點擊「建立」

### 3. 啟用 Google+ API

1. 在左側選單選擇「API 和服務」> 「資料庫」
2. 搜尋「Google+ API」
3. 點擊並啟用

### 4. 創建 OAuth 2.0 憑證

1. 在左側選單選擇「API 和服務」> 「憑證」
2. 點擊「建立憑證」> 「OAuth 用戶端 ID」
3. 如果是第一次，需要先設定「OAuth 同意畫面」：
   - 用戶類型：選擇「外部」（適用於所有 Google 帳戶）
   - 填寫應用程式名稱：VortixPR
   - 使用者支援電子郵件：你的 email
   - 授權網域：（暫時可以跳過）
   - 開發人員聯絡資訊：你的 email
   - 點擊「儲存並繼續」
   - 範圍：跳過（使用預設的 email、profile）
   - 測試使用者：可以加入你的 email（開發階段）
   - 完成

4. 回到「憑證」頁面，再次點擊「建立憑證」> 「OAuth 用戶端 ID」
5. 應用程式類型：選擇「網頁應用程式」
6. 名稱：VortixPR Web Client
7. **已授權的 JavaScript 來源**：
   ```
   http://localhost:5173
   http://localhost:3000
   ```
8. **已授權的重新導向 URI**：
   ```
   http://localhost:5173/auth/google/callback
   http://localhost:8000/api/auth/google/callback
   ```
9. 點擊「建立」

### 5. 複製憑證

創建後會顯示：
- **用戶端 ID**（Client ID）
- **用戶端密鑰**（Client Secret）

**複製這兩個值！**

### 6. 設定環境變數

在 `backend/.env` 中設定：

```env
GOOGLE_CLIENT_ID=你的_CLIENT_ID
GOOGLE_CLIENT_SECRET=你的_CLIENT_SECRET
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

### 7. 生產環境設定

當部署到生產環境時，記得：

1. 在 Google Cloud Console 的「已授權的重新導向 URI」中添加：
   ```
   https://yourdomain.com/auth/google/callback
   https://api.yourdomain.com/api/auth/google/callback
   ```

2. 更新 `.env`：
   ```env
   GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
   ```

3. 如果要發布到正式環境（非測試模式），需要在「OAuth 同意畫面」中：
   - 補充完整的應用程式資訊
   - 添加隱私權政策 URL
   - 添加服務條款 URL
   - 提交驗證申請

## 🧪 測試

1. 啟動後端：
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload
   ```

2. 啟動前端：
   ```bash
   cd frontend
   npm run dev
   ```

3. 前往 http://localhost:5173/login

4. 點擊「使用 Google 繼續」

5. 應該會跳轉到 Google 登入頁面，登入後會自動創建帳號並登入

## 📝 注意事項

- 開發階段，Google OAuth 會顯示「此應用程式尚未經過驗證」的警告，這是正常的
- 點擊「進階」>「前往 VortixPR（不安全）」即可繼續
- 正式上線前，建議完成 Google 的應用程式驗證流程

## 🔐 安全提醒

- **絕對不要**將 `GOOGLE_CLIENT_SECRET` 提交到 Git
- 確保 `.env` 檔案在 `.gitignore` 中
- 生產環境使用不同的 Client Secret


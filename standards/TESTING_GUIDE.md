# 🧪 API 測試指南與原則

**目的**：避免開發時被登入牆阻擋，提高測試效率

---

## ⚠️ 核心原則

### 原則 1：開發 API 後必須立即測試

**禁止**：
- ❌ 開發完 API 後直接推到前端
- ❌ 依賴前端登入測試 API
- ❌ 被認證牆阻擋無法測試

**正確做法**：
- ✅ 用終端機 + curl 直接測試
- ✅ 用資料庫直接創建測試帳號
- ✅ 用命令取得 token，不依賴前端登入

---

### 原則 2：直接操作資料庫，不繞路

**測試流程**：
```
開發 API → 直接用資料庫創建帳號 → 用 curl 取得 token → 測試 API
          ↑ 不需要前端登入！
```

---

## 🔑 關鍵操作：取得測試 Token

### 方法 1：直接從資料庫創建測試帳號（推薦）

```bash
# 創建測試管理員（密碼：test123）
psql postgresql://JL@localhost:5432/vortixpr -c "
INSERT INTO users (email, hashed_password, name, role, account_status, is_active, provider) 
VALUES ('test@vortixpr.com', '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TcxZ0Q3WBcpl2L3cRl.dF9C2xGQm', 'Test Admin', 'super_admin', 'active', true, 'email') 
ON CONFLICT (email) DO UPDATE SET role = 'super_admin', hashed_password = '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TcxZ0Q3WBcpl2L3cRl.dF9C2xGQm';
"
```

**說明**：
- Email: `test@vortixpr.com`
- Password: `test123`
- Role: `super_admin`
- 可重複執行（ON CONFLICT 更新）

---

### 方法 2：用 API 登入取得 Token

```bash
# 一行命令取得 token
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@vortixpr.com","password":"test123"}' | jq -r '.access_token')

# 顯示 token（前 50 字元）
echo "Token: ${TOKEN:0:50}..."

# 使用 token 測試 Admin API
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/admin/content/faqs
```

---

## 🎯 標準測試流程

### 開發新 API 時

```bash
# Step 1: 確保有測試帳號（執行一次即可）
psql postgresql://JL@localhost:5432/vortixpr -c "
INSERT INTO users (email, hashed_password, name, role, account_status, is_active, provider) 
VALUES ('test@vortixpr.com', '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TcxZ0Q3WBcpl2L3cRl.dF9C2xGQm', 'Test Admin', 'super_admin', 'active', true, 'email') 
ON CONFLICT (email) DO NOTHING;
"

# Step 2: 取得 token
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@vortixpr.com","password":"test123"}' | jq -r '.access_token')

# Step 3: 測試 Public API（無需認證）
curl http://localhost:8000/api/public/content/YOUR_ENDPOINT

# Step 4: 測試 Admin API（需要認證）
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/admin/content/YOUR_ENDPOINT

# Step 5: 測試 CRUD
# POST
curl -X POST http://localhost:8000/api/admin/content/YOUR_ENDPOINT \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"field":"value"}'

# PUT  
curl -X PUT http://localhost:8000/api/admin/content/YOUR_ENDPOINT/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"field":"new_value"}'

# DELETE
curl -X DELETE http://localhost:8000/api/admin/content/YOUR_ENDPOINT/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔍 快速檢查

### 檢查資料庫資料

```bash
# 查看某表的所有資料
psql postgresql://JL@localhost:5432/vortixpr -c "SELECT * FROM faqs;"

# 查看資料數量
psql postgresql://JL@localhost:5432/vortixpr -c "SELECT COUNT(*) FROM stats;"

# 清空測試資料
psql postgresql://JL@localhost:5432/vortixpr -c "DELETE FROM faqs WHERE question LIKE '%Test%';"
```

---

## 💡 重要提醒

### ✅ 該做的
1. ✅ **開發 API 後立即用 curl 測試**
2. ✅ **直接用資料庫創建測試帳號**
3. ✅ **不依賴前端登入**
4. ✅ **測試完整的 CRUD 流程**

### ❌ 不該做的
1. ❌ 開發完 API 就推給前端（沒測試過）
2. ❌ 用前端登入才能測試（太慢）
3. ❌ 忘記測試認證保護（Admin API 必須有認證）
4. ❌ 忘記測試錯誤情況（404, 401 等）

---

## 📝 測試帳號清單

| Email | Password | Role | 用途 |
|-------|----------|------|------|
| test@vortixpr.com | test123 | super_admin | API 測試 |
| joey@cryptoxlab.com | （Google OAuth） | super_admin | 正式管理員 |

**密碼 hash（test123）**：
```
$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TcxZ0Q3WBcpl2L3cRl.dF9C2xGQm
```

---

**維護者**: VortixPR Team  
**更新**: 每次開發新 API 時參考此文件

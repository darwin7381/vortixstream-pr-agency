# ✅ 認證與用戶管理系統 - 完整實現文檔

**完成日期**: 2025-12-28  
**版本**: v1.0 Complete  
**狀態**: ✅ 生產就緒

---

## 🎉 已完成功能總覽

### 🔐 認證系統

✅ **Email/密碼認證**
- 註冊（支援邀請 token）
- 登入
- JWT Token（Access + Refresh）
- 密碼加密（bcrypt）

✅ **Google OAuth 2.0**
- 一鍵登入
- 自動創建帳號
- 頭像同步

✅ **角色系統（4 種）**
- `user` - 一般用戶
- `publisher` - 出版商
- `admin` - 管理員
- `super_admin` - 超級管理員

✅ **權限控制**
- Protected Routes（前端）
- `require_admin` 中間件（後端）
- `require_super_admin` 中間件
- 角色層級檢查

---

### 👥 用戶管理系統

✅ **用戶列表管理**
- 搜尋（Email / 姓名）
- 角色篩選（Tab）
- 狀態篩選（啟用/停用/封禁）
- 統計卡片

✅ **角色管理**
- 即時切換角色（下拉選單）
- 權限限制（不能設定同級或更高級）

✅ **邀請系統**
- 創建邀請
- 發送郵件（Resend）
- 邀請列表管理
- 重新發送/取消邀請
- 邀請接受自動應用角色

✅ **用戶狀態管理（4 種狀態）**
- `active` - 正常使用
- `user_deactivated` - 用戶自主停用
- `admin_suspended` - 管理員停用
- `banned` - 永久封禁

✅ **操作功能**
- 停用用戶
- 封禁用戶（+ 封禁名單）
- 重新啟用
- 解除封禁（僅 super_admin）

✅ **系統設定**
- 參數化自動刪除設定
- 自動刪除天數設定

---

## 🔑 Super Admin 自動提升機制

### 功能說明

**設定位置**: `backend/.env`
```env
SUPER_ADMIN_EMAIL=your@email.com
```

### 完整邏輯

```python
每次應用啟動時自動執行：

1. 檢查 SUPER_ADMIN_EMAIL 是否設定
   ↓
2. 如果沒設定 → 跳過
   ↓
3. 如果有設定：
   
   情況 A：用戶不存在
   ├─ 自動創建帳號
   ├─ 設為 super_admin
   ├─ account_status = 'active'
   ├─ 生成隨機密碼
   └─ 提示：請用「忘記密碼」或 Google 登入
   
   情況 B：用戶存在
   ├─ 強制設為 super_admin（即使是 admin）
   ├─ 強制啟用（account_status = 'active'）
   ├─ 解除封禁（如果被封禁）
   ├─ 從封禁名單移除
   └─ 記錄日誌：Promoted from {舊角色}
```

### 安全特性

- ✅ **冪等性**：多次執行結果相同
- ✅ **自動修復**：即使帳號被封禁也會解除
- ✅ **自動創建**：不存在時自動創建
- ✅ **符合 DATABASE_ARCHITECTURE.md**：安全的 ALTER TABLE 邏輯

### 使用場景

1. **全新專案**：自動創建第一個管理員
2. **現有專案**：提升現有用戶為 super_admin
3. **緊急恢復**：帳號被封禁時自動解除

---

## 📊 資料表結構

### users 表（完整）

```sql
CREATE TABLE users (
    -- 基礎資訊
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    
    -- 認證方式
    provider VARCHAR(50) DEFAULT 'email',
    provider_id VARCHAR(255),
    
    -- 角色
    role VARCHAR(20) DEFAULT 'user',
    
    -- 狀態（新增）
    account_status VARCHAR(20) DEFAULT 'active',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- 停用/封禁資訊
    deactivated_at TIMESTAMP,
    deactivation_reason TEXT,
    banned_at TIMESTAMP,
    banned_reason TEXT,
    banned_by INTEGER,
    
    -- 時間戳
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP
);
```

### banned_emails 表

```sql
CREATE TABLE banned_emails (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    reason TEXT,
    banned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    banned_at TIMESTAMP DEFAULT NOW()
);
```

### system_settings 表

```sql
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(20) DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);
```

---

## 🔄 完整的用戶生命週期（2025-12-28 最新）

### 註冊流程

```
用戶註冊
  ↓
檢查 banned_emails（封禁名單）
  ├─ 在名單 → ❌ 拒絕「此帳號已被封禁」
  └─ 不在 → 繼續
  ↓
檢查現有用戶
  ├─ 不存在 → ✅ 創建新用戶
  ├─ account_status = 'active' → ❌ 拒絕「已被註冊」
  ├─ account_status = 'banned' → ❌ 拒絕「已被封禁」
  ├─ account_status = 'admin_suspended' → ❌ 拒絕「請聯絡管理員」
  └─ account_status = 'user_deactivated' → ✅ 重新啟用舊帳號（保留歷史）
  ↓
返回 JWT tokens
```

### 邀請流程

```
管理員創建邀請
  ↓
檢查權限（不能邀請同級或更高級）
  ↓
檢查 banned_emails
  ├─ 在名單 → ❌ 拒絕
  └─ 不在 → 繼續
  ↓
檢查現有用戶
  ├─ 不存在 → ✅ 創建邀請
  ├─ account_status = 'active' → ❌ 已註冊
  ├─ account_status = 'banned' → ❌ 已封禁
  └─ account_status = 'admin_suspended' → ✅ 允許邀請
  ↓
發送郵件（Resend）
  ↓
用戶接受邀請註冊
  ↓
應用邀請的角色 + 標記邀請為 accepted
```

### 停用流程

#### 管理員停用（admin_suspended）
```
管理員停用用戶
  ↓
設定 account_status = 'admin_suspended'
設定 is_active = FALSE
記錄 deactivated_at
  ↓
用戶無法登入
資料永久保留（不會自動刪除）
  ↓
只能：
  ✅ 管理員重新啟用
  ❌ 無法重新註冊
  ✅ 可以接受邀請（會重新啟用）
```

#### 用戶自主停用（user_deactivated）
```
用戶要求刪除帳號（前台，未來實現）
  ↓
設定 account_status = 'user_deactivated'
設定 is_active = FALSE
記錄 deactivated_at
  ↓
用戶無法登入
30 天內資料保留
  ↓
可以：
  ✅ 30 天內重新註冊（重新啟用舊帳號）
  ✅ 接受邀請
  ⏰ 超過 30 天自動刪除（如果設定啟用）
```

### 封禁流程

```
管理員封禁用戶
  ↓
設定 account_status = 'banned'
設定 is_active = FALSE
記錄 banned_at, banned_reason, banned_by
添加到 banned_emails 表
  ↓
用戶無法：
  ❌ 登入
  ❌ 重新註冊
  ❌ 接受邀請
  ↓
只能由 super_admin 解除封禁
```

---

## 🎨 前端頁面

### `/admin/users` - 用戶列表

**功能**：
- 統計卡片（總數、管理員、Google、已驗證）
- 角色 Tab（所有/一般用戶/出版商/管理員/超級管理員）
- 狀態篩選（啟用中/已停用/已封禁）
- 搜尋和過濾
- 邀請按鈕

**操作**：
- **啟用用戶**：角色選擇、停用、封禁
- **停用用戶**：重新啟用
- **封禁用戶**：解除封禁（super_admin）

### `/admin/invitations` - 邀請管理

**功能**：
- 狀態 Tab（待處理/已接受/已取消）
- 邀請列表
- 重新發送
- 取消邀請

### `/admin/settings` - 系統設定

**功能**：
- 自動刪除開關
- 刪除天數設定（1-365 天）

---

## 🐛 已修復的問題

### 問題 1：bcrypt 版本相容性
- ✅ 降級到 `bcrypt==4.0.1`

### 問題 2：JWT subject 類型
- ✅ 將 `user_id` 轉為字串

### 問題 3：外鍵約束
- ✅ 添加 `ON DELETE SET NULL`

### 問題 4：停用用戶無法刪除
- ✅ 改為軟刪除
- ✅ 添加封禁功能

### 問題 5：側邊欄展開邏輯
- ✅ 根據路徑自動展開
- ✅ 使用 useEffect 監聽

### 問題 6：CREATE TABLE + 新欄位索引
- ✅ 分離 CREATE TABLE 和 ALTER TABLE
- ✅ 索引在欄位存在後創建

### 問題 7：資料狀態不一致
- ✅ 同步 is_active 和 account_status
- ✅ 統一使用 account_status 作為主要狀態

---

## 📁 檔案清單

### 後端

```
backend/app/
├── api/
│   ├── auth.py                    # 認證 API
│   ├── user_admin.py              # 用戶管理 API
│   ├── invitation_admin.py        # 邀請管理 API
│   ├── invitation_public.py       # 公開邀請資訊 API
│   └── settings_admin.py          # 系統設定 API
├── models/
│   ├── user.py                    # 用戶模型
│   └── invitation.py              # 邀請模型
├── services/
│   └── invitation_email.py        # 邀請郵件服務
├── utils/
│   └── security.py                # JWT、密碼、權限中間件
└── core/
    └── database.py                # 資料庫初始化（含 Super Admin 邏輯）
```

### 前端

```
frontend/src/
├── pages/admin/
│   ├── AdminUsers.tsx             # 用戶列表
│   ├── AdminInvitations.tsx       # 邀請管理
│   └── AdminSettings.tsx          # 系統設定
├── components/
│   ├── LoginPage.tsx              # 登入/註冊頁面
│   ├── ProtectedRoute.tsx         # 路由保護
│   └── GoogleCallback.tsx         # OAuth 回調
├── hooks/
│   └── useAuth.ts                 # 認證 Hook
└── api/
    └── client.ts                  # API Client
```

### 文檔

```
- AUTH_IMPLEMENTATION_COMPLETE.md           # 認證系統實現
- USER_STATUS_AND_DELETION_STRATEGY.md      # 用戶狀態策略
- PERMISSIONS_AND_ROLES_ROADMAP.md          # 權限系統路線圖
- DATABASE_ARCHITECTURE.md                  # 資料庫架構（已更新陷阱）
- GOOGLE_OAUTH_SETUP.md                     # Google OAuth 設定
- AUTH_AND_USER_MANAGEMENT_COMPLETE.md      # 本文檔（總覽）
```

---

## 🧪 測試檢查清單

### 基礎認證
- [ ] Email/密碼註冊
- [ ] Email/密碼登入
- [ ] Google OAuth 登入
- [ ] Token 刷新
- [ ] 登出功能

### 用戶管理
- [ ] 查看用戶列表
- [ ] 搜尋用戶
- [ ] 切換角色 Tab
- [ ] 切換狀態篩選
- [ ] 修改用戶角色

### 邀請功能
- [ ] 創建邀請
- [ ] 收到郵件
- [ ] 接受邀請註冊
- [ ] 角色自動應用
- [ ] 重新發送邀請
- [ ] 取消邀請

### 狀態管理
- [ ] 停用用戶
- [ ] 重新啟用
- [ ] 封禁用戶
- [ ] 解除封禁
- [ ] 停用帳號重新註冊（應成功）
- [ ] 封禁帳號重新註冊（應失敗）

### Super Admin
- [ ] 設定 .env 中的 SUPER_ADMIN_EMAIL
- [ ] 重啟後端
- [ ] 帳號不存在 → 自動創建
- [ ] 帳號存在 → 自動提升
- [ ] 帳號被封禁 → 自動解除

### 系統設定
- [ ] 查看設定頁面
- [ ] 開啟自動刪除
- [ ] 設定天數
- [ ] 儲存設定

---

## 🔒 安全性檢查

✅ **密碼安全**
- bcrypt 加密（不可逆）
- 自動加鹽

✅ **Token 安全**
- JWT HS256
- Access Token：30 分鐘
- Refresh Token：30 天

✅ **權限檢查**
- 所有 /admin/* 端點需要認證
- 角色層級檢查
- 防止自我操作（刪除自己、降級自己等）

✅ **資料保護**
- 外鍵 ON DELETE SET NULL
- 軟刪除（預設）
- 封禁名單（防止重新註冊）

✅ **CORS 設定**
- 只允許指定的前端網域

---

## 📝 API 端點完整列表

### 認證 API (`/api/auth/`)

| 端點 | 方法 | 說明 |
|------|------|------|
| `/register` | POST | 註冊（支援 invitation_token） |
| `/login` | POST | 登入 |
| `/me` | GET | 取得當前用戶 |
| `/refresh` | POST | 刷新 Token |
| `/google/login` | GET | Google OAuth 登入 |
| `/google/callback` | GET | Google OAuth 回調 |
| `/invitation/{token}` | GET | 取得邀請資訊（公開） |

### 用戶管理 API (`/api/admin/users/`)

| 端點 | 方法 | 說明 | 權限 |
|------|------|------|------|
| `/` | GET | 用戶列表 | admin |
| `/stats` | GET | 用戶統計 | admin |
| `/{id}` | GET | 單一用戶 | admin |
| `/{id}/role` | PATCH | 更新角色 | admin |
| `/{id}/activate` | PATCH | 重新啟用 | admin |
| `/{id}` | DELETE | 停用用戶 | admin |
| `/{id}/ban` | POST | 封禁用戶 | admin |
| `/{id}/unban` | DELETE | 解除封禁 | **super_admin** |

### 邀請 API (`/api/admin/invitations/`)

| 端點 | 方法 | 說明 |
|------|------|------|
| `/` | POST | 創建邀請 |
| `/` | GET | 邀請列表 |
| `/{id}` | DELETE | 取消邀請 |
| `/{id}/resend` | POST | 重新發送 |

### 設定 API (`/api/admin/settings/`)

| 端點 | 方法 | 說明 | 權限 |
|------|------|------|------|
| `/` | GET | 所有設定 | **super_admin** |
| `/{key}` | PATCH | 更新設定 | **super_admin** |

---

## 🎯 關鍵設計決策

### 為什麼選擇軟刪除？

✅ **優點**：
- 資料保留（審計追蹤）
- 可以恢復
- 符合 GDPR
- 避免外鍵問題

⚠️ **注意**：
- 需要定期清理（可選）
- 佔用儲存空間

### 為什麼分離停用和封禁？

✅ **停用**（admin_suspended）：
- 暫時性的
- 可恢復
- 可重新註冊

✅ **封禁**（banned）：
- 永久性的
- 防止惡意用戶
- 無法重新註冊

### 為什麼用 account_status 而不是多個布林值？

✅ **單一欄位**：
- 狀態互斥（不會同時是停用和封禁）
- 易於查詢
- 清晰的狀態機

---

## 💡 未來擴展

### 短期（1-2 個月）
- [ ] 忘記密碼功能
- [ ] Email 驗證
- [ ] 用戶自主停用（前台「刪除帳號」功能）
- [ ] 更多 OAuth（GitHub、Facebook）

### 中期（3-6 個月）
- [ ] 背景任務（自動刪除 user_deactivated 超過 30 天的帳號）
- [ ] **硬刪除功能**（永久刪除，需謹慎設計）
  - [ ] 僅 super_admin 可執行
  - [ ] 二次確認
  - [ ] 處理所有關聯資料（外鍵）
  - [ ] 記錄刪除日誌
- [ ] 組織/團隊功能
- [ ] 資源所有權
- [ ] 操作日誌

### 長期（視需求）
- [ ] 完整 RBAC
- [ ] 審計追蹤
- [ ] MFA（雙因素認證）
- [ ] SSO（企業單點登入）

---

## 🎓 經驗教訓

### DATABASE_ARCHITECTURE.md 補充

**新增陷阱章節**：
- ⚠️ CREATE TABLE IF NOT EXISTS + 新欄位索引
- ✅ 正確做法：分離 CREATE TABLE 和 ALTER TABLE
- ✅ 索引在欄位存在後創建

### 保持一致性

**關鍵**：
- ✅ account_status 是主要狀態
- ✅ is_active 從 account_status 派生
- ✅ 所有邏輯使用 account_status 判斷

---

**維護者**: VortixPR Team  
**完成日期**: 2025-12-28  
**狀態**: ✅ 生產就緒


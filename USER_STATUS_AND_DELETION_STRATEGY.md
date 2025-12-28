# 🔐 用戶狀態與刪除策略完整指南

**文檔版本**: v1.0  
**最後更新**: 2025-12-28  
**目的**: 梳理用戶狀態管理、刪除策略和最佳實踐

---

## 📊 業界常見做法分析

### 主流平台的用戶狀態設計

| 平台 | 用戶自主刪除 | 管理員封禁 | 可重新註冊 | 資料保留 |
|------|-------------|-----------|-----------|---------|
| **GitHub** | 帳號停用（30天） | 封禁 | ✅ 30天後 | ✅ 30天 |
| **Twitter/X** | 帳號停用（30天） | 永久封禁 | ✅ 30天後 | ✅ 30天 |
| **Discord** | 刪除帳號 | 封禁 | ❌ | ✅ 永久 |
| **Slack** | 停用 | 停用 | ❌ | ✅ 永久 |
| **Notion** | - | 移除（組織層級） | ✅ | ✅ 永久 |

---

## 🎯 建議的狀態設計（3 種狀態）

### 狀態定義

```sql
-- 方案：使用單一欄位 + 狀態值
ALTER TABLE users ADD COLUMN account_status VARCHAR(20) DEFAULT 'active';

狀態值：
- 'active': 正常使用中 ✅
- 'deactivated': 用戶自主停用（可恢復） 🟡
- 'banned': 管理員封禁（無法恢復） 🔴
```

**或者使用多欄位**（更清晰）：
```sql
ALTER TABLE users 
    ADD COLUMN is_active BOOLEAN DEFAULT TRUE,          -- 帳號是否啟用
    ADD COLUMN is_banned BOOLEAN DEFAULT FALSE,         -- 是否被封禁
    ADD COLUMN deactivated_at TIMESTAMP,                -- 停用時間
    ADD COLUMN banned_at TIMESTAMP,                     -- 封禁時間
    ADD COLUMN banned_reason TEXT;                      -- 封禁原因
```

---

## 🔍 詳細場景分析

### 場景 1：用戶自主刪除帳號

**用戶需求**：
```
我不想再用這個服務了，我要刪除帳號
```

**業界做法（推薦）**：
```
1. 設定 account_status = 'deactivated'
2. 設定 deactivated_at = NOW()
3. 保留資料 30 天
4. 30 天內可以重新登入恢復
5. 30 天後自動永久刪除（背景任務）
```

**實現**：
```python
@router.post("/deactivate")
async def deactivate_account(current_user = Depends(get_current_user)):
    """用戶自主停用帳號"""
    await conn.execute("""
        UPDATE users 
        SET account_status = 'deactivated', 
            deactivated_at = NOW()
        WHERE id = $1
    """, current_user.user_id)
    
    # 發送確認郵件：「您的帳號已停用，30天內可重新登入恢復」
    return {"message": "帳號已停用，30天內可重新啟用"}

# 背景任務（每日執行）
async def cleanup_deactivated_accounts():
    """刪除停用超過 30 天的帳號"""
    await conn.execute("""
        DELETE FROM users 
        WHERE account_status = 'deactivated' 
        AND deactivated_at < NOW() - INTERVAL '30 days'
    """)
```

**重新註冊邏輯**：
```python
@router.post("/register")
async def register(user_data: UserRegister):
    existing = await conn.fetchrow(
        "SELECT account_status, deactivated_at FROM users WHERE email = $1",
        user_data.email
    )
    
    if existing:
        if existing["account_status"] == 'active':
            return "此 Email 已被註冊"
        
        elif existing["account_status"] == 'deactivated':
            # 允許重新啟用（相當於重新註冊）
            await conn.execute("""
                UPDATE users 
                SET account_status = 'active',
                    deactivated_at = NULL,
                    hashed_password = $1,
                    updated_at = NOW()
                WHERE email = $2
            """, hashed_password, user_data.email)
            return "歡迎回來！帳號已重新啟用"
        
        elif existing["account_status"] == 'banned':
            return "此帳號已被封禁，無法註冊"
```

---

### 場景 2：管理員停用用戶

**管理需求**：
```
這個用戶違規了，我要暫時停用他
或：這個用戶要求暫停服務
```

**業界做法**：
```
1. 設定 is_active = FALSE
2. 保留所有資料
3. 用戶無法登入
4. 管理員可隨時重新啟用
5. 用戶無法自行恢復
```

**實現**：
```python
@router.patch("/users/{id}/deactivate")
async def admin_deactivate_user(user_id: int, reason: str):
    """管理員停用用戶"""
    await conn.execute("""
        UPDATE users 
        SET is_active = FALSE,
            deactivated_at = NOW(),
            deactivation_reason = $1
        WHERE id = $2
    """, reason, user_id)
    
    # 發送通知郵件給用戶
```

**重新註冊邏輯**：
```python
❌ 不允許重新註冊
✅ 只能由管理員重新啟用
```

---

### 場景 3：管理員封禁用戶

**管理需求**：
```
這個用戶是惡意用戶/機器人，永久封禁
```

**業界做法**：
```
1. 設定 is_banned = TRUE
2. 記錄封禁原因
3. 用戶無法登入
4. 無法重新註冊（同 email）
5. 可以封禁 IP、設備指紋等
```

**實現**：
```python
@router.post("/users/{id}/ban")
async def ban_user(user_id: int, reason: str, permanent: bool = True):
    """封禁用戶"""
    await conn.execute("""
        UPDATE users 
        SET is_banned = TRUE,
            banned_at = NOW(),
            banned_reason = $1,
            is_active = FALSE
        WHERE id = $2
    """, reason, user_id)
    
    # 記錄到封禁列表
    await conn.execute("""
        INSERT INTO banned_users (user_id, email, reason, banned_by)
        VALUES ($1, $2, $3, $4)
    """, user_id, email, reason, admin_id)

# 註冊時檢查
if await is_email_banned(email):
    return "此 Email 已被封禁，無法註冊"
```

---

## 🏗️ 推薦的資料表設計

### 方案 A：簡單方案（推薦給你）

```sql
ALTER TABLE users 
    -- 基礎狀態
    ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
    ADD COLUMN is_banned BOOLEAN DEFAULT FALSE,
    
    -- 時間戳
    ADD COLUMN deactivated_at TIMESTAMP,
    ADD COLUMN banned_at TIMESTAMP,
    
    -- 原因（可選）
    ADD COLUMN deactivation_reason TEXT,
    ADD COLUMN banned_reason TEXT;

-- 封禁名單（獨立表，防止被刪除後重新註冊）
CREATE TABLE banned_emails (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    reason TEXT,
    banned_by INTEGER REFERENCES users(id),
    banned_at TIMESTAMP DEFAULT NOW()
);
```

**邏輯**：
```python
狀態判斷：
1. is_banned = TRUE → 封禁（最高優先級）
2. is_active = FALSE → 停用
3. is_active = TRUE AND is_banned = FALSE → 正常
```

---

### 方案 B：單一狀態欄位（更簡潔）

```sql
ALTER TABLE users 
    ADD COLUMN account_status VARCHAR(20) DEFAULT 'active';

-- 狀態值：
'active'        -- 正常使用
'deactivated'   -- 用戶自主停用（30天後刪除）
'suspended'     -- 管理員暫停（可恢復）
'banned'        -- 永久封禁
```

---

## 📋 各狀態的行為矩陣

| 狀態 | 登入 | 重新註冊 | 接受邀請 | 資料保留 | 管理員操作 |
|------|------|---------|---------|---------|-----------|
| **Active** | ✅ | - | ✅ | ✅ | 停用/封禁 |
| **Deactivated**<br>(用戶自主) | ❌ | ✅ 30天內 | ✅ | ✅ 30天 | 重新啟用 |
| **Suspended**<br>(管理員) | ❌ | ❌ | ❌ | ✅ 永久 | 重新啟用/封禁 |
| **Banned**<br>(永久封禁) | ❌ | ❌ | ❌ | ✅ 永久 | 解除封禁 |

---

## 🎯 VortixPR 的建議實現

### 階段一：簡化版本（當前，快速實現）

**使用 2 個狀態**：

```sql
-- 保持簡單
is_active BOOLEAN    -- TRUE = 正常，FALSE = 停用/封禁
is_banned BOOLEAN    -- TRUE = 封禁，FALSE = 一般停用
```

**邏輯**：
```python
# 停用（可恢復）
is_active = FALSE, is_banned = FALSE

# 封禁（不可恢復）
is_active = FALSE, is_banned = TRUE
```

**重新註冊規則**：
```python
if existing_user:
    if is_banned:
        return "此帳號已被封禁"
    elif not is_active:
        # 允許重新註冊（視為新帳號）
        # 刪除舊記錄或更新
        await conn.execute("DELETE FROM users WHERE id = $1", user_id)
        # 創建新帳號
    else:
        return "此 Email 已被註冊"
```

**邀請規則**：
```python
# 檢查時排除被封禁的
existing = await conn.fetchrow("""
    SELECT id FROM users 
    WHERE email = $1 AND is_banned = FALSE
""")

if existing:
    return "此 Email 已註冊"
# 可以邀請（即使是停用狀態，因為可能是用戶自己刪除的）
```

---

### 階段二：完整版本（未來，如果需要）

**使用 account_status**：
```sql
account_status:
- 'active': 正常使用
- 'user_deactivated': 用戶自主停用（可重新註冊）
- 'admin_suspended': 管理員暫停（不可重新註冊，需管理員解除）
- 'banned': 永久封禁
```

---

## 🔒 完整的註冊/邀請邏輯

### 註冊檢查流程

```python
@router.post("/register")
async def register(email: str, ...):
    existing = await get_user_by_email(email)
    
    if not existing:
        # 沒有記錄，允許註冊 ✅
        create_new_user()
    
    elif existing.is_banned:
        # 被封禁，拒絕 ❌
        raise HTTPException(403, "此帳號已被封禁，無法註冊")
    
    elif not existing.is_active and not existing.is_banned:
        # 僅停用（可能是用戶自己刪的），允許重新註冊 ✅
        # 選項 A: 刪除舊記錄，創建新的
        await conn.execute("DELETE FROM users WHERE id = $1", existing.id)
        create_new_user()
        
        # 選項 B: 重新啟用並更新資料
        await conn.execute("""
            UPDATE users 
            SET is_active = TRUE, 
                hashed_password = $1,
                deactivated_at = NULL
            WHERE id = $2
        """, new_password, existing.id)
    
    else:
        # 正常啟用中，拒絕 ❌
        raise HTTPException(400, "此 Email 已被註冊")
```

---

### 邀請檢查流程

```python
@router.post("/invitations")
async def create_invitation(email: str, role: str):
    existing = await get_user_by_email(email)
    
    if not existing:
        # 沒有記錄，允許邀請 ✅
        create_invitation()
    
    elif existing.is_banned:
        # 被封禁，拒絕邀請 ❌
        raise HTTPException(403, "此用戶已被封禁，無法邀請")
    
    elif not existing.is_active:
        # 僅停用，允許邀請（會重新啟用帳號） ✅
        create_invitation()
        # 用戶接受邀請時，重新啟用帳號
    
    else:
        # 已經是活躍用戶，無需邀請 ❌
        raise HTTPException(400, "此用戶已註冊並啟用")
```

---

## 🎨 UI 顯示建議

### 用戶列表的狀態欄位

**顯示優先級**：
```
1. 🔴 已封禁（最嚴重）
2. 🟡 已停用（次要）
3. ✅ 已驗證（正常）
4. ⚠️  未驗證（提醒）
```

**視覺效果**：
- 已封禁：紅色高亮 + 整行變暗
- 已停用：灰色 + 整行半透明
- 正常用戶：正常顯示

---

### 操作按鈕邏輯

| 用戶狀態 | 角色下拉 | 主要操作 | 次要操作 |
|---------|---------|---------|---------|
| **Active** | ✅ 可選 | 停用 | - |
| **Deactivated** | ❌ 隱藏 | 重新啟用 | 永久刪除 |
| **Banned** | ❌ 隱藏 | 解除封禁 | 永久刪除 |

---

## 💡 我的建議：VortixPR 應該這樣做

### 第一階段（現在）：簡單實用

**使用 2 個布林值**：
```sql
is_active BOOLEAN DEFAULT TRUE
is_banned BOOLEAN DEFAULT FALSE
```

**4 種操作**：
```
1. 停用（Deactivate）- 管理員
   → is_active = FALSE, is_banned = FALSE
   → 可重新啟用
   → 可重新註冊（自動刪除舊記錄）

2. 封禁（Ban）- 管理員
   → is_active = FALSE, is_banned = TRUE
   → 無法重新註冊
   → 只能由 super_admin 解除

3. 重新啟用（Reactivate）- 管理員
   → is_active = TRUE

4. 解除封禁（Unban）- Super Admin
   → is_banned = FALSE, is_active = TRUE
```

**註冊邏輯**：
```python
if existing:
    if is_banned:
        return "❌ 此帳號已被封禁"
    elif not is_active:
        # 刪除舊記錄，允許重新註冊
        DELETE old record
        CREATE new user ✅
    else:
        return "❌ 此 Email 已被註冊"
```

**邀請邏輯**：
```python
if existing:
    if is_banned:
        return "❌ 此用戶已被封禁"
    elif not is_active:
        # 允許邀請，接受時重新啟用 ✅
        create_invitation()
    else:
        return "❌ 此用戶已註冊"
```

---

### 第二階段（未來）：增加時效性

```sql
ADD COLUMN deactivated_at TIMESTAMP
ADD COLUMN auto_delete_at TIMESTAMP  -- 自動刪除時間
```

**背景任務**：
```python
# 每日執行
async def auto_cleanup():
    # 刪除停用超過 30 天的帳號
    await conn.execute("""
        DELETE FROM users 
        WHERE is_active = FALSE 
        AND is_banned = FALSE
        AND deactivated_at < NOW() - INTERVAL '30 days'
    """)
```

---

## 🎨 前端 UI 建議

### 狀態篩選器位置

**選項 A：整合在搜尋列**（推薦）
```
[🔍 搜尋框...........] [搜尋] [狀態: 啟用中▼]
```

**選項 B：在角色 Tab 最右側**
```
[ 所有(6) ][ 一般用戶(3) ][ 出版商(0) ][ 管理員(1) ] ... [ ⚙️ 啟用中▼ ]
```

**選項 C：獨立的小 Tab**（最不佔空間）
```
角色 Tab 下方加一行小的：
[ ✅ 啟用 ] [ 🚫 停用 ] [ 🔴 封禁 ]
```

---

### 用戶列表顯示

**預設**：只顯示啟用用戶

**停用用戶的顯示**（切換後）：
- 整行 50% 透明度
- 狀態欄位：🟡 已停用
- 操作：只有「重新啟用」按鈕

**封禁用戶的顯示**（切換後）：
- 整行 30% 透明度 + 紅色邊框
- 狀態欄位：🔴 已封禁
- 操作：只有「解除封禁」按鈕（僅 super_admin）

---

## 📝 API 端點建議

```python
# 用戶自主操作
POST   /api/auth/deactivate              # 用戶自主停用帳號
POST   /api/auth/reactivate/{token}      # 用戶恢復帳號（郵件連結）

# 管理員操作
PATCH  /api/admin/users/{id}/deactivate  # 停用用戶
PATCH  /api/admin/users/{id}/activate    # 重新啟用
POST   /api/admin/users/{id}/ban         # 封禁用戶
DELETE /api/admin/users/{id}/unban       # 解除封禁
DELETE /api/admin/users/{id}             # 永久刪除（需 super_admin）
```

---

## ⚠️ 常見陷阱

### 陷阱 1：停用和封禁混淆
```
❌ 錯誤：用同一個欄位
is_active = FALSE → 不知道是停用還是封禁

✅ 正確：分開處理
is_active = FALSE, is_banned = FALSE → 停用
is_active = FALSE, is_banned = TRUE → 封禁
```

### 陷阱 2：無法重新註冊
```
❌ 錯誤：停用帳號無法重新註冊
問題：用戶體驗差，像是「刪不掉帳號」

✅ 正確：允許重新註冊（刪除舊記錄或重新啟用）
```

### 陷阱 3：外鍵約束導致無法刪除
```
❌ 錯誤：直接 DELETE，遇到外鍵失敗

✅ 正確：
方案 1: ON DELETE SET NULL
方案 2: 軟刪除（不真刪）
方案 3: 刪除前先處理相關資料
```

---

## ✅ VortixPR 實現狀態（已完成！）

### 實際實現（2025-12-28）

**資料表設計**：
```sql
users 表：
- account_status VARCHAR(20) DEFAULT 'active'
  值：'active', 'user_deactivated', 'admin_suspended', 'banned'
- is_active BOOLEAN DEFAULT TRUE（保留向後兼容）
- deactivated_at, banned_at, banned_reason, banned_by

banned_emails 表：
- email, reason, banned_by, banned_at

system_settings 表：
- setting_key, setting_value, setting_type, description
```

**已實現功能**：
✅ 完整的狀態管理（4種狀態）
✅ 停用帳號可重新註冊（自動刪除舊記錄）
✅ 封禁功能（無法重新註冊）
✅ 封禁名單（banned_emails）
✅ 重新啟用功能
✅ 解除封禁功能（僅 super_admin）
✅ Settings 管理頁面（參數化自動刪除設定）

**API 端點**：
```
POST   /api/admin/users/{id}/ban        # 封禁用戶
DELETE /api/admin/users/{id}/unban      # 解除封禁（super_admin）
PATCH  /api/admin/users/{id}/activate   # 重新啟用
DELETE /api/admin/users/{id}            # 停用用戶（軟刪除）
GET    /api/admin/settings/             # 取得系統設定
PATCH  /api/admin/settings/{key}        # 更新設定
```

**前端頁面**：
✅ 用戶列表：顯示封禁/停用狀態
✅ 操作按鈕：停用、封禁、重新啟用、解除封禁
✅ 設定頁面：自動刪除參數化設定

### 建議的改進步驟

**Step 1（立即）**：
```
1. 添加 is_banned 欄位
2. 修改註冊邏輯：停用帳號可重新註冊（刪除舊記錄）
3. 修改 UI：封禁和停用分開顯示
4. 添加「封禁」功能按鈕
```

**Step 2（短期）**：
```
1. 添加 banned_emails 表（防止重新註冊）
2. 添加停用原因記錄
3. Email 通知（帳號被停用/封禁時）
```

**Step 3（長期，可選）**：
```
1. 用戶自主停用功能（前台）
2. 30 天自動刪除機制
3. 停用後恢復功能（郵件連結）
```

---

## 📖 快速決策指南

### 我應該用停用還是封禁？

| 情況 | 使用 | 理由 |
|------|------|------|
| 用戶要求刪除帳號 | 停用 | 保留 30 天，可恢復 |
| 用戶違反服務條款（輕微） | 停用 | 可以改過後恢復 |
| 用戶違反服務條款（嚴重） | 封禁 | 永久禁止 |
| 機器人/惡意用戶 | 封禁 | 防止重新註冊 |
| 測試帳號清理 | 永久刪除 | 不需要保留 |

---

## 🚀 立即行動計畫

### 最小改動方案（1-2 小時）

```sql
-- 1. 添加欄位
ALTER TABLE users ADD COLUMN is_banned BOOLEAN DEFAULT FALSE;

-- 2. 創建封禁名單表
CREATE TABLE banned_emails (...);
```

```python
# 3. 修改註冊邏輯（允許停用帳號重新註冊）
if existing and not is_active and not is_banned:
    DELETE old user
    CREATE new user

# 4. 添加封禁功能
@router.post("/users/{id}/ban")
async def ban_user(...):
    UPDATE users SET is_banned = TRUE
    INSERT INTO banned_emails (email)
```

```typescript
// 5. UI 添加封禁按鈕
<button onClick={() => handleBan(user.id)}>
  封禁
</button>
```

---

**建議**：先實現階段一的簡化版本，夠用了。未來有需要再擴展。

---

**維護者**: VortixPR Team  
**審核**: 需要討論後確定最終方案


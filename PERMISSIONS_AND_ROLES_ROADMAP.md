# 🔐 VortixPR 權限與角色系統路線圖

**文檔版本**: v1.0  
**最後更新**: 2025-12-28  
**目的**: 規劃完整的權限系統演進策略

---

## 📊 當前狀態（V1.0 - 基礎認證）

### 已實現

✅ **基礎認證系統**
- Email/密碼註冊登入
- Google OAuth 2.0
- JWT Token 認證
- 自動 Token 刷新

✅ **基礎角色系統**
```typescript
角色定義:
- user: 一般用戶
- publisher: 出版商（預留）
- admin: 管理員
- super_admin: 超級管理員
```

✅ **基礎權限控制**
- Protected Routes（前端）
- `require_admin` 中間件（後端）
- 管理後台訪問控制

---

## 🎯 階段二：資源所有權與細粒度權限（1-2 週）

### 概念說明

**資源所有權（Resource Ownership）**：
用戶只能操作自己創建的資源

**範例場景**：
```
情境 1: Blog 文章
- 用戶 A 創建文章 X
- 用戶 A 可以編輯/刪除文章 X ✅
- 用戶 B 無法編輯文章 X ❌
- Admin 可以編輯所有文章 ✅

情境 2: PR Campaigns（未來）
- 組織 A 創建 Campaign X
- 組織 A 的成員可以查看 ✅
- 組織 B 的成員無法查看 ❌
```

---

### 實現方案

#### 1. 資料表增加所有權欄位

```sql
-- 方式一：簡單欄位
ALTER TABLE blog_posts ADD COLUMN created_by INTEGER REFERENCES users(id);
ALTER TABLE pr_packages ADD COLUMN created_by INTEGER REFERENCES users(id);

-- 方式二：更完整的追蹤
ALTER TABLE blog_posts ADD COLUMN created_by INTEGER REFERENCES users(id);
ALTER TABLE blog_posts ADD COLUMN updated_by INTEGER REFERENCES users(id);
ALTER TABLE blog_posts ADD COLUMN deleted_by INTEGER REFERENCES users(id);
ALTER TABLE blog_posts ADD COLUMN deleted_at TIMESTAMP;

-- 建立索引
CREATE INDEX idx_blog_created_by ON blog_posts(created_by);
```

**實現位置**: `backend/app/core/database.py`

```python
async def init_tables(self):
    # ... 現有的表創建 ...
    
    # 檢查並添加 created_by 欄位
    created_by_exists = await conn.fetchval("""
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='blog_posts' AND column_name='created_by'
        )
    """)
    
    if not created_by_exists:
        logger.info("🔄 Adding ownership columns...")
        await conn.execute("""
            ALTER TABLE blog_posts ADD COLUMN created_by INTEGER REFERENCES users(id);
            ALTER TABLE pr_packages ADD COLUMN created_by INTEGER REFERENCES users(id);
            -- 其他需要追蹤所有權的表
        """)
```

---

#### 2. 權限檢查中間件

**檔案**: `backend/app/utils/permissions.py`

```python
from fastapi import Depends, HTTPException, status
from app.utils.security import get_current_user
from app.models.user import TokenData

class PermissionChecker:
    """權限檢查工具"""
    
    @staticmethod
    async def can_edit_resource(
        resource_id: int,
        table_name: str,
        current_user: TokenData = Depends(get_current_user)
    ) -> bool:
        """檢查用戶是否可以編輯資源"""
        from app.core.database import db
        
        # Admin 可以編輯所有資源
        if current_user.role in ['admin', 'super_admin']:
            return True
        
        # 檢查資源是否屬於該用戶
        async with db.pool.acquire() as conn:
            resource = await conn.fetchrow(
                f"SELECT created_by FROM {table_name} WHERE id = $1",
                resource_id
            )
            
            if not resource:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="資源不存在"
                )
            
            if resource["created_by"] != current_user.user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="無權限編輯此資源"
                )
            
            return True

# 快捷函數
async def require_resource_owner(
    resource_id: int,
    table_name: str,
    current_user: TokenData = Depends(get_current_user)
):
    """要求用戶擁有資源或為管理員"""
    await PermissionChecker.can_edit_resource(resource_id, table_name, current_user)
    return current_user
```

---

#### 3. API 使用範例

```python
# blog_admin.py
from app.utils.permissions import require_resource_owner

@router.put("/posts/{id}")
async def update_post(
    id: int,
    data: BlogPostUpdate,
    current_user = Depends(require_resource_owner(id, "blog_posts"))
):
    # 只有文章作者或管理員可以更新
    async with db.pool.acquire() as conn:
        await conn.execute("""
            UPDATE blog_posts 
            SET title = $1, content = $2, updated_by = $3
            WHERE id = $4
        """, data.title, data.content, current_user.user_id, id)
```

---

## 🏢 階段三：組織/團隊功能（1-2 週）

### 資料表設計

```sql
-- 組織表
CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    
    -- 訂閱方案
    plan VARCHAR(50) DEFAULT 'free',  -- 'free' | 'pro' | 'enterprise'
    
    -- 配額
    max_members INTEGER DEFAULT 5,
    max_campaigns INTEGER DEFAULT 10,
    
    -- 所有者
    owner_id INTEGER REFERENCES users(id) NOT NULL,
    
    -- 狀態
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 組織成員表
CREATE TABLE IF NOT EXISTS organization_members (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- 組織內角色
    role VARCHAR(50) DEFAULT 'member',  -- 'owner' | 'admin' | 'member' | 'viewer'
    
    -- 邀請資訊
    invited_by INTEGER REFERENCES users(id),
    invited_at TIMESTAMP,
    joined_at TIMESTAMP DEFAULT NOW(),
    
    -- 唯一性約束
    UNIQUE(organization_id, user_id)
);

-- 組織邀請表
CREATE TABLE IF NOT EXISTS organization_invitations (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- 被邀請人資訊
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    
    -- 邀請 Token
    token VARCHAR(255) UNIQUE NOT NULL,
    
    -- 邀請者
    invited_by INTEGER REFERENCES users(id),
    
    -- 狀態
    status VARCHAR(20) DEFAULT 'pending',  -- 'pending' | 'accepted' | 'expired'
    
    -- 過期時間
    expires_at TIMESTAMP NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    accepted_at TIMESTAMP
);

-- 業務資料表添加組織關聯
ALTER TABLE pr_campaigns ADD COLUMN organization_id INTEGER REFERENCES organizations(id);
ALTER TABLE blog_posts ADD COLUMN organization_id INTEGER REFERENCES organizations(id);
-- 其他需要組織隔離的表
```

---

### 角色層級設計

#### 全域角色（Global Roles）
```
super_admin > admin > publisher > user

權限:
super_admin: 
  - 管理所有用戶
  - 管理所有組織
  - 系統設定
  
admin:
  - 管理內容（Blog、PR Packages）
  - 查看所有數據
  - 無法管理用戶
  
publisher:
  - 提供媒體管道
  - 查看自己的合作案件
  
user:
  - 使用 AI PR 功能
  - 管理自己的內容
```

#### 組織內角色（Organization Roles）
```
owner > admin > member > viewer

權限:
owner:
  - 刪除組織
  - 管理成員（邀請、移除、改角色）
  - 管理訂閱和付費
  - 完整資源控制
  
admin:
  - 管理組織內容
  - 邀請成員
  - 無法刪除組織或移除 owner
  
member:
  - 創建和編輯內容
  - 查看組織資源
  
viewer:
  - 僅查看權限
  - 無法編輯
```

---

### JWT Token 結構（含組織資訊）

```json
{
  "sub": "123",
  "email": "user@example.com",
  "role": "user",
  "current_org_id": 456,
  "org_role": "admin",
  "exp": 1234567890
}
```

---

### API 權限檢查範例

```python
# utils/org_permissions.py

async def require_org_member(org_id: int, current_user: TokenData):
    """要求是組織成員"""
    async with db.pool.acquire() as conn:
        member = await conn.fetchrow("""
            SELECT role FROM organization_members
            WHERE organization_id = $1 AND user_id = $2
        """, org_id, current_user.user_id)
        
        if not member and current_user.role not in ['admin', 'super_admin']:
            raise HTTPException(403, "非組織成員")
        
        return member["role"] if member else "global_admin"

async def require_org_admin(org_id: int, current_user: TokenData):
    """要求是組織管理員"""
    role = await require_org_member(org_id, current_user)
    
    if role not in ['owner', 'admin'] and current_user.role not in ['admin', 'super_admin']:
        raise HTTPException(403, "需要組織管理員權限")
    
    return role

# 使用範例
@router.post("/organizations/{org_id}/campaigns")
async def create_campaign(
    org_id: int,
    data: CampaignCreate,
    current_user = Depends(get_current_user)
):
    # 檢查權限
    await require_org_member(org_id, current_user)
    
    # 創建 Campaign（自動關聯組織）
    async with db.pool.acquire() as conn:
        campaign = await conn.fetchrow("""
            INSERT INTO pr_campaigns (organization_id, name, created_by)
            VALUES ($1, $2, $3)
            RETURNING *
        """, org_id, data.name, current_user.user_id)
```

---

### Row Level Security（資料庫層級）

**如果使用 PostgreSQL RLS**：

```sql
-- 啟用 RLS
ALTER TABLE pr_campaigns ENABLE ROW LEVEL SECURITY;

-- 政策：用戶只能看到自己組織的 Campaigns
CREATE POLICY org_campaigns_select ON pr_campaigns
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = current_user_id()
        )
    );

-- 政策：只有組織成員可以創建
CREATE POLICY org_campaigns_insert ON pr_campaigns
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = current_user_id()
        )
    );
```

**注意**: 需要設定 `current_user_id()` 函數或使用 session variables

---

## 🎨 階段四：RBAC（角色基礎訪問控制）

### 何時需要 RBAC？

**觸發條件**：
- ❌ 有超過 5 種角色
- ❌ 不同角色需要細粒度權限組合
- ❌ 需要動態創建自定義角色
- ❌ 企業客戶要求自定義權限

**目前狀態**: ✅ 不需要（4 種角色足夠）

---

### RBAC 資料表設計（僅供參考）

```sql
-- 權限列表
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,  -- 'blog.create', 'blog.edit', 'blog.delete'
    description TEXT,
    resource VARCHAR(50),               -- 'blog', 'user', 'campaign'
    action VARCHAR(50)                  -- 'create', 'read', 'update', 'delete'
);

-- 角色定義
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE  -- 系統預設角色不可刪除
);

-- 角色-權限關聯
CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 用戶-角色關聯（支援多角色）
CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    scope VARCHAR(50),                    -- 'global' | 'org:123'
    PRIMARY KEY (user_id, role_id, scope)
);
```

---

### RBAC 使用範例

```python
# utils/rbac.py

async def has_permission(user_id: int, permission: str) -> bool:
    """檢查用戶是否有特定權限"""
    async with db.pool.acquire() as conn:
        result = await conn.fetchval("""
            SELECT EXISTS (
                SELECT 1
                FROM user_roles ur
                JOIN role_permissions rp ON ur.role_id = rp.role_id
                JOIN permissions p ON rp.permission_id = p.id
                WHERE ur.user_id = $1 AND p.name = $2
            )
        """, user_id, permission)
        return result

# 裝飾器
def require_permission(permission: str):
    async def checker(current_user: TokenData = Depends(get_current_user)):
        if not await has_permission(current_user.user_id, permission):
            raise HTTPException(403, f"需要權限: {permission}")
        return current_user
    return checker

# 使用
@router.post("/blog/posts")
async def create_post(
    data: BlogCreate,
    user = Depends(require_permission('blog.create'))
):
    # 只有有 blog.create 權限的用戶可以執行
```

---

## 🔍 權限檢查策略比較

### 方案一：簡單角色檢查（當前）

**優點**：
- ✅ 實現簡單
- ✅ 性能好（單次查詢）
- ✅ 易於理解和維護
- ✅ 適合小團隊

**缺點**：
- ❌ 權限固定，難以調整
- ❌ 無法自定義角色

**適用場景**：
- 用戶 < 10,000
- 角色 < 5 種
- 權限需求簡單

---

### 方案二：資源所有權 + 角色（推薦短期）

**優點**：
- ✅ 保護用戶資料
- ✅ 實現簡單
- ✅ 足夠靈活

**缺點**：
- ⚠️ 需要在每個資源表添加 created_by

**適用場景**：
- 有用戶自助功能
- 需要資料隔離
- 組織/團隊功能

**實現複雜度**: ⭐⭐（2/5）

---

### 方案三：完整 RBAC

**優點**：
- ✅ 極度靈活
- ✅ 可自定義角色
- ✅ 企業級功能

**缺點**：
- ❌ 實現複雜
- ❌ 性能開銷大（多次 JOIN）
- ❌ 維護成本高

**適用場景**：
- 企業 SaaS
- 複雜權限需求
- 需要審計追蹤

**實現複雜度**: ⭐⭐⭐⭐⭐（5/5）

---

## 📅 推薦實施時程

### 第 1 個月（當前）
```
✅ 基礎認證系統
✅ 簡單角色（user/publisher/admin/super_admin）
✅ Protected Routes
```

### 第 2 個月
```
□ 資源所有權（created_by）
□ 操作日誌（誰在何時做了什麼）
□ API Rate Limiting
```

### 第 3-4 個月
```
□ 組織/團隊功能
  - 組織 CRUD
  - 成員邀請
  - 團隊內角色
  - 資源隔離
```

### 第 5-6 個月（視需求）
```
□ RBAC（如果需要）
□ 自定義角色
□ 審計日誌
□ 合規功能（GDPR）
```

---

## 🛡️ 安全最佳實踐

### 1. 防止橫向訪問（Broken Access Control）

**錯誤範例**：
```python
# ❌ 危險！沒有檢查所有權
@router.delete("/posts/{id}")
async def delete_post(id: int):
    await conn.execute("DELETE FROM blog_posts WHERE id = $1", id)
```

**正確範例**：
```python
# ✅ 安全：檢查所有權
@router.delete("/posts/{id}")
async def delete_post(id: int, current_user = Depends(get_current_user)):
    # 檢查是否為文章作者或管理員
    post = await conn.fetchrow("SELECT created_by FROM blog_posts WHERE id = $1", id)
    
    if not post:
        raise HTTPException(404, "文章不存在")
    
    if post["created_by"] != current_user.user_id and current_user.role != 'admin':
        raise HTTPException(403, "無權限刪除此文章")
    
    await conn.execute("DELETE FROM blog_posts WHERE id = $1", id)
```

---

### 2. 操作日誌（Audit Logs）

**資料表**：
```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,       -- 'user.login', 'blog.create', 'user.delete'
    resource_type VARCHAR(50),          -- 'user', 'blog', 'campaign'
    resource_id INTEGER,
    
    -- 變更內容（可選）
    old_values JSONB,
    new_values JSONB,
    
    -- 元數據
    ip_address VARCHAR(50),
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
```

**使用範例**：
```python
async def log_action(
    user_id: int,
    action: str,
    resource_type: str = None,
    resource_id: int = None,
    old_values: dict = None,
    new_values: dict = None
):
    await conn.execute("""
        INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values, new_values)
        VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb)
    """, user_id, action, resource_type, resource_id, 
         json.dumps(old_values) if old_values else None,
         json.dumps(new_values) if new_values else None)

# 使用
@router.delete("/users/{id}")
async def delete_user(id: int, current_user = Depends(require_admin)):
    user = await get_user(id)
    await conn.execute("DELETE FROM users WHERE id = $1", id)
    await log_action(current_user.user_id, 'user.delete', 'user', id, old_values={'email': user.email})
```

---

## 💡 決策指南

### 何時實現各階段？

#### **資源所有權（階段二）**
**實施時機**：
- ✅ 有用戶自助內容創建功能時
- ✅ 需要保護用戶資料時
- ✅ 有多個用戶同時使用系統時

**實施門檻**: 低  
**建議時間**: 當 AI PR 功能開放給用戶時

---

#### **組織/團隊（階段三）**
**實施時機**：
- ✅ 有企業客戶時（B2B）
- ✅ 用戶需要團隊協作時
- ✅ 需要按組織計費時

**實施門檻**: 中  
**建議時間**: 有 50+ 付費用戶時

---

#### **完整 RBAC（階段四）**
**實施時機**：
- ✅ 企業客戶要求自定義權限時
- ✅ 需要複雜的權限組合時
- ✅ 有合規要求（審計追蹤）時

**實施門檻**: 高  
**建議時間**: 有大型企業客戶或融資後

---

## 🎯 推薦路線圖

### VortixPR 的建議

```
現在（V1.0）:
  ✅ 角色擴展（user/publisher/admin/super_admin）
  ✅ 基礎權限檢查
  
2 個月後（V1.5 - AI PR 功能開放）:
  □ 資源所有權
  □ 用戶只能看到/編輯自己的 Campaigns
  □ 操作日誌（基礎）
  
4 個月後（V2.0 - B2B 功能）:
  □ 組織/團隊功能
  □ 團隊內角色
  □ 成員邀請系統
  
6 個月後（V2.5 - 如果有需求）:
  □ 完整 RBAC（視客戶需求）
  □ 審計日誌
  □ 合規功能
```

---

## 📝 實現檢查清單

### 階段二：資源所有權

- [ ] 資料表添加 `created_by` 欄位
- [ ] 更新所有 Create API（記錄創建者）
- [ ] 實現 `require_resource_owner` 中間件
- [ ] 更新所有 Update/Delete API（檢查所有權）
- [ ] 前端：只顯示用戶可編輯的資源
- [ ] 測試：確保用戶無法編輯他人資源

### 階段三：組織功能

- [ ] 創建組織相關資料表
- [ ] 實現組織 CRUD API
- [ ] 實現成員邀請系統
- [ ] Email 邀請通知（使用 Resend）
- [ ] 實現組織切換器（前端）
- [ ] 資源查詢添加組織過濾
- [ ] 測試：確保組織間資料隔離

---

## 🔗 參考資源

- **Clerk Organizations**: https://clerk.com/docs/organizations
- **Auth0 RBAC**: https://auth0.com/docs/manage-users/access-control/rbac
- **PostgreSQL RLS**: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- **OWASP Access Control**: https://owasp.org/www-project-top-ten/2017/A5_2017-Broken_Access_Control

---

## 💭 設計哲學

> **從簡單開始，按需擴展**
> 
> 不要過早實現複雜的權限系統。根據實際業務需求，逐步演進。
> 
> - 10 個用戶：簡單角色足夠
> - 100 個用戶：加入資源所有權
> - 1000 個用戶：考慮組織功能
> - 10000 個用戶：視情況考慮 RBAC

**VortixPR 當前狀態**: 10 個用戶階段 ✅  
**下一個里程碑**: 100 個用戶（資源所有權）

---

## 🎓 總結

### 當前做法（正確）
✅ 簡單的角色系統  
✅ 基礎的訪問控制  
✅ 符合當前業務需求

### 下一步（當需要時）
🎯 資源所有權（用戶自助功能上線時）  
🎯 組織功能（B2B 業務時）  
🎯 RBAC（企業客戶要求時）

### 原則
> 保持簡單，直到複雜性成為必要。
> 
> 專注在核心功能（AI PR），權限系統夠用就好。

---

**維護者**: VortixPR Team  
**聯絡**: tech@vortixpr.com



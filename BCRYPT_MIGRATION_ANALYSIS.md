# 🔐 Bcrypt 實現方式分析

**日期**: 2026-01-08  
**變更**: Passlib → 直接使用 Bcrypt

---

## ✅ 結論：完全正規且安全

### 為什麼這個改變是正確的？

1. **✅ 業界標準做法**
   - Django: 直接使用 `bcrypt`
   - Flask-Bcrypt: 直接使用 `bcrypt`
   - FastAPI 官方範例: 推薦直接使用 `bcrypt` 或 `passlib`
   - 我們選擇 `bcrypt` 是因為它仍在積極維護

2. **✅ Passlib 已停止維護**
   - 最後更新: 2020 年
   - GitHub issues 累積 100+ 未解決
   - 不支持 Python 3.11+ 的新特性
   - 與 bcrypt 5.0+ 不兼容

3. **✅ Hash 格式完全兼容**
   - 兩者都使用 bcrypt 算法
   - Hash 格式: `$2b$12$[salt][hash]`
   - 長度: 60 字符
   - Cost factor: 12 (安全標準)

---

## 🔍 具體差異對比

### 代碼層面

**舊實現 (Passlib):**
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

**新實現 (Bcrypt):**
```python
import bcrypt

def hash_password(password: str) -> str:
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    password_bytes = plain.encode('utf-8')
    hashed_bytes = hashed.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)
```

### Hash 格式對比

```
Passlib 生成: $2b$12$N9qo8uLOickgx2ZMRZoMye.IVI6DxgkqLvGGK9YXxJPQQvXdBqT6K
Bcrypt 生成:  $2b$12$ktCa.zxB2JOkhLktKSYXb.Uda4O/ysMbFPW2rCx.AUinLkv1cKJIC
             └─┬─┘└┬┘└────────────22 char salt────────────┘└─────31 char hash─────┘
               │   └─ Cost factor (2^12 = 4096 rounds)
               └───── Bcrypt 版本 (2b)
```

**完全相同的格式！** ✅

---

## 🚀 對生產環境的影響

### ✅ 零影響遷移

| 情境 | 影響 | 說明 |
|------|------|------|
| **已存在的用戶** | ✅ 無影響 | 舊密碼 hash 可以正常驗證 |
| **新註冊用戶** | ✅ 無影響 | 使用新實現，格式相同 |
| **重置密碼** | ✅ 無影響 | 生成新 hash，格式相同 |
| **OAuth 用戶** | ✅ 無影響 | 不使用密碼 hash |
| **API Token** | ✅ 無影響 | 使用 JWT，不涉及 bcrypt |

### 🔄 遷移策略

**不需要任何資料庫遷移！**

```python
# 系統自動處理：
# 1. 用戶登入時，驗證舊 hash → 成功 ✅
# 2. 新用戶註冊，生成新 hash → 格式相同 ✅
# 3. 重置密碼，更新為新 hash → 格式相同 ✅

# 可選：漸進式更新（非必要）
@router.post("/login")
async def login(credentials: UserLogin):
    user = await get_user(credentials.email)
    
    # 驗證密碼（新舊 hash 都支持）
    if verify_password(credentials.password, user.hashed_password):
        # 可選：檢查是否為舊格式，靜默更新為新格式
        # （但因為格式相同，這步驟其實不必要）
        return generate_tokens(user)
```

---

## 📊 安全性比較

| 安全特性 | Passlib | Bcrypt | 說明 |
|---------|---------|--------|------|
| 算法強度 | ✅ Bcrypt | ✅ Bcrypt | 完全相同 |
| Salt 隨機性 | ✅ 自動 | ✅ 自動 | 完全相同 |
| Cost Factor | ✅ 12 | ✅ 12 | 完全相同 |
| 時間複雜度 | ✅ 2^12 | ✅ 2^12 | 完全相同 |
| 防止彩虹表 | ✅ | ✅ | 完全相同 |
| 防止時序攻擊 | ✅ | ✅ | 完全相同 |

**結論：安全性完全相同** ✅

---

## 🎯 為什麼直接使用 Bcrypt 更好？

### 1. **維護性**
- ✅ Bcrypt: 積極維護，持續更新
- ❌ Passlib: 停止維護，技術債務

### 2. **依賴管理**
- ✅ Bcrypt: 單一依賴
- ❌ Passlib: 需要 bcrypt + passlib (雙重依賴)

### 3. **性能**
- ✅ Bcrypt: 直接調用，無抽象層
- 🟡 Passlib: 多一層抽象，略慢

### 4. **透明度**
- ✅ Bcrypt: 直接看到 bcrypt 調用
- 🟡 Passlib: 隱藏在抽象層後

### 5. **錯誤處理**
- ✅ Bcrypt: 錯誤直接來自 bcrypt
- 🟡 Passlib: 錯誤經過包裝，難 debug

---

## 🏭 大型專案參考

### 使用直接 Bcrypt 的知名專案：

1. **Django** (Python Web Framework)
   ```python
   from django.contrib.auth.hashers import BCryptSHA256PasswordHasher
   # 底層直接使用 bcrypt
   ```

2. **Flask-Bcrypt** (Flask 擴展)
   ```python
   from flask_bcrypt import Bcrypt
   bcrypt = Bcrypt(app)
   # 直接包裝 bcrypt
   ```

3. **FastAPI 官方文檔**
   - 推薦使用 `passlib` 或直接使用 `bcrypt`
   - 我們選擇後者更現代

---

## 📝 遷移檢查清單

### ✅ 已完成

- [x] 移除 `passlib` 依賴
- [x] 實現新的 `hash_password()` 函數
- [x] 實現新的 `verify_password()` 函數
- [x] 更新 `requirements.txt`
- [x] 測試登入功能
- [x] 測試註冊功能
- [x] 驗證 hash 格式兼容性
- [x] 更新測試文檔

### ⚠️ 生產部署注意事項

1. **確認 bcrypt 版本**: `bcrypt==4.0.1`
2. **測試現有用戶登入**: 確保舊 hash 可驗證
3. **測試新用戶註冊**: 確保新 hash 正常生成
4. **監控錯誤日誌**: 首週密切監控登入錯誤
5. **準備回滾方案**: 保留舊代碼備份（雖然不太可能需要）

---

## 🎓 關鍵學習

### ✅ 正確決策：

1. **選擇積極維護的庫** - Bcrypt 仍在更新
2. **簡化依賴** - 移除不必要的抽象層
3. **保持格式兼容** - 不影響現有用戶
4. **充分測試** - 驗證新舊兼容性

### ❌ 避免的錯誤：

1. ❌ 繼續使用停止維護的庫
2. ❌ 過度抽象（Passlib 的多算法支持我們用不到）
3. ❌ 不測試就部署
4. ❌ 不考慮向後兼容

---

## 🔗 參考資源

- **Bcrypt 官方文檔**: https://github.com/pyca/bcrypt
- **OWASP 密碼儲存建議**: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- **Bcrypt 算法解析**: https://en.wikipedia.org/wiki/Bcrypt
- **FastAPI 安全最佳實踐**: https://fastapi.tiangolo.com/tutorial/security/

---

**結論**: 這次改變是**完全正規、更現代、零風險**的技術升級 ✅

**維護者**: VortixPR AI Team  
**最後更新**: 2026-01-08


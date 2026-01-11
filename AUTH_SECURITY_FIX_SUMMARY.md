# 🔐 認證系統修復總結

**日期**: 2026-01-08  
**狀態**: ✅ 完成

---

## 🐛 發現的問題

### 1. **Passlib 與 Bcrypt 版本不兼容**

**問題描述**：
- `passlib==1.7.4` (2020年版本) 與 `bcrypt>=5.0.0` 不兼容
- 導致密碼驗證時出現 `ValueError: password cannot be longer than 72 bytes`
- Passlib 已停止維護，不再支持新版本的 bcrypt

**解決方案**：
- 移除 `passlib` 依賴
- 直接使用 `bcrypt` 庫進行密碼加密和驗證
- 更新 `app/utils/security.py`：
  ```python
  # 舊代碼 (使用 passlib)
  from passlib.context import CryptContext
  pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
  
  # 新代碼 (直接使用 bcrypt)
  import bcrypt
  
  def hash_password(password: str) -> str:
      password_bytes = password.encode('utf-8')
      salt = bcrypt.gensalt()
      hashed = bcrypt.hashpw(password_bytes, salt)
      return hashed.decode('utf-8')
  
  def verify_password(plain_password: str, hashed_password: str) -> bool:
      password_bytes = plain_password.encode('utf-8')
      hashed_bytes = hashed_password.encode('utf-8')
      return bcrypt.checkpw(password_bytes, hashed_bytes)
  ```

---

### 2. **PR Template Admin API 中錯誤的 current_user 訪問方式**

**問題描述**：
- `current_user` 是 `TokenData` Pydantic 模型對象
- 代碼中錯誤使用字典語法 `current_user["role"]`
- 導致 `TypeError: 'TokenData' object is not subscriptable`

**錯誤位置**：
- `app/api/pr_template_admin.py` 中的 5 個函數

**解決方案**：
1. 改用正確的屬性訪問語法：`current_user.role`
2. 更好的做法：直接使用 `require_admin` 依賴注入，無需手動檢查權限
   ```python
   # 舊代碼
   async def admin_get_templates(current_user: dict = Depends(get_current_user)):
       if current_user["role"] not in ["admin", "super_admin"]:
           raise HTTPException(...)
   
   # 新代碼
   async def admin_get_templates(current_user: TokenData = Depends(require_admin)):
       # require_admin 已經處理了權限檢查
   ```

---

### 3. **JSONB 欄位序列化問題**

**問題描述**：
- 從 PostgreSQL 返回的 JSONB 欄位是字符串格式
- Pydantic 模型期望接收 Python 列表
- 導致 `ResponseValidationError: Input should be a valid list`

**解決方案**：
- 在返回資料前將 JSONB 字串轉換為 Python 對象
  ```python
  for row in rows:
      data = dict(row)
      if isinstance(data.get('industry_tags'), str):
          data['industry_tags'] = json.loads(data['industry_tags'])
      if isinstance(data.get('use_cases'), str):
          data['use_cases'] = json.loads(data['use_cases'])
      if isinstance(data.get('includes'), str):
          data['includes'] = json.loads(data['includes'])
      results.append(data)
  ```

---

### 4. **測試指南中的錯誤密碼 Hash**

**問題描述**：
- `TESTING_GUIDE.md` 中的測試密碼 hash 與新的 bcrypt 實現不兼容

**解決方案**：
- 更新測試指南，使用動態生成的密碼 hash
- 提供正確的創建測試帳號命令：
  ```bash
  HASH=$(cd backend && python3 -c "import bcrypt; print(bcrypt.hashpw('test123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'))")
  psql postgresql://JL@localhost:5432/vortixpr -c "
  INSERT INTO users (email, hashed_password, name, role, account_status, is_active, provider) 
  VALUES ('test@vortixpr.com', '$HASH', 'Test Admin', 'super_admin', 'active', true, 'email') 
  ON CONFLICT (email) DO UPDATE SET role = 'super_admin', hashed_password = '$HASH';
  "
  ```

---

## ✅ 修改的檔案

1. **`backend/app/utils/security.py`**
   - 移除 `passlib` 依賴
   - 直接使用 `bcrypt` 庫
   
2. **`backend/app/api/pr_template_admin.py`**
   - 修正 `current_user` 訪問方式
   - 使用 `require_admin` 依賴注入
   - 添加 JSONB 欄位轉換邏輯

3. **`backend/requirements.txt`**
   - 移除 `passlib==1.7.4`
   - 保留 `bcrypt==4.0.1`

4. **`standards/TESTING_GUIDE.md`**
   - 更新測試帳號創建命令
   - 提供動態生成密碼 hash 的方法

---

## 🧪 測試結果

```bash
✅ 登入成功 - Token 正常生成
✅ Admin API - 獲取模板列表成功 (8 個模板)
✅ Public API - 統計數據正常返回
```

---

## 📚 關鍵教訓

### ✅ 該做的：
1. **定期更新依賴** - 避免使用已停止維護的庫（如 passlib）
2. **使用類型提示** - `TokenData` 而非 `dict`，避免運行時錯誤
3. **使用依賴注入進行權限檢查** - `require_admin` 比手動檢查更簡潔
4. **處理資料庫類型轉換** - JSONB → Python 對象

### ❌ 避免的：
1. ❌ 依賴已停止維護的庫
2. ❌ 混用字典語法和屬性訪問
3. ❌ 假設資料庫返回的類型與 Pydantic 模型匹配
4. ❌ 在測試指南中硬編碼密碼 hash

---

## 🔄 相關文件

- **測試指南**: `standards/TESTING_GUIDE.md`
- **登入系統**: `backend/app/api/auth.py`
- **安全工具**: `backend/app/utils/security.py`
- **Admin API**: `backend/app/api/pr_template_admin.py`

---

**維護者**: VortixPR AI Team  
**最後更新**: 2026-01-08


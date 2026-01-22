# VortixPortal & Publisher Features JSONB 遷移執行計劃

## ⚠️ 必讀

**Token 和測試方法：** 必須參考 `standards/TESTING_GUIDE.md`  
**絕對禁止：** 
- ❌ 直接用資料庫操作測試
- ❌ 跳過任何步驟
- ❌ 欄位對不上就開始寫 code

**必須做到：**
- ✅ 用真實 Token + API 測試所有操作
- ✅ 測試 Public API 和 Admin API（GET + PUT）
- ✅ 確認前後台資料與原始內容完全一致

---

## 🎯 VortixPortal Section 完整流程

### Step 0: 檢查並記錄原始內容（必須第一步）

**0.1 找到前端組件：**
- 主組件：VortixPortalSection.tsx
- Constants：publisherData.ts 或其他
- 使用的地方：App.tsx 或其他頁面

**0.2 完整盤點所有欄位和原始值：**

**方法：** 用 grep 搜尋寫死的內容
```bash
# 找標題
grep -n "Vortix Portal\|#V_PR_WORKSPACE" frontend/src/components/VortixPortalSection.tsx

# 找描述
grep -n "operating system for modern PR" frontend/src/components/VortixPortalSection.tsx

# 找列表
grep -A 5 "const.*Features = \[" frontend/src/components/VortixPortalSection.tsx
```

**0.3 記錄到文件：**
```
檔案：/tmp/section_original_content.txt

需要的完整欄位結構：
{
  "label": "值",
  "title": "值",
  "subtitle": "值",  # 如果有
  "description": "值",
  "stats": [{number, label}],  # 如果有
  "items": [{結構}],
  "cta_*": {結構}
}
```

**0.4 比對確認：**
- 列出的欄位是否涵蓋前台所有顯示內容？
- 是否有遺漏？
- **沒有遺漏才進行下一步**

### Step 1: 遷移資料到 JSONB

**1.1 檢查前置條件：**
```bash
# 確認 section_contents 表存在
psql -U JL -d vortixpr -c "\d section_contents"

# 確認沒有重複的 section_key
psql -U JL -d vortixpr -c "SELECT section_key FROM section_contents WHERE section_key = 'vortix_portal';"
```

**1.2 插入資料：**
- 使用 Step 0 記錄的**完整**原始內容
- **每個欄位都要包含**，不要遺漏
- 使用 Python + asyncpg 插入

**1.3 驗證資料：**
```bash
# 查看完整資料
psql -U JL -d vortixpr -c "SELECT jsonb_pretty(content) FROM section_contents WHERE section_key = 'vortix_portal';"

# 逐項比對 Step 0 記錄的原始內容
# 所有欄位都要存在且值正確
```

### Step 2: 測試後端 APIs（用 Token，參考 TESTING_GUIDE.md）

**2.1 取得 Token：**
```bash
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@vortixpr.com","password":"test123"}' | jq -r '.access_token')
```

**2.2 測試 Public API：**
```bash
curl -s "http://localhost:8000/api/public/content/sections/vortix_portal"
# 確認返回的資料與 Step 0 記錄的一致
```

**2.3 測試 Admin GET API：**
```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/admin/content/sections/vortix_portal"
# 確認返回完整資料
```

**2.4 測試 Admin PUT API：**
```bash
# 用 API 更新資料（不要用資料庫）
curl -X PUT "http://localhost:8000/api/admin/content/sections/vortix_portal" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":{...Step 0 的完整原始資料...}}'
```

**2.5 驗證 PUT 成功：**
- 再次 GET，確認資料正確
- 對比 Step 0，確認每個欄位都正確
- **不是只看標題，是每個欄位都要檢查**

### Step 3: 更新前端組件

**3.1 備份（如果需要）：**
```bash
cp frontend/src/components/VortixPortalSection.tsx frontend/src/components/VortixPortalSection.tsx.before-jsonb
```

**3.2 修改組件：**
- 添加 useState 和 useEffect
- 改用 fetch API 讀取 JSONB
- **逐一替換**每個寫死的內容為 sectionData
- 移除舊的 constants import（如果不再需要）

**3.3 檢查清單：**
- [ ] 所有 Step 0 記錄的欄位都已改為從 sectionData 讀取
- [ ] 沒有遺漏任何欄位
- [ ] 沒有任何 fallback（|| 運算符）
- [ ] useEffect 依賴正確

### Step 4: 測試前台顯示（瀏覽器）

**4.1 刷新瀏覽器：**
- Cmd+Shift+R 清除快取

**4.2 找到 Section 並逐項比對：**
- 打開 Step 0 記錄的文件
- 對照前台顯示
- **逐項打勾確認：**
  - [ ] 標題文字完全一致
  - [ ] 副標題完全一致（如果有）
  - [ ] 描述文字完全一致
  - [ ] 統計數字完全一致（如果有）
  - [ ] 列表項目數量正確
  - [ ] 每個列表項目內容正確
  - [ ] CTA 按鈕文字正確
  - [ ] 圖片正確（如果有）

**4.3 檢查開發者工具：**
- Console 沒有錯誤
- Network 確認 API 呼叫成功
- 返回的資料正確

### Step 5: 創建 Admin 管理頁面

**5.1 複製模板：**
```bash
cp frontend/src/pages/admin/AdminContentServices.tsx \
   frontend/src/pages/admin/AdminContentVortixPortal.tsx
```

**5.2 修改內容：**
- 修改 function 名稱
- 修改 section_key: 'services' → 'vortix_portal'
- **根據 Step 0 調整所有欄位：**
  - 欄位名稱（label, name, placeholder）
  - 欄位數量（不要多也不要少）
  - 欄位結構（如 cta_primary vs cta_button）

**5.3 檢查清單：**
- [ ] Admin 頁面的欄位與 Step 0 完全對應
- [ ] 沒有多餘欄位
- [ ] 沒有缺少欄位
- [ ] 表單的 name 屬性與 JSONB 結構一致

### Step 6: 添加路由和側邊欄
- App.tsx 添加 route
- AdminLayout.tsx 添加選單項目

### Step 7: 用 API 測試編輯流程（必須用 Token + API）

**7.1 測試修改資料：**
```bash
# 用 PUT API 修改內容（不要用資料庫）
curl -X PUT "http://localhost:8000/api/admin/content/sections/vortix_portal" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":{...修改後的資料...}}'
```

**7.2 驗證：**
- 用 GET API 讀取，確認修改成功
- 用 psql 查資料庫，確認儲存正確
- **兩者必須一致**

**7.3 恢復原始資料：**
- 用 PUT API 恢復為 Step 0 的原始資料
- 驗證恢復成功

### Step 8: 測試後台編輯（瀏覽器）
- 登入後台
- 前往 Admin 頁面
- 測試編輯、儲存、重新整理

### Step 9: 最終驗證（逐項比對）

**9.1 前台驗證：**
- 打開前台頁面
- 對照 Step 0 記錄，逐項檢查：
  - [ ] 標題正確
  - [ ] 副標題正確（如果有）
  - [ ] 描述正確
  - [ ] 統計數字正確（如果有）
  - [ ] 列表項目數量正確
  - [ ] 每個列表項目內容正確
  - [ ] CTA 按鈕文字正確

**9.2 後台驗證：**
- 登入後台，前往 Admin 頁面
- 對照 Step 0 記錄，逐項檢查：
  - [ ] 所有欄位都有對應的輸入框
  - [ ] 每個欄位顯示的值正確
  - [ ] 沒有多餘欄位
  - [ ] 沒有缺少欄位

**9.3 編輯測試：**
- 修改一個欄位（如標題）
- 儲存
- 重新整理
- 確認修改保持

**9.4 恢復測試：**
- 用 API 恢復原始資料
- 前台確認恢復
- 後台確認恢復

**全部通過才算完成！**

---

## 🎯 Publisher Features 完整流程

完全相同的 9 個步驟，只是：
- section_key 改為 'publisher'
- 從 publisher_features 表讀取原始資料

---

## ⚠️ 絕對禁止

1. ❌ 跳過任何步驟（特別是 Step 0）
2. ❌ 同時改兩個 Section
3. ❌ 不測試就說完成
4. ❌ 用資料庫直接操作而非 API
5. ❌ 測試時不比對原始內容
6. ❌ 欄位對不上就開始改 code
7. ❌ 使用測試資料後不恢復
8. ❌ 未經同意使用 git 操作
9. ❌ 偽造測試結果
10. ❌ 創建完成文檔（在真正完成前）

---

## ✅ 必須做到

1. ✅ Step 0 必須完整盤點所有欄位
2. ✅ 一次只做一個 Section
3. ✅ 嚴格按照步驟順序（不跳步）
4. ✅ 每一步都用真實 API + Token 測試
5. ✅ 測試時逐項比對 Step 0 的原始內容
6. ✅ Admin 頁面欄位必須與 Step 0 完全對應
7. ✅ 測試用的資料必須立即恢復
8. ✅ 前後台都要測試並逐項比對
9. ✅ 確認 100% 正常才說完成
10. ✅ 參考 `standards/TESTING_GUIDE.md` 取得 Token


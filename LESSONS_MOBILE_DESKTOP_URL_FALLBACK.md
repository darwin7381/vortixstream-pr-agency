# 經驗教訓：手機版/桌面版 URL Fallback 問題

## 問題摘要

在實作 Hero Section 和 Navigation 的手機版/桌面版 URL 分離功能時，遇到以下嚴重問題：

1. **前端使用了錯誤的 fallback 邏輯**（使用 `||` 運算符）
2. **後端 Pydantic Model 缺少欄位定義**（導致 API 不返回手機版 URL）

這導致行銷人員設定的手機版 URL 無法生效，資料雖然儲存到資料庫，但前端接收不到。

---

## 根本原因分析

### 問題 1：前端 Fallback 邏輯錯誤

#### ❌ 錯誤寫法

```typescript
const url = isMobile ? (mobileUrl || desktopUrl) : desktopUrl;
```

**問題：**
- 使用 `||` 運算符會將空字串 `""` 視為 falsy
- 即使行銷人員故意留空手機版 URL（想要不同行為），也會被強制 fallback
- 導致手機版設定無效

#### ✅ 正確寫法

```typescript
const url = isMobile 
  ? (mobileUrl && mobileUrl.trim() !== '' ? mobileUrl : desktopUrl) 
  : desktopUrl;
```

**原則：**
- 只有在 `mobileUrl` 為 `null`、`undefined` 或空字串時才使用 `desktopUrl`
- 明確檢查而非依賴 JavaScript 的 falsy 特性

---

### 問題 2：後端 Pydantic Model 缺少欄位定義

#### 問題描述

雖然資料庫表 `hero_sections` 中有以下欄位：
- `cta_primary_url_mobile`
- `cta_secondary_url_mobile`

但 Pydantic model `HeroSectionBase` 中**沒有定義這兩個欄位**。

#### 後果

1. ✅ 前端可以送出資料到後端
2. ✅ 後端可以儲存到資料庫
3. ❌ **後端 API 回傳時會忽略這兩個欄位**（因為 Pydantic 不認識）
4. ❌ 前端接收不到手機版 URL
5. ❌ 頁面重新整理後顯示為空

#### 修復方式

```python
class HeroSectionBase(BaseModel):
    """
    ⚠️ 重要：所有欄位都必須在這裡定義，否則 API 不會返回該欄位
    """
    page: str = Field(..., max_length=50)
    title_prefix: Optional[str] = None
    # ... 其他欄位 ...
    cta_primary_url: Optional[str] = None
    cta_primary_url_mobile: Optional[str] = None  # ⚠️ 必須定義
    cta_secondary_url: Optional[str] = None
    cta_secondary_url_mobile: Optional[str] = None  # ⚠️ 必須定義
```

---

## 影響範圍

### 已檢查並修復的檔案

1. **前端 - Hero Section**
   - `/frontend/src/components/HeroNewSection.tsx`
   - 修復了 `handleCTA` 函數的 fallback 邏輯
   - 修復了 Secondary CTA 寫死 `#` 的問題

2. **前端 - Navigation 點擊處理**
   - `/frontend/src/components/Navigation.tsx`
   - 修復了 `handleNavClick` 函數的 fallback 邏輯

3. **前端 - Navigation 管理後台**
   - `/frontend/src/pages/admin/AdminSiteSettings.tsx`
   - ⚠️ **重大問題**：Line 74 使用了 `mobile_url: formData.get('mobile_url') as string || null`
   - 這導致空字串被轉成 `null`，而後端會忽略 `null` 值，不更新資料庫
   - **修復**：改為 `mobile_url: (formData.get('mobile_url') as string) || ''`，送空字串而非 null

4. **後端 - Pydantic Model**
   - `/backend/app/models/content.py`
   - 在 `HeroSectionBase` 中添加了缺失的 `cta_primary_url_mobile` 和 `cta_secondary_url_mobile` 欄位

5. **後端 - Navigation 更新 API**
   - `/backend/app/api/site_admin.py`
   - ⚠️ **重大問題**：使用 `if data.mobile_url is not None` 判斷是否更新
   - 當前端送 `null` 時，條件不成立，**不會更新資料庫**
   - **修復**：改用 `data.model_dump(exclude_unset=True)` 來區分「未提供」和「空值」

### Navigation 系統檢查結果

✅ **Navigation 系統沒有問題**
- 資料庫表已有 `desktop_url` 和 `mobile_url` 欄位
- Pydantic model 正確定義了這些欄位（在 `site_admin.py` 中）
- Public API 正確返回這些欄位
- 前端處理邏輯已修復

---

## 絕對禁止的寫法

### ❌ 禁止 1：前端使用 || 運算符選擇 URL

```typescript
// 絕對禁止！
const url = isMobile ? (mobileUrl || desktopUrl) : desktopUrl;
const url = isDesktop ? item.desktop_url : (item.mobile_url || item.desktop_url);
```

**原因：**
- 空字串會被視為 falsy 而觸發 fallback
- 行銷人員的設定會被忽略
- 難以 debug（看起來像是資料沒儲存）

### ❌ 禁止 2：前端使用 || null 轉換資料

```typescript
// 絕對禁止！
const data = {
  mobile_url: formData.get('mobile_url') as string || null,  // ❌
};
```

**問題：**
- 當用戶清空欄位時，空字串 `""` 會被轉成 `null`
- 後端使用 `if data.mobile_url is not None` 時，`null` 會被視為「未提供」
- 導致資料庫**不會被更新**，舊值保留

**正確寫法：**
```typescript
const data = {
  mobile_url: (formData.get('mobile_url') as string) || '',  // ✅ 送空字串
};
```

### ❌ 禁止 3：後端使用 is not None 判斷是否更新

```python
# 絕對禁止！
if data.mobile_url is not None:
    updates.append(f"mobile_url = ${param_count}")
    values.append(data.mobile_url)
```

**問題：**
- 無法區分「前端沒有提供這個欄位」和「前端提供了 None/null」
- 當前端想清空欄位時，會被視為「未提供」而不更新

**正確寫法：**
```python
# ✅ 使用 model_dump(exclude_unset=True)
update_data = data.model_dump(exclude_unset=True)

for field, value in update_data.items():
    updates.append(f"{field} = ${param_count}")
    values.append(value)
    param_count += 1
```

---

## 正確的實作原則

### 1. 前端 URL 選擇邏輯

```typescript
/**
 * ⚠️ 重要原則：禁止使用 || 運算符進行 fallback
 * 
 * ❌ 錯誤寫法：const url = isMobile ? (mobileUrl || desktopUrl) : desktopUrl;
 * 問題：空字串 "" 會被視為 falsy 而 fallback 到 desktopUrl
 * 
 * ✅ 正確寫法：只有在 mobileUrl 為 null/undefined/空字串時才使用 desktopUrl
 */
const url = isMobile 
  ? (mobileUrl && mobileUrl.trim() !== '' ? mobileUrl : desktopUrl) 
  : desktopUrl;
```

### 2. 後端 Pydantic Model 定義

```python
class SomeModelBase(BaseModel):
    """
    ⚠️ 重要：所有欄位都必須在 Base Model 中定義
    
    如果資料庫有該欄位，但 Pydantic Model 沒有定義：
    - FastAPI 可以接收資料（寫入）
    - 但 API 回應時會忽略該欄位（讀取失敗）
    """
    desktop_url: Optional[str] = None
    mobile_url: Optional[str] = None  # ⚠️ 必須明確定義
```

---

## 測試清單

在實作類似功能時，必須檢查：

- [ ] 資料庫表是否有對應欄位
- [ ] Pydantic Base Model 是否定義了所有欄位
- [ ] API 回應是否包含所有預期欄位（用 `curl` 測試）
- [ ] 前端是否正確接收到資料
- [ ] 前端 fallback 邏輯是否使用明確檢查（而非 `||` 運算符）
- [ ] 儲存後重新整理頁面，資料是否還在

---

## 相關檔案

### 前端
- `/frontend/src/components/HeroNewSection.tsx` - Hero Section CTA 處理
- `/frontend/src/components/Navigation.tsx` - Navigation 點擊處理
- `/frontend/src/pages/admin/AdminHeroHome.tsx` - Hero Section 管理後台

### 後端
- `/backend/app/models/content.py` - Pydantic Models
- `/backend/app/api/content_public.py` - Public API
- `/backend/app/api/content_admin_extended.py` - Admin API
- `/backend/app/api/site_admin.py` - Navigation Admin API
- `/backend/app/core/database.py` - Database Schema

---

## 總結

**關鍵原則：**

1. **絕對禁止使用 `||` 運算符進行 mobile/desktop fallback**
2. **Pydantic Model 必須定義所有需要返回的欄位**
3. **測試時必須檢查 API 回應的完整性**
4. **重新整理頁面後資料應該保持一致**

這些原則適用於所有類似的 mobile/desktop 分離場景。


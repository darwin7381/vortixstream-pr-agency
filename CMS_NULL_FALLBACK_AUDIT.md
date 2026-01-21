# CMS 系統 Null/Fallback 錯誤審計報告

## 執行時間
2026-01-21

## 問題摘要

在整個 CMS 系統中發現了**大量使用 `|| null` 和 `if data.field is not None` 的錯誤模式**，這些都會導致：
- ❌ 用戶無法清空欄位
- ❌ 資料庫保留舊值
- ❌ 行銷人員困惑

---

## 🚨 嚴重問題清單

### 前端問題：使用 `|| null`

#### 1. AdminHeroHome.tsx (Line 219-220)
**位置：** Hero Media Logo 編輯
```typescript
position_left: formData.get('position_left') as string || null,    // ❌
position_right: formData.get('position_right') as string || null,  // ❌
```

**影響：** 無法清空 logo 的位置設定

---

#### 2. AdminContentTestimonials.tsx (Line 58-60)
**位置：** Testimonials 編輯
```typescript
author_title: formData.get('author_title') as string || null,        // ❌
author_company: formData.get('author_company') as string || null,    // ❌
author_avatar_url: formData.get('author_avatar_url') as string || null, // ❌
```

**影響：** 無法清空作者職稱、公司、頭像

---

#### 3. AdminContentCarousel.tsx (Line 102-103)
**位置：** Carousel Logo 編輯
```typescript
alt_text: formData.get('alt_text') as string || null,      // ❌
website_url: formData.get('website_url') as string || null, // ❌
```

**影響：** 無法清空 alt text 和網址

---

#### 4. AdminHeroManagement.tsx (Line 88-89)
**位置：** Hero Management (舊版)
```typescript
position_left: formData.get('position_left') as string || null,   // ❌
position_right: formData.get('position_right') as string || null, // ❌
```

**影響：** 同 AdminHeroHome.tsx

---

#### 5. AdminContentHero.tsx (Line 50-56)
**位置：** Hero Content 編輯
```typescript
subtitle: formData.get(`${page}_subtitle`) as string || null,                  // ❌
description: formData.get(`${page}_description`) as string || null,            // ❌
cta_primary_text: formData.get(`${page}_cta_primary_text`) as string || null,  // ❌
cta_primary_url: formData.get(`${page}_cta_primary_url`) as string || null,    // ❌
cta_secondary_text: formData.get(`${page}_cta_secondary_text`) as string || null, // ❌
cta_secondary_url: formData.get(`${page}_cta_secondary_url`) as string || null,   // ❌
background_image_url: formData.get(`${page}_background_image_url`) as string || null, // ❌
```

**影響：** 無法清空各種 Hero Section 內容

---

#### 6. AdminContentClients.tsx (Line 61)
**位置：** Clients Logo 編輯
```typescript
website_url: formData.get('website_url') as string || null, // ❌
```

**影響：** 無法清空客戶網址

---

#### 7. AdminContentServices.tsx (Line 48)
**位置：** Services 編輯
```typescript
icon: formData.get('icon') as string || null, // ❌
```

**影響：** 無法清空服務 icon

---

### 後端問題：使用 `if data.field is not None`

#### site_admin.py - 四個 UPDATE 函數

##### 1. update_navigation_cta (Line 240-259)
```python
if data.text_en is not None:     # ❌
if data.text_zh is not None:     # ❌
if data.text_ja is not None:     # ❌
if data.url is not None:         # ❌
if data.is_active is not None:   # ❌
```

**影響：** Navigation CTA 無法清空多語言文字和 URL

---

##### 2. update_footer_section (Line 335-358)
```python
if data.section_key is not None:  # ❌
if data.title_en is not None:     # ❌
if data.title_zh is not None:     # ❌
if data.title_ja is not None:     # ❌
if data.display_order is not None: # ❌
if data.is_active is not None:    # ❌
```

**影響：** Footer Section 無法清空多語言標題

---

##### 3. update_footer_link (Line 426-457)
```python
if data.section_id is not None:   # ❌
if data.label_en is not None:     # ❌
if data.label_zh is not None:     # ❌
if data.label_ja is not None:     # ❌
if data.url is not None:          # ❌
if data.target is not None:       # ❌
if data.display_order is not None: # ❌
if data.is_active is not None:    # ❌
```

**影響：** Footer Link 無法清空多語言標籤和 URL

---

##### 4. update_footer_text_setting (Line 530-541)
```python
if data.value_en is not None:     # ❌
if data.value_zh is not None:     # ❌
if data.value_ja is not None:     # ❌
```

**影響：** Footer Text 無法清空多語言內容

---

## ✅ 已修復的檔案

1. ✅ AdminHeroHome.tsx - Primary/Secondary CTA URLs (mobile)
2. ✅ AdminSiteSettings.tsx - Navigation mobile_url
3. ✅ HeroNewSection.tsx - 前端 URL 選擇邏輯
4. ✅ Navigation.tsx - 前端 URL 選擇邏輯
5. ✅ backend/app/models/content.py - HeroSectionBase Model
6. ✅ backend/app/api/site_admin.py - update_navigation_item (已改用 model_dump)

---

## 修復優先級

### 🔴 高優先級（影響核心功能）

1. **AdminContentHero.tsx** - Hero Section 核心內容
2. **AdminContentTestimonials.tsx** - 客戶見證
3. **site_admin.py** - Navigation CTA 和 Footer 更新

### 🟡 中優先級（影響視覺和 SEO）

4. **AdminContentCarousel.tsx** - Logo Carousel
5. **AdminContentClients.tsx** - 客戶 Logo
6. **AdminHeroHome.tsx** - Hero Media Logo 位置

### 🟢 低優先級（使用較少）

7. **AdminContentServices.tsx** - Services Icon
8. **AdminHeroManagement.tsx** - 舊版 Hero Management（可能已棄用）

---

## 建議修復策略

### 選項 1：全面修復（推薦）
- 一次性修復所有前端和後端問題
- 確保整個系統一致性
- 避免未來混淆

### 選項 2：分階段修復
1. 先修復高優先級
2. 再修復中優先級
3. 最後修復低優先級

---

## 標準修復模板

### 前端修復

```typescript
// ❌ 錯誤
field: formData.get('field') as string || null,

// ✅ 正確
field: (formData.get('field') as string) || '',
```

### 後端修復

```python
# ❌ 錯誤
if data.field is not None:
    updates.append(f"field = ${param_count}")
    values.append(data.field)
    param_count += 1

# ✅ 正確
update_data = data.model_dump(exclude_unset=True)

for field, value in update_data.items():
    updates.append(f"{field} = ${param_count}")
    values.append(value)
    param_count += 1
```

---

## 測試檢查清單

修復後需要測試：

- [ ] 可以清空欄位並儲存
- [ ] 重新整理後欄位保持為空
- [ ] 可以重新設定值
- [ ] 資料庫正確更新

---

## 相關文件

- `LESSONS_MOBILE_DESKTOP_URL_FALLBACK.md` - 詳細的問題說明和修復原則


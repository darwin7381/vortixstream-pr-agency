# Modal 風格一致性審查報告

## 審查日期
2026-01-13

## 專案標準 Glassmorphism 風格

### 定義位置
`frontend/src/index.css` (Lines 116-126)

```css
.glass-backdrop {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.glass-modal {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(40px) saturate(150%);
  -webkit-backdrop-filter: blur(40px) saturate(150%);
}
```

### 標準樣式規範
1. **背景層 (Backdrop)**
   - 使用 `glass-backdrop` class
   - `background: rgba(0, 0, 0, 0.3)`
   - `backdrop-filter: blur(8px)`

2. **Modal 主體**
   - 使用 `glass-modal` class
   - `background: rgba(255, 255, 255, 0.05)`
   - `backdrop-filter: blur(40px) saturate(150%)`
   - `border: border-white/30`
   - `shadow: shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_80px_rgba(255,255,255,0.05),inset_0_0_0_1px_rgba(255,255,255,0.1)]`
   - `rounded-2xl`

3. **字體標準**
   - 標題使用 `Space Grotesk, sans-serif`
   - 一般文字可使用系統 font-sans

4. **顏色主題**
   - 主色：`#FF7400` (橙色)
   - 次要色：`#1D3557` (深藍)
   - 白色透明度：`white/60`, `white/70`, `white/90`

---

## 前台 Modal 清單與審查結果

### ✅ 符合標準

#### 1. PackageDetailModal.tsx
**路徑**: `frontend/src/components/pricing/PackageDetailModal.tsx`
**用途**: PR Package 詳情彈窗
**狀態**: ✅ 完全符合標準

**實現細節**:
- ✅ 使用 `glass-backdrop`
- ✅ 使用 `glass-modal`
- ✅ 使用 `border-white/30`
- ✅ 使用標準 shadow
- ✅ 標題使用 `Space Grotesk`
- ✅ 顏色主題一致

---

#### 2. PublisherApplicationModal.tsx
**路徑**: `frontend/src/components/publisher/PublisherApplicationModal.tsx`
**用途**: 出版商申請表單彈窗
**狀態**: ✅ 完全符合標準

**實現細節**:
- ✅ 使用 `glass-backdrop`
- ✅ 使用 `glass-modal`
- ✅ 使用 `border-white/30`
- ✅ 使用標準 shadow
- ✅ 標題使用 `Space Grotesk`
- ✅ 顏色主題一致

---

### ❌ 不符合標準（需要修復）

#### 3. TemplatePreviewModal.tsx ⚠️
**路徑**: `frontend/src/components/template/TemplatePreviewModal.tsx`
**用途**: PR Template 預覽彈窗
**狀態**: ❌ **風格不一致 - 漏網之魚！**

**問題清單**:

1. **背景層 (Line 94-97)**
   - ❌ 使用 `bg-black/70 backdrop-blur-sm`
   - ✅ 應該使用 `glass-backdrop`

2. **Modal 主體 (Line 100)**
   - ❌ 使用 `bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]`
   - ✅ 應該使用 `glass-modal`
   - ❌ 使用 `border-white/10` (太淡)
   - ✅ 應該使用 `border-white/30`
   - ❌ 使用 `shadow-2xl` (不一致)
   - ✅ 應該使用標準 shadow

3. **字體 (Lines 105, 119, 137, etc.)**
   - ❌ 標題使用 `font-sans`
   - ✅ 應該使用 `Space Grotesk`

4. **內部區塊 (Lines 102, 140, 303)**
   - ❌ 使用 `border-white/10` 和 `bg-black/20`
   - ✅ 應該使用 `border-white/20` 和更透明的背景

**影響範圍**:
- Templates 頁面的主要互動元素
- 使用者體驗不一致
- 視覺風格與其他 modal 明顯不同

---

#### 4. EmailLoginModal.tsx ⚠️
**路徑**: `frontend/src/components/template/EmailLoginModal.tsx`
**用途**: Email 登入彈窗（Template 下載流程）
**狀態**: ❌ **風格不一致 - 漏網之魚！**

**問題清單**:

1. **背景層 (Line 49-52)**
   - ❌ 使用 `bg-black/80 backdrop-blur-sm`
   - ✅ 應該使用 `glass-backdrop`

2. **Modal 主體 (Line 55)**
   - ❌ 使用 `bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]`
   - ✅ 應該使用 `glass-modal`
   - ❌ 使用 `border-white/10` (太淡)
   - ✅ 應該使用 `border-white/30`
   - ❌ 使用 `shadow-2xl` (不一致)
   - ✅ 應該使用標準 shadow

3. **字體**
   - ❌ 標題使用 `font-sans`
   - ✅ 應該使用 `Space Grotesk`

4. **內部區塊 (Lines 66, 117)**
   - ❌ 使用 `border-white/10`
   - ✅ 應該使用 `border-white/20`

**影響範圍**:
- Template 下載流程中的關鍵轉換點
- 用戶註冊/登入體驗
- 與主系統風格不一致

---

## 管理後台 Modal

#### 5. ImageViewModal.tsx
**路徑**: `frontend/src/components/admin/ImageViewModal.tsx`
**用途**: 管理後台圖片查看
**狀態**: ⚠️ 需要檢查（管理後台可能有不同標準）

**備註**: 
- 管理後台的 UI 標準可能與前台不同
- 建議保持管理後台內部一致即可
- 暫時不列入此次修復範圍

---

## 統計總結

### 前台 Modal 統計
- **總數**: 5 個
- **符合標準**: 2 個 (40%)
- **不符合標準**: 3 個 (60%)

### 需要修復的 Modal
1. ❌ **TemplatePreviewModal.tsx** (高優先級)
2. ❌ **EmailLoginModal.tsx** (高優先級)
3. ❌ **TemplateDownloadForm.tsx** (高優先級)

---

## 風格差異對比

### 當前 TemplatePreviewModal vs. 標準 PackageDetailModal

| 元素 | TemplatePreviewModal (錯誤) | PackageDetailModal (標準) |
|------|---------------------------|--------------------------|
| **Backdrop** | `bg-black/70 backdrop-blur-sm` | `glass-backdrop` |
| **Modal 背景** | `bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]` | `glass-modal` |
| **邊框** | `border-white/10` | `border-white/30` |
| **陰影** | `shadow-2xl` | 標準 glass shadow |
| **標題字體** | `font-sans` | `Space Grotesk, sans-serif` |
| **視覺效果** | 深色、厚重、不透明 | 輕盈、透明、現代 |

---

## 修復優先級

### 🔴 高優先級（立即修復）
1. **TemplatePreviewModal.tsx**
   - 主要用戶互動元素
   - 影響品牌一致性
   - 修復工作量：中等

2. **EmailLoginModal.tsx**
   - 關鍵轉換流程
   - 影響用戶註冊體驗
   - 修復工作量：中等

### 🟡 中優先級（後續評估）
3. **ImageViewModal.tsx**
   - 僅管理後台使用
   - 可能有不同設計標準
   - 建議先確認管理後台整體設計規範

---

## 修復建議

### 標準化步驟

1. **替換 Backdrop**
   ```tsx
   // 之前
   <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
   
   // 之後
   <div className="absolute inset-0 glass-backdrop" />
   ```

2. **替換 Modal 主體**
   ```tsx
   // 之前
   <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl">
   
   // 之後
   <div className="
     glass-modal
     border border-white/30 rounded-2xl
     shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_80px_rgba(255,255,255,0.05),inset_0_0_0_1px_rgba(255,255,255,0.1)]
   ">
   ```

3. **統一字體**
   ```tsx
   // 之前
   <h2 className="text-white text-[28px] font-sans font-bold">
   
   // 之後
   <h2 
     className="text-white text-3xl md:text-4xl font-bold"
     style={{ fontFamily: 'Space Grotesk, sans-serif' }}
   >
   ```

4. **調整邊框透明度**
   - `border-white/10` → `border-white/20` 或 `border-white/30`

5. **調整內部區塊**
   ```tsx
   // 之前
   <div className="border-b border-white/10 bg-black/20">
   
   // 之後
   <div className="border-b border-white/20">
   ```

---

## 預期效果

### 修復後的優勢
1. ✅ **視覺一致性**: 所有前台 modal 使用統一的 glassmorphism 風格
2. ✅ **品牌形象**: 強化專業、現代的品牌印象
3. ✅ **用戶體驗**: 提供一致的互動體驗
4. ✅ **維護性**: 使用標準化的 CSS class，易於維護
5. ✅ **性能**: Glassmorphism 提供更好的視覺層次和可讀性

### 風格對比圖
```
❌ 舊風格 (TemplatePreviewModal)
┌─────────────────────────┐
│  深色不透明背景          │
│  ┌───────────────────┐  │
│  │  厚重的深色 Modal │  │
│  │  缺乏層次感       │  │
│  └───────────────────┘  │
└─────────────────────────┘

✅ 新風格 (Standard Glassmorphism)
┌─────────────────────────┐
│  輕透明模糊背景          │
│  ┌───────────────────┐  │
│  │  透明玻璃效果     │  │
│  │  清晰層次感       │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

---

## 後續行動

### 立即行動
1. 修復 **TemplatePreviewModal.tsx**
2. 修復 **EmailLoginModal.tsx**
3. 進行視覺回歸測試

### 長期維護
1. 建立 Modal 組件開發規範文件
2. 考慮創建標準 Modal wrapper 組件
3. 添加 lint rules 確保風格一致性

---

## 相關文件
- `frontend/src/index.css` - Glass style 定義
- `frontend/src/components/pricing/PackageDetailModal.tsx` - 標準參考
- `frontend/src/components/publisher/PublisherApplicationModal.tsx` - 標準參考

## 結論

共發現 **2 個前台 modal** 未遵循專案的 glassmorphism 標準設計風格：
1. **TemplatePreviewModal** - 使用舊的深色漸變風格
2. **EmailLoginModal** - 使用舊的深色漸變風格

這兩個 modal 都位於 template 相關功能中，很可能是在不同時期或由不同開發流程創建的，導致風格不一致。建議立即進行標準化修復，以確保整體用戶體驗的一致性。


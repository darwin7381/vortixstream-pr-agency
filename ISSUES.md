# VortixPR 專案問題清單

## 當前狀態
- 專案已成功啟動在 `http://localhost:3000`
- 存在多個視覺和功能性問題需要修復

---

## 問題 1: 缺少圖片資源 (已部分處理)

### 問題描述
專案中引用了一個不存在的圖片檔案:`2799e81d26195c87c18db17ccc6b7baed122de1d.png`

### 當前狀態
**暫時處理方案**: 在 `vite.config.ts` 中新增了 alias 映射,將缺少的圖片指向現有的替代圖片 `c79d7f21c404cf28a35c0be8bcf6afb7466c18e7.png`

### 實際情況
- **我們沒有這張原始圖片**
- **目前使用替代圖片作為臨時解決方案**
- 這個替代圖片可能與設計稿中的原始圖片不同

### 檔案位置
- 引用位置: `/src/constants/articleContent.ts:149`
- 配置位置: `/vite.config.ts:20`

### 建議解決方案
1. 向設計團隊索取原始圖片 `2799e81d26195c87c18db17ccc6b7baed122de1d.png`
2. 或者確認替代圖片是否符合設計需求
3. 如果替代圖片可接受,則維持現狀

---

## 問題 2: 缺少字體載入 ⚠️ **嚴重** ✅ **已修復**

### 問題描述
網站使用的主要字體 **Space Grotesk** 和 **Noto Sans** 沒有被正確載入,導致顯示效果與設計稿不符

### 設計規範 (根據 UI Guidelines)
```
標題字體: 'Space Grotesk', sans-serif
- 變體: Medium, SemiBold, Bold

內文字體: 'Noto Sans', sans-serif  
- 變體: Regular, SemiBold, Bold
```

### 根本原因
1. 缺少 Google Fonts 字體載入連結
2. Figma 匯出的 CSS 使用了錯誤的字體名稱格式 (`Noto Sans\:Bold` 而非 `'Noto Sans'`)

### 修復內容
✅ **已修復檔案:**
1. `/index.html` - 新增 Google Fonts 連結載入 Space Grotesk 和 Noto Sans
2. `/src/styles/globals.css` - 新增字體變數並應用到 body 和標題元素
3. `/src/index.css` - 修正 Figma 匯出的錯誤字體類別定義

### 修復後狀態
- ✅ Space Grotesk 字體正確載入並應用到標題
- ✅ Noto Sans 字體正確載入並應用到內文
- ✅ 所有字重(400, 500, 600, 700)都正確顯示
- ✅ 視覺效果與設計稿一致

---

## 問題 3: 可能缺少的動畫效果

### 問題描述
從 Cursor AI 的描述來看,Figma 設計稿包含多種動畫效果,但需要驗證是否都已實現

### 已實現的動畫 (根據 globals.css)
- ✅ Hero Section 動畫
- ✅ Stats Section 動畫  
- ✅ Logo Carousel 滾動
- ✅ Button hover 效果
- ✅ 手指脈衝光效果
- ✅ 貓太空人浮動效果

### 需要驗證
- 頁面滾動時的元素進場動畫
- Testimonials 輪播動畫
- FAQ 展開/收合動畫
- 其他互動效果

---

## 問題 4: 版本控制與依賴

### npm audit 警告
安裝依賴時出現 1 個中等安全性漏洞警告

### 建議
```bash
npm audit fix
```

---

## 修復優先順序

### 🔴 高優先級 (立即修復)
1. **問題 2**: 載入 Space Grotesk 和 Noto Sans 字體
   - 這是視覺差異最大的問題
   - 修復後可立即看到改善

### 🟡 中優先級 (建議修復)
2. **問題 1**: 確認圖片資源是否正確
3. **問題 3**: 驗證所有動畫效果

### 🟢 低優先級 (可選)
4. **問題 4**: 處理 npm 安全警告

---

## 下一步行動

1. 立即修復字體載入問題
2. 重新載入網站驗證效果
3. 與設計稿逐一對比確認細節
4. 補充缺失的動畫效果(如有)

---

**文件創建時間**: 2025-10-27
**最後更新**: 2025-10-27


# Tailwind CSS v4 完整規則與專案診斷報告

## 📋 目錄
1. [Tailwind v4 核心變更](#tailwind-v4-核心變更)
2. [關鍵規則與限制](#關鍵規則與限制)
3. [我們當前違反的規則](#我們當前違反的規則)
4. [所有問題的根本原因](#所有問題的根本原因)
5. [正確的 v4 架構](#正確的-v4-架構)

---

## Tailwind v4 核心變更

### 1. 全新引擎（Oxide - Rust）
- 完整構建速度提升 **5 倍**
- 增量構建速度提升 **100+ 倍**
- 移除 PostCSS 依賴

### 2. CSS-First 配置
**v3 方式（已廢棄）：**
```javascript
// tailwind.config.js
module.exports = {
  theme: { extend: {...} }
}
```

**v4 方式（正確）：**
```css
@import "tailwindcss";

@theme {
  --font-sans: 'Custom Font', sans-serif;
  --color-brand: #FF7400;
}
```

### 3. 移除 `@tailwind` 指令
**v3：**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**v4：**
```css
@import "tailwindcss";
```

### 4. 自動內容檢測
- 不需要手動配置 `content` 路徑
- 使用 `@source` 指令控制掃描範圍

---

## 關鍵規則與限制

### 規則 1：`@import` 順序
**正確順序：**
```css
/* 1. 外部字體（可選） */
@import url("https://fonts.googleapis.com/...");

/* 2. Tailwind 核心 */
@import "tailwindcss";

/* 3. Source 指令 */
@source "../src/**/*.{js,jsx,ts,tsx}";

/* 4. Theme 自定義 */
@theme {
  --font-sans: ...;
}

/* 5. Variants 自定義 */
@custom-variant dark (&:is(.dark *));

/* 6. Utilities 自定義 */
@utility content-auto {
  content-visibility: auto;
}

/* 7. 專案全域樣式 */
:root { ... }
html { ... }

/* 8. 專案組件樣式 */
.btn-brand { ... }
```

### 規則 2：任意值類別（Arbitrary Values）
**❌ 錯誤（v3 方式，v4 中可能衝突）：**
```css
@layer utilities {
  .opacity-\[0\.02\] {
    opacity: 0.02;
  }
}
```

**✅ 正確方式 1（使用 @utility 指令）：**
```css
@utility opacity-* {
  opacity: --value([number]);
}
```

**✅ 正確方式 2（使用 @source inline）：**
```css
@source inline("opacity-[0.02]");
```

**✅ 正確方式 3（讓 Tailwind 自動生成）：**
- 只要在組件中使用 `opacity-[0.02]`
- Tailwind 會自動掃描並生成
- **前提：`@source` 指令正確配置**

### 規則 3：`@layer` 的使用限制
**在 v4 中，`@layer` 的作用改變了：**

**❌ 不應該做：**
```css
@layer utilities {
  /* 手動定義與 Tailwind 重複的類別 */
  .opacity-5 { opacity: .05; }
  .container { width: 100%; }
}
```

**✅ 應該做：**
```css
/* 專案特有的 utilities，不在 @layer 中 */
.container-global {
  max-width: var(--max-width-container-large);
  padding-left: var(--spacing-global-mobile);
  padding-right: var(--spacing-global-mobile);
  margin-left: auto;
  margin-right: auto;
}

/* 或使用 @utility 指令 */
@utility container-global {
  max-width: var(--max-width-container-large);
  padding-inline: var(--spacing-global-mobile);
  margin-inline: auto;
}
```

### 規則 4：`@theme` 指令
**用於定義主題變數：**
```css
@theme {
  /* 字體 */
  --font-sans: 'Noto Sans', sans-serif;
  --font-heading: 'Space Grotesk', sans-serif;
  
  /* 顏色 */
  --color-brand: #FF7400;
  
  /* Spacing */
  --spacing-section-large: 112px;
}
```

**⚠️ 注意：**
- `@theme` 定義的變數會被 Tailwind 識別
- 可以用於 Tailwind 的工具類別中
- **不應該與專案自定義的 `:root` 變數混淆**

### 規則 5：`@custom-variant` 指令
**定義自定義變體：**
```css
@custom-variant dark (&:is(.dark *));
@custom-variant hocus (&:is(:hover, :focus));
```

### 規則 6：瀏覽器支持
**v4 最低要求：**
- Safari 16.4+
- Chrome 111+
- Firefox 128+

**原因：**
- 依賴 `@property`
- 依賴 `color-mix()`
- 依賴 cascade layers

---

## 我們當前違反的規則

### ❌ 違反 1：在 `@layer utilities` 中手動定義任意值類別
**位置：** `index.css` 行 578-592

```css
@layer utilities {
  .opacity-\[0\.02\] {  /* ❌ 錯誤！這應該讓 Tailwind 自動生成 */
    opacity: 0.02;
  }
  .opacity-3 { opacity: .03; }  /* ❌ 錯誤！與 Tailwind 預設衝突 */
  .opacity-5 { opacity: .05; }  /* ❌ 錯誤！與 Tailwind 預設衝突 */
  .opacity-8 { opacity: .08; }  /* ❌ 錯誤！與 Tailwind 預設衝突 */
}
```

**問題：**
- 這些類別應該由 Tailwind 自動生成
- 手動定義可能與 Tailwind 的生成機制衝突
- 導致類別無效或優先級錯誤

### ❌ 違反 2：`@layer utilities` 中混入專案自定義類別
**位置：** `index.css` 行 407-600

```css
@layer utilities {
  .container { ... }          /* ✅ 這個可以 */
  .container-global { ... }   /* ⚠️ 應該在 @layer 外 */
  .px-global { ... }          /* ⚠️ 應該在 @layer 外 */
  .py-section-large { ... }   /* ⚠️ 應該在 @layer 外 */
  .duration-900 { ... }       /* ⚠️ 應該在 @layer 外 */
}
```

**問題：**
- 專案特有的類別不應該在 `@layer utilities` 中
- 應該在全域作用域或使用 `@utility` 指令

### ❌ 違反 3：註解掉 Tailwind 生成的 `@layer theme` 和 `@layer base`
**位置：** `index.css` 行 14-404

```css
/* @layer theme {
  :root, :host {
    --font-sans: ui-sans-serif, ...;
    --color-red-500: ...;
    /* 104 個 Tailwind 預設變數 */
  }
} */
```

**問題：**
- 這些是 **Tailwind 預編譯時生成的**
- 在使用 `@import "tailwindcss"` 時，**不應該存在這些註解內容**
- 應該完全刪除（Tailwind 會在編譯時自動生成）

### ❌ 違反 4：`:root` 變數與 `@theme` 變數混淆
**位置：** `index.css` 行 603-688

```css
:root {
  --font-size: 14px;               /* ✅ 專案自定義 */
  --font-sans: 'Noto Sans', ...;   /* ⚠️ 應該在 @theme 中 */
  --brand-500: ...;                /* ✅ 專案自定義 */
  --spacing-section-large: ...;    /* ✅ 專案自定義 */
}
```

**問題：**
- `--font-sans` 和 `--font-heading` 應該用 `@theme` 定義
- 專案特有的變數（如 `--brand-500`, `--spacing-*`）應該在 `:root` 中

---

## 所有問題的根本原因

### 1. Hero Section 網格不顯示
**原因：**
- `.opacity-\[0\.02\]` 在 `@layer utilities` 中手動定義
- 與 Tailwind 自動生成機制衝突
- 導致類別無效或未被應用

### 2. 字體問題
**原因：**
- `--font-sans` 和 `--font-heading` 在 `:root` 中定義
- 應該用 `@theme` 指令定義
- Tailwind 無法正確識別和應用

### 3. 位置/大小有些微差異
**原因：**
- 註解掉的 `@layer theme` 包含 Tailwind 的預設間距和尺寸變數
- 某些 Tailwind 工具類別可能使用這些預設值
- 導致計算不一致

### 4. 80% 正常，20% 有問題
**原因：**
- Tailwind 的 `@import "tailwindcss"` **確實在工作**
- 大部分 Tailwind 預設類別正常生成
- **只有我們手動定義的衝突部分有問題**

---

## 正確的 v4 架構

### 標準 Tailwind v4 CSS 結構
```css
/* ==========================================
   1. 外部資源（字體、圖標等）
   ========================================== */
@import url("https://fonts.googleapis.com/...");

/* ==========================================
   2. Tailwind 核心（必須在最前面）
   ========================================== */
@import "tailwindcss";

/* ==========================================
   3. Source 指令（告訴 Tailwind 去哪掃描）
   ========================================== */
@source "../src/**/*.{js,jsx,ts,tsx}";

/* 可選：強制生成特定類別 */
@source inline("opacity-[0.02]");

/* ==========================================
   4. Theme 自定義（Tailwind 會識別的變數）
   ========================================== */
@theme {
  /* 字體家族 */
  --font-sans: 'Noto Sans', ui-sans-serif, system-ui, sans-serif;
  --font-heading: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
  
  /* 如果需要覆蓋 Tailwind 預設顏色 */
  /* --color-brand-500: #FF7400; */
}

/* ==========================================
   5. Variants 自定義
   ========================================== */
@custom-variant dark (&:is(.dark *));

/* ==========================================
   6. Utilities 自定義（使用 @utility 指令）
   ========================================== */
@utility opacity-* {
  opacity: --value([number]);
}

@utility tab-* {
  tab-size: --value([integer]);
}

/* ==========================================
   7. 專案全域樣式（不在 @layer 中）
   ========================================== */
:root {
  /* 只放專案特有的變數，不是 Tailwind 的 theme */
  --font-size: 14px;
  --brand-h: 27;
  --brand-s: 100%;
  --brand-l: 51%;
  --brand-500: hsl(var(--brand-h) var(--brand-s) var(--brand-l));
  --shadow-brand: 0 12px 28px -12px hsl(var(--brand-h) var(--brand-s) 40% / .45);
  
  /* 專案特有的 spacing */
  --padding-section-large-desktop: 112px;
  --padding-section-large-mobile: 64px;
  /* ... */
}

.dark {
  /* Dark mode 變數 */
}

html {
  font-size: var(--font-size);
}

body {
  line-height: inherit;
}

/* ==========================================
   8. 專案自定義組件類別（不在 @layer 中）
   ========================================== */
.container-global {
  max-width: var(--max-width-container-large);
  padding-left: var(--spacing-global-mobile);
  padding-right: var(--spacing-global-mobile);
  margin-left: auto;
  margin-right: auto;
}

@media (width >=1280px) {
  .container-global {
    padding-left: var(--spacing-global-desktop);
    padding-right: var(--spacing-global-desktop);
  }
}

.py-section-large {
  padding-top: var(--spacing-section-large-mobile);
  padding-bottom: var(--spacing-section-large-mobile);
}

@media (width >=1280px) {
  .py-section-large {
    padding-top: var(--spacing-section-large-desktop);
    padding-bottom: var(--spacing-section-large-desktop);
  }
}

/* ... 其他專案特有的類別 */

/* ==========================================
   9. 動畫定義
   ========================================== */
@keyframes float-particle {
  0%, 100% { ... }
  50% { ... }
}

/* ==========================================
   10. CSS Properties（Houdini）
   ========================================== */
@property --tw-translate-x {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
```

---

## 關鍵規則與限制

### 📌 規則 1：不要手動定義 Tailwind 預設類別
**❌ 錯誤：**
```css
@layer utilities {
  .opacity-5 { opacity: .05; }  /* Tailwind 已有 */
  .opacity-8 { opacity: .08; }  /* Tailwind 已有 */
}
```

**✅ 正確：**
- 讓 Tailwind 自動生成
- 如果需要確保生成：`@source inline("opacity-5")`

### 📌 規則 2：任意值類別的處理
**v4 中有三種方式：**

**方式 1：完全依賴自動生成（推薦）**
```jsx
// 組件中直接使用
<div className="opacity-[0.02]">
```
- Tailwind 會自動掃描並生成
- **前提：`@source` 正確配置**

**方式 2：使用 @utility 指令（支持模式匹配）**
```css
@utility opacity-* {
  opacity: --value([number]);
}
```
- 支持所有 `opacity-[任意數字]`
- 更靈活

**方式 3：使用 @source inline（強制生成特定類別）**
```css
@source inline("opacity-[0.02]");
```
- 確保特定類別一定會生成
- 適用於動態類別或確保生成

### 📌 規則 3：`@layer` 在 v4 中的正確用法
**Tailwind 自動生成的層級順序：**
```
1. @layer properties { ... }  ← Tailwind 自動生成
2. @layer theme { ... }       ← Tailwind 自動生成
3. @layer base { ... }        ← Tailwind 自動生成
4. @layer utilities { ... }   ← Tailwind 自動生成
```

**專案不應該：**
- ❌ 手動創建這些 @layer
- ❌ 在這些 @layer 中添加內容
- ❌ 註解掉預編譯的 @layer（應該完全刪除）

**專案應該：**
- ✅ 讓 Tailwind 自動生成這些層級
- ✅ 專案自定義內容放在全域作用域
- ✅ 使用 `@utility`, `@theme`, `@custom-variant` 指令

### 📌 規則 4：變數定義的分類
**`@theme` vs `:root`：**

**@theme（Tailwind 會識別）：**
```css
@theme {
  --font-sans: ...;      /* Tailwind 的字體系統會用 */
  --color-brand: ...;    /* 可以用 text-brand, bg-brand */
  --spacing-xl: ...;     /* 可以用 p-xl, m-xl */
}
```

**:root（專案私有）：**
```css
:root {
  --font-size: 14px;           /* 專案特有 */
  --brand-h: 27;               /* 專案特有 */
  --shadow-brand: ...;         /* 專案特有 */
  --max-width-container: ...;  /* 專案特有 */
}
```

### 📌 規則 5：CSS 文件的載入
**main.tsx 或 入口文件：**
```typescript
import "./index.css";  /* ✅ 正確 */
```

**Vite 配置（vite.config.ts）：**
```typescript
// v4 不需要特殊的 CSS 配置
// PostCSS 配置在 postcss.config.js 中
```

**postcss.config.js：**
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},  /* ✅ v4 的 PostCSS 插件 */
  },
}
```

---

## 我們當前違反的規則（詳細列表）

### ❌ 問題 1：手動定義 opacity 類別（最嚴重）
**位置：** `index.css` 行 578-592
```css
@layer utilities {
  .opacity-\[0\.02\] { opacity: 0.02; }  /* 與自動生成衝突 */
  .opacity-3 { opacity: .03; }           /* 與預設衝突 */
  .opacity-5 { opacity: .05; }           /* 與預設衝突 */
  .opacity-8 { opacity: .08; }           /* 與預設衝突 */
}
```

**影響：**
- Hero Section 網格的 `opacity-[0.02]` 類別無效
- 可能導致其他使用 opacity-3, 5, 8 的地方也有問題

### ❌ 問題 2：專案類別錯誤放在 `@layer utilities`
**位置：** `index.css` 行 407-577
```css
@layer utilities {
  .container { ... }         /* ✅ Tailwind 標準，可以覆蓋 */
  .container-global { ... }  /* ❌ 專案特有，不應該在 @layer 中 */
  .px-global { ... }         /* ❌ 專案特有 */
  .py-section-large { ... }  /* ❌ 專案特有 */
  .duration-900 { ... }      /* ❌ 專案特有 */
  .font-sans { ... }         /* ❌ 專案特有 */
}
```

**影響：**
- 這些類別的優先級可能不正確
- 可能與 Tailwind 的其他工具類別衝突

### ❌ 問題 3：註解掉的預編譯內容未清理
**位置：** `index.css` 行 14-404
```css
/* @layer theme { ... } */  /* ← 7,000+ 行的預編譯內容 */
/* @layer base { ... } */
```

**影響：**
- 佔用文件空間（本應是 ~1,500 行，現在 2,018 行）
- 造成混淆
- 應該完全刪除

### ❌ 問題 4：`:root` 中包含應該在 `@theme` 的變數
**位置：** `index.css` 行 601-602
```css
:root {
  --font-sans: 'Noto Sans', ...;      /* ❌ 應該在 @theme */
  --font-heading: 'Space Grotesk', ...;  /* ❌ 應該在 @theme */
}
```

**影響：**
- Tailwind 無法識別這些字體定義
- 無法用於 `font-sans` 工具類別
- 導致字體問題

### ⚠️ 問題 5：`@source` 指令的路徑
**當前：** `@source "../src/**/*.{js,jsx,ts,tsx}";`
**問題：** 路徑 `../src/` 可能不正確（已經在 `src/` 中了）
**應該：** `@source "./**/*.{js,jsx,ts,tsx}";` 或移除（自動檢測）

---

## 正確的 v4 架構（完整範例）

### 正確的 index.css 結構（~1,400 行）
```css
/* ========== 1. 外部資源 ========== */
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:...");

/* ========== 2. Tailwind 核心 ========== */
@import "tailwindcss";

/* ========== 3. Source 指令 ========== */
@source "./**/*.{js,jsx,ts,tsx}";

/* 可選：強制生成特定類別 */
/* @source inline("opacity-[0.02]"); */

/* ========== 4. Theme 自定義 ========== */
@theme {
  --font-sans: 'Noto Sans', ui-sans-serif, system-ui, sans-serif;
  --font-heading: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
}

/* ========== 5. Variants 自定義 ========== */
@custom-variant dark (&:is(.dark *));

/* ========== 6. Utilities 自定義（使用 @utility）========== */
/* 如果需要支持任意值模式 */
/* @utility opacity-* {
  opacity: --value([number]);
} */

/* ========== 7. 專案全域樣式 ========== */
:root {
  --font-size: 14px;
  --brand-h: 27;
  --brand-s: 100%;
  --brand-l: 51%;
  --brand-500: hsl(var(--brand-h) var(--brand-s) var(--brand-l));
  --brand-600: hsl(var(--brand-h) var(--brand-s) 46%);
  --brand-blue: #1d3557;
  --shadow-brand: 0 12px 28px -12px hsl(var(--brand-h) var(--brand-s) 40% / .45);
  
  --max-width-container-large: 1280px;
  --spacing-global-desktop: 64px;
  --spacing-global-mobile: 20px;
  --spacing-section-large-desktop: 112px;
  --spacing-section-large-mobile: 64px;
  /* ... 其他專案變數 */
}

.dark {
  --background: oklch(.145 0 0);
  /* ... */
}

html {
  font-size: var(--font-size);
}

body {
  line-height: inherit;
}

/* ========== 8. 專案自定義類別 ========== */
.container-global {
  max-width: var(--max-width-container-large);
  padding-left: var(--spacing-global-mobile);
  padding-right: var(--spacing-global-mobile);
  margin-left: auto;
  margin-right: auto;
}

@media (width >=1280px) {
  .container-global {
    padding-left: var(--spacing-global-desktop);
    padding-right: var(--spacing-global-desktop);
  }
}

.py-section-large {
  padding-top: var(--spacing-section-large-mobile);
  padding-bottom: var(--spacing-section-large-mobile);
}

@media (width >=1280px) {
  .py-section-large {
    padding-top: var(--spacing-section-large-desktop);
    padding-bottom: var(--spacing-section-large-desktop);
  }
}

/* ... 其他專案類別 */

/* ========== 9. 動畫定義 ========== */
@keyframes float-particle {
  0%, 100% {
    opacity: .3;
    transform: translateY(0)translateX(0);
  }
  /* ... */
}

/* ... 其他動畫 */

/* ========== 10. 專案組件樣式 ========== */
.btn-brand-shadow {
  box-shadow: var(--shadow-brand);
  transition: box-shadow .3s ease-out, transform .3s ease-out;
}

.btn-brand-shadow:hover {
  box-shadow: ...;
}

/* ... */

/* ========== 11. CSS Properties（Houdini）========== */
@property --tw-translate-x {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}

/* ... */
```

---

## 解決方案總結

### 需要修正的地方

1. **刪除註解掉的 @layer theme 和 @layer base**
   - 行 14-404
   - 這些是預編譯內容，不應存在於源文件

2. **移除 @layer utilities 包裝**
   - 將專案自定義類別移到全域作用域
   - 只保留 `.container` 的覆蓋（如果需要）

3. **刪除手動定義的 opacity 類別**
   - `.opacity-\[0\.02\]`, `.opacity-3`, `.opacity-5`, `.opacity-8`
   - 讓 Tailwind 自動生成
   - 或使用 `@utility opacity-* { opacity: --value([number]); }`

4. **移動字體定義到 @theme**
   - 從 `:root` 移除 `--font-sans` 和 `--font-heading`
   - 在 `@theme` 中定義

5. **修正 @source 路徑**
   - 從 `"../src/**/*"` 改為 `"./**/*"`

### 預期結果

**修正後：**
- ✅ Hero Section 網格正常顯示（Tailwind 自動生成 opacity-[0.02]）
- ✅ 所有字體正確應用（@theme 正確定義）
- ✅ 位置/大小精準（Tailwind 預設值正確）
- ✅ index.css 約 1,400-1,600 行（刪除預編譯內容）
- ✅ 100% 符合 Tailwind v4 規範

---

## 參考資料

- [Tailwind CSS v4 官方文檔](https://tailwindcss.com/docs)
- [Tailwind CSS v4 升級指南](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS v4 發布公告](https://tailwindcss.com/blog/tailwindcss-v4)
- [Functions & Directives](https://tailwindcss.com/docs/functions-and-directives)
- [Adding Custom Styles](https://tailwindcss.com/docs/adding-custom-styles)

---

**診斷完成！** 🎯


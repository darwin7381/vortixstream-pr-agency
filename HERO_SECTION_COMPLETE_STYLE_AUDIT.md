# Hero Section 完整樣式盤點與優先度分析

## 影響 Hero Section 網格的所有樣式來源

### 1. Hero Section 組件（HeroNewSection.tsx）

**Section 容器（行 218）：**
```jsx
<section className="relative w-full min-h-[100vh] bg-black overflow-hidden">
```
- `relative` → 定位上下文
- `bg-black` → **黑色背景**（可能覆蓋子元素？）
- `overflow-hidden` → 隱藏溢出
- `min-h-[100vh]` → 最小高度

**網格元素（行 232-243）：**
```jsx
<div 
  className="absolute inset-0 opacity-8 pointer-events-none"
  style={{
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    mask: 'radial-gradient(...)',
    WebkitMask: 'radial-gradient(...)',
    zIndex: 1
  }}
/>
```

**層次結構：**
```
<section relative bg-black>
  ├─ Background Gradient (absolute inset-0)     z-index: auto (0)
  ├─ Grid Pattern (absolute inset-0 opacity-8)  z-index: 1
  ├─ Floating Particles (absolute inset-0)      z-index: auto (0)
  └─ Main Content (relative z-10)               z-index: 10
```

---

### 2. index.css 全域樣式

**:root 變數（影響）：**
- `--font-size: 14px` → 影響 rem 計算
- 無直接影響 background

**html 樣式：**
```css
html {
  font-family: theme('fontFamily.sans');
  font-size: var(--font-size);
}
```
- 無影響 background

**body 樣式：**
```css
body {
  line-height: inherit;
}
```
- 無影響 background

**.dark 樣式：**
```css
.dark {
  --background: oklch(.145 0 0);
}
```
- 只影響 dark mode
- Hero 在 light mode

**動畫定義：**
- @keyframes hero-*
- 無影響 background

---

### 3. App.tsx 父容器

**外層容器（App.tsx 行 107）：**
```jsx
<div className="min-h-screen bg-black">
```
- `bg-black` → 黑色背景
- 不影響子元素

**Main Content 容器（行 115）：**
```jsx
<div className="pt-14 sm:pt-16 md:pt-[72px] lg:pt-[72px]">
```
- 只有 padding-top
- 無影響 background

**HomePage 渲染（行 52）：**
```jsx
<HeroNewSection />
```
- 直接渲染，無包裝
- 無影響

---

### 4. Navigation 導航欄

**Navigation 組件：**
- 固定在頂部（fixed）
- z-index: 50
- 不影響 Hero Section（Hero 在 padding-top 之下）

---

### 5. Tailwind 生成的類別

**`.absolute`：**
```css
.absolute {
  position: absolute;
}
```

**`.inset-0`：**
```css
.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
```

**`.opacity-8`（來自 tailwind.config.js）：**
```css
.opacity-8 {
  opacity: 0.08;
}
```

**`.bg-black`：**
```css
.bg-black {
  background-color: #000;
}
```

---

## CSS 優先度分析

### 優先度規則（由高到低）

```
1. !important                         = 10,000
2. 內聯 style=""                      = 1,000
3. #id                                = 100
4. .class, [attr]                     = 10
5. tag                                = 1
```

### Hero 網格元素的樣式優先度

**應用的樣式（優先度由高到低）：**

1. **內聯 style（優先度 = 1,000）：**
   ```jsx
   style={{
     backgroundImage: `...`,  // 優先度最高
     backgroundSize: '60px',
     mask: '...',
     WebkitMask: '...',
     zIndex: 1
   }}
   ```

2. **CSS 類別（優先度 = 10）：**
   ```css
   .absolute { position: absolute; }           // 優先度 10
   .inset-0 { top/right/bottom/left: 0; }     // 優先度 10
   .opacity-8 { opacity: 0.08; }              // 優先度 10
   .pointer-events-none { pointer-events: none; } // 優先度 10
   ```

**理論上：內聯 style 的 backgroundImage 應該優先於所有 CSS！**

---

## 可能的衝突點分析

### ❓ 衝突點 1：父元素的 bg-black
**理論：**
```jsx
<section className="bg-black">  // 黑色背景
  <div style={{ backgroundImage: ... }}>  // 網格背景
```

**問題：**
- 父元素的 `background-color: #000`
- 會不會覆蓋子元素的 `backgroundImage`？

**測試方法：**
- 移除 section 的 `bg-black`
- 看網格是否出現

**優先度分析：**
```
父元素 .bg-black（優先度 10）
vs
子元素 inline style backgroundImage（優先度 1,000）
→ 子元素應該贏！
```

**結論：理論上不應該衝突**

---

### ❓ 衝突點 2：Background Gradient 元素
**順序：**
```jsx
<div className="absolute inset-0" style={{ background: 'gradient...' }} />  // 第一個
<div className="absolute inset-0" style={{ backgroundImage: 'grid...' }} />  // 第二個
```

**問題：**
- 兩個都是 `absolute inset-0`
- 第二個會覆蓋第一個嗎？

**z-index 分析：**
```
Background Gradient: z-index: auto (0)
Grid Pattern: z-index: 1
→ Grid 應該在上面！
```

**結論：理論上 Grid 應該顯示**

---

### ❓ 衝突點 3：opacity-8 的值
**CSS：**
```css
.opacity-8 {
  opacity: 0.08;  /* 8% */
}
```

**問題：**
- 0.08 = 8%
- 是否太淡看不見？

**對比：**
- Stats Section 也用 opacity-8 → **能看見**
- Hero 用 opacity-8 → **看不見**

**結論：不是 opacity 的問題**

---

### ❓ 衝突點 4：mask 屬性
**CSS：**
```css
mask: 'radial-gradient(ellipse at center, white 0%, white 70%, transparent 100%)'
```

**問題：**
- mask 會遮蔽背景嗎？
- mask 的漸變是否正確？

**對比：**
- Stats 有 mask → **網格顯示**
- Hero 有 mask → **網格不顯示**

**結論：不是 mask 的問題**

---

## 深入分析：為什麼 Stats 能顯示但 Hero 不能

### Stats Section 完整結構
```jsx
<section className="relative w-full overflow-hidden">
  <style>{內嵌動畫}</style>
  <div className="absolute inset-0 opacity-100" style={{ background: ... }} />
  <div className="absolute inset-0">粒子</div>
  <div className="absolute inset-0 opacity-8" style={{ backgroundImage: grid... }} />
  <div className="relative z-10">內容</div>
</section>
```

### Hero Section 完整結構
```jsx
<section className="relative w-full min-h-[100vh] bg-black overflow-hidden">
  <div className="absolute inset-0" style={{ background: gradient... }} />
  <div className="absolute inset-0 opacity-8 z-1" style={{ backgroundImage: grid... }} />
  <div className="absolute inset-0">粒子</div>
  <div className="relative z-10">內容</div>
</section>
```

### 關鍵差異對比

| 項目 | Stats (✅ 顯示) | Hero (❌ 不顯示) | 影響 |
|------|----------------|-----------------|------|
| section bg | 無 | `bg-black` | ⚠️ 可能 |
| section 高度 | 無 | `min-h-[100vh]` | ❓ |
| 網格順序 | Particles 之後 | Particles 之前 | ⚠️ 可能 |
| 內嵌 style | 無 | 無 | ✅ 相同 |

### ⚠️ 最可疑的差異

**1. section 的 `bg-black`**
```
理論：父元素的 background-color 不應該影響子元素的 backgroundImage
實際：可能在某些情況下有 bug 或特殊行為
```

**2. 網格元素的順序**
```
Stats：Background → Particles → Grid → Content
Hero：Background → Grid → Particles → Content

問題：Particles 在 Grid 之後，可能覆蓋了 Grid？
```

---

## 建議的修正方案（優先度排序）

### 🔴 優先度 1：調整網格元素順序
**修正：** 將網格移到 Particles 之後（與 Stats 一致）

**理由：** 
- Stats 能顯示，順序是關鍵差異
- 即使有 z-index，DOM 順序仍可能影響

**預期效果：** 高機率解決

---

### 🟡 優先度 2：移除 section 的 bg-black
**修正：** 只在 Background Gradient 中設置黑色

**理由：**
- Hero 獨有的屬性
- 可能與 backgroundImage 有未知衝突

**預期效果：** 中等機率

---

### 🟢 優先度 3：提高 opacity
**修正：** 從 opacity-8 改為 opacity-15 或更高

**理由：**
- 8% 可能真的太淡
- 在黑色背景上更難看見

**預期效果：** 低機率（但值得嘗試）

---

## 執行建議

**建議按順序嘗試：**
1. 先調整網格順序（移到 Particles 之後）
2. 如仍無效，移除 section bg-black
3. 如仍無效，提高 opacity

**每次修改後測試，找出真正的原因。**

---

**準備開始修正！**




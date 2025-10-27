# VortixStream UI 設計指南

## 專案概覽

VortixStream 是一個專業的 PR 服務網站，專注於區塊鏈、加密貨幣和 AI 領域。我們的設計理念結合了宇宙科技美學與現代商業專業感，創造出獨特的品牌視覺體驗。

---

## 1. 整體視覺概念

### 設計理念
- **宇宙科技風格**：融合太空、科技與未來感的視覺元素
- **專業商務導向**：保持專業 PR 服務的可信度與權威性
- **動態互動體驗**：通過精緻的動畫提升用戶參與感
- **極簡與複雜的平衡**：在視覺豐富性與功能清晰度間取得平衡

### 品牌調性
- 創新前瞻
- 專業可靠
- 技術領先
- 國際化視野

---

## 2. 色彩系統

### 主要色彩

#### 背景色系
```css
--color-black-primary: #000000     /* 主要黑色背景 */
--color-black-secondary: #050505   /* Features Section 背景 */
--color-black-tertiary: #191919    /* 卡片和次要背景 */
```

#### 品牌色彩
```css
--color-brand-orange: #FF7400      /* 主要品牌橘色 */
--color-brand-blue: #1D3557        /* 輔助品牌深藍 */
--color-white: #FFFFFF             /* 純白色文字和邊框 */
```

#### 透明度變化
```css
--color-white-5: rgba(255,255,255,0.05)   /* 極淡背景 */
--color-white-10: rgba(255,255,255,0.10)  /* 淡背景 */
--color-white-20: rgba(255,255,255,0.20)  /* 邊框和分隔線 */
--color-white-80: rgba(255,255,255,0.80)  /* 次要文字 */
```

### 色彩使用原則

1. **黑色背景為主導**：創造專業科技感
2. **白色文字確保可讀性**：所有文字內容使用白色或高透明度白色
3. **橘色作為視覺焦點**：用於 CTA 按鈕、重點元素和 hover 狀態
4. **深藍色提供對比層次**：在漸層和輔助元素中使用

---

## 3. 按鈕設計系統

### Primary Button（主要按鈕）
```css
/* 橘藍漸層按鈕 - 用於最重要的 CTA */
background: linear-gradient(102deg, #FF7400 0%, #1D3557 100%);
border: 1px solid #FF7400;
color: white;
padding: 20px 24px;
border-radius: 6px;

/* Hover 狀態 */
hover:scale-105
hover:shadow-[0_0_25px_rgba(255,116,0,0.4)]
```

### Secondary Button（次要按鈕）
```css
/* 白色邊框透明背景 */
background: transparent;
border: 2px solid white;
color: white;
padding: 20px 24px;

/* Hover 狀態 */
hover:bg-white
hover:text-black
```

### Submit Now Button（特殊白框按鈕）
```css
/* 保持白色文字的特殊按鈕 */
background: transparent;
border: 1px solid white;
color: white;
position: relative;
overflow: hidden;

/* 特殊 Hover 效果 */
hover:scale-[1.02]
hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]
/* 內部脈衝邊框動畫 */
```

### Contact Us Button（橘色 Hover）
```css
/* Ghost 按鈕變體 */
background: transparent;
color: white;

/* Hover 狀態變橘色 */
hover:text-[#FF7400]
hover:animate-[text-pulse_2s_ease-in-out_infinite]
```

### 按鈕使用原則

1. **每個區域最多一個 Primary Button**
2. **Submit Now 按鈕始終保持白色文字**
3. **所有按鈕都需要 hover 效果**
4. **移動端按鈕 padding 適當減少**

---

## 4. Hover 效果標準

### 導航欄 Hover
```css
/* 文字脈衝光效果 */
.navbar-link:hover {
  animation: text-pulse 2s ease-in-out infinite;
  text-shadow: 
    0 0 6px rgba(255,255,255,0.3),
    0 0 12px rgba(255,255,255,0.15),
    0 0 18px rgba(255,255,255,0.08);
}
```

### 卡片 Hover
```css
/* 微妙發光效果 */
.card:hover {
  animation: subtle-glow 2s ease-in-out infinite;
  background: rgba(255,255,255,0.02);
  transform: scale(1.02);
  border-color: rgba(255,255,255,0.25);
}
```

### 圖標漂浮動畫
```css
/* 月球圖標漂浮效果 */
@keyframes moon-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-3px) rotate(2deg); }
  50% { transform: translateY(-5px) rotate(0deg); }
  75% { transform: translateY(-2px) rotate(-2deg); }
}

.icon-float:hover {
  animation: moon-float 3s ease-in-out infinite;
}
```

### 按鈕 Hover
```css
/* 縮放 + 陰影 */
.button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(255,116,0,0.4);
}
```

### Logo 卡片 Hover
```css
.logo-card:hover {
  transform: scale(1.02);
  border-color: rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.05);
}
```

---

## 5. 慣用視覺元素

### 浮動粒子（Floating Particles）
```css
/* 用於增加宇宙感的背景裝飾 */
width: 1px;
height: 1px;
background: white;
border-radius: 50%;
opacity: 0.2-0.3;
animation: float-particle 2.5s-5s ease-in-out infinite;
```

### 網格背景（Grid Pattern）
```css
/* 科技感網格覆蓋 */
background-image: 
  linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
background-size: 60px 60px;
opacity: 0.8;
```

### 徑向漸層（Radial Gradients）
```css
/* 多層宇宙背景效果 */
background: 
  radial-gradient(circle at 15% 25%, rgba(255,116,0,0.18) 0%, transparent 45%),
  radial-gradient(circle at 85% 75%, rgba(29,53,87,0.22) 0%, transparent 50%),
  linear-gradient(135deg, #000000 0%, #1a1a2e 20%, #16213e 40%);
```

### 脈衝光效（Pulse Effects）
```css
/* 手指指向脈衝光 */
@keyframes finger-pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 0.8; transform: scale(1.2); }
}
```

### 軌道動畫（Orbital Animation）
```css
/* 頭像周圍粒子軌道 */
@keyframes particle-orbit-1 {
  0% { transform: rotate(0deg) translateX(25px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(25px) rotate(-360deg); }
}
```

---

## 6. 入場動畫系統

### 動畫時間設定
```css
/* 自定義 duration 類別 */
.duration-1300 { transition-duration: 1300ms; }
.duration-1400 { transition-duration: 1400ms; }
.duration-1500 { transition-duration: 1500ms; }
```

### 漸進式入場模式
```javascript
// Hero Section 入場時序
標題第一行：delay 0.4s, duration 1500ms
標題第二行：delay 0.9s, duration 1500ms  
描述文字：delay 1.4s, duration 1300ms
按鈕：delay 2.0s, duration 1300ms
```

### 錯開動畫原則
- **文字元素**：0.3s - 0.5s 間隔
- **卡片元素**：0.4s - 0.7s 間隔  
- **列表項目**：0.3s - 0.4s 間隔
- **Logo 網格**：index * 0.12s

### 動畫效果組合
```css
/* 標準入場動畫 */
.entrance-animation {
  opacity: 0;
  transform: translateY(8px) translateX(4px);
  filter: blur(2px);
  
  /* 入場後狀態 */
  opacity: 1;
  transform: translateY(0) translateX(0);
  filter: blur(0);
  transition: all 1400ms ease-out;
}
```

---

## 7. 動態背景系統

### 宇宙粒子配置
```javascript
// 粒子數量按區域調整
Hero Section: 25個粒子
Stats Section: 25個粒子  
Services Section: 25個粒子（底部漸隱）
Features Section: 無粒子（保持貓咪太空人清晰）
Client Logos: 12個粒子
```

### 背景層次結構
1. **基礎漸層背景**（最底層）
2. **徑向光暈效果**（中層）
3. **網格圖案**（上層）
4. **浮動粒子**（頂層）
5. **內容層**（最上層，z-index: 10）

### 區域背景特色
- **Hero**: 英雄圖片 + 深色遮罩
- **Stats**: 宇宙背景 + 動態粒子
- **Services**: 漸層過渡 + 底部漸隱
- **Features**: 純貓咪太空人背景
- **Client Logos**: 微妙宇宙背景

---

## 8. 響應式設計原則

### 斷點系統
```css
/* Mobile First 設計 */
default: < 768px     /* 手機版 */
md: ≥ 768px         /* 平板版 */  
lg: ≥ 1024px        /* 桌面版 */
xl: ≥ 1280px        /* 大桌面版 */
```

### 動畫響應式調整
- **手機版**：動畫簡化，粒子減少
- **平板版**：完整動畫，適中效果
- **桌面版**：完整動畫，最佳體驗

### 特殊響應式元素
```css
/* 貓咪太空人背景大小 */
mobile: background-size: 100.1%
tablet: background-size: 63%  
desktop: background-size: 50.4%

/* 手指脈衝光位置 */
mobile: top: calc(33% - 80px), right: 22%
tablet: top: calc(37% - 160px), right: 16%
desktop: top: calc(40% - 160px), right: 12%
```

---

## 9. 字體與排版系統

### 字體家族
```css
/* 標題字體 */
font-family: 'Space Grotesk', sans-serif;
font-variants: Medium

/* 內文字體 */  
font-family: 'Noto Sans', sans-serif;
font-variants: Regular, SemiBold, Bold
```

### 字體尺寸階層
```css
/* 主標題 */
h1: 44px (mobile) / 72px (desktop)

/* 次標題 */
h2: 40px (mobile) / 52px (desktop)

/* 三級標題 */
h3: 24px (mobile) / 32px (desktop)

/* 內文 */
p: 12px (mobile) / 18px (desktop)

/* 按鈕文字 */
button: 12px (mobile) / 16px (desktop)
```

### 排版原則
1. **避免覆蓋 Tailwind 字體類別**（除非特別需要）
2. **使用精確的 tracking 值**確保視覺平衡
3. **行高保持 1.2-1.6** 之間確保可讀性

---

## 10. 元件使用指南

### ShadCN 元件集成
- **Accordion**: FAQ 區域，深色主題適配
- **Button**: 基礎按鈕，客製化樣式覆蓋
- **Input**: 表單輸入，透明背景設計
- **DropdownMenu**: 導航選單，深色主題

### 自定義元件規範
```javascript
// Logo 元件
<CompanyLogo /> // 響應式公司 Logo

// 打字機效果
<TypewriterText /> // Hero 區域動態文字

// 服務圖標
<ServiceIcon /> // 統一的服務圖標樣式

// 檢查圖標  
<CheckIcon /> // 特色列表檢查標記

// Google Material Icons
<MaterialIcon name="home" /> // 基本使用
<MaterialIcon name="star" variant="outlined" size="lg" /> // 完整配置
```

### Google Material Icons 系統
```javascript
// 基本使用
import { MaterialIcon, MATERIAL_ICONS } from './ui/material-icon';

// 圖標變體
variant: 'filled' | 'outlined' | 'round' | 'sharp' | 'two-tone'

// 尺寸選項
size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | number

// 使用範例
<MaterialIcon name="home" variant="filled" size="lg" className="text-white" />
<MaterialIcon name={MATERIAL_ICONS.STAR} variant="round" size={24} />
```

### 圖標使用原則
1. **優先使用 Material Icons**：一致的視覺語言
2. **選擇適當的變體**：filled(預設) / outlined / round / sharp / two-tone
3. **合理的尺寸設定**：根據使用場景選擇適當大小
4. **顏色搭配品牌系統**：使用 #FF7400, #1D3557, white 等品牌色彩

### 動畫元件整合
- 所有自定義元件都應支援入場動畫
- 使用 `useEffect` 和 `IntersectionObserver` 觸發動畫
- 遵循既定的動畫時序和延遲設定

---

## 11. 精美卡片設計系統

### 設計理念
精美卡片設計系統專為黑色背景環境設計，結合微妙的漸層背景、精緻的邊框效果和動態 hover 互動，創造出專業且具有科技感的視覺體驗。

### 基礎卡片結構
```tsx
<div className="group relative bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent border border-white/10 rounded-xl p-6 lg:p-8 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 hover:animate-[subtle-glow_2s_ease-in-out_infinite] hover:shadow-lg hover:shadow-white/5">
  {/* Hover 漸層覆蓋層 */}
  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  
  <div className="relative space-y-4 lg:space-y-5">
    {/* 卡片內容 */}
  </div>
</div>
```

### 圖標容器設計
```tsx
{/* 增強型圖標容器 */}
<div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl p-3 border border-white/10 group-hover:border-white/20 transition-all duration-500">
  <ImageWithFallback
    src="icon-path.svg"
    alt="Feature Icon"
    className="w-full h-full object-contain group-hover:animate-[moon-float_3s_ease-in-out_infinite] transition-transform duration-500"
  />
</div>
```

### 卡片樣式組成元素

#### 背景漸層系統
```css
/* 基礎漸層背景 */
background: linear-gradient(to bottom right, 
  rgba(255,255,255,0.03) 0%, 
  rgba(255,255,255,0.01) 50%, 
  transparent 100%
);

/* Hover 狀態增強背景 */
background: rgba(255,255,255,0.05);

/* Hover 漸層覆蓋層 */
background: linear-gradient(to bottom right,
  rgba(255,116,0,0.05) 0%,
  transparent 50%,
  rgba(29,53,87,0.03) 100%
);
```

#### 邊框系統
```css
/* 預設邊框 */
border: 1px solid rgba(255,255,255,0.1);

/* Hover 邊框 */
border: 1px solid rgba(255,255,255,0.2);

/* 圖標容器邊框 */
border: 1px solid rgba(255,255,255,0.1);
hover:border: 1px solid rgba(255,255,255,0.2);
```

#### 陰影效果
```css
/* Hover 陰影 */
box-shadow: 
  0 10px 25px -5px rgba(255,255,255,0.05),
  0 10px 10px -5px rgba(255,255,255,0.04);
```

### 動畫效果配置

#### 月球圖標漂浮動畫
```css
@keyframes moon-float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-3px) rotate(2deg);
  }
  50% {
    transform: translateY(-5px) rotate(0deg);
  }
  75% {
    transform: translateY(-2px) rotate(-2deg);
  }
}
```

#### 卡片微妙發光動畫
```css
@keyframes subtle-glow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(255,255,255,0.05), 0 0 20px rgba(255,255,255,0.02);
  }
  50% {
    box-shadow: 0 0 15px rgba(255,255,255,0.08), 0 0 30px rgba(255,255,255,0.04);
  }
}
```

#### 過渡動畫設定
```css
/* 標準過渡時間 */
transition: all 500ms ease-out;

/* 覆蓋層過渡 */
transition: opacity 500ms ease-out;

/* 圖標變換過渡 */
transition: transform 500ms ease-out;
```

### 響應式設計
```css
/* 卡片間距 */
gap: 2rem;                    /* lg: 32px */
@media (min-width: 1024px) {
  gap: 2rem;                  /* lg: 32px */
}

/* 卡片內邊距 */
padding: 1.5rem;              /* mobile: 24px */
@media (min-width: 1024px) {
  padding: 2rem;              /* lg: 32px */
}

/* 圖標大小 */
width: 4rem; height: 4rem;    /* 64px x 64px */
```

### 文字層次設計
```tsx
{/* 標題 */}
<h3 className="text-white text-[20px] md:text-[24px] lg:text-[28px] font-medium leading-[1.3] tracking-[-0.2px] md:tracking-[-0.24px] lg:tracking-[-0.28px] group-hover:text-white transition-colors duration-300">
  {title}
</h3>

{/* 描述文字 */}
<p className="text-white/90 text-[12px] md:text-[14px] lg:text-[16px] opacity-90 leading-[1.6] group-hover:opacity-100 transition-opacity duration-300">
  {description}
</p>
```

### 使用場景與最佳實踐

#### 適用場景
- **功能介紹卡片**：展示產品特色和優勢
- **服務項目展示**：PR 服務內容說明
- **優勢特點列表**：突出關鍵賣點
- **團隊成員介紹**：專業團隊展示

#### 設計原則
1. **維持黑色背景一致性**：確保與整體設計風格統一
2. **微妙而精緻的 hover 效果**：提升互動體驗但不過度搶眼
3. **漸層元素適度使用**：創造層次但保持專業感
4. **響應式優先**：確保各螢幕尺寸下的最佳表現

#### 最佳實踐
- **卡片數量**：建議 2-4 個卡片為一組，保持版面平衡
- **間距控制**：使用 `gap-8` 確保卡片間有足夠的視覺間距
- **圖標一致性**：同一組卡片使用統一風格的圖標
- **內容長度**：標題控制在 1-3 個詞，描述文字控制在 2-3 行

### 完整實現範例
```tsx
// 功能卡片組件範例
const FeatureCards = ({ features }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {features.map((feature, index) => (
      <div 
        key={feature.title} 
        className="group relative bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent border border-white/10 rounded-xl p-6 lg:p-8 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 hover:animate-[subtle-glow_2s_ease-in-out_infinite] hover:shadow-lg hover:shadow-white/5"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative space-y-4 lg:space-y-5">
          <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl p-3 border border-white/10 group-hover:border-white/20 transition-all duration-500">
            <ImageWithFallback
              src={feature.icon}
              alt="Feature Icon"
              className="w-full h-full object-contain group-hover:animate-[moon-float_3s_ease-in-out_infinite] transition-transform duration-500"
            />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-white text-[20px] md:text-[24px] lg:text-[28px] font-medium leading-[1.3] tracking-[-0.2px] md:tracking-[-0.24px] lg:tracking-[-0.28px] group-hover:text-white transition-colors duration-300">
              {feature.title}
            </h3>
            <p className="text-white/90 text-[12px] md:text-[14px] lg:text-[16px] opacity-90 leading-[1.6] group-hover:opacity-100 transition-opacity duration-300">
              {feature.description}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);
```

---

## 12. 開發最佳實踐

### CSS 組織
```css
/* 動畫定義統一放在 globals.css */
@keyframes custom-animation { ... }

/* 響應式設定使用 mobile-first */
.element { mobile-styles }
@media (min-width: 768px) { tablet-styles }
@media (min-width: 1024px) { desktop-styles }
```

### React 組件結構
```javascript
// 標準組件結構
function ComponentName() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  // Intersection Observer
  useEffect(() => { ... });
  
  return (
    <section ref={sectionRef} className="...">
      {/* 背景效果 */}
      <div className="absolute background-effects">
      
      {/* 內容 */}
      <div className="relative z-10 content">
    </section>
  );
}
```

### 性能優化考量
1. **動畫降級**：支援 `prefers-reduced-motion`
2. **懶加載**：非關鍵動畫延遲觸發
3. **GPU 加速**：使用 `transform` 和 `opacity` 進行動畫

---

## 12. 品質檢查清單

### 視覺一致性
- [ ] 色彩使用符合設計系統
- [ ] 動畫時序遵循既定標準  
- [ ] 響應式斷點正確實現
- [ ] 字體和排版保持一致

### 互動體驗
- [ ] 所有按鈕都有 hover 效果
- [ ] 動畫流暢且有意義
- [ ] 觸控設備支援良好
- [ ] 載入狀態處理完善

### 可訪問性
- [ ] 鍵盤導航支援
- [ ] 螢幕閱讀器友好
- [ ] 對比度符合標準
- [ ] 動畫可被停用

### 性能表現
- [ ] 動畫運行流暢（60fps）
- [ ] 資源載入優化
- [ ] 移動設備性能良好
- [ ] 記憶體使用合理

---

## 結語

此設計指南為 VortixStream 專案建立了全面的視覺設計標準。遵循這些準則將確保品牌一致性、用戶體驗品質，以及後續開發的效率。

設計系統應該是活文檔，隨著專案發展持續更新和完善。

---

**最後更新**: 2025年8月
**維護者**: VortixStream 開發團隊
# 📝 Hero Section 前台整合待辦事項

## ⏳ 待完成

### HeroNewSection.tsx 需要更新

#### 1. 載入 API 資料
```typescript
const [heroData, setHeroData] = useState(null);
const [mediaLogos, setMediaLogos] = useState([]);

useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/public/content/hero/home`)
    .then(r => r.json())
    .then(setHeroData);
  fetch(`${import.meta.env.VITE_API_URL}/public/content/hero/home/logos`)
    .then(r => r.json())
    .then(setMediaLogos);
}, []);
```

#### 2. 替換寫死文字

**第 303 行**：`Strategic PR & Global` → `{heroData?.title_prefix}`

**第 344 行**：`Fast, reliable coverage...` → `{heroData?.subtitle}`

**第 367 行**：`View Packages` → `{heroData?.cta_primary_text}`

**第 386 行**：`Submit Press Release` → `{heroData?.cta_secondary_text}`

#### 3. 打字機效果

**第 8-10 行**：
```typescript
// 移除
const words = ["Web3 & AI"];

// 改為
<TypewriterText words={heroData?.title_highlights || ['Web3 & AI']} />
```

#### 4. CTA 按鈕行為

```typescript
const handleCTA = (url: string, mobileUrl: string) => {
  const isMobile = window.innerWidth < 1024;
  const targetUrl = isMobile ? (mobileUrl || url) : url;
  
  if (targetUrl.startsWith('#')) {
    const element = document.getElementById(targetUrl.substring(1));
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 72 - 20,
        behavior: 'smooth'
      });
    }
  } else {
    navigate(targetUrl);
  }
};
```

#### 5. Media Logos 動態渲染

**替換 MediaLogoCloud 組件**：
```typescript
{mediaLogos.map(logo => (
  <div key={logo.id} className="absolute" style={{
    top: logo.position_top,
    left: logo.position_left,
    right: logo.position_right,
    opacity: logo.opacity,
    zIndex: 10
  }}>
    <img src={logo.logo_url} alt={logo.name} />
  </div>
))}
```

#### 6. 中心 Logo

```typescript
<img src={heroData?.center_logo_url} alt="Vortix" />
```

---

## ⚠️ 重要原則

1. ❌ **禁止** `|| 'fallback'`
2. ❌ **禁止** 寫死文字
3. ✅ 使用 `heroData?.field`（可選鏈）
4. ✅ 組件總是渲染

---

## 📍 CTA URL 填寫範例

| 場景 | Desktop URL | Mobile URL | 說明 |
|------|-------------|-----------|------|
| 滑到首頁區塊 | `#packages-section` | `/pricing` | 桌面滑動，手機跳轉 |
| 跳轉頁面 | `/contact` | `/contact` | 兩者相同 |
| 外部連結 | `https://...` | `https://...` | 兩者相同 |

---

**下次對話立即完成前台整合！**


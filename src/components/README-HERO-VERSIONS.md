# Hero Section 版本說明

## 📁 檔案結構

### 1. `HeroNewSection.tsx` ✅ (目前使用)
- **類型**：CSS 動畫版本
- **來源**：GitHub 遠端版本
- **特色**：
  - `MediaLogoCloud` 組件
  - 靜態位置 + `float-particle` 浮動動畫
  - ✅ 穩定可靠
  - ✅ 無需 CORS 設定
  - ✅ 效能優異

### 2. `HeroNewSection3D.tsx` 🎮 (備用)
- **類型**：3D 互動版本  
- **技術**：React Three Fiber + Three.js
- **特色**：
  - `Orbiting3DLogos` 組件
  - 真實 3D 空間環繞動畫
  - 🖱️ 滑鼠 hover 互動
  - 📐 Billboard 效果
  - ⚠️ **需要 CORS 設定完成**

### 3. `Orbiting3DLogos.tsx`
- **類型**：3D 組件
- **用途**：給 `HeroNewSection3D.tsx` 使用
- **依賴**：`@react-three/fiber`, `@react-three/drei`, `three`

---

## 🔄 如何切換版本

### 方法：修改 import

在使用 Hero Section 的地方（通常是首頁）：

**目前（CSS 版本）：**
```tsx
import HeroNewSection from './components/HeroNewSection';
```

**切換到 3D 版本：**
```tsx
import HeroNewSection from './components/HeroNewSection3D';
```

---

## ⚙️ CORS 設定狀態

### Cloudflare R2 CORS 配置

**設定位置**：`dash.cloudflare.com` → R2 → vortixpr-assets → Settings → CORS Policy

**建議配置**：
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

**狀態**：
- ⏳ 已設定，等待生效（通常需要 5-10 分鐘）
- 🧪 生效後可測試 3D 版本

---

## 📊 版本比較

| 特性 | CSS 版本 | 3D 版本 |
|------|---------|---------|
| 穩定性 | ✅ 高 | ⚠️ 需 CORS |
| 效能 | ✅ 優秀 | 🔶 良好 |
| 互動性 | 🔶 基本 | ✅ 豐富 |
| 視覺效果 | 🔶 2D 浮動 | ✅ 3D 環繞 |
| 包大小 | ✅ 小 | 🔶 +600KB |
| 瀏覽器支援 | ✅ 全部 | 🔶 需 WebGL |

---

## 🎯 建議

- **生產環境**：使用 CSS 版本（目前）
- **CORS 生效後**：測試 3D 版本效果
- **最終選擇**：根據實際效果和效能決定

# VortixPR / Vortix Crypto 雙品牌切分設計

> Date: 2026-04-08
> Status: Draft (awaiting user review)
> Author: Joey Luo + Claude (Opus 4.6)

---

## 1. 背景與目標

### 1.1 背景

VortixPR 目前是單一 React + Vite 應用，首頁與所有對外頁面以 **Crypto PR** 為主要敘事，AI 為次要。市場趨勢顯示應該轉向 **以 AI 為主要品牌**，並把 Crypto 切成獨立的子品牌服務，方便分別賣給不同類型的客戶（AI 新創 vs Crypto 公司）。

### 1.2 目標

- 主品牌 **VortixPR** 重新定位為 AI PR 服務（服務 AI 新創與個人公司）
- 既有的 Crypto 內容與設計**完整保留**，獨立成 **Vortix Crypto** 子站
- 兩站住在**同一個 React app、同一個網域** `vortixpr.com`
- 用戶從 `/` 進來看到 AI 站；想找 Crypto 服務從 nav 連結進入 `/crypto`
- **不影響現有 admin 後台、CMS、auth、shared 服務**

### 1.3 非目標

- ❌ 不做子網域切分（未來可選，本次不做）
- ❌ 不擴展 CMS schema 加 `site` 欄位（YAGNI，AI 內容用靜態 constants）
- ❌ 不做 301 重導向（網站本身網域不變，無外部已收錄的舊路徑要保護）
- ❌ 不做共用頁面（blog/packages/compare）的 audience 過濾（留待之後驗證後再做）

---

## 2. 高層架構決策

### 2.1 路線選擇

考慮過三條路線：

| 路線 | 描述 | 結論 |
|---|---|---|
| A. 子網域 | `vortixpr.com` + `crypto.vortixpr.com` | ❌ 前期成本高、需動 infra |
| **B. 路徑前綴** | 同一 app，AI 在 `/`，Crypto 在 `/crypto/*` | ✅ **採用** |
| C. CMS 加 site 維度 | 改 12+ 表 schema | ❌ 風險高、與策略驗證無關 |

選 B 的原因：單一部署、共用 auth/CMS、改動最小、未來想升級到 A 也容易。

### 2.2 CMS 處理

**Crypto 子站繼續吃現有 CMS（admin 0 變動）。AI 站用靜態 constants 寫死，完全不接 DB。**

理由：
1. AI-first 品牌定位還在驗證階段，YAGNI
2. 現有 CMS 改動風險高（見 `CRITICAL_LESSONS_FOR_CMS_DATA_LOADING.md`），新 AI 站零耦合可避免連動爆掉
3. 等 AI 內容穩定再考慮把它搬進 CMS（之後可加 `site='ai'` 欄位 migrate）

### 2.3 Layout 機制

採用 React Router 官方推薦的 **nested layouts** pattern。**不使用** 全域 Navigation 加 `if` 判斷的 detection 模式。

每組路由有自己的 layout 元件，layout 寫死自己的 Navigation + Footer。沒有切換邏輯、沒有偵測、沒有 context。

```tsx
<Routes>
  <Route element={<AILayout />}>
    <Route path="/" element={<AIHomePage />} />
    <Route path="/services" element={<AIServicesPage />} />
    {/* ... */}
  </Route>

  <Route element={<CryptoLayout />}>
    <Route path="/crypto" element={<CryptoHomePage />} />
    <Route path="/crypto/services" element={<CryptoServicesPage />} />
    {/* ... */}
  </Route>

  <Route element={<SharedLayout />}>
    <Route path="/blog" element={<BlogPage />} />
    {/* ... */}
  </Route>
</Routes>
```

`AILayout.tsx`：

```tsx
export function AILayout() {
  return (
    <>
      <AINavigation />
      <Outlet />
      <AIFooter />
    </>
  );
}
```

`CryptoLayout.tsx` 同理但用 `CryptoNavigation` + `CryptoFooter`。

---

## 3. 路由設計

### 3.1 AI 站（VortixPR，主品牌）

| 路徑 | 頁面元件 | 內容來源 |
|---|---|---|
| `/` | `AIHomePage` | 全新，靜態 constants |
| `/services` | `AIServicesPage` | 全新，靜態 constants |
| `/pricing` | `AIPricingPage` | 全新，靜態 constants |
| `/about` | `AIAboutPage` | 全新，靜態 constants |
| `/clients` | `AIClientsPage` | 全新，靜態 constants |
| `/publisher` | `AIPublisherPage` | 全新，靜態 constants |

### 3.2 Crypto 子站（Vortix Crypto）

| 路徑 | 頁面元件 | 內容來源 |
|---|---|---|
| `/crypto` | `CryptoHomePage` | 現有 HomePage 內容照搬 |
| `/crypto/services` | `CryptoServicesPage` | 現有 ServicesPage 照搬 |
| `/crypto/pricing` | `CryptoPricingPage` | 現有 PricingPage 照搬 |
| `/crypto/about` | `CryptoAboutPage` | 現有 AboutPage 照搬 |
| `/crypto/clients` | `CryptoClientsPage` | 現有 OurClientsPage 照搬 |
| `/crypto/publisher` | `CryptoPublisherPage` | 現有 PublisherPage 照搬 |

「照搬」意指：頁面內容一行不改，只是改 import 路徑、改名、掛到 CryptoLayout 下。

### 3.3 共用路由

| 路徑 | 說明 |
|---|---|
| `/blog`, `/blog/:articleId` | 共用，不分品牌 |
| `/packages/:slug` | 共用 |
| `/compare` | 共用 |
| `/contact` | 共用 |
| `/login`, `/register`, `/auth/google/callback` | 共用 |
| `/newsletter-success` | 共用 |
| `/privacy-policy`, `/terms-of-service`, `/cookie-policy` | 共用 |
| `/admin/*` | 0 變動，保留現狀 |

共用頁面不需要知道用戶從哪個品牌進來。後續若需要 audience 過濾，另開 spec。

### 3.4 兩站之間的入口

- AI 站 `AINavigation` 右上角（或選單中）放一個入口：「Crypto Services →」連到 `/crypto`
- Crypto 站 `CryptoNavigation` 右上角放一個入口：「← VortixPR」連到 `/`

---

## 4. 檔案結構

### 4.1 新增資料夾

```
frontend/src/
├── layouts/                        ← 新增
│   ├── AILayout.tsx
│   ├── CryptoLayout.tsx
│   └── SharedLayout.tsx
│
├── pages/
│   ├── ai/                         ← 新增
│   │   ├── AIHomePage.tsx
│   │   ├── AIServicesPage.tsx
│   │   ├── AIPricingPage.tsx
│   │   ├── AIAboutPage.tsx
│   │   ├── AIClientsPage.tsx
│   │   └── AIPublisherPage.tsx
│   │
│   └── crypto/                     ← 新增，現有 crypto 頁面搬入
│       ├── CryptoHomePage.tsx
│       ├── CryptoServicesPage.tsx
│       ├── CryptoPricingPage.tsx
│       ├── CryptoAboutPage.tsx
│       ├── CryptoClientsPage.tsx
│       └── CryptoPublisherPage.tsx
│
├── components/
│   ├── ai/                         ← 新增
│   │   ├── AINavigation.tsx
│   │   ├── AIFooter.tsx
│   │   ├── home/
│   │   ├── services/
│   │   ├── pricing/
│   │   ├── about/
│   │   ├── clients/
│   │   └── publisher/
│   │
│   └── crypto/                     ← 新增，現有 crypto 元件搬入
│       ├── CryptoNavigation.tsx     (從 Navigation.tsx 搬+改名)
│       ├── CryptoFooter.tsx         (從 Footer.tsx 搬+改名)
│       ├── HeroSection.tsx
│       ├── HeroNewSection.tsx
│       ├── HeroNewSection3D.tsx
│       ├── ServicesSection.tsx
│       ├── FeaturesSection.tsx
│       ├── ClientLogosSection.tsx
│       ├── EverythingYouNeedSection.tsx
│       ├── FAQSection.tsx
│       ├── LogoCarousel.tsx
│       ├── LyroSection.tsx
│       ├── Orbiting3DLogos.tsx
│       ├── StatsSection.tsx
│       ├── TestimonialSection.tsx
│       ├── TrustedBySection.tsx
│       ├── VortixPortalSection.tsx
│       ├── WhyPartnerSection.tsx
│       ├── PricingCard.tsx
│       ├── PricingCommitment.tsx
│       ├── PricingContactForm.tsx
│       ├── PricingFAQ.tsx
│       ├── about/                   (從 components/about/ 搬)
│       ├── clients/                 (從 components/clients/ 搬)
│       └── publisher/               (從 components/publisher/ 搬)
│
└── constants/
    ├── ai/                         ← 新增（檔案為起始集，會隨內容增加）
    │   ├── aiHeroData.ts
    │   ├── aiServicesData.ts
    │   ├── aiPricingData.ts
    │   ├── aiAboutData.ts
    │   ├── aiClientsData.ts
    │   ├── aiPublisherData.ts
    │   └── aiFaqData.ts
    │
    └── crypto/                     ← 新增，現有 crypto constants 搬入
        ├── servicesData.ts
        ├── faqData.ts
        ├── testimonialData.ts
        ├── aboutData.ts
        ├── publisherData.ts
        ├── pricingDataV2.ts
        ├── articleContent.ts
        └── blogData.ts
```

### 4.2 不變動的資料夾

以下資料夾**完全不動**，因為它們是共用元件或非品牌專屬：

- `components/ui/` (Radix UI primitives)
- `components/blog/`
- `components/pricing/` (PackageDetailPage、CoverageMap 等共用)
- `components/compare/`
- `components/contact/`
- `components/admin/`
- `components/login/`
- `components/template/`
- `components/figma/`
- `components/concept/`
- `pages/admin/`
- `pages/CookiePolicy.tsx`、`PrivacyPolicy.tsx`、`TermsOfService.tsx`、`GoogleCallback.tsx`
- `ProtectedRoute.tsx`、`ScrollToTop.tsx`、`ThemeToggle.tsx`

### 4.3 命名規則

- **頁面元件加 `Crypto` 前綴**：`HomePage` → `CryptoHomePage`、`ServicesPage` → `CryptoServicesPage` 等。同理 AI 站頁面用 `AI` 前綴。
- **`Navigation` / `Footer` 加品牌前綴**：因為兩品牌會同時存在。
- **其他子區塊元件不加前綴**：例如 `HeroSection.tsx`、`FeaturesSection.tsx`、`PricingCard.tsx` 等等直接住在 `components/crypto/` 下，不改名。原因：這些元件只在自己品牌的資料夾內被引用，加前綴只會讓命名變雜訊。
- **AI 站子區塊元件**：放在對應子資料夾下（`components/ai/home/HeroSection.tsx` 等），不需要 `AI` 前綴。

### 4.4 搬家的代價

實體搬家會觸發每個被搬檔案的 import path 全部要改。預估約 **50–80 處 import path 改動**。應**用一次性的 PR 完成搬家**，避免分批 merge conflict。

---

## 5. 後端與 CMS

### 5.1 後端

**0 變動**。所有 `/api/*` 路由維持原樣，包括 `content_public`、`content_admin`、`pr_package`、`auth` 等等。

### 5.2 CMS / Admin

**0 變動**。Admin 後台所有頁面繼續管理 Crypto 子站的內容（hero、faqs、testimonials、services、carousel、why-vortix、clients、publisher、vortix-portal、lyro、settings）。

AI 站不接 CMS，所有內容由 `frontend/src/constants/ai/*.ts` 提供。

### 5.3 資料庫

**0 變動**。不加 `site` 欄位、不改 schema。

---

## 6. 實作步驟

每一步結束時，現有 Crypto 站都應該還能正常運作，build 能過、頁面能開。

### Step 1 — 純搬家（不改邏輯）

- 搬 6 個 crypto page 元件到 `pages/crypto/`，順便改名加 `Crypto` 前綴
- 搬 ~25 個 crypto component 到 `components/crypto/`
- 搬 `Navigation.tsx` → `components/crypto/CryptoNavigation.tsx`
- 搬 `Footer.tsx` → `components/crypto/CryptoFooter.tsx`
- 搬 `components/about/`、`components/clients/`、`components/publisher/` 進 `components/crypto/`
- 搬 8 個 constants 到 `constants/crypto/`
- 修改所有 import path
- `App.tsx` 路由**暫時不變**，仍是舊的 `/`、`/services` 等

**驗證**：`npm run build` 過；`/`、`/services`、`/about`、`/clients`、`/publisher`、`/pricing` 全部還能開、長相一模一樣。

**Commit message**：`refactor: move crypto-specific files into crypto/ subfolders`

### Step 2 — 加入 Layout 機制 + crypto 路由改 prefix

- 新增 `layouts/CryptoLayout.tsx`、`layouts/SharedLayout.tsx`
- 新增 `layouts/AILayout.tsx`（暫時極簡，待 Step 3 補齊）
- `App.tsx` 路由重組：
  - 所有 crypto 路由加 `/crypto` prefix，包進 `<CryptoLayout>`
  - 共用路由包進 `<SharedLayout>`
  - `/` 暫時放 placeholder「VortixPR AI 站建設中，前往 Vortix Crypto →」
- 移除 `App.tsx` 全域掛載的 `<Navigation />` / `<Footer />`，改由 layout 自帶

**驗證**：`/crypto`、`/crypto/services` 等所有 crypto 頁面都還能開、長相一模一樣；`/` 顯示 placeholder。

**Commit message**：`feat: introduce nested layouts, move crypto routes under /crypto prefix`

### Step 3 — AI 站骨架

- 寫 `components/ai/AINavigation.tsx`（VortixPR logo + AI 選單 + 入口連到 `/crypto`）
- 寫 `components/ai/AIFooter.tsx`
- 補完 `AILayout`
- 在 `CryptoNavigation` 加「← VortixPR」入口連回 `/`
- 建 6 個 AI page 檔案，內容先放最簡單的 hero + 一句話即可
- `App.tsx` 加 6 條 AI 路由

**驗證**：`/`、`/services`、`/about`、`/clients`、`/publisher`、`/pricing` 都能開、長 AI 樣；`/crypto/*` 仍長 Crypto 樣；兩邊互相切換的入口連結都通。

**Commit message**：`feat: scaffold AI site (VortixPR) with navigation, layout, and placeholder pages`

### Step 4 — 填 AI 站內容（多個小 PR）

寫 AI 首頁的 hero / services / features 區塊、新文案、新元件。所有資料用 `constants/ai/*` 靜態檔案。建議拆成多個小 PR：先 home、再 services、再 pricing、依序完成。

**這步是真正的設計工作，不在本 spec 細節範圍。** 本 spec 只負責確保結構就緒。

### Step 5（之後再說）— 共用頁面 audience 過濾

Blog tag 過濾、Packages 加 `audience` 欄位等等。**不在本 spec 範圍內**。等 AI 站上線、看到實際使用情況後另開 spec。

---

## 7. 風險與緩解

| 風險 | 緩解 |
|---|---|
| 搬家時 import path 改錯導致 build 爆 | Step 1 結束後跑 `npm run build` 完整驗證；任何 page 不能開就回滾 |
| Layout 改動讓 admin / shared 路由意外受影響 | Admin 路由完全不動；shared 路由獨立放在 `SharedLayout` |
| AI 內容靜態 constants 與 CMS 不一致 | 規範：AI 站的所有資料只能來自 `constants/ai/*`，禁止 fetch CMS API |
| 未來想把 AI 內容搬進 CMS 時 schema 不夠 | 屆時開新 spec，加 `site` 欄位 migrate；本次先不做 |
| 兩個 Navigation 元件之間出現重複代碼 | 接受短期重複；若重複量大，未來抽 `components/shared/NavBase.tsx` |

---

## 8. 驗收標準

完成後應同時滿足：

1. ✅ `npm run build` 通過
2. ✅ `/` 顯示新的 AI 首頁，使用 AINavigation + AIFooter
3. ✅ `/services`、`/pricing`、`/about`、`/clients`、`/publisher` 顯示 AI 版頁面
4. ✅ `/crypto` 顯示原本的 crypto 首頁，使用 CryptoNavigation + CryptoFooter
5. ✅ `/crypto/services`、`/crypto/pricing`、`/crypto/about`、`/crypto/clients`、`/crypto/publisher` 顯示原本的 crypto 頁面，視覺與遷移前一致
6. ✅ AI 站 nav 有入口可以一鍵跳到 `/crypto`
7. ✅ Crypto 站 nav 有入口可以一鍵跳回 `/`
8. ✅ Admin 後台 `/admin/*` 完全不變、CMS 功能正常
9. ✅ Blog、PR Packages、Compare、Contact、Login、Auth 等共用頁面正常運作
10. ✅ 沒有任何 backend / DB schema 改動

---

## 9. 待決事項

無。所有設計決策已確認。

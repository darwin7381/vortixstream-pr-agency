# 🚀 VortixPR - AI-Driven PR Agency Platform

<div align="center">

![VortixPR](https://img.shields.io/badge/VortixPR-AI%20PR%20Agency-FF7400?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-In%20Development-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)

**The Future of PR is Here: AI-Powered + Human Expertise**

[Website](https://vortixpr.com) • [Documentation](#documentation) • [API Docs](http://localhost:8000/docs)

</div>

---

## 🌟 關於 VortixPR

**VortixPR** 是全球領先的 **AI-Driven PR Agency**，結合人工智慧技術與頂尖 PR 專業團隊，為企業提供前所未有的公關服務體驗。

### 💡 我們的願景

傳統 PR 服務往往耗時、昂貴且難以預測成效。VortixPR 透過 **AI 技術與人類專業的完美融合**，重新定義公關產業：

- 🤖 **AI-Powered Analytics** - 即時媒體趨勢分析與輿情監控
- 👨‍💼 **Expert Human Touch** - 資深 PR 專家團隊把關每一次曝光
- ⚡ **Lightning Fast** - 從策略制定到媒體發布，速度提升 10 倍
- 📊 **Data-Driven Results** - 可量化的 PR 成效追蹤與優化

---

## 🎯 核心功能

### 🔥 當前功能（V1.0）

#### 1️⃣ **專業 PR 服務套餐**
- **Global PR** - 全球媒體曝光方案（TechCrunch, Forbes, Bloomberg 等）
- **Asia Packages** - 亞洲市場專屬（中國、韓國、日本、東南亞）
- **Founder PR** - 創辦人個人品牌打造

#### 2️⃣ **完整的內容管理系統**
- 📰 **部落格系統** - SEO 優化的內容發布平台
- 💰 **動態定價** - 靈活的服務方案管理
- 📧 **聯絡管理** - 客戶諮詢與需求追蹤
- 📬 **電子報系統** - 自動化行銷與客戶維繫

#### 3️⃣ **管理後台**
- 🎨 現代化管理介面（Glassmorphism 設計）
- 📊 即時數據分析與報表
- 🖼️ Cloudflare R2 媒體資源管理
- 🔐 完整的權限控制系統

#### 4️⃣ **認證系統**（新增！）
- ✅ Email/密碼註冊登入
- ✅ Google OAuth 2.0 社交登入
- ✅ JWT Token 認證
- ✅ 角色權限管理（User / Admin）
- ✅ Protected Routes 保護

---

### 🚀 即將推出（V2.0 - Q1 2025）

#### 🤖 **AI PR Agent**
革命性的 AI 驅動公關助理，24/7 為您工作：

- **智能媒體匹配** - AI 自動分析並推薦最適合的媒體管道
- **內容生成** - 基於 GPT-4 的新聞稿、媒體資料包自動生成
- **輿情監控** - 即時追蹤品牌提及與市場反應
- **危機預警** - AI 預測潛在公關風險

#### 👤 **用戶自助平台**
- **自助註冊** - 一般用戶可註冊並使用基礎 AI PR 功能
- **訂閱方案** - 彈性的月費/年費方案
- **AI 工具箱** - 新聞稿生成、媒體列表建議、發布排程
- **成效儀表板** - 即時追蹤 PR 活動成效

#### 🏢 **組織/團隊功能**
- **多租戶架構** - 企業可創建組織並邀請團隊成員
- **團隊協作** - 角色權限、工作流程管理
- **資源共享** - 團隊內部的媒體資源與資料共享

---

## 🏗️ 技術架構

### 🎨 前端技術棧

```
React 18 + TypeScript
├── Vite - 超快的建構工具
├── TailwindCSS - 現代化 UI 框架
├── React Router - 路由管理
├── Lucide Icons - 美觀的圖示系統
└── Glassmorphism Design - 獨特的視覺風格
```

**特色**：
- ⚡ 超快的開發體驗（HMR < 100ms）
- 🎨 完全響應式設計（Mobile-First）
- ♿ 無障礙設計（WCAG 2.1 AA）
- 🌙 深色主題（品牌色 #FF7400）

### ⚙️ 後端技術棧

```
FastAPI + Python 3.11
├── asyncpg - 異步 PostgreSQL 驅動
├── SQLAlchemy - ORM（規劃中）
├── Pydantic - 資料驗證
├── python-jose - JWT 認證
├── passlib - 密碼加密
├── Resend - Email 服務
└── boto3 - Cloudflare R2 整合
```

**特色**：
- 🚄 異步處理（高並發支援）
- 📚 自動生成 API 文檔（OpenAPI 3.0）
- 🔐 企業級安全性（JWT + bcrypt）
- 📊 結構化錯誤處理

### 🗄️ 資料庫架構

```
PostgreSQL 15
├── Railway 部署
├── 完整的資料表設計
│   ├── users - 用戶系統
│   ├── blog_posts - 部落格
│   ├── pricing_packages - 定價方案
│   ├── pr_packages - PR 套餐
│   ├── pr_package_categories - 分類管理
│   ├── contact_submissions - 聯絡表單
│   ├── newsletter_subscribers - 電子報訂閱
│   └── media_files - 媒體資源
└── 完整的索引優化
```

### ☁️ 基礎設施

- **部署**: Railway (Backend) + Vercel/Netlify (Frontend)
- **CDN**: Cloudflare R2（圖片、媒體資源）
- **Email**: Resend API
- **監控**: 規劃中（Sentry + Grafana）

---

## 📂 專案結構

```
a-new-pr-agency/
├── frontend/                  # React 前端應用
│   ├── src/
│   │   ├── components/        # UI 組件
│   │   │   ├── admin/        # 管理後台組件
│   │   │   ├── pricing/      # 定價頁面
│   │   │   ├── blog/         # 部落格組件
│   │   │   └── ...
│   │   ├── pages/            # 頁面組件
│   │   │   └── admin/        # 管理後台頁面
│   │   ├── hooks/            # React Hooks
│   │   ├── api/              # API Client
│   │   ├── constants/        # 常數定義
│   │   └── styles/           # 樣式檔案
│   ├── public/               # 靜態資源
│   └── package.json
│
├── backend/                   # FastAPI 後端應用
│   ├── app/
│   │   ├── api/              # API 路由
│   │   │   ├── auth.py       # 認證 API
│   │   │   ├── blog.py       # 部落格 API
│   │   │   ├── pricing.py    # 定價 API
│   │   │   └── ...
│   │   ├── models/           # 資料模型
│   │   ├── core/             # 核心功能
│   │   │   └── database.py   # 資料庫管理
│   │   ├── utils/            # 工具函數
│   │   │   └── security.py   # 安全工具
│   │   ├── services/         # 業務邏輯
│   │   ├── config.py         # 配置管理
│   │   └── main.py           # 應用入口
│   ├── requirements.txt      # Python 依賴
│   └── .env                  # 環境變數（需自行創建）
│
├── docs/                      # 專案文檔
│   ├── AUTH_IMPLEMENTATION_COMPLETE.md
│   ├── GOOGLE_OAUTH_SETUP.md
│   └── DATABASE_ARCHITECTURE.md
│
└── README.md                 # 本文件
```

---

## 🚦 快速開始

### 📋 前置需求

- **Node.js** >= 18.0.0
- **Python** >= 3.11
- **PostgreSQL** >= 15
- **pnpm/npm** (推薦使用 pnpm)

### 🔧 環境設定

#### 1. Clone 專案

```bash
git clone <repository-url>
cd a-new-pr-agency
```

#### 2. 後端設定

```bash
cd backend

# 創建虛擬環境
python -m venv venv
source venv/bin/activate  # macOS/Linux
# 或 venv\Scripts\activate  # Windows

# 安裝依賴
pip install -r requirements.txt

# 設定環境變數（複製 .env.example 並修改）
cp .env.example .env
# 編輯 .env 填入必要的設定
```

**必要的環境變數**：
```env
DATABASE_URL=postgresql://user:password@localhost:5432/vortixpr
SECRET_KEY=your-secret-key-here
RESEND_API_KEY=your-resend-api-key
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
```

#### 3. 前端設定

```bash
cd frontend

# 安裝依賴
npm install
# 或 pnpm install

# 設定環境變數
echo "VITE_API_URL=http://localhost:8000/api" > .env
```

### 🚀 啟動開發伺服器

#### 後端

```bash
cd backend
python -m uvicorn app.main:app --reload
```

後端會運行在 `http://localhost:8000`

API 文檔: `http://localhost:8000/docs`

#### 前端

```bash
cd frontend
npm run dev
```

前端會運行在 `http://localhost:5173`

---

## 🔐 認證系統

### 功能特色

- ✅ **Email/密碼註冊登入**
- ✅ **Google OAuth 2.0** 社交登入
- ✅ **JWT Token** 認證（Access + Refresh Token）
- ✅ **角色權限管理**（User / Admin）
- ✅ **Protected Routes** 保護敏感頁面
- ✅ **自動 Token 刷新**
- ✅ **密碼加密**（bcrypt）

### 設定 Google OAuth

請參考 [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) 完整教學。

### 創建第一個管理員帳號

方法一：註冊後手動升級
```sql
-- 在 PostgreSQL 中執行
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

方法二：使用 API（開發環境）
```bash
# 註冊帳號
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vortixpr.com","password":"SecurePass123","name":"Admin"}'

# 手動在資料庫中將該帳號設為 admin
```

---

## 📚 API 文檔

### 🔑 認證 API

| 端點 | 方法 | 說明 |
|------|------|------|
| `/api/auth/register` | POST | 用戶註冊 |
| `/api/auth/login` | POST | 用戶登入 |
| `/api/auth/me` | GET | 獲取當前用戶資料 |
| `/api/auth/refresh` | POST | 刷新 Token |
| `/api/auth/google/login` | GET | Google OAuth 登入 |
| `/api/auth/google/callback` | GET | Google OAuth 回調 |

### 📰 公開 API

| 端點 | 方法 | 說明 |
|------|------|------|
| `/api/public/blog/posts` | GET | 取得部落格文章列表 |
| `/api/public/pricing/packages` | GET | 取得定價方案 |
| `/api/public/pr-packages/` | GET | 取得 PR 套餐（按分類） |

### 🔒 管理 API（需要管理員權限）

| 端點 | 方法 | 說明 |
|------|------|------|
| `/api/admin/blog/posts` | POST | 創建文章 |
| `/api/admin/blog/posts/{id}` | PUT | 更新文章 |
| `/api/admin/pricing/packages` | POST | 創建定價方案 |
| `/api/admin/pr-packages/` | POST | 創建 PR 套餐 |
| `/api/admin/media/upload` | POST | 上傳媒體檔案 |

完整 API 文檔請訪問：`http://localhost:8000/docs`

---

## 🎨 設計系統

### 🎨 品牌色彩

```css
--vortix-orange: #FF7400;      /* 主要品牌色 */
--vortix-navy: #1D3557;        /* 深色調 */
--vortix-dark: #000000;        /* 背景色 */
--vortix-gradient: linear-gradient(102deg, #FF7400 0%, #1D3557 100%);
```

### 🖌️ 設計風格

- **Glassmorphism** - 半透明毛玻璃效果
- **Dark Theme** - 深色主題設計
- **Gradient Accents** - 橘色到深藍的漸層
- **Floating Particles** - 動態浮動粒子背景
- **Modern Typography** - Space Grotesk 字體

---

## 🧪 測試

### 前端測試

```bash
cd frontend
npm run test
```

### 後端測試

```bash
cd backend
pytest
```

---

## 🚀 部署

### 後端部署（Railway）

```bash
# 已設定 railway.json
railway up
```

環境變數需在 Railway Dashboard 設定。

### 前端部署（Vercel）

```bash
cd frontend
npm run build
vercel deploy
```

---

## 📊 開發進度

### ✅ 已完成

- [x] 前端 UI/UX 設計與實現
- [x] 後端 API 架構
- [x] 資料庫設計與初始化
- [x] Blog 系統（含管理後台）
- [x] Pricing 系統
- [x] PR Packages 系統
- [x] 媒體管理（Cloudflare R2）
- [x] 聯絡表單與電子報
- [x] 用戶認證系統（Email + Google OAuth）
- [x] 角色權限管理
- [x] Protected Routes

### 🚧 進行中

- [ ] AI PR Agent 開發
- [ ] 用戶自助平台
- [ ] 訂閱付費系統
- [ ] 組織/團隊功能
- [ ] 即時通知系統

### 📅 規劃中

- [ ] Mobile App（React Native）
- [ ] API Rate Limiting
- [ ] 多語言支援（i18n）
- [ ] 進階分析與報表
- [ ] Webhook 整合
- [ ] 第三方整合（Slack, Discord, etc.）

---

## 👥 團隊

### 核心開發團隊

- **技術架構** - AI-Powered Development
- **UI/UX 設計** - Modern Glassmorphism Design
- **產品管理** - PR Industry Expertise

### 協作指南

1. **分支策略** - 使用 Git Flow
2. **Commit 規範** - Conventional Commits
3. **Code Review** - 所有 PR 需經過審查
4. **文檔更新** - 重要變更需更新文檔

---

## 📄 授權

本專案為 **專有軟體**（Proprietary），版權所有 © 2025 VortixPR。

未經授權不得複製、修改或分發。

---

## 📞 聯絡我們

- **Website**: [vortixpr.com](https://vortixpr.com)
- **Email**: hello@vortixpr.com
- **Support**: support@vortixpr.com

---

## 🙏 致謝

感謝所有為 VortixPR 貢獻的開發者、設計師和 PR 專家們。

特別感謝：
- FastAPI 團隊 - 出色的 Python Web 框架
- React 團隊 - 強大的前端框架
- Tailwind CSS - 現代化的 CSS 框架
- Railway - 簡單易用的部署平台

---

<div align="center">

**Built with ❤️ by VortixPR Team**

*Redefining PR with AI*

</div>


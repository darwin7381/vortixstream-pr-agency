# VortixPR Backend API

FastAPI + PostgreSQL 後端系統

## 🚀 快速開始

### 1. 安裝依賴

```bash
uv sync
```

### 2. 設定環境變數

```bash
cp .env.example .env
# 編輯 .env，設定 DATABASE_URL
```

### 3. 啟動開發伺服器

```bash
# 方法 1: 使用啟動腳本
./run_dev.sh

# 方法 2: 直接使用 uv
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. 訪問 API 文件

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- 健康檢查: http://localhost:8000/health

## 📁 專案結構

```
backend/
├── app/
│   ├── main.py              # FastAPI 應用程式入口
│   ├── config.py            # 設定檔
│   ├── core/
│   │   └── database.py      # 資料庫連線 & 自動建表
│   ├── api/
│   │   ├── blog.py          # Blog API
│   │   ├── pricing.py       # Pricing API
│   │   ├── contact.py       # Contact API
│   │   └── newsletter.py    # Newsletter API
│   └── models/
│       ├── blog.py          # Blog Pydantic models
│       ├── pricing.py       # Pricing Pydantic models
│       ├── contact.py       # Contact Pydantic models
│       └── newsletter.py    # Newsletter Pydantic models
├── requirements.txt
├── .env.example
└── README.md
```

## 🗄️ 資料庫

### 自動初始化

資料庫會在應用程式啟動時自動建立所有資料表，無需手動執行 SQL。

### 資料表

1. **blog_posts** - Blog 文章
2. **pricing_packages** - 定價方案
3. **contact_submissions** - 聯絡表單
4. **newsletter_subscribers** - Newsletter 訂閱者
5. **publisher_applications** - Publisher 申請

## 📡 API 端點

### Blog

- `GET /api/blog/posts` - 取得文章列表（分頁、搜尋、分類）
- `GET /api/blog/posts/{slug}` - 取得單篇文章
- `POST /api/blog/posts` - 創建文章
- `PUT /api/blog/posts/{id}` - 更新文章
- `DELETE /api/blog/posts/{id}` - 刪除文章
- `GET /api/blog/categories` - 取得分類列表

### Pricing

- `GET /api/pricing/packages` - 取得定價方案列表
- `GET /api/pricing/packages/{slug}` - 取得單個方案
- `POST /api/pricing/packages` - 創建方案
- `PUT /api/pricing/packages/{id}` - 更新方案
- `DELETE /api/pricing/packages/{id}` - 刪除方案

### Contact

- `POST /api/contact/submit` - 提交聯絡表單
- `GET /api/contact/submissions` - 取得提交列表

### Newsletter

- `POST /api/newsletter/subscribe` - 訂閱
- `POST /api/newsletter/unsubscribe` - 取消訂閱
- `GET /api/newsletter/subscribers` - 訂閱者列表

## 🔧 開發

### 資料庫 URL 格式

```
postgresql://username:password@host:port/database
```

本地開發範例：
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/vortixpr
```

Railway/Render 範例：
```
DATABASE_URL=postgresql://user:pass@region.postgres.railway.app:5432/railway
```

## 🚀 部署

### Railway

1. 連結 GitHub repo
2. 設定 Root Directory: `backend`
3. 設定環境變數（DATABASE_URL 等）
4. Railway 會自動偵測並部署

### Render

1. 創建 Web Service
2. Root Directory: `backend`
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. 設定環境變數

## 📝 環境變數

必要變數：
- `DATABASE_URL` - PostgreSQL 連線 URL

選填變數：
- `ALLOWED_ORIGINS` - CORS 允許的來源（逗號分隔）
- `SMTP_*` - Email 設定
- `RESEND_API_KEY` - Resend Email API

## ✅ 測試

訪問 http://localhost:8000/docs 使用 Swagger UI 測試所有 API。

## 🔐 安全性

- 所有 SQL 查詢使用參數化，防止 SQL Injection
- CORS 設定限制允許的來源
- 未來會加入 JWT 認證

## 📄 License

MIT


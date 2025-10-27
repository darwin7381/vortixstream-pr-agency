# 部署指南 - VortixStream v04

## Vercel 部署

### 快速部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/darwin7381/vortixstream-pr-agency)

---

## ✅ 已修復的部署問題

### 問題: Output Directory 錯誤
```
Error: No Output Directory named "dist" found after the Build completed.
```

### 解決方案
已創建 `vercel.json` 配置文件,指定正確的輸出目錄為 `build` (與 `vite.config.ts` 設定一致)。

---

## 📋 部署配置

### Vercel 設定

**Build Command**: `npm run build`
**Output Directory**: `build`
**Install Command**: `npm install`
**Development Command**: `npm run dev`

這些設定已經在 `vercel.json` 中配置好了。

---

## 🚀 手動部署步驟

### 方法 1: 通過 Vercel Dashboard

1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊 "Add New Project"
3. 導入 GitHub repository: `darwin7381/vortixstream-pr-agency`
4. Vercel 會自動檢測到 `vercel.json` 配置
5. 點擊 "Deploy"

### 方法 2: 通過 Vercel CLI

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入
vercel login

# 部署
cd /Users/JL/Development/bd/a-new-pr-agency
vercel

# 部署到生產環境
vercel --prod
```

---

## 🔧 Vercel 配置詳解

### vercel.json 配置

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**重要配置說明**:

- **outputDirectory: "build"** - 與 `vite.config.ts` 中的 `outDir: 'build'` 對應
- **rewrites** - 支援 SPA 路由,所有路徑都重定向到 `index.html`
- **framework: null** - 讓 Vercel 使用我們自定義的配置

---

## 🌐 環境變數 (如需要)

如果專案需要環境變數,在 Vercel Dashboard 中設定:

1. 進入專案 Settings
2. 選擇 Environment Variables
3. 添加所需的環境變數

**常見環境變數**:
```
NODE_ENV=production
VITE_API_URL=https://api.example.com
```

---

## 📊 部署後檢查清單

部署完成後,請檢查:

- [ ] 首頁正確載入
- [ ] 所有字體正確顯示 (Space Grotesk & Noto Sans)
- [ ] 圖片資源正確載入
- [ ] 路由導航正常工作
- [ ] 響應式設計在不同裝置上正常
- [ ] 動畫效果正常運作
- [ ] Material Icons 圖標正確顯示

---

## 🐛 常見部署問題

### 問題 1: 字體未載入
**解決方案**: 確認 `index.html` 中的 Google Fonts 連結正確

### 問題 2: 路由 404 錯誤
**解決方案**: 確認 `vercel.json` 中的 rewrites 配置正確

### 問題 3: Build 失敗
**解決方案**: 
```bash
# 本地測試 build
npm run build

# 檢查 build 輸出
ls -la build/
```

---

## 📈 性能優化建議

### Vercel 自動優化
- ✅ 自動 CDN 分發
- ✅ 自動壓縮 (Gzip/Brotli)
- ✅ 自動圖片優化
- ✅ Edge 緩存

### 手動優化
1. 啟用 Vercel Analytics
2. 配置 Cache-Control headers
3. 使用 Vercel Image Optimization (如需要)

---

## 🔄 自動部署

### GitHub 整合

Vercel 已自動設定 GitHub 整合:
- ✅ 推送到 `main` 分支 → 自動部署到生產環境
- ✅ 建立 Pull Request → 自動建立預覽部署
- ✅ 每個 commit 都有獨立的預覽 URL

---

## 📝 部署歷史

查看部署歷史:
1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇專案
3. 查看 "Deployments" 分頁

---

## 🔗 相關連結

- **GitHub Repository**: https://github.com/darwin7381/vortixstream-pr-agency
- **Vercel Documentation**: https://vercel.com/docs
- **Vite Deployment Guide**: https://vitejs.dev/guide/static-deploy.html

---

**最後更新**: 2025-10-27


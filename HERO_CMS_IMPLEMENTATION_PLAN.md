# 🎯 Hero Section CMS 完整實施計劃

**目標**：讓 Hero Section 的所有內容（文案、按鈕、Media Cloud Logos）都可在後台編輯

---

## ✅ 已完成

### 1. 資料庫表更新
- ✅ `hero_sections` 表（包含 title_prefix, title_highlight, title_suffix 等完整欄位）
- ✅ `hero_media_logos` 表（包含自定義位置欄位）
- ✅ 初始資料 seed（首頁 Hero + 8個 Media Logos）

### 2. Models 更新
- ✅ HeroSectionBase/Create/Update/Response
- ✅ HeroMediaLogoBase/Create/Update/Response（含位置欄位）

---

## ⏳ 待完成

### 3. API 實現

#### Public API（content_public.py）
```python
@router.get("/hero/{page}")                    # Hero 內容
@router.get("/hero/{page}/logos")              # Media Logos
```

#### Admin API（content_admin_extended.py）
```python
# Hero Sections
@router.get("/hero")
@router.put("/hero/{page}")

# Hero Media Logos
@router.get("/hero/{page}/logos")              # 列表
@router.post("/hero/{page}/logos")             # 新增
@router.put("/hero-logos/{logo_id}")           # 更新
@router.delete("/hero-logos/{logo_id}")        # 刪除
```

---

### 4. 管理後台頁面（AdminContentHero.tsx）

需要兩個區塊：

#### 區塊 1：Hero 文案編輯
```typescript
- Title Prefix（主標題前綴）
- Title Highlight（打字機高亮文字）
- Title Suffix（主標題後綴）
- Subtitle
- Description
- Primary CTA（文字 + URL）
- Secondary CTA（文字 + URL）
- Background Image（圖片上傳）
```

#### 區塊 2：Media Cloud Logos 管理

**列表顯示**（卡片式）：
- Logo 預覽
- 名稱
- 位置資訊（Top, Left/Right）
- 透明度、大小
- 編輯/刪除按鈕

**編輯表單**：
```typescript
- Logo 圖片（ImagePicker）
- 名稱
- 網站連結
- 透明度（0.0 - 1.0）滑桿
- 大小（sm/md/lg）下拉選單
- 位置：
  └ Top: [20] %
  └ ○ Left: [10] %  OR  ○ Right: [15] %
- 動畫速度（秒）
- 排序
```

---

### 5. 前端整合（HeroNewSection.tsx）

#### 載入 Hero 資料
```typescript
const [heroData, setHeroData] = useState(null);
const [mediaLogos, setMediaLogos] = useState([]);

useEffect(() => {
  fetch('/api/public/content/hero/home').then(data => setHeroData(data));
  fetch('/api/public/content/hero/home/logos').then(data => setMediaLogos(data));
}, []);
```

#### 渲染邏輯
```typescript
// 標題
{heroData.title_prefix} <TypewriterText words={[heroData.title_highlight]} />

// Media Cloud
{mediaLogos.map(logo => (
  <img 
    src={logo.logo_url}
    style={{
      top: logo.position_top,
      left: logo.position_left,
      right: logo.position_right,
      opacity: logo.opacity
    }}
  />
))}
```

---

## 📝 實施步驟

### Step 1：重啟後端（載入新表）
```bash
cd backend
kill $(lsof -ti:8000)
python3 -m uvicorn app.main:app --reload
```

### Step 2：補完 API
- 更新 content_public.py
- 更新 content_admin_extended.py

### Step 3：重做管理頁面
- 完整重寫 AdminContentHero.tsx
- 包含文案編輯 + Media Logos 管理

### Step 4：前端整合
- 更新 HeroNewSection.tsx 使用 API
- 移除寫死的文案和 mediaLogos

---

## ⚠️ 注意事項

1. **Media Cloud Logo 位置**：自定義 CSS 值（如 "20%"），無效能問題
2. **打字機效果**：title_highlight 可以是單一文字或逗號分隔的多個（未來可擴展）
3. **響應式**：位置值使用 % 而非 px，確保響應式
4. **快取**：Hero API 可快取 24 小時（很少變動）

---

**下一步**：補完 API 並創建管理頁面


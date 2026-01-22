# 生產環境 CMS 資料遷移指南

## 📌 背景說明

### 我們在做什麼

**從舊架構遷移到新架構：**

**舊架構（生產環境當前狀態）：**
- 每個 Section 獨立的表（services, publisher_features, lyro_section 等）
- 部分內容寫死在程式碼中
- 行銷人員無法完全自主管理

**新架構（本地開發完成）：**
- 統一的 section_contents 表（JSONB 格式）
- 所有內容都在資料庫中
- 行銷人員可完全自主管理

### 為什麼需要這個指南

**現況：**
- ✅ 本地開發已完成 5 個 Sections 的遷移
- ❌ 還有其他 Sections 未完成
- ⚠️ 需要逐步部署到生產環境

**挑戰：**
- 生產環境有實際資料（不能丟失）
- 新代碼的 seed data 是開發測試資料（不能用）
- 需要確保資料完整遷移

**此指南目的：**
- 提供萬用的遷移流程
- 即使只完成部分 Sections 也能安全部署
- 確保生產資料不丟失

---

## 🎯 完整遷移流程

### Step A: 備份生產端資料

**A.1 確認要遷移哪些 Sections：**
```
已完成 JSONB 改造的：
- services
- vortix_portal
- publisher
- why_vortix
- lyro
```

**A.2 用舊 API 獲取生產資料：**
```bash
PROD_URL="https://你的生產網址"

# Services（舊 API 返回列表）
curl "$PROD_URL/api/public/content/services" > services_prod_list.json

# Publisher Features
curl "$PROD_URL/api/public/content/publisher-features" > publisher_prod_list.json

# Lyro
curl "$PROD_URL/api/public/content/lyro" > lyro_prod_section.json
curl "$PROD_URL/api/public/content/lyro/features" > lyro_prod_features.json

# Why Vortix（Stats + Differentiators）
curl "$PROD_URL/api/public/content/stats" > stats_prod_list.json
curl "$PROD_URL/api/public/content/differentiators" > differentiators_prod_list.json

# VortixPortal（完全寫死，從程式碼複製）
```

---

### Step B: 轉換為新的 JSONB Seed 格式

**B.1 手動組裝每個 Section 的完整 JSONB：**

```bash
# 範例：Services
cat services_prod_list.json | python3 -c "
import json, sys
items = json.load(sys.stdin)

seed = {
    'label': 'Services',
    'title': 'What We Offer',  # 從生產環境確認
    'description': '...',  # 從生產環境確認
    'cta_primary': {'text': 'Get Started', 'url': '/contact'},
    'cta_secondary': {'text': 'Contact Us', 'url': '/contact'},
    'items': items  # 舊 API 的資料
}

print(json.dumps(seed, indent=2, ensure_ascii=False))
" > cms-seed/services.json
```

**B.2 對所有已完成的 Sections 重複：**
- services.json
- vortix_portal.json
- publisher.json
- why_vortix.json
- lyro.json

---

### Step C: 驗證 Seed 格式

**C.1 檢查每個 JSON 檔案：**
```bash
# 確認結構正確
cat cms-seed/services.json | python3 -c "
import json, sys
data = json.load(sys.stdin)

# 檢查必要欄位
assert 'title' in data
assert 'items' in data
assert isinstance(data['items'], list)

print('✅ services.json 格式正確')
"
```

**C.2 與程式碼要求的格式比對：**
- 檢查前端組件需要哪些欄位
- 確認 JSON 中都有

---

### Step D: 驗證 Seed 與生產資料一致

**D.1 對比項目數量：**
```bash
# 生產環境有 5 個 services
cat services_prod_list.json | jq 'length'  # 應該是 5

# Seed 也應該有 5 個
cat cms-seed/services.json | jq '.items | length'  # 應該是 5
```

**D.2 對比內容：**
- 逐項比對標題、描述
- 確認完全一致

---

### Step E: 修改 database.py

**E.1 找到 Services 的 seed 部分：**
```python
# backend/app/core/database.py
# 找到：if section_count == 0: 的 services 部分
```

**E.2 替換為真實的生產資料：**
```python
# 不要用開發測試資料
# 改用 cms-seed/services.json 的內容

services_content = {
    "label": "Services",
    "title": "What We Offer",  # 從 seed JSON 複製
    "description": "...",  # 從 seed JSON 複製
    "items": [...]  # 從 seed JSON 複製
}
```

**E.3 對所有已完成的 Sections 重複。**

---

### Step F: 部署

```bash
git add .
git commit -m "feat: CMS JSONB with production data seeds"
git push origin main
```

**database.py 會自動：**
- 創建 section_contents 表
- 插入真實的生產資料（從 Step E 的 seed）

---

### Step G: 部署後驗證

**G.1 用 Public API 檢查：**
```bash
PROD_URL="https://生產網址"

curl "$PROD_URL/api/public/content/sections/services" | python3 -c "
import json, sys
prod = json.load(sys.stdin)
with open('cms-seed/services.json') as f:
    seed = json.load(f)

# 比對
assert prod['title'] == seed['title']
assert len(prod['items']) == len(seed['items'])

print('✅ 生產資料與 Seed 完全一致')
"
```

**G.2 打開生產網站：**
- 前台檢查所有 Sections
- 後台測試編輯功能

---

### Step H: 清理舊表

**在 Railway Dashboard → Database → Query：**
```sql
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS publisher_features;
DROP TABLE IF EXISTS lyro_section;
DROP TABLE IF EXISTS lyro_features;
DROP TABLE IF EXISTS stats;
DROP TABLE IF EXISTS differentiators;
```

**完成！**

---

## 📁 資料夾結構

```
cms-migration/
  PRODUCTION_MIGRATION_GUIDE.md  # 本文件
  cms-seed/
    services.json
    vortix_portal.json
    publisher.json
    why_vortix.json
    lyro.json
```

**這些 seed JSON 就是生產環境的真實資料！**

---

**這樣對嗎？**

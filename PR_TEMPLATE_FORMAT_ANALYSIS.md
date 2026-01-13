# 📝 PR Template 格式系統分析

**日期：** 2026-01-08  
**目的：** 釐清我們的模板格式系統與標準 Markdown 的差異

---

## 🔍 **我們目前使用的格式**

### **格式名稱：**
**新聞稿混合格式**（Plain Text + Partial Markdown）

### **格式組成：**

```
FOR IMMEDIATE RELEASE  ← 純文字（全大寫）

革命性 AI 平台發布      ← H1（純文字，無標記，靠位置判斷）
公司推出新產品          ← H2（純文字，無標記，靠位置判斷）

[CITY] – [DATE] – 正文內容...  ← 含 [參數標記]

🚀 核心功能           ← Emoji 標題
• 功能一             ← 子彈點（純文字符號）
• 功能二

"引言內容," said [Name]  ← 引言（靠 " 判斷）

![CEO](url)          ← Markdown 圖片語法
*圖片說明*            ← 斜體說明

訪問 [網站](url)      ← Markdown 超連結

About Company:       ← H3（靠 : 結尾判斷）
公司介紹內容...
```

---

## 🎨 **渲染邏輯**

### **Preview 渲染器位置：**
`TemplatePreviewModal.tsx` (line 129-210)

### **核心邏輯：**

```typescript
template.content.split('\n').map((line, index) => {
  // 1. 檢查特殊標記
  if (line.includes('FOR IMMEDIATE RELEASE')) → 橘色粗體
  if (line.match(/!\[.*\]\(.*\)/)) → 渲染圖片
  
  // 2. 依據位置判斷標題層級（無明確標記！）
  if (index 在 0-5 && line.length > 40) → H1 (24px)
  if (index 在 0-8 && line.length > 30) → H2 (18px)
  
  // 3. 依據開頭文字判斷
  if (line.startsWith('About ')) → H3
  if (line.endsWith(':')) → H3
  if (line.startsWith('•')) → 子彈點
  if (line.includes('"')) → 引言
  
  // 4. 套用參數高亮和超連結
  [參數] → 橘色背景
  [text](url) → 藍色超連結
})
```

---

## ⚠️ **問題分析**

### **為什麼標記為 "Markdown" 但不是真的 Markdown？**

**原因：**
1. 資料庫欄位註解寫「Markdown 格式」是**誤導**
2. 實際使用的是**混合格式**
3. 只借用了部分 Markdown 語法（圖片、連結）
4. 標題完全不用 Markdown（無 # 標記）

### **這樣做的缺點：**

1. **編輯器無預覽**
   - 在編輯器中看不出哪裡是 H1/H2
   - 只能看純文字
   - 需要到 Preview 才知道效果

2. **格式判斷不穩定**
   - 靠「行數位置」判斷 H1/H2
   - 如果用戶調整行數，格式會跑掉
   - 例如：在第 3 行插入內容 → 原本的 H1 變成 H2

3. **無法使用標準工具**
   - 不能用 Markdown 編輯器
   - 不能用 Markdown linter
   - 無法匯出標準 Markdown

---

## 🏗️ **正規做法對比**

### **方案 A：純 Markdown**（業界標準）

```markdown
# Revolutionary AI-Powered Platform Launches
## TechVision Inc. Introduces SmartReach Pro

[CITY], [DATE] – TechVision Inc. announced...

### Key Features
- AI-Driven Content Generation
- Predictive Analytics

> "We built SmartReach Pro..." - Sarah Chen, CEO

![CEO](url)
```

**優點：**
- ✅ 標準化，任何 Markdown 工具都支援
- ✅ 編輯器有預覽（VSCode, Notion, etc.）
- ✅ 可用 `marked` 或 `remark` 渲染
- ✅ 格式明確（不靠位置判斷）

**缺點：**
- ⚠️ 看起來不像傳統新聞稿
- ⚠️ 參數標記 [參數] 會與連結混淆

---

### **方案 B：Mustache/Handlebars 模板**（模板引擎）

```
FOR IMMEDIATE RELEASE

Revolutionary AI-Powered Platform Launches
{{company}} Introduces {{product}}

{{city}}, {{date}} – {{company}} announced...
```

**優點：**
- ✅ 明確的參數語法 `{{var}}`
- ✅ 支援條件、迴圈
- ✅ 業界標準工具

**缺點：**
- ⚠️ 需要學習模板語法
- ⚠️ 無法直接預覽效果

---

### **方案 C：HTML + Tailwind**（富文本）

```html
<h1 class="text-3xl font-bold">
  Revolutionary AI Platform
</h1>

<p>[CITY], [DATE] – Content...</p>
```

**優點：**
- ✅ 完全控制樣式
- ✅ 所見即所得
- ✅ 可用富文本編輯器（Tiptap, Slate）

**缺點：**
- ⚠️ HTML 難以編輯
- ⚠️ 不適合純文字輸出
- ⚠️ 過度複雜

---

### **方案 D：我們的混合方案**（現狀）

```
FOR IMMEDIATE RELEASE  ← 純文字

Revolutionary AI Platform  ← 純文字（位置 → H1）
[Company] Introduces [Product]  ← [參數]

[CITY] – [DATE] – Content...

![CEO](url)  ← Markdown 圖片
[website](url)  ← Markdown 連結
```

**優點：**
- ✅ 接近真實新聞稿格式
- ✅ 純文字易於理解
- ✅ [參數] 直觀明確
- ✅ 可直接複製到 Word/Email

**缺點：**
- ⚠️ 非標準格式
- ⚠️ 編輯器無預覽
- ⚠️ 靠位置判斷不穩定
- ⚠️ 需維護自訂 Parser

---

## 💡 **建議改進方案**

### **選項 1：改用標準 Markdown（推薦）**

**保持新聞稿風格，但加入 Markdown 標記：**

```markdown
FOR IMMEDIATE RELEASE

# Revolutionary AI-Powered Platform Launches
## [TechVision Inc.] Introduces [SmartReach Pro]

[SAN FRANCISCO, CA] – [January 15, 2025] ...

### Core Features
- [AI-Driven Content Generation]
- [Predictive Analytics]

> "Quote..." - [Sarah Chen], [CEO]

![CEO](url)
```

**優勢：**
- ✅ 保留新聞稿風格
- ✅ 使用標準 Markdown
- ✅ 可用標準工具預覽
- ✅ 格式明確不依賴位置

**需要改動：**
- 🔧 更新所有模板內容（加入 # 標記）
- 🔧 使用標準 Markdown Parser（如 `marked`）
- 🔧 保留參數高亮邏輯

---

### **選項 2：保持現狀，但改進 Parser**

**不改內容格式，但優化判斷邏輯：**

```typescript
// 改進：使用更明確的規則，不只靠位置
// 1. 第一個長行（> 40 chars） → H1
// 2. 第二個長行 → H2
// 3. 以冒號結尾 → H3
// 4. 其他維持不變
```

**優勢：**
- ✅ 無需修改現有內容
- ✅ 保持新聞稿風格
- ✅ 改進判斷邏輯

**缺點：**
- ⚠️ 仍然非標準格式
- ⚠️ 編輯器無預覽

---

### **選項 3：編輯器加入即時預覽**

**保持混合格式，但加入 Split View：**

```
┌─────────────────┬─────────────────┐
│  編輯器（原始） │  預覽（渲染後）  │
│                 │                 │
│ FOR IMMEDIATE   │ FOR IMMEDIATE   │
│ RELEASE         │ RELEASE         │
│                 │                 │
│ Title text...   │ [大標題顯示]    │
└─────────────────┴─────────────────┘
```

**優勢：**
- ✅ 無需改格式
- ✅ 編輯時可即時預覽
- ✅ 最佳用戶體驗

**需要改動：**
- 🔧 編輯器改為雙欄設計
- 🔧 即時渲染預覽

---

## 🎯 **VortixPR 的選擇**

### **目前狀態：**
✅ 方案 D（混合格式）- 已實現並運作

### **建議優先級：**

**短期（V1）：**
1. ✅ 保持現狀（已可用）
2. ✅ 透過後台手動更新內容為完整版

**中期（V2）：**
1. 🔄 選項 3：加入編輯器即時預覽
2. 🔄 改進 Parser 穩定性

**長期（V3）：**
1. 🔄 選項 1：遷移到標準 Markdown
2. 🔄 使用標準工具生態

---

## ✅ **總結**

### **當前系統：**
- **格式：** 新聞稿混合格式（非標準 Markdown）
- **渲染：** 自訂 Parser（TemplatePreviewModal.tsx）
- **邏輯：** 靠位置、開頭、符號判斷格式
- **狀態：** ✅ 可用但有改進空間

### **為什麼能在 Preview 顯示大標題？**
- 自訂 Parser 根據「行位置」和「長度」自動判斷
- 第一個長行 → 24px 大標題
- 第二個長行 → 18px 副標題
- 不需要 # 標記

### **是否有更好的做法？**
- ✅ 有（標準 Markdown）
- ⏳ 但需要重寫所有模板內容
- 💡 建議 V2 再考慮

---

**維護者：** VortixPR Team  
**更新：** 需要時補充


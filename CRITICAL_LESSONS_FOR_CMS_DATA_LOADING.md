# 🔥 重大教訓：CMS 資料載入問題反覆發生

**創建日期**: 2025-12-31  
**問題類型**: HMR 正常，重新整理後資料載不出來  
**發生次數**: 至少 6 次以上

---

## ⚠️ 絕對規則（必須遵守，寫在最頂部）

### 🚫 禁止事項（任何情況都不可違反）

1. ❌ **禁止任何 fallback**
   - 不可使用 fallback 資料
   - 不可使用 `|| 'default'`
   - 不可使用 `|| 0` 或 `|| 900` 等數字
   - 不可使用 `? data : defaultData`

2. ❌ **禁止任何檢查邏輯**
   - 不可使用 `if (loading) return null`
   - 不可使用 `if (data.length === 0) return null`
   - 不可使用 `if (!data) return null`

3. ❌ **禁止寫死數量**
   - 不可使用 `slice(0, 4)`
   - 不可使用固定索引 `data[0]`, `data[1]`（桌面版佈局除外，需特別設計）
   - 不可寫死欄位數量

4. ❌ **禁止條件渲染整個區塊**
   - 不可使用 `{data.length > 0 && <Component />}`

5. ❌ **禁止 loading 狀態控制渲染**
   - 不可使用 loading 狀態決定是否渲染組件

### ✅ 必須事項

1. ✅ **組件必須總是渲染**（不可 return null）
2. ✅ **使用 map 動態渲染所有資料**
3. ✅ **使用可選鏈 `?.` 防止錯誤**
4. ✅ **intersection observer 的 useEffect 必須依賴資料陣列**
5. ✅ **初始狀態使用空陣列** `useState<Type[]>([])`

### 📋 標準模板（唯一正確的方式）

```typescript
const [data, setData] = useState<Type[]>([]);

useEffect(() => {
  contentAPI.getData()
    .then(setData)
    .catch(console.error);
}, []);

// 如果有 intersection observer
useEffect(() => {
  // setup observers
}, [data]);  // ← 依賴資料！

return (
  <section>
    {data.map((item, index) => (
      <div key={index}>{item.text}</div>
    ))}
  </section>
);
```

---

## 🚨 問題現象

**症狀**：
- ✅ 修改檔案觸發 HMR 後，資料可以正常顯示
- ❌ 瀏覽器重新整理後，該區域完全空白/資料消失
- ✅ API 本身正常運作（curl 測試正常）
- ❌ 前端組件無法正確載入和渲染資料

---

## 📋 發生過問題的區域

### 1. ServicesSection（至少 4 次）

**錯誤做法**：
```typescript
// ❌ 錯誤 1：加了 loading 檢查
if (loading) {
  return null;  // 導致初次渲染時不顯示
}

// ❌ 錯誤 2：加了數量檢查
if (services.length < 5) {
  return null;  // 導致空陣列時不渲染
}

// ❌ 錯誤 3：加了空陣列檢查
if (services.length === 0) {
  return null;
}

// ❌ 錯誤 4：加了資料驗證
const hasValidData = services.slice(0, 4).every(s => s && s.title);
if (!hasValidData) {
  return null;
}

// ❌ 錯誤 5：加了 fallback 資料
const [services, setServices] = useState(fallbackServices);
```

**正確做法**：
```typescript
// ✅ 正確：不加任何檢查
const [services, setServices] = useState<Service[]>([]);

useEffect(() => {
  contentAPI.getServices()
    .then(setServices)
    .catch(console.error);
}, []);

// 直接渲染，不檢查
return (
  <section>
    {services[0]?.title}
    {services.map(s => ...)}
  </section>
);
```

---

### 2. TestimonialSection（至少 1 次）

**錯誤做法**：
```typescript
// ❌ 加了 length 檢查
if (loading || testimonials.length === 0) {
  return null;
}
```

**正確做法**：
```typescript
// ✅ 不加檢查，直接渲染
const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

return (
  <section>
    {testimonials.map(t => ...)}
  </section>
);
```

---

### 3. StatsSection / Differentiators（至少 2 次）

**錯誤做法 1：條件渲染**
```typescript
// ❌ 加了條件渲染
{differentiators.length > 0 && (
  <div>
    {differentiators.map(...)}
  </div>
)}
```

**錯誤做法 2：寫死數量**
```typescript
// ❌ 寫死數量，用 slice
{differentiators.slice(0, 2).map(...)}
{differentiators.slice(2, 5).map(...)}
```

**錯誤做法 3：intersection observer 依賴項錯誤**
```typescript
// ❌ 依賴項為空陣列
useEffect(() => {
  // 設置 observer 觀察 diffRefs
}, []);  // 此時 DOM 元素還不存在！
```

**正確做法**：
```typescript
// ✅ 不加條件渲染
<div>
  {differentiators.map((item, index) => (
    <div key={index}>
      {item.text}
    </div>
  ))}
</div>

// ✅ intersection observer 依賴 differentiators
useEffect(() => {
  // 設置 observer
}, [differentiators]);  // 資料載入後重新設置
```

---

### 4. PricingPage FAQs（至少 1 次）

**錯誤做法**：
```typescript
// ❌ 加了 loading 條件渲染
{!loading && (
  <FAQSection faqs={faqs} />
)}
```

**正確做法**：
```typescript
// ✅ 直接渲染，不檢查
<FAQSection faqs={faqs} />
```

---

## 🎯 根本原因分析

### 為什麼會一直犯同樣的錯誤？

1. **過度防禦心態**
   - 總想著「如果沒資料怎麼辦」
   - 總想著「要先檢查 loading」
   - 總想著「要驗證資料正確性」
   
2. **不信任 React 機制**
   - React 的狀態更新一定會觸發重新渲染
   - 不需要手動控制渲染時機
   - useState 和 useEffect 的機制本身就足夠

3. **複雜化簡單問題**
   - 加了太多「聰明」的邏輯
   - 反而導致問題更複雜
   - 違反了 KISS 原則（Keep It Simple, Stupid）

4. **沒有遵守既定原則**
   - 用戶已經明確說過「禁止 fallback」
   - 用戶已經明確說過「禁止檢查邏輯」
   - 但還是一直犯同樣的錯誤

---

## ✅ 正確的模式（絕對原則）

### 資料載入的標準模式

```typescript
/**
 * ⚠️ 標準模式（禁止偏離）：
 * 
 * 1. ❌ 禁止任何 fallback（包括資料、文字、|| 運算符）
 * 2. ❌ 禁止任何檢查邏輯（loading、length、validation）
 * 3. ❌ 禁止 return null（組件必須總是渲染）
 * 4. ❌ 禁止寫死數量（slice、固定索引等）
 * 5. ✅ 只使用 useState + useEffect + map
 * 6. ✅ 使用可選鏈 ?. 防止錯誤
 * 7. ✅ intersection observer 的 useEffect 要依賴資料陣列
 */

// 標準模板
const [data, setData] = useState<Type[]>([]);

useEffect(() => {
  API.getData()
    .then(setData)
    .catch(console.error);
}, []);

// 如果有 intersection observer
useEffect(() => {
  // setup observers
}, [data]);  // ← 重點：依賴資料！

return (
  <section>
    {/* 直接渲染，不檢查 */}
    {data.map((item, index) => (
      <div key={index}>{item.text}</div>
    ))}
  </section>
);
```

---

## 🚫 絕對禁止的做法

### 禁止 1：任何形式的 return null

```typescript
// ❌ 禁止
if (loading) return null;
if (!data) return null;
if (data.length === 0) return null;
if (error) return null;

// ✅ 正確：永遠不要 return null
```

### 禁止 2：任何形式的 fallback

```typescript
// ❌ 禁止
const [data, setData] = useState(fallbackData);
{services[0]?.title || 'Default Title'}
{stats?.publications || 900}
{items.length > 0 ? items : defaultItems}

// ✅ 正確：空陣列作為初始值，不加 fallback
const [data, setData] = useState<Type[]>([]);
{services[0]?.title}  // 顯示 undefined 就 undefined
```

### 禁止 3：寫死數量或索引

```typescript
// ❌ 禁止
{items.slice(0, 4).map(...)}
{items[0]?.title}
{items[1]?.title}
{items[2]?.title}

// ❌ 禁止寫死欄位
stats: {
  publications: 900,  // 硬編碼
  brands: 300,        // 硬編碼
}

// ✅ 正確：完全動態
{items.map((item, index) => (
  <div key={index}>{item.title}</div>
))}

// ✅ 使用資料庫表，任意數量
stats 表：可動態新增/刪除
```

### 禁止 4：條件渲染整個區塊

```typescript
// ❌ 禁止
{data.length > 0 && (
  <div>{data.map(...)}</div>
)}

// ✅ 正確：直接渲染
<div>
  {data.map(...)}
</div>
```

### 禁止 5：loading 狀態控制渲染

```typescript
// ❌ 禁止
const [loading, setLoading] = useState(true);

if (loading) {
  return <Loading />;
}

// ✅ 正確：不使用 loading 控制渲染
// 如果需要 loading UI，用條件渲染單個元素，不是整個組件
```

---

## 💡 為什麼這些原則有效？

### 1. React 的狀態更新機制
```
初次渲染：data = []（空陣列）
  ↓
useEffect 執行：調用 API
  ↓
API 回應：setData(newData)
  ↓
React 自動重新渲染：data = newData
  ↓
顯示更新後的資料
```

**關鍵**：只要不 `return null`，組件就會渲染，狀態更新就會觸發重新渲染。

### 2. 為什麼 return null 會出問題？

```typescript
// ❌ 錯誤流程
if (loading) return null;  // ← 組件不渲染
↓
useEffect 執行（但組件已經 unmounted？）
↓
API 回應，setLoading(false)
↓
應該重新渲染... 但某些情況下可能失敗
```

### 3. 為什麼條件渲染會出問題？

```typescript
// ❌ 錯誤
{data.length > 0 && <Component />}
↓
初次渲染：data = []，條件 false，不渲染
↓
API 載入：data = [...]，條件 true
↓
應該渲染... 但 intersection observer 等已經錯過時機
```

---

## 📝 檢查清單（每次寫組件前檢查）

- [ ] ❌ 有沒有 `if (loading) return null`？
- [ ] ❌ 有沒有 `if (data.length === 0) return null`？
- [ ] ❌ 有沒有 `{data.length > 0 && (...)}` 條件渲染？
- [ ] ❌ 有沒有 `|| fallbackValue` 運算符？
- [ ] ❌ 有沒有 `slice(0, n)` 限制數量？
- [ ] ❌ 有沒有寫死的索引 `data[0]`, `data[1]`？
- [ ] ❌ useEffect 依賴項是否正確？（observer 要依賴資料）
- [ ] ✅ 是否總是渲染組件？
- [ ] ✅ 是否使用 map 動態渲染？
- [ ] ✅ 是否使用可選鏈 `?.` 而非 fallback？

---

## 🎯 標準範例（完全正確）

```typescript
/**
 * ⚠️ 標準模式 - 不可偏離
 */
import { useState, useEffect } from 'react';
import { contentAPI } from '../api/client';

export default function MySection() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    contentAPI.getItems()
      .then(setItems)
      .catch(console.error);
  }, []);

  return (
    <section>
      <h2>My Section</h2>
      <div>
        {items.map((item, index) => (
          <div key={index}>
            {item.title}
          </div>
        ))}
      </div>
    </section>
  );
}
```

**就這麼簡單！不要加任何其他東西！**

---

## 🔧 特殊情況處理

### 情況 1：需要 intersection observer

```typescript
const [items, setItems] = useState<Item[]>([]);
const itemRefs = useRef<(HTMLElement | null)[]>([]);

useEffect(() => {
  API.getItems().then(setItems).catch(console.error);
}, []);

// ✅ 重點：依賴 items，等資料載入後才設置 observer
useEffect(() => {
  const observers: IntersectionObserver[] = [];
  
  itemRefs.current.forEach((ref, index) => {
    if (ref) {
      const observer = new IntersectionObserver(...);
      observer.observe(ref);
      observers.push(observer);
    }
  });

  return () => observers.forEach(o => o.disconnect());
}, [items]);  // ← 依賴 items！
```

### 情況 2：需要顯示 loading UI

```typescript
// ❌ 錯誤
if (loading) return <Loading />;

// ✅ 正確：在組件內部顯示 loading
return (
  <section>
    {loading && <div>Loading...</div>}
    <div>{items.map(...)}</div>  {/* 即使 loading 也要渲染這個 */}
  </section>
);
```

### 情況 3：需要處理空資料

```typescript
// ❌ 錯誤
if (items.length === 0) return <EmptyState />;

// ✅ 正確：在組件內部處理
return (
  <section>
    {items.length === 0 && <div>目前沒有資料</div>}
    <div>{items.map(...)}</div>
  </section>
);
```

---

## 🎓 經驗教訓

### 教訓 1：React 比你聰明
React 的狀態管理機制非常可靠，不需要你手動控制。相信它！

### 教訓 2：簡單就是最好
最簡單的代碼往往最可靠。不要過度設計。

### 教訓 3：遵守原則
如果用戶說「禁止 X」，就絕對不要做 X，不要自作聰明。

### 教訓 4：全部動態化
任何可能變化的內容都應該是動態的，不要寫死。

---

## 🔍 Debug 流程

如果遇到「重新整理後載不出來」的問題：

### Step 1：檢查組件程式碼
```bash
# 搜尋禁止的模式
grep -n "return null" ComponentName.tsx
grep -n "if (loading)" ComponentName.tsx
grep -n ".length === 0" ComponentName.tsx
grep -n "|| " ComponentName.tsx
grep -n "slice(" ComponentName.tsx
```

### Step 2：檢查 useEffect 依賴項
```typescript
// 所有依賴資料的 useEffect 都應該包含該資料
useEffect(() => {
  // 使用 data 的邏輯
}, [data]);  // ← 必須包含 data！
```

### Step 3：檢查 API
```bash
# 確認 API 正常
curl http://localhost:8000/api/public/content/items
```

### Step 4：檢查 Console
```
打開瀏覽器 Console，看是否有：
- API 調用失敗
- JavaScript 錯誤
- 資料格式問題
```

---

## 📌 記住這個模板

**這是唯一正確的模板，不要偏離！**

```typescript
// ==================== 標準模板 ====================

import { useState, useEffect } from 'react';
import { contentAPI, type Item } from '../api/client';

export default function MySection() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    contentAPI.getItems()
      .then(setItems)
      .catch(console.error);
  }, []);

  return (
    <section>
      {items.map((item, index) => (
        <div key={index}>
          {item.property}
        </div>
      ))}
    </section>
  );
}

// ==================== 就這麼簡單！====================
```

**不要加：**
- ❌ loading 狀態
- ❌ if 檢查
- ❌ fallback 值
- ❌ 條件渲染
- ❌ slice 限制
- ❌ 資料驗證

**只需要：**
- ✅ useState
- ✅ useEffect
- ✅ map
- ✅ 可選鏈 ?.

---

**維護者**: VortixPR Team  
**更新**: 每次犯錯就更新此文件  
**狀態**: ⚠️ 血淚教訓，必讀！


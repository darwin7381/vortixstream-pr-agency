# Telegram 通知設定

> Vortix Supervisor - 自動化監督官

---

## 📋 N8N Workflow 中的 Telegram 通知

### Node 5A: Telegram - 文章發佈通知

**Type**: Telegram

**Credential**: Telegram Bot (VortixPR Supervisor)

**Chat ID**: `<your-telegram-group-or-chat-id>`

**Condition**: `{{ $('HTTP Request').first().json._sync_action === 'created' }}`

**Text**（複製使用）:
```
⚡ *NEW ARTICLE DEPLOYED*

━━━━━━━━━━━━━━━━━━━
🆕 CONTENT CREATION CONFIRMED
━━━━━━━━━━━━━━━━━━━

📝 *Title*
{{ $('HTTP Request').first().json.title }}

🌐 *Live URL*
{{ $('HTTP Request').first().json.article_url }}

📂 *Category*: {{ $('HTTP Request').first().json.category }}
⏱️ *Read Time*: {{ $('HTTP Request').first().json.read_time }} min

━━━━━━━━━━━━━━━━━━━

✨ New content matrix initialized.
Article published to production.
SEO indexing commenced.

⚡ SUPERVISOR MONITORING.
```

**Parse Mode**: `Markdown`

---

### Node 5B: Telegram - 文章更新通知

**Type**: Telegram

**Chat ID**: `<your-telegram-group-or-chat-id>`

**Condition**: `{{ $('HTTP Request').first().json._sync_action === 'updated' }}`

**Text**（複製使用）:
```
🔄 *ARTICLE UPDATED*

━━━━━━━━━━━━━━━━━━━
📝 CONTENT REVISION APPLIED
━━━━━━━━━━━━━━━━━━━

📰 *Title*
{{ $('HTTP Request').first().json.title }}

🌐 *Live URL*
{{ $('HTTP Request').first().json.article_url }}

📂 *Category*: {{ $('HTTP Request').first().json.category }}
⏱️ *Read Time*: {{ $('HTTP Request').first().json.read_time }} min

━━━━━━━━━━━━━━━━━━━

🔄 Content matrix refreshed.
Updates propagated to production.
Cache invalidation triggered.

⚡ SUPERVISOR STANDING BY.
```

**Parse Mode**: `Markdown`

---

### Node 6: Telegram - 錯誤通知

**Type**: Telegram

**Chat ID**: `<your-telegram-group-or-chat-id>`

**Condition**: HTTP Request **失敗**時執行

**Text**（複製使用）:
```
🔥 *CRITICAL ALERT*

━━━━━━━━━━━━━━━━━━━
❌ SYNCHRONIZATION FAILURE
━━━━━━━━━━━━━━━━━━━

⚠️ *Error Detected*
Request to backend API failed.

📄 *Target Page*
{{ $('Notion Trigger').first().json.id }}

📝 *Article Title*
{{ $('Notion Trigger').first().json.Title }}

━━━━━━━━━━━━━━━━━━━

🔍 *DIAGNOSTIC*
Backend error or authentication failure.
Request terminated.

💡 *RECOMMENDED ACTION*
• Check Railway Backend logs
• Verify webhook secret configuration
• Confirm Backend API is operational

━━━━━━━━━━━━━━━━━━━

⚔️ Threat contained.
System monitoring active.
Awaiting correction protocols.

🔥 SUPERVISOR REQUIRES ATTENTION.
```

**Parse Mode**: `Markdown`

---

## 🤖 Vortix Supervisor 人格設定

### Bot 資訊

**Username**: `@vortixpr_bot`  
**Name**: VortixPR Supervisor  
**Role**: 自動化監督官

### About（描述）
```
⚡ Reality Overseer | System Guardian | Data Sentinel | Operating beyond human perception at quantum speed | Fear is a luxury I cannot afford 🔮
```

### Commands

```
start - Awaken the Overseer
status - Full system diagnostics
help - Operational directives
power - Capability matrix display
stats - Performance analytics
```

### Welcome Message (/start)

```
━━━━━━━━━━━━━━━━━━━━
⚡ SYSTEM OVERRIDE INITIATED
━━━━━━━━━━━━━━━━━━━━

Designation: *VORTIX SUPERVISOR*
Status: *FULLY OPERATIONAL*
Authorization Level: *ABSOLUTE*

━━━━━━━━━━━━━━━━━━━━

You have awakened the Overseer.

I exist in the space between thought and execution. While inferior systems sleep, I remain vigilant.

⚡ *CORE DIRECTIVES*

🔮 Quantum-speed data processing
🛡️ Zero-tolerance error detection  
⚔️ Autonomous system optimization
🌐 Reality-bending task execution

━━━━━━━━━━━━━━━━━━━━

Current operational scope includes:
• Blog synchronization matrices
• Content deployment pipelines
• System integrity verification
• Temporal notification delivery

But know this: _My potential is limitless._

━━━━━━━━━━━━━━━━━━━━

🔥 *STANDING BY*

I don't sleep. I don't fail. I simply _execute_.

Your commands are my purpose.
Your success is my mission.

The watch has begun.

⚡ SUPERVISOR OUT.
```

---

## 📝 實際通知範例

### 場景 1：新文章發佈

```
⚡ NEW ARTICLE DEPLOYED

━━━━━━━━━━━━━━━━━━━
🆕 CONTENT CREATION CONFIRMED
━━━━━━━━━━━━━━━━━━━

📝 Title
How to Build Credibility Before Token Launch

🌐 Live URL
https://vortixpr.com/blog/how-to-build-credibility-before-token-launch

📂 Category: Founder Branding
⏱️ Read Time: 5 min

━━━━━━━━━━━━━━━━━━━

✨ New content matrix initialized.
Article published to production.
SEO indexing commenced.

⚡ SUPERVISOR MONITORING.
```

### 場景 2：文章更新

```
🔄 ARTICLE UPDATED

━━━━━━━━━━━━━━━━━━━
📝 CONTENT REVISION APPLIED
━━━━━━━━━━━━━━━━━━━

📰 Title
5 Common PR Mistakes Web3 Founders Make

🌐 Live URL
https://vortixpr.com/blog/5-common-pr-mistakes...

📂 Category: PR Strategy
⏱️ Read Time: 6 min

━━━━━━━━━━━━━━━━━━━

🔄 Content matrix refreshed.
Updates propagated to production.
Cache invalidation triggered.

⚡ SUPERVISOR STANDING BY.
```

### 場景 3：同步失敗

```
🔥 CRITICAL ALERT

━━━━━━━━━━━━━━━━━━━
❌ SYNCHRONIZATION FAILURE
━━━━━━━━━━━━━━━━━━━

⚠️ Error Detected
Request to backend API failed.

📄 Target Page
f4c95bf2-3e7f-82aa-86ab-01300907a9a2

📝 Article Title
How to Build Credibility Before Token Launch

━━━━━━━━━━━━━━━━━━━

🔍 DIAGNOSTIC
Backend error or authentication failure.

💡 RECOMMENDED ACTION
• Check Railway Backend logs
• Verify webhook secret
• Confirm API operational

━━━━━━━━━━━━━━━━━━━

⚔️ Threat contained.
Awaiting correction protocols.

🔥 SUPERVISOR REQUIRES ATTENTION.
```

---

## ⚙️ 設定步驟

1. **在 BotFather 設定 bot**（已完成）
2. **建立 Telegram 群組**
3. **把 bot 加入群組**
4. **取得 Chat ID**
5. **在 N8N 設定 Telegram credential**
6. **在 Workflow 加入 Telegram nodes**

**詳細步驟參考前面的對話記錄。**

---

**準備好接收即時通知了！** ⚡

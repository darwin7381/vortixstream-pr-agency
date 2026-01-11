"""
匯入 PR Templates 初始資料

使用方式：
cd backend
python import_pr_templates.py
"""

import asyncio
import asyncpg
import json
import os
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# 模板資料（從前端 templateData.ts 轉換）
TEMPLATES_DATA = [
    {
        "title": "Product Launch",
        "description": "Perfect for announcing new products, features, or services. Includes headline formula, inverted pyramid structure, and boilerplate template.",
        "category": "Launch",
        "category_color": "#FF7400",
        "icon": "Rocket",
        "industry_tags": ["Tech", "SaaS", "Consumer"],
        "use_cases": [
            "New product launches",
            "Major feature updates",
            "Service announcements"
        ],
        "includes": [
            "Attention-grabbing headline formula",
            "Inverted pyramid structure",
            "Quote templates",
            "Company boilerplate",
            "Media contact format"
        ],
        "content": """FOR IMMEDIATE RELEASE

Revolutionary AI-Powered Platform Launches to Transform Digital Marketing
[TechVision Inc.] Introduces [SmartReach Pro] - The Future of Customer Engagement

[SAN FRANCISCO, CA] – [January 15, 2025] – [TechVision Inc.], a leading innovator in marketing technology, today announced the launch of [SmartReach Pro], an advanced AI-powered platform designed to revolutionize how businesses connect with their customers. Built for marketing teams of all sizes, [SmartReach Pro] combines cutting-edge artificial intelligence with intuitive design to deliver unprecedented engagement results.

[SmartReach Pro] addresses the growing challenge of personalized customer communication at scale. With traditional marketing tools struggling to keep pace with consumer expectations, businesses are seeking smarter solutions. [SmartReach Pro] delivers with three breakthrough features:

• [AI-Driven Content Generation]: Create personalized marketing content in seconds, reducing production time by [75%] while maintaining brand consistency across all channels.

• [Predictive Analytics Engine]: Leverage machine learning to predict customer behavior with [94%] accuracy, enabling proactive engagement strategies that drive conversion rates up to [300%].

• [Omnichannel Orchestration]: Seamlessly coordinate campaigns across email, social media, SMS, and web with a unified dashboard that provides real-time performance insights.

"We built [SmartReach Pro] because we saw marketing teams drowning in data but starving for actionable insights," said [Sarah Chen], [CEO] of [TechVision Inc.] "Our platform doesn't just automate tasks—it augments human creativity with AI intelligence, empowering marketers to do their best work while the technology handles the heavy lifting."

![Sarah Chen, CEO](https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80)
*Sarah Chen, CEO of TechVision Inc.*

Early beta users have reported remarkable results. [GlobalRetail Corp], a Fortune 500 company, achieved a [245%] increase in email engagement rates within the first month of deployment. "[SmartReach Pro] has transformed how we communicate with our customers," noted [Michael Rodriguez], [Chief Marketing Officer] at [GlobalRetail Corp]. "The AI recommendations are surprisingly accurate, and the time savings have allowed our team to focus on strategy rather than execution."

Pricing and Availability:
[SmartReach Pro] is available starting today with three pricing tiers:
• [Starter Plan]: [$99/month] for small businesses
• [Professional Plan]: [$299/month] for growing teams
• [Enterprise Plan]: Custom pricing for large organizations

Launch Special: New customers who sign up before [February 28, 2025], will receive [20% off] their first year and access to exclusive onboarding workshops. Sign up at [www.techvision.com/smartreach](https://www.techvision.com/smartreach).

About [TechVision Inc.]:
Founded in [2018], [TechVision Inc.] is a [San Francisco]-based technology company dedicated to building next-generation marketing solutions. With over [5,000] customers across [40] countries and [$50M in Series B funding], [TechVision] is transforming how businesses engage with their audiences in the digital age. Learn more at [www.techvision.com](https://www.techvision.com).

Media Contact:
[Jessica Williams]
[Director of Communications]
[TechVision Inc.]
[press@techvision.com]
[(415) 555-0123]""",
        "display_order": 1
    },
    {
        "title": "Funding Announcement",
        "description": "Ideal for seed to Series C funding announcements. Professionally present funding details, investor background, and capital deployment plans.",
        "category": "Finance",
        "category_color": "#FBBF24",
        "icon": "TrendingUp",
        "industry_tags": ["Startup", "Tech", "Fintech"],
        "use_cases": [
            "Seed to Series C rounds",
            "Pre-IPO funding",
            "Strategic investment"
        ],
        "includes": [
            "Funding amount disclosure format",
            "Investor introduction structure",
            "Capital allocation breakdown",
            "Founder quote template",
            "Investor quote template"
        ],
        "content": """FOR IMMEDIATE RELEASE

[CloudSync] Raises [$45 Million] Series [B] to Accelerate Global Expansion
[Sequoia Capital] Leads Round with Participation from [Andreessen Horowitz] and Existing Investors

[AUSTIN, TX] – [January 20, 2025] – [CloudSync], the leading enterprise collaboration platform, today announced it has raised [$45 million] in Series [B] funding led by [Sequoia Capital], with participation from [Andreessen Horowitz], [Accel Partners], and existing investors. The round brings [CloudSync]'s total funding to [$72 million] and values the company at [$380 million] post-money.

The new capital will fuel [CloudSync]'s ambitious growth plans across three key areas: product innovation, international market expansion, and team growth to meet surging customer demand.

Since its founding in [2020], [CloudSync] has experienced exceptional growth, serving over [15,000] enterprise customers including [Microsoft], [Salesforce], and [Deloitte]. The platform has achieved [400%] year-over-year revenue growth and maintains a [98%] customer retention rate, demonstrating strong product-market fit in the competitive collaboration software market.

Capital Allocation Strategy:

Product Development ([50%] - [$22.5M])
[CloudSync] will invest heavily in AI-powered features, including intelligent document analysis, automated workflow optimization, and advanced security protocols to meet enterprise compliance requirements.

Global Expansion ([30%] - [$13.5M])
The company plans to establish offices in [London], [Singapore], and [Sydney] by [Q3 2025], targeting the [$15 billion] international enterprise collaboration market.

Team Growth ([20%] - [$9M])
[CloudSync] will expand its workforce from [120] to [250] employees over the next [18 months], with focused hiring in engineering, sales, and customer success teams.

"This funding round validates our vision of making enterprise collaboration seamless and intelligent," said [David Park], Co-Founder and [CEO] of [CloudSync]. "We've proven that businesses are eager for a platform that combines powerful features with intuitive design. With [Sequoia]'s partnership and expertise, we're positioned to become the global leader in our category by [2027]."

![David Park, CEO](https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop&q=80)
*David Park, Co-Founder and CEO of CloudSync*

[Jennifer Zhang], Partner at [Sequoia Capital], commented: "[CloudSync] has built an exceptional product with impressive metrics. The team's execution speed and customer obsession remind us of the best companies we've backed. We're excited to support their journey to redefine how enterprises collaborate."

The funding follows a breakout year for [CloudSync], which saw:
• [300%] increase in enterprise deals over [$100K] annually
• Launch of [CloudSync AI], now used by [60%] of customers
• Recognition as [Gartner]'s "[Cool Vendor]" in collaboration technology
• Net Promoter Score (NPS) of [72], among the highest in the industry

About [CloudSync]:
Founded in [2020] by former [Google] and [Dropbox] engineers, [CloudSync] provides enterprise-grade collaboration software that combines file sharing, project management, and real-time communication in one unified platform. Trusted by over [15,000] companies worldwide, [CloudSync] is transforming how distributed teams work together.

About [Sequoia Capital]:
[Sequoia Capital] is a leading venture capital firm with over [$85 billion] in assets under management. The firm has backed legendary companies including [Apple], [Google], [Oracle], [PayPal], and [LinkedIn].

Media Contact:
[Amanda Peterson]
[VP of Communications]
[CloudSync]
[amanda.peterson@cloudsync.com]
[(512) 555-0199]""",
        "display_order": 2
    },
    {
        "title": "Awards & Recognition",
        "description": "Showcase company achievements and industry recognition. Perfect for industry awards, certifications, rankings, and accolades.",
        "category": "Recognition",
        "category_color": "#EF4444",
        "icon": "Award",
        "industry_tags": ["All Industries"],
        "use_cases": ["Industry award wins", "Certification achievements", "Ranking list inclusions"],
        "includes": ["Award significance explanation", "Selection criteria details", "Past achievement highlights", "Future outlook statement"],
        "content": """FOR IMMEDIATE RELEASE

[NexGen Solutions] Named "[Best AI Innovation]" at [2025 Tech Excellence Awards]
Company Recognized for Groundbreaking Natural Language Processing Platform

[BOSTON, MA] – [February 3, 2025] – [NexGen Solutions], a pioneer in artificial intelligence technology, today announced it has been honored with the prestigious "[Best AI Innovation]" award at the [2025 Tech Excellence Awards].

The [Tech Excellence Awards], now in its [15th year], drew entries from over [500] companies across [35] countries.

"Receiving this award is a tremendous honor," said [Dr. Emily Rodriguez], [Chief Technology Officer] at [NexGen Solutions].

About [NexGen Solutions]:
Founded in [2021], [NexGen Solutions] develops enterprise-grade AI platforms. Visit [www.nexgensolutions.com](https://www.nexgensolutions.com).

Media Contact:
[Robert Chen]
[Director of Public Relations]
[robert.chen@nexgensolutions.com]
[(617) 555-0147]""",
        "display_order": 3
    },
    {
        "title": "Event Announcement",
        "description": "Perfect for promoting conferences, product launches, webinars, and exhibitions. Includes 5W format and speaker bios.",
        "category": "Event",
        "category_color": "#8B5CF6",
        "icon": "Megaphone",
        "industry_tags": ["Events", "Conferences", "Webinars"],
        "use_cases": ["Product launch events", "Conferences & summits", "Virtual/in-person events"],
        "includes": ["5W event information format", "Agenda highlights", "Speaker bio templates", "Registration details module"],
        "content": """FOR IMMEDIATE RELEASE

[Future of Work Summit 2025] to Convene Leading Innovators
Three-Day Conference Features Keynotes from [Microsoft], [Salesforce], [LinkedIn]

[NEW YORK, NY] – [February 10, 2025] – [WorkTech Global] announced the [Future of Work Summit 2025], taking place [March 15-17, 2025] at [Javits Center].

Register at [www.futureworksummit.com/register](https://www.futureworksummit.com/register)

Media Contact:
[Lauren Thompson]
[Senior PR Manager]
[lauren@worktechglobal.com]
[(212) 555-0166]""",
        "display_order": 4
    },
    {
        "title": "Partnership Announcement",
        "description": "Announce strategic partnerships, technology alliances, and distribution agreements.",
        "category": "Partnership",
        "category_color": "#3B82F6",
        "icon": "FileText",
        "industry_tags": ["Business", "Strategic"],
        "use_cases": ["Strategic partnerships", "Technology collaborations", "Distribution agreements"],
        "includes": ["Partnership background context", "Dual-company format", "Combined strengths", "Dual-quote format"],
        "content": """FOR IMMEDIATE RELEASE

[Adobe] and [Microsoft] Announce Strategic Partnership
Integration Brings [Creative Cloud] to [Microsoft 365]

[SAN JOSE, CA] & [REDMOND, WA] – [February 14, 2025] – [Adobe] and [Microsoft] announced a partnership to integrate creative tools.

"This represents a watershed moment," said [Shantanu Narayen], [CEO] of [Adobe].

Visit [www.adobe.com](https://www.adobe.com) and [www.microsoft.com](https://www.microsoft.com).

Media Contacts:
[Adobe]: [sarah.williams@adobe.com]
[Microsoft]: [davidchen@microsoft.com]""",
        "display_order": 5
    },
    {
        "title": "Company News",
        "description": "Ideal for organizational changes, leadership appointments, office expansions, and milestone achievements.",
        "category": "Corporate",
        "category_color": "#6366F1",
        "icon": "TrendingUp",
        "industry_tags": ["All Industries"],
        "use_cases": ["Executive appointments", "Organizational restructuring", "Major milestones", "Office expansions"],
        "includes": ["Context and background", "Significance explanation", "Biography template"],
        "content": """FOR IMMEDIATE RELEASE

[Spotify] Appoints Former [Netflix] Executive as [Chief Product Officer]
[Maria Santos] to Lead Product Strategy and Innovation

[STOCKHOLM, SWEDEN] – [February 18, 2025] – [Spotify] announced the appointment of [Maria Santos] as [Chief Product Officer], effective [March 1, 2025].

![Maria Santos, CPO](https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80)
*Maria Santos, Chief Product Officer*

About [Spotify]:
Visit [www.spotify.com](https://www.spotify.com).

Media Contact:
[Thomas Anderson]
[press@spotify.com]
[+46 8 555 0175]""",
        "display_order": 6
    },
    {
        "title": "Product Update",
        "description": "Designed for major product updates and version releases.",
        "category": "Update",
        "category_color": "#10B981",
        "icon": "Rocket",
        "industry_tags": ["Tech", "SaaS", "Software"],
        "use_cases": ["Major app updates", "Platform releases", "System launches"],
        "includes": ["Version numbering", "Feature list", "Technical specs"],
        "content": """FOR IMMEDIATE RELEASE

[Slack] Unveils [Slack 5.0] with Revolutionary AI-Powered Automation
Major Update Introduces [Smart Canvas], [Voice Huddles 2.0]

[SAN FRANCISCO, CA] – [February 22, 2025] – [Slack Technologies] released [Slack 5.0] with [50+] new features.

Visit [slack.com/5.0](https://slack.com/5.0).

Media Contact:
[Rachel Kim]
[rachel.kim@slack.com]
[(415) 555-0201]""",
        "display_order": 7
    },
    {
        "title": "Series B Funding",
        "description": "Tailored for growth-stage startups announcing Series B rounds.",
        "category": "Finance",
        "category_color": "#FBBF24",
        "icon": "TrendingUp",
        "industry_tags": ["Startup", "Growth Stage"],
        "use_cases": ["Series B announcements", "Growth-stage funding", "Expansion capital"],
        "includes": ["Traction metrics", "Market positioning", "Expansion strategy"],
        "content": """FOR IMMEDIATE RELEASE

[FinFlow] Closes [$65M] Series B Led by [Insight Partners]
Fastest-Growing B2B Payment Platform Reaches [$500M] Valuation

[CHICAGO, IL] – [February 25, 2025] – [FinFlow] closed a [$65 million] Series B funding round led by [Insight Partners].

"This validates our vision," said [Marcus Johnson], [CEO] of [FinFlow].

About [FinFlow]:
Visit [www.finflow.com](https://www.finflow.com).

Media Contact:
[Christina Martinez]
[press@finflow.com]
[(312) 555-0183]""",
        "display_order": 8
    }
]


async def import_templates():
    """匯入模板到資料庫"""
    print("🚀 Starting PR Templates import...")
    
    conn = await asyncpg.connect(DATABASE_URL)
    
    try:
        # 檢查是否已有資料
        count = await conn.fetchval("SELECT COUNT(*) FROM pr_templates")
        
        if count > 0:
            print(f"⚠️  Database already has {count} templates")
            response = input("Do you want to clear and reimport? (yes/no): ")
            if response.lower() != 'yes':
                print("❌ Import cancelled")
                return
            
            # 清空資料
            await conn.execute("DELETE FROM pr_templates")
            print("🗑️  Cleared existing templates")
        
        # 匯入資料
        for idx, template in enumerate(TEMPLATES_DATA, 1):
            await conn.execute("""
                INSERT INTO pr_templates (
                    title, description, category, category_color, icon,
                    content, industry_tags, use_cases, includes, display_order
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9::jsonb, $10)
            """,
                template["title"],
                template["description"],
                template["category"],
                template["category_color"],
                template["icon"],
                template["content"],
                json.dumps(template["industry_tags"]),
                json.dumps(template["use_cases"]),
                json.dumps(template["includes"]),
                template["display_order"]
            )
            print(f"✅ Imported: {template['title']}")
        
        print(f"\n🎉 Successfully imported {len(TEMPLATES_DATA)} templates!")
        
        # 顯示統計
        total = await conn.fetchval("SELECT COUNT(*) FROM pr_templates")
        print(f"📊 Total templates in database: {total}")
        
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(import_templates())


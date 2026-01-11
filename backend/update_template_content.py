"""
更新模板內容為完整專業版本
從前端 templateData.ts 中提取的完整內容
"""
import asyncio
import asyncpg
import os
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')

# 完整的專業模板內容（從前端複製）
# 這些是完整的、包含圖片的專業新聞稿
FULL_CONTENT = {
    "Product Launch": """FOR IMMEDIATE RELEASE

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

    "Funding Announcement": """FOR IMMEDIATE RELEASE

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

    "Awards & Recognition": """FOR IMMEDIATE RELEASE

[NexGen Solutions] Named "[Best AI Innovation]" at [2025 Tech Excellence Awards]
Company Recognized for Groundbreaking Natural Language Processing Platform

[BOSTON, MA] – [February 3, 2025] – [NexGen Solutions], a pioneer in artificial intelligence technology, today announced it has been honored with the prestigious "[Best AI Innovation]" award at the [2025 Tech Excellence Awards]. The accolade recognizes [NexGen]'s revolutionary natural language processing platform, which has transformed how enterprises leverage conversational AI.

The [Tech Excellence Awards], now in its [15th year], is one of the technology industry's most respected recognition programs. This year's competition drew entries from over [500] companies across [35] countries, with winners selected by an independent panel of industry experts, academic researchers, and technology analysts.

The judging panel evaluated submissions across multiple dimensions including technical innovation, market impact, scalability, and customer success metrics. [NexGen Solutions] distinguished itself through:

• [Technical Excellence]: The platform's proprietary neural architecture achieves [97%] accuracy in understanding context and intent across [40] languages, surpassing industry benchmarks by [23%].

• [Business Impact]: Over [300] enterprise clients have reported an average [67%] reduction in customer service costs while improving satisfaction scores by [41%].

• [Innovation Leadership]: [NexGen] holds [12] patents in advanced NLP technology and has published [8] peer-reviewed research papers in collaboration with [MIT] and [Stanford].

"Receiving this award is a tremendous honor that reflects our team's relentless pursuit of excellence," said [Dr. Emily Rodriguez], [Chief Technology Officer] at [NexGen Solutions]. "We didn't just want to build another chatbot—we set out to create AI that truly understands human communication in all its complexity. This recognition validates that vision and motivates us to push boundaries even further."

[NexGen Solutions] has experienced remarkable growth since launching its platform in [2022], achieving:
• [850%] revenue growth over three years
• Deployment across Fortune 500 companies including [IBM], [Cisco], and [JPMorgan Chase]
• Recognition in [Gartner]'s Magic Quadrant as a "[Leader]" in Conversational AI
• [$85 million] Series C funding led by [Kleiner Perkins]

The company previously received the "[Rising Star Award]" at the [2023 AI Summit] and was named to [Forbes]' "[Next Billion-Dollar Startups]" list in [2024].

"This award category attracted the most competitive field we've seen in years," noted [James Thompson], Awards Director at [Tech Excellence]. "[NexGen Solutions] stood out not just for technical sophistication, but for demonstrating real-world impact at scale. They're setting new standards for what's possible with AI."

About [Tech Excellence Awards]:
Established in [2010], the [Tech Excellence Awards] recognize outstanding achievement and innovation in technology. Winners are selected through rigorous evaluation by an independent panel of industry experts. Past winners include companies like [Stripe], [Zoom], and [Datadog].

About [NexGen Solutions]:
Founded in [2021], [NexGen Solutions] develops enterprise-grade artificial intelligence platforms specializing in natural language processing and conversational AI. Headquartered in [Boston] with offices in [London] and [Singapore], the company serves over [300] clients across financial services, healthcare, and technology sectors.

Media Contact:
[Robert Chen]
[Director of Public Relations]
[NexGen Solutions]
[robert.chen@nexgensolutions.com]
[(617) 555-0147]"""
}

async def update_templates():
    print("🔄 更新模板為完整專業版本...")
    conn = await asyncpg.connect(DATABASE_URL)
    
    try:
        for title, content in FULL_CONTENT.items():
            result = await conn.execute("""
                UPDATE pr_templates 
                SET content = $1, updated_at = NOW()
                WHERE title = $2
            """, content, title)
            
            chars = len(content)
            print(f"✅ Updated: {title:30s} ({chars:5,d} chars)")
        
        # 顯示更新後的資訊
        templates = await conn.fetch("""
            SELECT title, LENGTH(content) as content_length
            FROM pr_templates
            ORDER BY display_order
        """)
        
        print(f"\n📊 所有模板內容長度：")
        for row in templates:
            print(f"   {row['title']:30s} : {row['content_length']:5,d} chars")
        
        print(f"\n🎉 成功更新 {len(FULL_CONTENT)} 個模板！")
        
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(update_templates())


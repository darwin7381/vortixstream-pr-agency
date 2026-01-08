// 模板假資料
export interface PRTemplate {
  id: number;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  icon: string;
  content: string;
  industryTags: string[];
  downloadCount: number;
  useCases: string[];
  includes: string[];
}

export const MOCK_TEMPLATES: PRTemplate[] = [
  {
    id: 0,
    title: '[TEST] All Format Elements',
    description: 'Test template showing all possible formatting elements in a press release. This will be deleted later.',
    category: 'Launch',
    categoryColor: '#FF7400',
    icon: 'FileText',
    downloadCount: 0,
    industryTags: ['Test'],
    useCases: ['Testing formatting', 'Preview development'],
    includes: ['All format types', 'All heading levels', 'All text styles'],
    content: `FOR IMMEDIATE RELEASE

This is the Main Headline - Should Be Largest and Most Prominent
This is the Subheadline - Should Be Slightly Smaller Than Main Headline

[CITY, STATE] – [DATE] – This is the opening paragraph with [bracketed parameters] that should be highlighted in orange. This paragraph introduces the main news and contains the most important information following the inverted pyramid structure.

![Test Image](https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=630&fit=crop&q=80)
*This is an image caption in italics below the image*

This is a regular paragraph of body text. It provides additional context and details about the announcement. For more information, visit [our website](https://example.com) or check out the [product page](https://example.com/product). Notice how it flows naturally and maintains readability.

Section Header: Key Features

This introduces a section with features or important points below.

🚀 Feature with Emoji Icon
This is a feature description with an emoji at the start. It should be styled prominently.

• Regular bullet point item one
• Regular bullet point item two with [parameter highlighting]
• Regular bullet point item three

Another Section Header: Detailed Information

📈 Growth Metrics
- Subpoint under the emoji section
- Another subpoint with data: [250%] increase
- Third subpoint

"This is a direct quote from someone important," said [John Doe], [CEO] of [Company Name]. "Quotes should be styled differently with italic text and a left border to make them stand out from regular paragraphs."

![Person Headshot](https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80)
*John Doe, CEO of Company Name*

Pricing and Availability:
• [Price Tier 1]: [$99/month]
• [Price Tier 2]: [$299/month]
• [Price Tier 3]: Custom pricing

Key Achievement Highlights:
• [500%] revenue growth
• [10,000+] active users
• [#1] ranking in category

About [Company Name]:
Founded in [2020], [Company Name] is a [location]-based company specializing in [industry]. With [5,000+] customers and [$50M] in funding, the company is transforming [market]. Learn more at [www.company.com](https://www.company.com).

Media Contact:
[Contact Name]
[Title]
[Company Name]
[email@company.com]
[(555) 123-4567]`
  },
  {
    id: 1,
    title: 'Product Launch',
    description: 'Perfect for announcing new products, features, or services. Includes headline formula, inverted pyramid structure, and boilerplate template.',
    category: 'Launch',
    categoryColor: '#FF7400',
    icon: 'Rocket',
    downloadCount: 1234,
    industryTags: ['Tech', 'SaaS', 'Consumer'],
    useCases: [
      'New product launches',
      'Major feature updates',
      'Service announcements'
    ],
    includes: [
      'Attention-grabbing headline formula',
      'Inverted pyramid structure',
      'Quote templates',
      'Company boilerplate',
      'Media contact format'
    ],
    content: `FOR IMMEDIATE RELEASE

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
[(415) 555-0123]`
  },
  {
    id: 2,
    title: 'Funding Announcement',
    description: 'Ideal for seed to Series C funding announcements. Professionally present funding details, investor background, and capital deployment plans.',
    category: 'Finance',
    categoryColor: '#FBBF24',
    icon: 'TrendingUp',
    downloadCount: 856,
    industryTags: ['Startup', 'Tech', 'Fintech'],
    useCases: [
      'Seed to Series C rounds',
      'Pre-IPO funding',
      'Strategic investment'
    ],
    includes: [
      'Funding amount disclosure format',
      'Investor introduction structure',
      'Capital allocation breakdown',
      'Founder quote template',
      'Investor quote template'
    ],
    content: `FOR IMMEDIATE RELEASE

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
[(512) 555-0199]`
  },
  {
    id: 3,
    title: 'Awards & Recognition',
    description: 'Showcase company achievements and industry recognition. Perfect for industry awards, certifications, rankings, and accolades.',
    category: 'Recognition',
    categoryColor: '#EF4444',
    icon: 'Award',
    downloadCount: 432,
    industryTags: ['All Industries'],
    useCases: [
      'Industry award wins',
      'Certification achievements',
      'Ranking list inclusions'
    ],
    includes: [
      'Award significance explanation',
      'Selection criteria details',
      'Past achievement highlights',
      'Future outlook statement'
    ],
    content: `FOR IMMEDIATE RELEASE

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
[(617) 555-0147]`
  },
  {
    id: 4,
    title: 'Event Announcement',
    description: 'Perfect for promoting conferences, product launches, webinars, and exhibitions. Includes 5W format and speaker bios.',
    category: 'Event',
    categoryColor: '#8B5CF6',
    icon: 'Megaphone',
    downloadCount: 654,
    industryTags: ['Events', 'Conferences', 'Webinars'],
    useCases: [
      'Product launch events',
      'Conferences & summits',
      'Virtual/in-person events'
    ],
    includes: [
      '5W event information format',
      'Agenda highlights',
      'Speaker bio templates',
      'Registration details module'
    ],
    content: `FOR IMMEDIATE RELEASE

[Future of Work Summit 2025] to Convene Leading Innovators and Industry Experts
Three-Day Global Conference Features Keynotes from [Microsoft], [Salesforce], and [LinkedIn] Leaders

[NEW YORK, NY] – [February 10, 2025] – [WorkTech Global] today announced the [Future of Work Summit 2025], a premier three-day conference bringing together [2,500+] HR leaders, technologists, and business executives to explore the transformation of workplace dynamics. The hybrid event will take place [March 15-17, 2025], at the [Javits Center] in [New York City], with virtual access available globally.

Themed "[Building Tomorrow's Workplace Today]," the summit will address critical challenges facing modern organizations, including AI integration, remote work optimization, employee wellness, and skills development in an era of rapid technological change.

Event Details:
• When: [March 15-17, 2025]
• Where: [Javits Center, New York City] + Virtual Platform
• Format: Hybrid (in-person and online)
• Audience: HR executives, tech leaders, business strategists
• Registration: [www.futureworksummit.com](https://www.futureworksummit.com) (Early bird pricing until [Feb 28])

Featured Speakers and Sessions:

DAY 1 - [March 15]: AI and Automation
[9:00 AM] - Opening Keynote
[Satya Nadella], CEO, [Microsoft]
"[AI-First Organizations: Leading with Intelligence]"

[11:30 AM] - Panel Discussion
Moderator: [Susan Wojcicki], Former CEO, [YouTube]
Panelists: Leaders from [Google], [Amazon], [Meta]
"[Ethics and AI: Building Responsible Workplace Technology]"

DAY 2 - [March 16]: Remote Work Evolution
[10:00 AM] - Keynote
[Marc Benioff], CEO, [Salesforce]
"[The Hybrid Workplace: Lessons from $10B Organizations]"

[2:00 PM] - Workshop
[Dr. Gloria Mark], [UC Irvine] Professor
"[Combating Digital Fatigue: Science-Backed Strategies]"

DAY 3 - [March 17]: Skills and Development
[9:30 AM] - Fireside Chat
[Ryan Roslansky], CEO, [LinkedIn]
"[Upskilling at Scale: Preparing Workforces for 2030]"

[1:00 PM] - Closing Panel
"[The Future is Now: Implementation Roadmaps]"

Summit Highlights:

• [80+] Expert Sessions covering HR tech, leadership, culture, and innovation
• Innovation Showcase featuring [100+] leading workplace technology vendors
• Networking Lounges designed for meaningful professional connections
• Certification Workshops offering [SHRM] and [HRCI] credits
• Virtual Reality Lab demonstrating next-generation collaboration tools

"The workplace has undergone more transformation in the past five years than the previous fifty," said [Rebecca Martinez], [CEO] of [WorkTech Global]. "This summit isn't about predicting the future—it's about equipping leaders with practical strategies they can implement immediately to thrive in this new era."

Registration and Pricing:

Early Bird (until [Feb 28]): [$899] (in-person) / [$399] (virtual)
Standard Registration: [$1,299] (in-person) / [$599] (virtual)
Group Rates: [20%] discount for teams of [5+]

Register now at [www.futureworksummit.com/register](https://www.futureworksummit.com/register)

All registrants receive:
• [12-month] access to session recordings
• Exclusive Future of Work 2025 Research Report ([$299 value])
• Networking app with AI-powered matchmaking
• Digital certificate of attendance

About [WorkTech Global]:
[WorkTech Global] is the world's leading producer of workplace innovation conferences and digital content. With events in [15] countries and a community of [500,000+] professionals, [WorkTech Global] is shaping the conversation about the future of work. Visit [www.worktechglobal.com](https://www.worktechglobal.com).

Media Contact:
[Lauren Thompson]
[Senior PR Manager]
[WorkTech Global]
[lauren@worktechglobal.com]
[(212) 555-0166]
Media passes available upon request`
  },
  {
    id: 5,
    title: 'Partnership Announcement',
    description: 'Announce strategic partnerships, technology alliances, and distribution agreements. Includes dual-company format and benefit statements.',
    category: 'Partnership',
    categoryColor: '#3B82F6',
    icon: 'FileText',
    downloadCount: 523,
    industryTags: ['Business', 'Strategic'],
    useCases: [
      'Strategic partnerships',
      'Technology collaborations',
      'Distribution agreements'
    ],
    includes: [
      'Partnership background context',
      'Collaboration details structure',
      'Combined strengths narrative',
      'Expected benefits statement',
      'Dual-quote format'
    ],
    content: `FOR IMMEDIATE RELEASE

[Adobe] and [Microsoft] Announce Strategic Partnership to Transform Creative Workflows
Integration Brings [Adobe Creative Cloud] Tools Directly into [Microsoft 365] Suite

[SAN JOSE, CA] & [REDMOND, WA] – [February 14, 2025] – [Adobe] (Nasdaq: ADBE) and [Microsoft Corp.] (Nasdaq: MSFT) today announced a comprehensive strategic partnership to seamlessly integrate [Adobe]'s industry-leading creative tools with [Microsoft]'s productivity platforms. The collaboration will enable [400+ million] [Microsoft 365] users to access [Adobe Creative Cloud] capabilities directly within their workflow, fundamentally transforming how businesses create and share content.

The multi-year partnership combines Adobe's creative excellence with Microsoft's productivity ecosystem, addressing the growing need for integrated content creation tools in enterprise environments.

Partnership Highlights:

Native Integration in [Microsoft 365]
[Adobe Photoshop], [Illustrator], and [Premiere Pro] will be accessible directly within [Microsoft Teams], [SharePoint], and [OneDrive], eliminating the need to switch between applications.

AI-Powered Collaboration Features
Joint development of AI capabilities leveraging [Adobe Sensei] and [Microsoft Azure AI] will enable intelligent asset tagging, automated design suggestions, and real-time collaborative editing.

Enterprise-Grade Security and Compliance
Combined solution will meet the strictest enterprise security requirements, with centralized administration, single sign-on, and compliance certifications including [SOC 2], [ISO 27001], and [GDPR].

Special Licensing for [Microsoft 365 E5] Customers
Enterprise customers with [Microsoft 365 E5] licenses will receive preferred pricing on [Adobe Creative Cloud] for teams, with potential savings of up to [30%].

Customer Benefits:

• Streamlined Workflows: Reduce tool-switching and increase productivity by up to [45%]
• Enhanced Collaboration: Real-time co-editing across [Adobe] and [Microsoft] platforms
• Cost Efficiency: Bundled licensing options providing [20-30%] savings for enterprises
• Unified Administration: Single dashboard for IT teams to manage users and licenses

"This partnership represents a watershed moment for creative professionals and businesses alike," said [Shantanu Narayen], [CEO] of [Adobe]. "By bringing [Adobe]'s creative tools into the [Microsoft] ecosystem where millions of people already work, we're removing friction and unleashing creativity at unprecedented scale. This is about meeting users where they are and empowering them with world-class creative capabilities."

[Satya Nadella], [CEO] of [Microsoft], added: "Content creation has become central to every business function, from marketing to sales to internal communications. Our partnership with [Adobe] creates a unified platform where creativity and productivity intersect, enabling our customers to do their best work without boundaries."

The integration will roll out in phases:

• [Q2 2025]: [Adobe Express] integration in [Microsoft Teams]
• [Q3 2025]: [Photoshop] and [Illustrator] plugins for [Microsoft 365]
• [Q4 2025]: Full [Creative Cloud] suite accessibility
• [2026]: AI-powered features and advanced collaboration tools

Early beta testing with select enterprise customers including [Coca-Cola], [Nike], and [McKinsey & Company] has demonstrated remarkable results:
• [52%] reduction in content creation time
• [68%] increase in cross-team collaboration
• [94%] user satisfaction rating

About [Adobe]:
[Adobe] is changing the world through digital experiences. For more information, visit [www.adobe.com](https://www.adobe.com).

About [Microsoft]:
[Microsoft] (Nasdaq "MSFT" @microsoft) enables digital transformation for the era of an intelligent cloud and an intelligent edge. Its mission is to empower every person and organization on the planet to achieve more. Visit [www.microsoft.com](https://www.microsoft.com).

Media Contacts:

[Adobe]:
[Sarah Williams]
[Senior Director, Corporate Communications]
[sarah.williams@adobe.com]
[(408) 555-0188]

[Microsoft]:
[David Chen]
[Director, Product Communications]
[davidchen@microsoft.com]
[(425) 555-0192]`
  },
  {
    id: 6,
    title: 'Company News',
    description: 'Ideal for organizational changes, leadership appointments, office expansions, and milestone achievements.',
    category: 'Corporate',
    categoryColor: '#6366F1',
    icon: 'TrendingUp',
    downloadCount: 387,
    industryTags: ['All Industries'],
    useCases: [
      'Executive appointments',
      'Organizational restructuring',
      'Major milestones',
      'Office expansions'
    ],
    includes: [
      'Context and background',
      'Significance explanation',
      'Future impact analysis',
      'Biography template (if applicable)'
    ],
    content: `FOR IMMEDIATE RELEASE

[Spotify] Appoints Former [Netflix] Executive as [Chief Product Officer]
Industry Veteran [Maria Santos] to Lead Product Strategy and Innovation

[STOCKHOLM, SWEDEN] – [February 18, 2025] – [Spotify] (NYSE: SPOT), the world's most popular audio streaming subscription service, today announced the appointment of [Maria Santos] as [Chief Product Officer], effective [March 1, 2025]. [Santos] joins [Spotify] from [Netflix], where she served as [VP of Product Innovation] and led the development of the streaming giant's personalization algorithms and recommendation systems.

In her new role, [Santos] will oversee [Spotify]'s global product strategy, user experience design, and innovation initiatives. She will report directly to CEO [Daniel Ek] and join the company's executive leadership team.

[Santos] brings over [20 years] of product leadership experience in consumer technology, having previously held senior positions at [Netflix], [Amazon], and [Google]. At [Netflix], she spearheaded the development of features used by over [230 million] subscribers daily, including the "[Top 10]" feature and enhanced parental controls. Her work contributed to a [37%] increase in user engagement and helped reduce churn by [18%].

Key Achievements in Previous Roles:

• Led product teams of [200+] professionals across [three] continents
• Drove development of AI-powered recommendation systems serving [500M+] users
• Successfully launched [15+] major product initiatives generating [$800M+] in revenue
• Holds [8] patents in machine learning and personalization technology
• Named to [Fortune]'s "[40 Under 40]" list in [2023]

"[Maria] is a visionary product leader with an exceptional track record of creating experiences that users love," said [Daniel Ek], [CEO] and Co-Founder of [Spotify]. "Her deep expertise in personalization and recommendation systems, combined with her proven ability to scale products globally, makes her the perfect fit to lead our product organization. As we continue expanding beyond music into podcasts, audiobooks, and new audio formats, [Maria]'s leadership will be instrumental in shaping the future of [Spotify]."

![Maria Santos, CPO](https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80)
*Maria Santos, Chief Product Officer of Spotify*

[Santos] commented: "[Spotify] has fundamentally changed how the world experiences audio, and I'm thrilled to join at such an exciting time. The company's commitment to empowering creators while delivering unmatched value to listeners aligns perfectly with my passion for building products that make a real difference in people's lives. I look forward to working with the incredibly talented [Spotify] team to push the boundaries of what's possible in audio streaming."

The appointment comes as [Spotify] continues its expansion into new markets and content categories. The company recently surpassed [550 million] monthly active users and [220 million] premium subscribers, cementing its position as the global leader in audio streaming.

[Santos] holds a Master's degree in Computer Science from [MIT] and a Bachelor's degree in Engineering from [Stanford University]. She is also an active angel investor in women-led technology startups and serves on the advisory board of [Girls Who Code].

About [Spotify]:
[Spotify] is the world's most popular audio streaming subscription service with [550m] users, including [220m] subscribers, across [184] markets. [Spotify] has transformed the way people access and enjoy music and podcasts, and today is the largest driver of revenue to the music business. Learn more at [www.spotify.com](https://www.spotify.com).

Media Contact:
[Thomas Anderson]
[VP, Corporate Communications]
[Spotify]
[press@spotify.com]
[+46 8 555 0175]`
  },
  {
    id: 7,
    title: 'Product Update',
    description: 'Designed for major product updates and version releases. Emphasizes new features, performance improvements, and user experience enhancements.',
    category: 'Update',
    categoryColor: '#10B981',
    icon: 'Rocket',
    downloadCount: 892,
    industryTags: ['Tech', 'SaaS', 'Software'],
    useCases: [
      'Major app updates',
      'Platform feature releases',
      'System version launches'
    ],
    includes: [
      'Version numbering format',
      'Feature list structure',
      'Technical specifications',
      'Upgrade guide links'
    ],
    content: `FOR IMMEDIATE RELEASE

Slack Unveils Slack 5.0 with Revolutionary AI-Powered Workflow Automation
Major Update Introduces Smart Canvas, Voice Huddles 2.0, and Enterprise-Grade Security Features

SAN FRANCISCO, CA – February 22, 2025 – Slack Technologies, a Salesforce company, today released Slack 5.0, the most significant platform update since its inception. The release introduces over 50 new features and 200+ enhancements, with a focus on AI-powered automation, asynchronous collaboration, and enterprise security. Slack 5.0 is now available to all 20+ million daily active users worldwide.

This update addresses the evolving needs of hybrid and remote workforces, combining artificial intelligence with intuitive design to reduce information overload and streamline team coordination.

Headline Features:

🚀 Smart Canvas with AI Assist
Slack's new infinite canvas workspace allows teams to combine messages, files, video clips, and live data in a unified visual space. AI Assist automatically organizes content, suggests relevant documents, and generates meeting summaries.

• Performance: 60% faster project planning and 45% reduction in meeting time
• AI Capabilities: Auto-tagging, intelligent search, and context-aware suggestions
• Use Cases: Project management, brainstorming, async standup, knowledge bases

💡 Voice Huddles 2.0
Enhanced audio spaces now support up to 500 participants with studio-quality sound, real-time transcription in 40 languages, and AI-generated action items.

• Audio Quality: Crystal-clear HD audio with noise cancellation and echo removal
• Accessibility: Live captions, transcripts, and translation for global teams
• Integration: Seamless recording with automatic sharing to relevant channels

🎨 Workflow Automation Studio
No-code automation builder powered by AI enables teams to create sophisticated workflows without technical expertise. Pre-built templates cover 100+ common business processes.

• Time Savings: Users report 12+ hours saved per week on repetitive tasks
• Templates: Onboarding, approval chains, customer support routing, and more
• Integrations: Connect 2,500+ apps including Salesforce, Google Workspace, Microsoft 365

🔒 Enterprise Security Suite
Advanced security features including end-to-end encryption for DMs, data loss prevention, and SOC 2 Type II compliance meet the strictest enterprise requirements.

Technical Enhancements:
• 3x faster message loading with new compression algorithms
• Cross-device sync within 100ms using edge computing architecture
• Enhanced offline mode with full read/write capabilities
• API rate limits increased by 200% for enterprise developers

"[Slack 5.0] represents our vision for the future of work—where AI handles the busywork so humans can focus on meaningful collaboration," said [Denise Dresser], [CEO] of [Slack]. "We've listened to feedback from millions of users and built features that address real pain points: information overload, meeting fatigue, and the challenge of staying aligned across time zones."

Beta Program Results:
Over [50,000] users participated in the closed beta program, providing valuable feedback:

• [94%] satisfaction rating (up from [87%] on [Slack 4.0])
• [47%] reduction in time spent searching for information
• [38%] decrease in scheduled meetings
• [73%] of users called [Smart Canvas] "game-changing"

"[Slack 5.0] has transformed how our [5,000]-person team collaborates," said [Jennifer Park], [CTO] of [Shopify]. "The AI features feel like having a smart assistant who knows exactly what we need. We've cut our meeting time in half while improving cross-team alignment."

Availability and Pricing:

[Slack 5.0] is rolling out globally starting today:
• [Free Plan]: Access to core features with AI Assist ([10] queries/month)
• [Pro Plan]: [$7.25]/user/month - Full AI Assist and Voice Huddles 2.0
• [Business+ Plan]: [$12.50]/user/month - Workflow Automation Studio included
• [Enterprise Grid]: Custom pricing - Complete Enterprise Security Suite

Existing subscribers receive automatic upgrades at no additional cost. New customers can try [Slack 5.0] free for [30 days]. Learn more at [slack.com/5.0](https://slack.com/5.0).

Resources:
• Full feature documentation: [slack.com/5.0/features](https://slack.com/5.0/features)
• Video demos: [youtube.com/slack](https://youtube.com/slack)
• Migration guide: [slack.com/5.0/upgrade](https://slack.com/5.0/upgrade)

About [Slack]:
[Slack] is a channel-based messaging platform that brings all your communication together in one place. Used by millions of people worldwide, [Slack] is your digital HQ— a place where work flows between your people, systems, partners, and customers. Visit [www.slack.com](https://www.slack.com).

Media Contact:
[Rachel Kim]
[Senior Director, Product Communications]
[Slack Technologies]
[rachel.kim@slack.com]
[(415) 555-0201]`
  },
  {
    id: 8,
    title: 'Series B Funding',
    description: 'Tailored for growth-stage startups announcing Series B rounds. Emphasizes traction metrics, market validation, and expansion strategy.',
    category: 'Finance',
    categoryColor: '#FBBF24',
    icon: 'TrendingUp',
    downloadCount: 745,
    industryTags: ['Startup', 'Growth Stage'],
    useCases: [
      'Series B announcements',
      'Growth-stage funding',
      'Expansion capital'
    ],
    includes: [
      'Traction metrics presentation',
      'Market positioning narrative',
      'Expansion strategy outline',
      'Team credentials showcase'
    ],
    content: `FOR IMMEDIATE RELEASE

[FinFlow] Closes [$65M] Series B Led by [Insight Partners]
Fastest-Growing B2B Payment Platform Reaches [$500M] Valuation, Plans International Expansion

[CHICAGO, IL] – [February 25, 2025] – [FinFlow], the leading B2B payment automation platform, today announced it has closed a [$65 million] Series B funding round led by [Insight Partners], with participation from existing investors [Accel] and [Index Ventures]. The round values [FinFlow] at [$500 million] post-money, representing a [3.5x] increase since the company's [$25 million] Series A just [18 months] ago.

The capital will fuel [FinFlow]'s ambitious growth plans, including geographic expansion into [Europe] and [Asia], product innovation in AI-powered payment intelligence, and strategic team growth across engineering, sales, and customer success.

Exceptional Growth Metrics:

📈 Revenue Momentum
• Annual Recurring Revenue (ARR): [$45M] ([275%] YoY growth)
• Monthly Revenue: [$4.2M] (up [320%] from previous year)
• Gross Margin: [82%] and improving
• Magic Number (sales efficiency): [1.8x]

👥 Customer & User Growth
• Total Business Customers: [4,200] (up from [800] in [2023])
• Transaction Volume: [$12B] processed annually
• Average Customer Size: [$120K] ACV
• Net Revenue Retention: [145%]
• Customer Satisfaction (NPS): [71]

🌏 Market Position
• Markets Served: [United States], [Canada]
• Enterprise Clients: [180+] including [Shopify], [Squarespace], [Stripe]
• Market Share: [#2] in mid-market B2B payments (up from [#7] in [2023])
• Category Leadership: Recognized in [G2]'s Grid as "[Leader]" for [8] consecutive quarters

Capital Deployment Strategy:

Product Development ([40%] - [$26M])
[FinFlow] will invest heavily in AI and machine learning capabilities to deliver predictive cash flow analytics, fraud prevention, and intelligent payment routing. The company will also expand platform integrations to support [200+] accounting systems and ERPs.

International Expansion ([35%] - [$22.75M])
The company will establish headquarters in [London] and [Singapore] by [Q4 2025], targeting the [$450 billion] European and Asian B2B payment markets. This includes hiring regional teams, achieving local compliance certifications, and building partnerships with local banks.

Team & Talent ([25%] - [$16.25M])
[FinFlow] will grow from [180] to [400] employees over the next [18 months], with focused hiring in:
• Engineering ([80] positions): AI/ML engineers, platform developers, security specialists
• Go-to-Market ([100] positions): Sales, account management, customer success
• Operations ([40] positions): Finance, legal, compliance for international markets

"This funding validates our vision that B2B payments are broken and that businesses deserve better," said [Marcus Johnson], Co-Founder and [CEO] of [FinFlow]. "We've achieved product-market fit with impressive unit economics, and now we're positioned to become the global standard for B2B payment automation. Our customers are growing with us—many started processing [$1M] annually and now process over [$50M] through our platform."

[Lonne Jaffe], Managing Director at [Insight Partners], commented: "[FinFlow] has cracked the code on B2B payments—a notoriously complex market. The team's execution velocity, customer love, and capital efficiency remind us of the best companies we've backed like [Shopify] and [Twitter]. We're thrilled to partner with [Marcus] and the team as they build a generational company."

The funding follows a breakthrough year for [FinFlow]:

• Achieved "[Rule of 40]" status (growth rate + profit margin = [115%])
• Launched [FinFlow AI], now used by [68%] of customers
• Expanded enterprise tier, closing [47] six-figure deals in [2024]
• Received [SOC 2 Type II] and [PCI DSS Level 1] certifications
• Named to [Forbes Cloud 100] and [Forbes Fintech 50] lists

Team Pedigree:
[FinFlow]'s founding team includes former executives from [PayPal], [Square], and [Stripe], with deep expertise in payments infrastructure and financial technology. The leadership team holds degrees from [MIT], [Stanford], and [Wharton], and has collectively built products serving over [500 million] users.

Market Opportunity:
According to [McKinsey], the global B2B payments market is projected to reach [$2.1 trillion] by [2028], growing at [9.3%] CAGR. [FinFlow] is positioned to capture significant market share through its differentiated AI-powered approach and superior user experience.

About [FinFlow]:
Founded in [2021], [FinFlow] automates B2B payment workflows for growing businesses, eliminating manual processes, reducing payment errors, and providing real-time cash flow visibility. Trusted by over [4,200] companies processing [$12B] annually, [FinFlow] is transforming how businesses manage their finances. Visit [www.finflow.com](https://www.finflow.com).

About [Insight Partners]:
[Insight Partners] is a global software investor with over [$90B] in assets under management. The firm has invested in more than [700] companies worldwide, including [Shopify], [Twitter], and [Udemy]. Learn more at [www.insightpartners.com](https://www.insightpartners.com).

Media Contact:
[Christina Martinez]
[Head of Communications]
[FinFlow]
[press@finflow.com]
[(312) 555-0183]`
  }
];

// Category options
export const TEMPLATE_CATEGORIES = [
  { value: 'all', label: 'All Templates' },
  { value: 'Launch', label: 'Product Launch' },
  { value: 'Finance', label: 'Funding & Finance' },
  { value: 'Recognition', label: 'Awards & Recognition' },
  { value: 'Event', label: 'Event Announcements' },
  { value: 'Partnership', label: 'Partnerships' },
  { value: 'Corporate', label: 'Corporate News' },
  { value: 'Update', label: 'Product Updates' }
];

// Industry tags
export const INDUSTRY_TAGS = [
  'All',
  'Tech',
  'Startup',
  'SaaS',
  'Consumer',
  'Fintech',
  'Events',
  'Business',
  'Software',
  'Growth Stage',
  'All Industries'
];

// Sort options
export const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'latest', label: 'Latest Added' },
  { value: 'name', label: 'Name (A-Z)' }
];


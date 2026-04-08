/**
 * AI PR Packages data
 * Shape mirrors PRPackageCategory / PRPackage from api/client.ts
 */

export const aiPackagesData = [
  {
    id: "ai-essential",
    name: "AI Launch Essential",
    tier: "Starter",
    price: "$2,500",
    price_note: "per launch",
    description:
      "Perfect for pre-seed and seed-stage AI founders who need credible media coverage for their first public launch. One focused campaign, maximum impact.",
    is_featured: false,
    features: [
      "Targeted outreach to 15–20 AI & tech journalists",
      "Custom press release written by AI-fluent writers",
      "3 guaranteed placements across tech media",
      "Founder narrative coaching session (1 hour)",
      "Coverage report and analytics dashboard",
      "14-day campaign window",
    ],
    cta_text: "Get Started",
    cta_url: "#contact-section",
  },
  {
    id: "ai-growth",
    name: "AI Growth",
    tier: "Growth",
    price: "$6,500",
    price_note: "per month",
    description:
      "For Series A-stage companies building sustained media presence. Ongoing coverage strategy, journalist relationship building, and month-over-month coverage growth.",
    is_featured: true,
    features: [
      "Full media campaign with 30+ journalist outreach",
      "5–8 guaranteed placements per month",
      "Tier-1 outlet targeting (TechCrunch, VentureBeat, Wired)",
      "Monthly founder op-ed ghostwriting",
      "Investor comms advisory (1 session/month)",
      "Lyro portal access — live coverage dashboard",
      "Bi-weekly strategy calls with dedicated account lead",
      "Hacker News and community amplification",
    ],
    cta_text: "Most Popular",
    cta_url: "#contact-section",
  },
  {
    id: "ai-authority",
    name: "AI Founder Authority",
    tier: "Authority",
    price: "$14,000",
    price_note: "per month",
    description:
      "The full-stack PR program for AI companies raising Series B and beyond. Sustained thought leadership, major announcement management, and executive positioning across global AI media.",
    is_featured: false,
    features: [
      "Unlimited journalist outreach and campaign management",
      "10–15+ placements per month across AI and mainstream media",
      "Exclusive journalist relationship management",
      "Executive media training program (quarterly)",
      "Fundraising announcement strategy and placement",
      "International AI media coverage (EU, Asia-Pacific)",
      "Thought leadership program: 2 op-eds/month",
      "Weekly strategy calls + dedicated Slack channel",
      "Lyro portal with custom analytics and board-ready reports",
      "Speaking opportunity identification and pitching",
    ],
    cta_text: "Let's Talk",
    cta_url: "#contact-section",
  },
];

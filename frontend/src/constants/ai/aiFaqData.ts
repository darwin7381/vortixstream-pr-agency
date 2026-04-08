/**
 * AI FAQ data
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export const aiFaqs: FAQItem[] = [
  {
    question: "What kind of teams is Vortix for?",
    answer:
      "Vortix works with startups, builders, and companies launching AI products, tools, and emerging technologies. We support both early-stage teams and larger organizations.",
  },
  {
    question: "What do you provide in your service?",
    answer:
      "We focus primarily on distribution — getting your story in front of relevant media with optional support for narrative and positioning.",
  },
  {
    question: "Are placements guaranteed?",
    answer:
      "We provide structured distribution across curated media networks. Final placements remain subject to editorial approval.",
  },
  {
    question: "How long does a campaign take?",
    answer:
      "Most campaigns are prepared and distributed within a few days, depending on scope and requirements.",
  },
  {
    question: "What is Vortix Platform?",
    answer:
      "Vortix Platform is our upcoming workspace for planning, distributing, and tracking PR campaigns, with AI-assisted insights through Lyro.",
  },
];

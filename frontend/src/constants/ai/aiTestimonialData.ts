/**
 * AI Testimonials data
 * Shape mirrors the Testimonial type from api/client.ts
 */

export interface AITestimonial {
  id: number;
  quote: string;
  author_name: string;
  author_title: string;
  author_company: string;
  author_avatar_url: string;
}

export const aiTestimonials: AITestimonial[] = [
  {
    id: 1,
    quote:
      "VortixPR got us into TechCrunch, VentureBeat, and The Verge on the same morning. The coordinated embargo management was flawless — we went from zero coverage to front page in 24 hours. Every AI founder needs this team.",
    author_name: "Priya Nair",
    author_title: "Co-founder & CEO",
    author_company: "Synthara AI",
    author_avatar_url:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    quote:
      "We were about to announce our Series A with a standard press release. VortixPR rewrote our entire narrative around the problem we're solving, not just the funding amount. The response from investors and journalists was night and day.",
    author_name: "Marcus Webb",
    author_title: "Founder",
    author_company: "Contextual Labs",
    author_avatar_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    quote:
      "Technical journalists actually understood what we were building. The media training sessions made a massive difference — I went from fumbling through explanations of our RAG architecture to giving clean, quotable answers in every interview.",
    author_name: "Akira Tanaka",
    author_title: "CTO & Co-founder",
    author_company: "NeuroPipe",
    author_avatar_url:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 4,
    quote:
      "We're a stealth startup and were terrified of leaking before we were ready. VortixPR managed our entire pre-launch whisper campaign — seeding the right signals in the right circles without a single leak. When we announced, the coverage was already primed.",
    author_name: "Leila Roshan",
    author_title: "Founder",
    author_company: "Inference Engine (stealth)",
    author_avatar_url:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 5,
    quote:
      "Demo day coverage used to be an afterthought. VortixPR treated it like a major product launch — pre-event briefings with journalists, a coordinated social moment, and a round-up article live by 9 AM. We got three inbound VC meetings directly from the coverage.",
    author_name: "James Okafor",
    author_title: "CEO",
    author_company: "Vellum AI",
    author_avatar_url:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 6,
    quote:
      "The op-ed they placed for me in MIT Technology Review has driven more credibility than any product launch. I get cited in other journalists' AI coverage now. The thought leadership track is genuinely worth it for any technical founder.",
    author_name: "Sofia Petrov",
    author_title: "Chief AI Officer",
    author_company: "Meridian Intelligence",
    author_avatar_url:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
  },
];

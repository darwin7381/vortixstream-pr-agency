/**
 * AI TrustedBy / clients section data
 * Logos are hosted on our R2 CDN — sourced from Wikipedia article images via
 * scripts/upload_ai_logos.py. Replace with real client logos as they sign on.
 */

export interface AIClientLogo {
  id: number;
  name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
}

export const aiTrustedByClients: AIClientLogo[] = [
  {
    id: 1,
    name: "OpenAI",
    logo_url: "https://img.vortixpr.com/ai-clients/1a826da9-881f-4101-b2b5-295b52ada08f.png",
    website_url: "https://openai.com",
    display_order: 1,
    is_active: true,
  },
  {
    id: 2,
    name: "Anthropic",
    logo_url: "https://img.vortixpr.com/ai-clients/072a5d56-dae1-40e4-8a7e-77d6f04d2496.png",
    website_url: "https://anthropic.com",
    display_order: 2,
    is_active: true,
  },
  {
    id: 3,
    name: "Hugging Face",
    logo_url: "https://img.vortixpr.com/ai-clients/1d08bc9d-3fa7-4ce0-b5ef-44bca0e3f9df.png",
    website_url: "https://huggingface.co",
    display_order: 3,
    is_active: true,
  },
  {
    id: 4,
    name: "Mistral AI",
    logo_url: "https://img.vortixpr.com/ai-clients/ff5a6e7d-d3fc-41ce-9b63-20c3092aad30.png",
    website_url: "https://mistral.ai",
    display_order: 4,
    is_active: true,
  },
  {
    id: 5,
    name: "Cohere",
    logo_url: "https://img.vortixpr.com/ai-clients/59d369fc-8300-4cc2-b305-9279c5a8fdc3.png",
    website_url: "https://cohere.com",
    display_order: 5,
    is_active: true,
  },
  {
    id: 6,
    name: "Stability AI",
    logo_url: "https://img.vortixpr.com/ai-clients/e46b312b-090c-49b4-811d-a1162ecee34e.png",
    website_url: "https://stability.ai",
    display_order: 6,
    is_active: true,
  },
  {
    id: 7,
    name: "Runway",
    logo_url: "https://img.vortixpr.com/ai-clients/3880d593-6fe6-4a38-a24d-06888c5786b4.png",
    website_url: "https://runwayml.com",
    display_order: 7,
    is_active: true,
  },
  {
    id: 8,
    name: "Perplexity",
    logo_url: "https://img.vortixpr.com/ai-clients/1496aaf6-fc33-4dbb-ad99-f59fe6163925.png",
    website_url: "https://perplexity.ai",
    display_order: 8,
    is_active: true,
  },
  {
    id: 9,
    name: "Replicate",
    logo_url: "https://img.vortixpr.com/ai-clients/f7a93469-8b94-474e-803c-b34863afb366.png",
    website_url: "https://replicate.com",
    display_order: 9,
    is_active: true,
  },
  {
    id: 10,
    name: "ElevenLabs",
    logo_url: "https://img.vortixpr.com/ai-clients/b4661c78-7c6b-44fe-89c7-eef92624e40d.png",
    website_url: "https://elevenlabs.io",
    display_order: 10,
    is_active: true,
  },
  {
    id: 11,
    name: "Groq",
    logo_url: "https://img.vortixpr.com/ai-clients/80357fa6-319d-4eb4-9547-066d2247a0ab.png",
    website_url: "https://groq.com",
    display_order: 11,
    is_active: true,
  },
  {
    id: 12,
    name: "Scale AI",
    logo_url: "https://img.vortixpr.com/ai-clients/87bd7681-2bde-4335-85c2-b6d5ce7d636c.png",
    website_url: "https://scale.com",
    display_order: 12,
    is_active: true,
  },
  {
    id: 13,
    name: "Together AI",
    logo_url: "https://img.vortixpr.com/ai-clients/5eb5f952-0b89-44aa-9663-58c647db89c4.png",
    website_url: "https://together.ai",
    display_order: 13,
    is_active: true,
  },
  {
    id: 14,
    name: "Weights & Biases",
    logo_url: "https://img.vortixpr.com/ai-clients/12d24b3a-107f-48df-a724-585ec3bbd6eb.png",
    website_url: "https://wandb.ai",
    display_order: 14,
    is_active: true,
  },
  {
    id: 15,
    name: "LangChain",
    logo_url: "https://img.vortixpr.com/ai-clients/81ce81c1-d066-4d96-b4d0-86f254925c56.png",
    website_url: "https://langchain.com",
    display_order: 15,
    is_active: true,
  },
];

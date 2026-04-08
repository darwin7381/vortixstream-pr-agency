/**
 * AI TrustedBy / clients section data
 * Shape mirrors the /public/content/clients API response
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
    name: "Anthropic",
    logo_url: "https://logo.clearbit.com/anthropic.com",
    website_url: "https://anthropic.com",
    display_order: 1,
    is_active: true,
  },
  {
    id: 2,
    name: "Hugging Face",
    logo_url: "https://logo.clearbit.com/huggingface.co",
    website_url: "https://huggingface.co",
    display_order: 2,
    is_active: true,
  },
  {
    id: 3,
    name: "Replicate",
    logo_url: "https://logo.clearbit.com/replicate.com",
    website_url: "https://replicate.com",
    display_order: 3,
    is_active: true,
  },
  {
    id: 4,
    name: "Mistral AI",
    logo_url: "https://logo.clearbit.com/mistral.ai",
    website_url: "https://mistral.ai",
    display_order: 4,
    is_active: true,
  },
  {
    id: 5,
    name: "Perplexity",
    logo_url: "https://logo.clearbit.com/perplexity.ai",
    website_url: "https://perplexity.ai",
    display_order: 5,
    is_active: true,
  },
  {
    id: 6,
    name: "ElevenLabs",
    logo_url: "https://logo.clearbit.com/elevenlabs.io",
    website_url: "https://elevenlabs.io",
    display_order: 6,
    is_active: true,
  },
  {
    id: 7,
    name: "Cohere",
    logo_url: "https://logo.clearbit.com/cohere.com",
    website_url: "https://cohere.com",
    display_order: 7,
    is_active: true,
  },
  {
    id: 8,
    name: "Together AI",
    logo_url: "https://logo.clearbit.com/together.ai",
    website_url: "https://together.ai",
    display_order: 8,
    is_active: true,
  },
  {
    id: 9,
    name: "Groq",
    logo_url: "https://logo.clearbit.com/groq.com",
    website_url: "https://groq.com",
    display_order: 9,
    is_active: true,
  },
  {
    id: 10,
    name: "Scale AI",
    logo_url: "https://logo.clearbit.com/scale.com",
    website_url: "https://scale.com",
    display_order: 10,
    is_active: true,
  },
  {
    id: 11,
    name: "Weights & Biases",
    logo_url: "https://logo.clearbit.com/wandb.ai",
    website_url: "https://wandb.ai",
    display_order: 11,
    is_active: true,
  },
  {
    id: 12,
    name: "LangChain",
    logo_url: "https://logo.clearbit.com/langchain.com",
    website_url: "https://langchain.com",
    display_order: 12,
    is_active: true,
  },
];

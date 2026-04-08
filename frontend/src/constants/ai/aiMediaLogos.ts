/**
 * AI Logo Carousel data — AI & tech publications
 * Used by AIHomePage via LogoCarousel dataOverride
 * Logos hosted on R2 CDN, sourced via scripts/upload_ai_logos.py
 */

export interface CarouselLogoItem {
  id: number;
  name: string;
  logo_url: string;
  alt_text: string;
}

export const aiCarouselLogos: CarouselLogoItem[] = [
  { id: 1, name: "TechCrunch", logo_url: "https://img.vortixpr.com/ai-media-logos/5fb6b9f6-9c7f-481c-8ab0-7d1db1226ce1.png", alt_text: "TechCrunch" },
  { id: 2, name: "The Verge", logo_url: "https://img.vortixpr.com/ai-media-logos/4731c9b5-9555-4401-a75a-733b304df7ca.png", alt_text: "The Verge" },
  { id: 3, name: "VentureBeat", logo_url: "https://img.vortixpr.com/ai-media-logos/7ff3a43e-c3fe-43b0-bffc-297cae3c3f50.png", alt_text: "VentureBeat" },
  { id: 4, name: "Wired", logo_url: "https://img.vortixpr.com/ai-media-logos/e4591930-6946-40e0-b9b7-6a339c2e4f99.png", alt_text: "Wired" },
  { id: 5, name: "MIT Technology Review", logo_url: "https://img.vortixpr.com/ai-media-logos/d5d8b169-0a60-4997-8d89-33185b4396c8.png", alt_text: "MIT Technology Review" },
  { id: 6, name: "Ars Technica", logo_url: "https://img.vortixpr.com/ai-media-logos/a421bba0-5f8c-489c-886e-53a0bcdbe32c.png", alt_text: "Ars Technica" },
  { id: 7, name: "Product Hunt", logo_url: "https://img.vortixpr.com/ai-media-logos/6d63db5a-f7c3-4afa-918a-7f544a5ec987.png", alt_text: "Product Hunt" },
  { id: 8, name: "IEEE Spectrum", logo_url: "https://img.vortixpr.com/ai-media-logos/8ab2079a-f263-416b-8ce7-dcd816f3a2ba.png", alt_text: "IEEE Spectrum" },
  { id: 9, name: "The Information", logo_url: "https://img.vortixpr.com/ai-media-logos/7193ce67-d1be-4fe2-8fc0-a8a80332c749.png", alt_text: "The Information" },
  { id: 10, name: "Fortune", logo_url: "https://img.vortixpr.com/ai-media-logos/74ecb52a-c1d4-42d6-b7e2-e12803f609f0.png", alt_text: "Fortune" },
  { id: 11, name: "Forbes", logo_url: "https://img.vortixpr.com/ai-media-logos/14a564b3-cdb0-496e-ae14-5a57db6e8e8e.png", alt_text: "Forbes" },
  { id: 12, name: "Bloomberg", logo_url: "https://img.vortixpr.com/ai-media-logos/1cbd7c50-eb24-4e15-882e-21bd216bdaed.png", alt_text: "Bloomberg" },
];

export const aiCarouselSubtitle = "Covered in the publications that matter most to AI founders";

/**
 * AI Logo Carousel data — AI & tech publications
 * Used by AIHomePage via LogoCarousel dataOverride
 */

export interface CarouselLogoItem {
  id: number;
  name: string;
  logo_url: string;
  alt_text: string;
}

export const aiCarouselLogos: CarouselLogoItem[] = [
  { id: 1, name: "TechCrunch", logo_url: "https://logo.clearbit.com/techcrunch.com", alt_text: "TechCrunch" },
  { id: 2, name: "The Verge", logo_url: "https://logo.clearbit.com/theverge.com", alt_text: "The Verge" },
  { id: 3, name: "VentureBeat", logo_url: "https://logo.clearbit.com/venturebeat.com", alt_text: "VentureBeat" },
  { id: 4, name: "Wired", logo_url: "https://logo.clearbit.com/wired.com", alt_text: "Wired" },
  { id: 5, name: "MIT Technology Review", logo_url: "https://logo.clearbit.com/technologyreview.com", alt_text: "MIT Technology Review" },
  { id: 6, name: "Ars Technica", logo_url: "https://logo.clearbit.com/arstechnica.com", alt_text: "Ars Technica" },
  { id: 7, name: "Product Hunt", logo_url: "https://logo.clearbit.com/producthunt.com", alt_text: "Product Hunt" },
  { id: 8, name: "IEEE Spectrum", logo_url: "https://logo.clearbit.com/ieee.org", alt_text: "IEEE Spectrum" },
  { id: 9, name: "The Information", logo_url: "https://logo.clearbit.com/theinformation.com", alt_text: "The Information" },
  { id: 10, name: "Fortune", logo_url: "https://logo.clearbit.com/fortune.com", alt_text: "Fortune" },
  { id: 11, name: "Forbes", logo_url: "https://logo.clearbit.com/forbes.com", alt_text: "Forbes" },
  { id: 12, name: "Bloomberg", logo_url: "https://logo.clearbit.com/bloomberg.com", alt_text: "Bloomberg" },
];

export const aiCarouselSubtitle = "Covered in the publications that matter most to AI founders";

export interface Package {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  badge?: string;
  guaranteedPublications?: number;
  mediaLogos?: {
    url: string;
    name: string;
  }[];
  detailedInfo?: {
    sections: {
      title: string;
      items: string[];
    }[];
    note?: string;
    ctaText?: string;
  };
}

export interface PackageCategory {
  id: string;
  title: string;
  badges?: string[];
  packages: Package[];
}

export const pricingPackagesV2: PackageCategory[] = [
  {
    id: 'global-pr',
    title: 'GLOBAL PR',
    badges: ['🚀 Launches', '💰 Funding', '🤝 Partnerships'],
    packages: [
      {
        id: 'foundation',
        name: 'Foundation',
        price: '$1,200 USD',
        description: 'LAUNCH-READY VISIBILITY',
        badge: '10 GUARANTEED PUBLICATIONS',
        guaranteedPublications: 10,
        mediaLogos: [
          {
            url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(58).png',
            name: 'CoinTelegraph'
          },
          {
            url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(59).png',
            name: 'CoinDesk'
          }
        ],
        features: [
          'Distribution to 10 curated crypto & tech outlets',
          'Homepage placement where available',
          'Same-day distribution after final approval',
          'Editorial suggestions & light copy editing',
          'Standard email support'
        ],
        detailedInfo: {
          sections: [
            {
              title: '10 GUARANTEED PUBLICATIONS',
              items: [
                'CoinTelegraph',
                'Bitcoin.com News',
                'CryptoPotato',
                'NewsBTC',
                'U.Today',
                'Bitcoinist',
                'CoinGape',
                'ZyCrypto',
                'CryptoDaily',
                'Blockchain Reporter'
              ]
            },
            {
              title: 'INCLUDED FEATURES',
              items: [
                'Professional press release writing',
                'SEO optimization',
                'Multimedia support (images, logos)',
                'Distribution tracking',
                'Publication report within 48h'
              ]
            }
          ],
          note: 'Perfect for seed / Series A, launch or partnership news.',
          ctaText: 'Start with Foundation'
        }
      },
      {
        id: 'global-core',
        name: 'Global Core',
        price: 'From $3,800',
        description: 'Balanced coverage for product launches and major ecosystem news.',
        badge: '30+ GUARANTEED PUBLICATIONS',
        guaranteedPublications: 30,
        mediaLogos: [
          {
            url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/blocktempo%20logo_white_%E6%A9%AB.png',
            name: 'BlockTempo'
          },
          {
            url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/Logo.png',
            name: 'Investing.com'
          },
          {
            url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(60).png',
            name: 'Decrypt'
          }
        ],
        features: [
          'Distribution to 30+ tier 1-2 outlets',
          'Multi-wave scheduling',
          'Premium placement opportunities',
          'Full editorial support',
          'Priority support team'
        ],
        detailedInfo: {
          sections: [
            {
              title: 'DISTRIBUTION',
              items: [
                '30+ guaranteed publications',
                'Mix of tier 1 & tier 2 outlets',
                'Premium placement priority',
                'Multi-day scheduling options',
                'Regional targeting available'
              ]
            },
            {
              title: 'EDITORIAL SUPPORT',
              items: [
                'Comprehensive copy editing',
                'Quote optimization',
                'Multiple revision rounds',
                'Strategic messaging guidance',
                'AP style compliance'
              ]
            },
            {
              title: 'ADDITIONAL FEATURES',
              items: [
                'Social media snippets',
                'SEO optimization',
                'Media contact database access',
                'Dedicated account manager',
                'Real-time distribution updates'
              ]
            }
          ],
          note: 'Ideal for product launches and major announcements.',
          ctaText: 'Get Started'
        }
      },
      {
        id: 'global-premium',
        name: 'Global Premium',
        price: 'From $8,000',
        description: 'Tier-1 focus, extended coverage and multi-wave scheduling.',
        badge: '50+ TIER-1 PUBLICATIONS',
        guaranteedPublications: 50,
        mediaLogos: [
          {
            url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/output-onlinepngtools%20(9).png',
            name: 'Bitcoin.com'
          }
        ],
        features: [
          '50+ tier-1 focused distribution',
          'Exclusive outlet relationships',
          'Custom multi-wave strategy',
          'C-suite interview coordination',
          'White-glove service'
        ],
        detailedInfo: {
          sections: [
            {
              title: 'PREMIUM DISTRIBUTION',
              items: [
                '50+ guaranteed tier-1 publications',
                'Exclusive media relationships',
                'Custom timing strategy',
                'Follow-up coverage support',
                'Tier-1 homepage guarantees'
              ]
            },
            {
              title: 'ELITE SERVICES',
              items: [
                'C-suite media training',
                'Interview coordination',
                'Custom thought leadership',
                'Crisis management support',
                'Investor relations messaging'
              ]
            },
            {
              title: 'COMPREHENSIVE SUPPORT',
              items: [
                'Dedicated team of 3+',
                '24/7 availability',
                'Real-time monitoring',
                'Monthly strategy sessions',
                'Quarterly performance review'
              ]
            }
          ],
          note: 'Maximum visibility for high-impact announcements and campaigns.',
          ctaText: 'Get Started'
        }
      }
    ]
  },
  {
    id: 'asia-packages',
    title: 'ASIA PACKAGES',
    badges: ['🇨🇳 CN', '🇰🇷 KR', '🇯🇵 JP', '🌏 SEA'],
    packages: [
      {
        id: 'southeast-asia',
        name: 'Southeast Asia',
        price: '$2,000',
        description: 'Regional narrative-optimized PR across key SEA outlets.',
        badge: 'SEA REGIONAL COVERAGE',
        mediaLogos: [
          {
            url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(61).png',
            name: 'Bitcoin Magazine'
          }
        ],
        features: [
          'Distribution to major SEA crypto media',
          'Localized messaging for regional markets',
          'Coverage in Singapore, Vietnam, Thailand markets',
          'Native language adaptation available',
          'Regional time zone optimization'
        ],
        detailedInfo: {
          sections: [
            {
              title: 'REGIONAL COVERAGE',
              items: [
                'Singapore tier-1 outlets',
                'Vietnam crypto media',
                'Thailand publications',
                'Indonesia coverage',
                'Philippines outlets',
                'Malaysia media partners'
              ]
            },
            {
              title: 'LOCALIZATION',
              items: [
                'Cultural adaptation',
                'Regional terminology',
                'Market-specific angles',
                'Local compliance review',
                'Time zone optimized distribution'
              ]
            },
            {
              title: 'FEATURES',
              items: [
                'Native language translation available',
                'Regional social media support',
                'Local influencer connections',
                'Market research insights'
              ]
            }
          ],
          note: 'Ideal for projects targeting Southeast Asian markets.',
          ctaText: 'Get Started'
        }
      },
      {
        id: 'korea-japan',
        name: 'Korea & Japan',
        price: '$5,000',
        description: 'Includes both language translation and narrative adaptation.',
        badge: 'DUAL-MARKET COVERAGE',
        mediaLogos: [
          {
            url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(57).png',
            name: 'The Block'
          }
        ],
        features: [
          'Full Korean translation & distribution',
          'Full Japanese translation & distribution',
          'Native speaker editorial review',
          'Cultural narrative adaptation',
          'Top-tier outlets in both markets'
        ],
        detailedInfo: {
          sections: [
            {
              title: 'KOREA COVERAGE',
              items: [
                'Professional Korean translation',
                'Distribution to Korean crypto media',
                'Kakao/Telegram community support',
                'Korean influencer outreach',
                'Naver SEO optimization'
              ]
            },
            {
              title: 'JAPAN COVERAGE',
              items: [
                'Professional Japanese translation',
                'Distribution to Japanese outlets',
                'Cultural sensitivity review',
                'Japan market timing optimization',
                'Yahoo Japan optimization'
              ]
            },
            {
              title: 'COMBINED BENEFITS',
              items: [
                'Cross-market strategy',
                'Regional thought leadership',
                'Dual-market media contacts',
                'Combined reporting dashboard'
              ]
            }
          ],
          note: 'Essential for projects targeting Korean and Japanese markets.',
          ctaText: 'Get Started'
        }
      },
      {
        id: 'chinese-speaking',
        name: 'Chinese Speaking',
        price: '$5,000',
        description: '6-outlet distribution with Mandarin narrative adaptation.',
        badge: '6 CHINESE OUTLETS',
        mediaLogos: [
          {
            url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/blocktempo%20logo_white_%E6%A9%AB.png',
            name: 'BlockTempo'
          }
        ],
        features: [
          'Professional Mandarin translation',
          '6 major Chinese crypto outlets',
          'Mainland + Hong Kong + Taiwan coverage',
          'WeChat distribution support',
          'Simplified & Traditional Chinese versions'
        ],
        detailedInfo: {
          sections: [
            {
              title: 'DISTRIBUTION NETWORK',
              items: [
                'Mainland China outlets (VPN-accessible)',
                'Hong Kong tier-1 media',
                'Taiwan crypto publications',
                'Singapore Chinese media',
                'Malaysian Chinese outlets',
                'Global Chinese diaspora media'
              ]
            },
            {
              title: 'CHINESE MARKET SERVICES',
              items: [
                'Simplified Chinese translation',
                'Traditional Chinese translation',
                'WeChat article formatting',
                'Chinese SEO optimization',
                'Baidu indexing support',
                'Weibo social amplification'
              ]
            },
            {
              title: 'CULTURAL ADAPTATION',
              items: [
                'Market-appropriate messaging',
                'Regulatory compliance review',
                'Cultural sensitivity check',
                'Regional terminology usage'
              ]
            }
          ],
          note: 'Perfect for projects targeting Chinese-speaking markets globally.',
          ctaText: 'Get Started'
        }
      }
    ]
  },
  {
    id: 'founder-pr',
    title: 'FOUNDER PR',
    badges: ['👤 Founders', '💼 CMOs', '⭐ Key Leaders'],
    packages: [
      {
        id: 'founder-starter',
        name: 'Starter',
        price: '$2,000',
        description: 'Personal branding narrative + 1–2 articles and AI visibility support.',
        badge: 'FOUNDER BRANDING',
        mediaLogos: [
          {
            url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(60).png',
            name: 'Decrypt'
          }
        ],
        features: [
          'Personal brand narrative development',
          '1-2 thought leadership articles',
          'AI-optimized founder bio',
          'LinkedIn profile optimization',
          'Personal PR strategy session'
        ],
        detailedInfo: {
          sections: [
            {
              title: 'BRAND BUILDING',
              items: [
                'Founder story development',
                'Personal messaging framework',
                'AI visibility optimization',
                'Social media presence audit',
                'Professional headshot guidance'
              ]
            },
            {
              title: 'CONTENT CREATION',
              items: [
                '1-2 bylined articles',
                'LinkedIn post templates',
                'Quote bank creation',
                'Media kit preparation',
                'Bio optimization for all platforms'
              ]
            },
            {
              title: 'VISIBILITY',
              items: [
                'Google search optimization',
                'Social media profile enhancement',
                'Speaking opportunity guidance',
                'Media training basics'
              ]
            }
          ],
          note: 'Build your personal brand and establish thought leadership.',
          ctaText: 'Get Started'
        }
      },
      {
        id: 'key-leader',
        name: 'Key Leader',
        price: '$2,000',
        description: 'Narrative, 2–3 articles, 1 interview + 1 shorts, plus AI visibility.',
        badge: 'LEADERSHIP PACKAGE',
        mediaLogos: [
          {
            url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(61).png',
            name: 'Bitcoin Magazine'
          }
        ],
        features: [
          'Comprehensive leader narrative',
          '2-3 thought leadership articles',
          '1 podcast/media interview',
          'Short-form video content',
          'Advanced AI visibility package'
        ],
        detailedInfo: {
          sections: [
            {
              title: 'ENHANCED CONTENT',
              items: [
                '2-3 bylined articles in tier-1 outlets',
                'Podcast interview coordination',
                '1 short-form video content',
                'Interview media training',
                'Ongoing content strategy'
              ]
            },
            {
              title: 'VISIBILITY BOOST',
              items: [
                'Multi-platform AI optimization',
                'Wikipedia page consultation',
                'Google Knowledge Panel setup',
                'Ongoing media opportunities',
                'Press mention tracking'
              ]
            },
            {
              title: 'PROFESSIONAL DEVELOPMENT',
              items: [
                'Media training session',
                'Speaking engagement support',
                'Conference speaker applications',
                'Award nomination submissions',
                'Industry recognition strategy'
              ]
            }
          ],
          note: 'Elevate your leadership presence and industry recognition.',
          ctaText: 'Get Started'
        }
      }
    ]
  }
];


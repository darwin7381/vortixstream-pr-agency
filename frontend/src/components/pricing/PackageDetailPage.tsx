import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Globe, Zap, GitCompareArrows, Check } from 'lucide-react';
import { prPackagesAPI, type PRPackage } from '../../api/client';
import { handleGetStartedClick } from '../../utils/navigationHelpers';
import { useCompare } from '../../contexts/CompareContext';
import { Button } from '../ui/button';
import CoverageMap from './CoverageMap';
import CryptoFooter from '../crypto/CryptoFooter';

const DEMO_COVERAGE: Record<string, {
  countries: string[];
  media_by_country: Record<string, string[]>;
  total_outlets: number;
  total_countries: number;
}> = {
  'global-pr': {
    countries: ['US', 'GB', 'DE', 'FR', 'CA', 'AU', 'JP', 'KR', 'SG', 'IN', 'NL', 'CH', 'ES', 'IT', 'SE', 'IE', 'BR', 'MX', 'AE', 'IL', 'NZ', 'NO', 'DK', 'FI'],
    media_by_country: {
      US: ['Forbes', 'Bloomberg', 'TechCrunch', 'Wired', 'Business Insider'],
      GB: ['The Guardian', 'BBC', 'Reuters', 'The Telegraph'],
      DE: ['Handelsblatt', 'BTC-ECHO', 'Der Spiegel'],
      FR: ['Les Echos', 'The Big Whale', 'Le Monde'],
      JP: ['Nikkei', 'CoinPost', 'CoinTelegraph Japan'],
      KR: ['Chosun', 'Korea Herald', 'Block Media'],
      SG: ['The Straits Times', 'Channel News Asia'],
      AU: ['Australian Financial Review', 'The Australian'],
      CA: ['The Globe and Mail', 'Financial Post'],
      IN: ['Economic Times', 'Livemint'],
      AE: ['Gulf News', 'Arabian Business'],
      IL: ['The Times of Israel', 'Calcalist'],
    },
    total_outlets: 150,
    total_countries: 24,
  },
  'asia-packages': {
    countries: ['JP', 'KR', 'TW', 'SG', 'TH', 'VN', 'ID', 'PH', 'MY', 'HK', 'CN', 'IN'],
    media_by_country: {
      JP: ['Nikkei', 'CoinPost', 'CoinTelegraph Japan', 'CoinDesk Japan'],
      KR: ['Chosun', 'Korea Herald', 'Block Media', 'Decenter'],
      TW: ['經濟日報', '動區動趨', '鏈新聞', '工商時報'],
      SG: ['The Straits Times', 'Channel News Asia', 'The Business Times'],
      TH: ['Bangkok Post', 'The Nation'],
      VN: ['VnExpress', 'Tuoi Tre News'],
      HK: ['South China Morning Post', 'Hong Kong Economic Journal'],
      CN: ['Caixin', '36Kr', 'ChainNews'],
      IN: ['Economic Times', 'Livemint', 'The Hindu'],
    },
    total_outlets: 80,
    total_countries: 12,
  },
  'founder-pr': {
    countries: ['US', 'GB', 'SG', 'AE', 'DE', 'FR', 'JP', 'KR'],
    media_by_country: {
      US: ['Forbes', 'Inc.', 'Entrepreneur', 'Fast Company'],
      GB: ['Evening Standard', 'City AM', 'Sifted'],
      SG: ['The Business Times', 'Tech in Asia'],
      AE: ['Arabian Business', 'Gulf News'],
      DE: ['Handelsblatt', 'Gründerszene'],
      FR: ['Maddyness', 'Les Echos'],
    },
    total_outlets: 50,
    total_countries: 8,
  },
};

function getCoverageForPackage(pkg: PRPackage) {
  const detailedCoverage = (pkg.detailed_info as Record<string, unknown>)?.coverage as typeof DEMO_COVERAGE[string] | undefined;
  if (detailedCoverage?.countries) return detailedCoverage;
  return DEMO_COVERAGE[pkg.category_id] || DEMO_COVERAGE['global-pr'];
}

export default function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [pkg, setPkg] = useState<PRPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { isInCompare, toggleItem, isFull } = useCompare();

  const inCompare = pkg ? isInCompare(slug!) : false;

  const handleCompareToggle = () => {
    if (!pkg || !slug) return;
    toggleItem({
      id: String(pkg.id),
      slug,
      name: pkg.name,
      price: pkg.price,
      description: pkg.description,
      badge: pkg.badge,
      guaranteed_publications: pkg.guaranteed_publications,
      features: pkg.features,
      category_id: pkg.category_id,
    });
  };

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    prPackagesAPI
      .getPackage(slug)
      .then(setPkg)
      .catch(() => setError('Package not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60 text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <p className="text-white/60 text-lg">{error || 'Package not found'}</p>
        <Link
          to="/pricing"
          className="text-[#FF7400] hover:text-[#FF8C2A] transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Packages
        </Link>
      </div>
    );
  }

  const coverage = getCoverageForPackage(pkg);

  return (
    <div className="min-h-screen bg-black">
      {/* ===== HERO SECTION ===== */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24"
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(255,116,0,0.12) 0%, transparent 45%),
              radial-gradient(circle at 80% 70%, rgba(29,53,87,0.15) 0%, transparent 50%),
              linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)
            `,
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{
                left: `${10 + (i * 6) % 80}%`,
                top: `${15 + (i * 8) % 70}%`,
                animation: `float-particle ${2.5 + (i % 3) * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container-large px-[17px] md:px-[17px]">
          {/* Breadcrumb */}
          <nav
            className={`flex items-center gap-2 text-sm mb-8 md:mb-12 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <Link to="/pricing" className="text-white/40 hover:text-white/70 transition-colors">
              Packages
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/30" />
            <span className="text-white/70">{pkg.name}</span>
          </nav>

          {/* Hero Content */}
          <div className="max-w-4xl">
            {/* Badge */}
            {pkg.badge && (
              <div
                className={`inline-flex items-center mb-5 transition-all duration-800 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="px-4 py-1.5 rounded-full bg-[#FF7400]/10 border border-[#FF7400]/30">
                  <span className="text-[#FF7400]/90 text-xs font-bold uppercase tracking-wider">
                    {pkg.badge}
                  </span>
                </div>
              </div>
            )}

            {/* Title + Price */}
            <div
              className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <h1
                className="text-white text-4xl sm:text-5xl md:text-6xl font-bold"
                style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
              >
                {pkg.name}
              </h1>
              <div className="flex items-baseline gap-2 flex-shrink-0">
                <span
                  className="text-[#FF7400] text-4xl md:text-5xl font-bold"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {pkg.price}
                </span>
              </div>
            </div>

            {/* Description */}
            <p
              className={`text-white/60 text-lg md:text-xl max-w-2xl transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              {pkg.description}
            </p>

            {/* Key Metrics */}
            {pkg.guaranteed_publications && (
              <div
                className={`flex flex-wrap items-center gap-6 mt-8 transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: '800ms' }}
              >
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                  <Zap className="w-5 h-5 text-[#FF7400]" />
                  <div>
                    <div className="text-white font-semibold text-lg">{pkg.guaranteed_publications}+</div>
                    <div className="text-white/50 text-xs uppercase tracking-wider">Guaranteed Publications</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                  <Globe className="w-5 h-5 text-[#FF7400]" />
                  <div>
                    <div className="text-white font-semibold text-lg">{coverage.total_countries}</div>
                    <div className="text-white/50 text-xs uppercase tracking-wider">Countries</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== COVERAGE MAP SECTION ===== */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, rgba(29,53,87,0.1) 0%, transparent 60%),
              linear-gradient(180deg, #000000 0%, #050510 50%, #000000 100%)
            `,
          }}
        />

        <div className="relative z-10 container-large px-[17px] md:px-[17px]">
          {/* Section Title */}
          <div className="text-center mb-10 md:mb-14">
            <span className="text-[#FF7400] text-sm font-semibold uppercase tracking-widest">
              Coverage
            </span>
            <h2
              className="text-white text-3xl md:text-[44px] font-medium mt-3"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
            >
              Global Media Coverage
            </h2>
            <p className="text-white/50 text-base md:text-lg mt-4 max-w-2xl mx-auto">
              Your story reaches audiences across {coverage.total_countries} countries through {coverage.total_outlets}+ trusted media outlets worldwide.
            </p>
          </div>

          {/* Map */}
          <CoverageMap coverage={coverage} />
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent" />

        <div className="relative z-10 container-large px-[17px] md:px-[17px]">
          <div className="max-w-5xl mx-auto">
            {/* Section Title */}
            <div className="text-center mb-12 md:mb-16">
              <span className="text-[#FF7400] text-sm font-semibold uppercase tracking-widest">
                What's Included
              </span>
              <h2
                className="text-white text-3xl md:text-[44px] font-medium mt-3"
                style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
              >
                Package Features
              </h2>
            </div>

            {/* Main Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {pkg.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/8 hover:border-white/15 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FF7400]/10 border border-[#FF7400]/20 flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        fill="#22C55E"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-white/90 text-base">{feature}</p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-12" />

            {/* Detailed Sections */}
            {pkg.detailed_info?.sections && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {pkg.detailed_info.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    <h3 className="text-white text-sm font-bold mb-5 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-1 h-5 bg-[#FF7400] rounded-full" />
                      {section.title}
                    </h3>
                    <div className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-3 pl-3">
                          <div className="w-1.5 h-1.5 bg-white/30 rounded-full flex-shrink-0" />
                          <p className="text-white/70 text-sm leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== MEDIA PARTNERS SECTION ===== */}
      {pkg.media_logos && pkg.media_logos.length > 0 && (
        <section className="relative py-16 md:py-24">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 30% 50%, rgba(255,116,0,0.05) 0%, transparent 50%),
                radial-gradient(circle at 70% 50%, rgba(29,53,87,0.08) 0%, transparent 50%)
              `,
            }}
          />

          <div className="relative z-10 container-large px-[17px] md:px-[17px]">
            <div className="text-center mb-10 md:mb-14">
              <span className="text-[#FF7400] text-sm font-semibold uppercase tracking-widest">
                Distribution
              </span>
              <h2
                className="text-white text-3xl md:text-[44px] font-medium mt-3"
                style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
              >
                Featured Media Partners
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {pkg.media_logos.map((logo, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white/[0.03] border border-white/8 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300"
                >
                  <img
                    src={logo.url}
                    alt={logo.name}
                    className="h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                    style={{ filter: 'brightness(1.3)' }}
                  />
                  <span className="text-white/40 text-xs text-center">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, rgba(255,116,0,0.08) 0%, transparent 50%),
              linear-gradient(180deg, #000000 0%, #0a0612 50%, #000000 100%)
            `,
          }}
        />

        <div className="relative z-10 container-large px-[17px] md:px-[17px]">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-white text-3xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
            >
              Ready to Amplify Your Story?
            </h2>
            {pkg.detailed_info?.note && (
              <p className="text-white/60 text-base md:text-lg mb-8 max-w-xl mx-auto">
                {pkg.detailed_info.note}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => handleGetStartedClick(navigate, location.pathname)}
                className="
                  border border-[#FF7400] text-white overflow-hidden
                  py-4 px-10 rounded-xl transition-all duration-300
                  hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,116,0,0.4)]
                  relative text-lg
                  before:absolute before:inset-0 before:bg-black/20 before:opacity-0 before:transition-opacity before:duration-300
                  hover:before:opacity-100
                "
                style={{
                  background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)',
                }}
              >
                <span className="relative z-10 font-semibold">
                  {pkg.detailed_info?.cta_text || 'Get Started'}
                </span>
              </Button>

              <button
                onClick={handleCompareToggle}
                disabled={!inCompare && isFull}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium
                  transition-all duration-300
                  ${inCompare
                    ? 'bg-[#FF7400]/15 border border-[#FF7400]/30 text-[#FF7400]'
                    : 'bg-white/5 border border-white/15 text-white/60 hover:text-white hover:border-white/30'
                  }
                  disabled:opacity-30 disabled:cursor-not-allowed
                `}
              >
                {inCompare ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Compare
                  </>
                ) : (
                  <>
                    <GitCompareArrows className="w-4 h-4" />
                    + Add to Compare
                  </>
                )}
              </button>
            </div>

            <div className="mt-4">
              <Link
                to="/pricing"
                className="text-white/40 hover:text-white/70 transition-colors text-sm flex items-center gap-1 justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
                View all packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CryptoFooter />
    </div>
  );
}

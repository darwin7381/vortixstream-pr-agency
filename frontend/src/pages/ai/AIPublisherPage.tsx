import PublisherFeatures from '../../components/crypto/publisher/PublisherFeatures';
import LogoCarousel from '../../components/crypto/LogoCarousel';
import { aiPublisherData } from '../../constants/ai/aiPublisherData';
import { aiCarouselLogos, aiCarouselSubtitle } from '../../constants/ai/aiMediaLogos';

export default function AIPublisherPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="bg-black py-section-large">
        <div className="container-global">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#FF7400] shadow-[0_0_10px_#FF7400] animate-pulse" />
              <span className="text-[14px] text-[#FF7400] font-mono tracking-widest uppercase font-bold">
                PUBLISHER NETWORK
              </span>
            </div>
            <h1 className="text-[40px] md:text-[56px] font-medium text-white font-heading tracking-[-0.4px] md:tracking-[-0.56px] mb-6">
              Reach AI founders through our media network
            </h1>
            <p className="text-[14px] md:text-[18px] text-white/70 max-w-[600px] leading-relaxed">
              VortixPR partners with 200+ AI newsletters, podcasts, and media outlets to distribute founder stories. Join our publisher network and get curated, high-quality AI story pitches.
            </p>
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <LogoCarousel dataOverride={{ logos: aiCarouselLogos as any[], subtitle: aiCarouselSubtitle }} />

      {/* Publisher Features */}
      <PublisherFeatures dataOverride={aiPublisherData} />

      {/* CTA */}
      <section className="bg-black py-section-large">
        <div className="container-global">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-white text-[32px] md:text-[40px] font-medium mb-4 font-heading tracking-[-0.32px]">
              Apply to the AI publisher network
            </h2>
            <p className="text-white/70 text-[14px] md:text-[16px] mb-8">
              We review all publisher applications within 5 business days. We look for engaged, AI-focused audiences above 2,000 monthly readers.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-[20px] rounded-md border border-[#FF7400] text-white text-[14px] md:text-[16px] font-medium cursor-pointer transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' }}
            >
              Apply as Publisher →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

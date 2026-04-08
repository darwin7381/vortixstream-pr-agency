import { useState } from 'react';
import FAQSection from '../../components/crypto/FAQSection';
import PricingContactForm from '../../components/crypto/PricingContactForm';
import PricingCommitment from '../../components/crypto/PricingCommitment';
import LogoCarousel from '../../components/crypto/LogoCarousel';
import PricingHero from '../../components/pricing/PricingHero';
import PRPackagesGrid from '../../components/pricing/PRPackagesGrid';
import PackageDetailModal from '../../components/pricing/PackageDetailModal';
import type { PRPackage } from '../../api/client';
import { aiFaqs } from '../../constants/ai/aiFaqData';
import { aiCarouselLogos, aiCarouselSubtitle } from '../../constants/ai/aiMediaLogos';

export default function AIPricingPage() {
  const [selectedPackage, setSelectedPackage] = useState<PRPackage | null>(null);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero — same component as crypto, just different copy */}
      <PricingHero
        eyebrow="Pricing"
        title="Pricing built for AI founders"
        subtitle="From stealth mode to Series B — flexible packages that scale with your launch, fundraise, and thought-leadership goals."
      />

      {/* PR Packages Grid (identical structure to crypto pricing page) */}
      <section className="bg-black py-section-large">
        <div className="container-large px-[17px] md:px-[17px]">
          <PRPackagesGrid onPackageSelect={setSelectedPackage} audience="ai" />
        </div>
      </section>

      {/* Package Detail Modal */}
      <PackageDetailModal
        package={selectedPackage!}
        isOpen={!!selectedPackage}
        onClose={() => setSelectedPackage(null)}
      />

      {/* Logo Carousel */}
      <section className="bg-black py-section-medium">
        <LogoCarousel dataOverride={{ logos: aiCarouselLogos as any[], subtitle: aiCarouselSubtitle }} />
      </section>

      {/* FAQ */}
      <FAQSection
        faqs={aiFaqs}
        variant="default"
        maxWidth="default"
        showCTA={false}
        description="Common questions from AI founders about our pricing, process, and results."
      />

      {/* Contact Form */}
      <PricingContactForm />

      {/* Commitment */}
      <PricingCommitment />
    </div>
  );
}

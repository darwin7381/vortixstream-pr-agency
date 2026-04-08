import { useState } from 'react';
import FAQSection from '../../components/crypto/FAQSection';
import PricingContactForm from '../../components/crypto/PricingContactForm';
import LogoCarousel from '../../components/crypto/LogoCarousel';
import PRPackagesSection from '../../components/pricing/PRPackagesSection';
import { aiFaqs } from '../../constants/ai/aiFaqData';
import { aiCarouselLogos, aiCarouselSubtitle } from '../../constants/ai/aiMediaLogos';

export default function AIPricingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="bg-black py-section-large">
        <div className="container-global">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#FF7400] shadow-[0_0_10px_#FF7400] animate-pulse" />
              <span className="text-[14px] text-[#FF7400] font-mono tracking-widest uppercase font-bold">
                PRICING
              </span>
            </div>
            <h1 className="text-[40px] md:text-[56px] font-medium text-white font-heading tracking-[-0.4px] md:tracking-[-0.56px] mb-6">
              Transparent pricing for AI founders
            </h1>
            <p className="text-[14px] md:text-[18px] text-white/70 max-w-[600px] leading-relaxed">
              No retainer lock-in surprises. Choose the package that matches your stage and goals — every plan includes our Lyro AI co-pilot and dedicated account support.
            </p>
          </div>
        </div>
      </section>

      {/* Packages */}
      <PRPackagesSection
        title="AI PR PACKAGES"
        description="Flexible plans for every stage — from solo founder to Series B. All packages include our Lyro AI co-pilot and dedicated account management."
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
      <section id="contact-section">
        <PricingContactForm />
      </section>
    </div>
  );
}

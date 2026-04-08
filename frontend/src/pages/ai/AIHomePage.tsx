import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleContactClick } from '../../utils/navigationHelpers';
import HeroNewSection from '../../components/crypto/HeroNewSection';
import LogoCarousel from '../../components/crypto/LogoCarousel';
import StatsSection from '../../components/crypto/StatsSection';
import ServicesSection from '../../components/crypto/ServicesSection';
import LyroSection from '../../components/crypto/LyroSection';
import TrustedBySection from '../../components/crypto/TrustedBySection';
import TestimonialSection from '../../components/crypto/TestimonialSection';
import VortixPortalSection from '../../components/crypto/VortixPortalSection';
import FAQSection from '../../components/crypto/FAQSection';
import PricingContactForm from '../../components/crypto/PricingContactForm';
import PRPackagesSection from '../../components/pricing/PRPackagesSection';
import PublisherFeatures from '../../components/crypto/publisher/PublisherFeatures';

import { aiHeroData, aiMediaLogos } from '../../constants/ai/aiHeroData';
import { aiCarouselLogos, aiCarouselSubtitle } from '../../constants/ai/aiMediaLogos';
import { aiWhyVortixData } from '../../constants/ai/aiWhyVortixData';
import { aiServicesData } from '../../constants/ai/aiServicesData';
import { aiLyroData } from '../../constants/ai/aiLyroData';
import { aiTrustedByClients } from '../../constants/ai/aiTrustedByData';
import { aiVortixPortalData } from '../../constants/ai/aiVortixPortalData';
import { aiTestimonials } from '../../constants/ai/aiTestimonialData';
import { aiFaqs } from '../../constants/ai/aiFaqData';
import { aiPublisherData } from '../../constants/ai/aiPublisherData';

export default function AIHomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCTAClick = () => {
    handleContactClick(navigate, location.pathname);
  };

  return (
    <>
      <HeroNewSection dataOverride={{ hero: aiHeroData, mediaLogos: aiMediaLogos }} />
      <LogoCarousel dataOverride={{ logos: aiCarouselLogos as any[], subtitle: aiCarouselSubtitle }} />

      <section id="about-section">
        <StatsSection dataOverride={aiWhyVortixData} />
      </section>

      <ServicesSection onContactClick={handleCTAClick} dataOverride={aiServicesData} />

      {/* Packages Preview Section */}
      <PRPackagesSection
        title="AI PR PACKAGES"
        description="Flexible plans for every stage — from solo founder to Series B. All packages include our Lyro AI co-pilot and dedicated account management."
      />

      {/* Vortix Portal Section */}
      <section id="vortix-portal-section">
        <VortixPortalSection dataOverride={aiVortixPortalData} />
      </section>

      {/* Lyro AI Section */}
      <section id="lyro-section">
        <LyroSection dataOverride={aiLyroData} />
      </section>

      {/* Our Clients Section */}
      <section id="clients-section">
        <TrustedBySection
          showTitle={true}
          title="Trusted by AI-native companies"
          dataOverride={aiTrustedByClients as any[]}
        />
      </section>

      {/* Publisher Features Preview */}
      <section id="publisher-section">
        <PublisherFeatures dataOverride={aiPublisherData} />
      </section>

      <TestimonialSection dataOverride={aiTestimonials as any[]} />

      <FAQSection
        faqs={aiFaqs}
        variant="default"
        maxWidth="default"
        showCTA={true}
        description="Get answers to common questions from AI founders about working with VortixPR."
        onPrimaryAction={handleCTAClick}
        onSecondaryAction={handleCTAClick}
      />

      {/* Contact Us Section */}
      <section id="contact-section">
        <PricingContactForm />
      </section>
    </>
  );
}

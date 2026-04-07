import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleContactClick } from '../../utils/navigationHelpers';
import { contentAPI, type FAQ } from '../../api/client';
import HeroNewSection from '../../components/HeroNewSection';
import LogoCarousel from '../../components/LogoCarousel';
import StatsSection from '../../components/StatsSection';
import ServicesSection from '../../components/ServicesSection';
import LyroSection from '../../components/LyroSection';
import TrustedBySection from '../../components/TrustedBySection';
import TestimonialSection from '../../components/TestimonialSection';
import VortixPortalSection from '../../components/VortixPortalSection';
import FAQSection from '../../components/FAQSection';
import PricingContactForm from '../../components/PricingContactForm';
import Footer from '../../components/Footer';
import PRPackagesSection from '../../components/pricing/PRPackagesSection';
import PublisherFeatures from '../../components/crypto/publisher/PublisherFeatures';

export default function CryptoHomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    contentAPI.getFAQs()
      .then(setFaqs)
      .catch(console.error);
  }, []);

  const handleCTAClick = () => {
    handleContactClick(navigate, location.pathname);
  };

  return (
    <>
      <HeroNewSection />
      <LogoCarousel />
      <section id="about-section">
        <StatsSection />
      </section>
      <ServicesSection onContactClick={handleCTAClick} />

      {/* Packages Preview Section */}
      <PRPackagesSection />

      {/* Vortix Portal Section */}
      <section id="vortix-portal-section">
        <VortixPortalSection />
      </section>

      {/* Lyro AI Section */}
      <section id="lyro-section">
        <LyroSection />
      </section>

      {/* Our Clients Section */}
      <section id="clients-section">
        <TrustedBySection showTitle={true} />
      </section>

      {/* Publisher Features Preview */}
      <section id="publisher-section">
        <PublisherFeatures />
      </section>

      <TestimonialSection />
      <FAQSection
        faqs={faqs.map(faq => ({ question: faq.question, answer: faq.answer }))}
        variant="default"
        maxWidth="default"
        showCTA={true}
        onPrimaryAction={handleCTAClick}
        onSecondaryAction={handleCTAClick}
      />

      {/* Contact Us Section */}
      <section id="contact-section">
        <PricingContactForm />
      </section>

      <Footer />
    </>
  );
}

import HeroSection from './HeroSection';
import StatsSection from './crypto/StatsSection';
import LogoCarousel from './crypto/LogoCarousel';
import ServicesSection from './crypto/ServicesSection';
import TrustedBySection from './crypto/TrustedBySection';
import FeaturesSection from './crypto/FeaturesSection';
import TestimonialSection from './crypto/TestimonialSection';
import EverythingYouNeedSection from './crypto/EverythingYouNeedSection';
import FAQSection from './crypto/FAQSection';
import CryptoFooter from './crypto/CryptoFooter';
import { faqs } from '../constants/faqData';
import { Route } from '../hooks/useRouter';

/**
 * OldIndexPage - Backup of the original home page layout
 * Created as backup before redesigning the home page structure
 * Date: 2025-12-03
 */
export default function OldIndexPage({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <LogoCarousel />
      <ServicesSection />
      <TrustedBySection showTitle={true} />
      <FeaturesSection />
      <TestimonialSection />
      <EverythingYouNeedSection reverse={true} />
      <FAQSection 
        faqs={faqs}
        variant="default"
        maxWidth="default"
        showCTA={true}
      />
      <CryptoFooter />
    </>
  );
}


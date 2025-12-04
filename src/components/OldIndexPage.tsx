import HeroSection from './HeroSection';
import StatsSection from './StatsSection';
import LogoCarousel from './LogoCarousel';
import ServicesSection from './ServicesSection';
import TrustedBySection from './TrustedBySection';
import FeaturesSection from './FeaturesSection';
import TestimonialSection from './TestimonialSection';
import EverythingYouNeedSection from './EverythingYouNeedSection';
import FAQSection from './FAQSection';
import Footer from './Footer';
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
      <Footer onNavigate={onNavigate} />
    </>
  );
}


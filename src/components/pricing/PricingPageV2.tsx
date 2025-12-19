import FAQSection from '../FAQSection';
import PricingContactForm from '../PricingContactForm';
import PricingCommitment from '../PricingCommitment';
import LogoCarousel from '../LogoCarousel';
import Footer from '../Footer';
import PricingHero from './PricingHero';
import PricingCardsV2 from './PricingCardsV2';
import { faqs } from '../../constants/faqData';

export default function PricingPageV2() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <PricingHero />

      {/* Pricing Cards V2 */}
      <PricingCardsV2 />

      {/* Logo Carousel */}
      <section className="bg-black py-section-medium">
        <LogoCarousel />
      </section>

      {/* FAQ Section */}
      <FAQSection 
        faqs={faqs}
        variant="default"
        maxWidth="default"
        showCTA={false}
      />

      {/* Contact Form */}
      <PricingContactForm />

      {/* Commitment Section */}
      <PricingCommitment />

      {/* Footer */}
      <Footer />
    </div>
  );
}


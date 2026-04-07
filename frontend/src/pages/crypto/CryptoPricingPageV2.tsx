import { useState, useEffect } from 'react';
import FAQSection from '../../components/crypto/FAQSection';
import PricingContactForm from '../../components/crypto/PricingContactForm';
import PricingCommitment from '../../components/crypto/PricingCommitment';
import LogoCarousel from '../../components/crypto/LogoCarousel';
import CryptoFooter from '../../components/crypto/CryptoFooter';
import PricingHero from '../../components/pricing/PricingHero';
import PRPackagesGrid from '../../components/pricing/PRPackagesGrid';
import PackageDetailModal from '../../components/pricing/PackageDetailModal';
import { contentAPI, type FAQ, type PRPackage } from '../../api/client';

export default function CryptoPricingPageV2() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PRPackage | null>(null);

  useEffect(() => {
    contentAPI.getFAQs()
      .then(setFaqs)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <PricingHero />

      {/* PR Packages Grid */}
      <section className="bg-black py-section-large">
        <div className="container-large px-[17px] md:px-[17px]">
          <PRPackagesGrid onPackageSelect={setSelectedPackage} />
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
        <LogoCarousel />
      </section>

      {/* FAQ Section */}
      <FAQSection
        faqs={faqs.map(faq => ({ question: faq.question, answer: faq.answer }))}
        variant="default"
        maxWidth="default"
        showCTA={false}
      />

      {/* Contact Form */}
      <PricingContactForm />

      {/* Commitment Section */}
      <PricingCommitment />

      {/* Footer */}
      <CryptoFooter />
    </div>
  );
}

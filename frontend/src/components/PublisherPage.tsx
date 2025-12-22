import PublisherHeroSection from './PublisherHeroSection';
import PublisherFeaturesSection from './PublisherFeaturesSection';
import PublisherContentSections from './PublisherContentSections';
import PublisherCTASection from './PublisherCTASection';
import LogoCarousel from './LogoCarousel';
import Footer from './Footer';

interface PublisherPageProps {
  showFooter?: boolean;
}

export default function PublisherPage({ showFooter = true }: PublisherPageProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <PublisherHeroSection />

      {/* Logo Carousel Section - Using Global Component */}
      <LogoCarousel />

      {/* Why Partner Section */}
      <PublisherFeaturesSection />

      {/* Everything You Need & Payment Options Sections */}
      <PublisherContentSections />

      {/* CTA Section */}
      <PublisherCTASection />

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
}
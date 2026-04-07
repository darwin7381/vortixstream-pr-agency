import PublisherHero from '../../components/crypto/publisher/PublisherHero';
import PublisherFeatures from '../../components/crypto/publisher/PublisherFeatures';
import PublisherContent from '../../components/crypto/publisher/PublisherContent';
import PublisherCTA from '../../components/crypto/publisher/PublisherCTA';
import LogoCarousel from '../../components/crypto/LogoCarousel';
import Footer from '../../components/Footer';

export default function CryptoPublisherPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <PublisherHero />

      {/* Logo Carousel Section */}
      <LogoCarousel />

      {/* Why Partner Section */}
      <PublisherFeatures />

      {/* Everything You Need & Payment Options Sections */}
      <PublisherContent />

      {/* CTA Section */}
      <PublisherCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}



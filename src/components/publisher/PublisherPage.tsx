import PublisherHero from './PublisherHero';
import PublisherFeatures from './PublisherFeatures';
import PublisherContent from './PublisherContent';
import PublisherCTA from './PublisherCTA';
import LogoCarousel from '../LogoCarousel';
import Footer from '../Footer';

export default function PublisherPage() {
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

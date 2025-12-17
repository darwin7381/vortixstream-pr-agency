import ServicesSection from './ServicesSection';
import Footer from './Footer';

interface ServicesPageProps {
  showFooter?: boolean;
}

export default function ServicesPage({ showFooter = true }: ServicesPageProps) {
  return (
    <div className="min-h-screen bg-black">
      <ServicesSection />
      
      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
}

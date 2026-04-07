import ServicesSection from '../../components/ServicesSection';
import Footer from '../../components/Footer';

interface ServicesPageProps {
  showFooter?: boolean;
}

export default function CryptoServicesPage({ showFooter = true }: ServicesPageProps) {
  return (
    <div className="min-h-screen bg-black">
      <ServicesSection />
      
      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
}



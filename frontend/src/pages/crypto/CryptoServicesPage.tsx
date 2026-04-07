import ServicesSection from '../../components/crypto/ServicesSection';
import CryptoFooter from '../../components/crypto/CryptoFooter';

interface ServicesPageProps {
  showFooter?: boolean;
}

export default function CryptoServicesPage({ showFooter = true }: ServicesPageProps) {
  return (
    <div className="min-h-screen bg-black">
      <ServicesSection />
      
      {/* Footer */}
      {showFooter && <CryptoFooter />}
    </div>
  );
}



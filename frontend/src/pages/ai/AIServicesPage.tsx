import ServicesSection from '../../components/crypto/ServicesSection';
import { aiServicesData } from '../../constants/ai/aiServicesData';

export default function AIServicesPage() {
  return (
    <div className="min-h-screen bg-black">
      <ServicesSection dataOverride={aiServicesData} />
    </div>
  );
}

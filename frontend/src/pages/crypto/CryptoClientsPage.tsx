import TrustedBySection from '../../components/crypto/TrustedBySection';
import ClientsHero from '../../components/crypto/clients/ClientsHero';
import ClientsCTA from '../../components/crypto/clients/ClientsCTA';

export default function CryptoClientsPage() {
  return (
    <div className="min-h-screen bg-black">
      <ClientsHero />
      <TrustedBySection />
      <ClientsCTA />
    </div>
  );
}



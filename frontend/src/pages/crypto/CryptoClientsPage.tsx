import Footer from '../../components/Footer';
import TrustedBySection from '../../components/TrustedBySection';
import ClientsHero from '../../components/crypto/clients/ClientsHero';
import ClientsCTA from '../../components/crypto/clients/ClientsCTA';

export default function CryptoClientsPage() {
  return (
    <div className="min-h-screen bg-black">
      <ClientsHero />
      <TrustedBySection />
      <ClientsCTA />
      <Footer />
    </div>
  );
}



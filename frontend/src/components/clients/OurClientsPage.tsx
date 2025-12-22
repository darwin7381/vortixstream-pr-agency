import Footer from '../Footer';
import TrustedBySection from '../TrustedBySection';
import ClientsHero from './ClientsHero';
import ClientsCTA from './ClientsCTA';

export default function OurClientsPage() {
  return (
    <div className="min-h-screen bg-black">
      <ClientsHero />
      <TrustedBySection />
      <ClientsCTA />
      <Footer />
    </div>
  );
}



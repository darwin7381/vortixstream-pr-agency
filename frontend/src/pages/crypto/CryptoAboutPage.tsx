import CryptoFooter from '../../components/crypto/CryptoFooter';
import AboutHero from '../../components/crypto/about/AboutHero';
import AboutTeam from '../../components/crypto/about/AboutTeam';
import StatsSection from '../../components/crypto/StatsSection';

export default function CryptoAboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <AboutHero />
      <StatsSection />
      <AboutTeam />
      <CryptoFooter />
    </div>
  );
}



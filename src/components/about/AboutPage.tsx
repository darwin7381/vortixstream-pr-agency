import Footer from '../Footer';
import AboutHero from './AboutHero';
import AboutTeam from './AboutTeam';
import StatsSection from '../StatsSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <AboutHero />
      <StatsSection />
      <AboutTeam />
      <Footer />
    </div>
  );
}

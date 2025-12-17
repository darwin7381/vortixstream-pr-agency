import Footer from '../Footer';
import AboutHero from './AboutHero';
import AboutTeam from './AboutTeam';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <AboutHero />
      <AboutTeam />
      <Footer />
    </div>
  );
}

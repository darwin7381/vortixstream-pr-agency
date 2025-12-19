import Footer from '../Footer';
import TemplateHero from './TemplateHero';
import TemplateContent from './TemplateContent';

export default function TemplatePage() {
  return (
    <div className="min-h-screen bg-black">
      <TemplateHero />
      <TemplateContent />
      <Footer />
    </div>
  );
}



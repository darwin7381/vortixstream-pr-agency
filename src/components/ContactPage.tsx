import PricingContactForm from './PricingContactForm';
import Footer from './Footer';
import ContactHero from './contact/ContactHero';
import ContactInfo from './contact/ContactInfo';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black">
      <ContactHero />
      <PricingContactForm />
      <ContactInfo />
      <Footer />
    </div>
  );
}


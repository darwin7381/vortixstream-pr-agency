import PricingContactForm from './crypto/PricingContactForm';
import CryptoFooter from './crypto/CryptoFooter';
import ContactHero from './contact/ContactHero';
import ContactInfo from './contact/ContactInfo';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black">
      <ContactHero />
      <PricingContactForm />
      <ContactInfo />
      <CryptoFooter />
    </div>
  );
}




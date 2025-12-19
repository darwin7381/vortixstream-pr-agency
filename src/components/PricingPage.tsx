import { useState, useEffect, useRef } from 'react';
import PricingCard from './PricingCard';
import FAQSection from './FAQSection';
import PricingContactForm from './PricingContactForm';
import PricingCommitment from './PricingCommitment';
import LogoCarousel from './LogoCarousel';
import Footer from './Footer';
import { pricingPlans } from '../constants/pricingData';
import { faqs } from '../constants/faqData';

interface PricingPageProps {
  showFooter?: boolean;
}

export default function PricingPage({ showFooter = true }: PricingPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section 
        ref={sectionRef}
        className="relative bg-black py-section-small md:py-section-large overflow-hidden"
      >
        {/* Dynamic Universe Background */}
        <div className="absolute inset-0">
          {/* Base Gradient Background */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(255,116,0,0.12) 0%, transparent 45%),
                radial-gradient(circle at 80% 70%, rgba(29,53,87,0.15) 0%, transparent 50%),
                linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)
              `
            }}
          />
          
          {/* Floating Particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${10 + (i * 4.5) % 80}%`,
                top: `${15 + (i * 7) % 70}%`,
                animation: `float-particle ${2.5 + (i % 3) * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container-large px-[17px] md:px-0">
          {/* Section Title */}
          <div className="text-center mb-12 md:mb-20 max-w-content-xlarge mx-auto">
            <div 
              className={`mb-4 transition-all duration-1300 ${
                isVisible 
                ? 'opacity-100 transform translate-y-0 blur-0' 
                : 'opacity-0 transform translate-y-2 blur-sm'
              }`}
              style={{ transitionDelay: '0.3s' }}
            >
              <span className="text-white text-sm md:text-base" style={{ fontWeight: '600' }}>
                Pricing
              </span>
            </div>
            <h1 
              className={`text-white text-3xl sm:text-4xl md:text-5xl xl:text-6xl mb-6 transition-all duration-1400 ${
                isVisible 
                ? 'opacity-100 transform translate-y-0 blur-0' 
                : 'opacity-0 transform translate-y-3 blur-sm'
              }`}
              style={{ 
                fontFamily: 'Space Grotesk, sans-serif', 
                fontWeight: 'medium', 
                letterSpacing: '-0.02em',
                transitionDelay: '0.6s'
              }}
            >
              Choose Your Perfect Plan
            </h1>
            <p 
              className={`text-white text-base md:text-lg opacity-80 transition-all duration-1300 ${
                isVisible 
                ? 'opacity-80 transform translate-y-0 blur-0' 
                : 'opacity-0 transform translate-y-2 blur-sm'
              }`}
              style={{ transitionDelay: '0.9s' }}
            >
              From startups to enterprises, we have the right package to amplify your story and reach your audience.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`transition-all duration-1400 ${
                  isVisible 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-0 transform translate-y-4'
                }`}
                style={{ transitionDelay: `${1.2 + index * 0.3}s` }}
              >
                <PricingCard
                  name={plan.name}
                  price={plan.price}
                  description={plan.description}
                  features={plan.features}
                  isPopular={plan.isPopular}
                  className={plan.isPopular ? 'lg:scale-105 lg:z-10' : ''}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <section className="bg-black py-section-medium">

        <LogoCarousel />
      </section>

      {/* FAQ Section */}
      <FAQSection 
        faqs={faqs}
        variant="default"
        maxWidth="default"
        showCTA={false}
      />

      {/* Contact Form */}
      <PricingContactForm />

      {/* Commitment Section */}
      <PricingCommitment />

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
}
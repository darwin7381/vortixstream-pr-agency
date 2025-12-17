import { useState, useEffect, useRef } from 'react';
import PricingCard from '../PricingCard';
import { pricingPlans } from '../../constants/pricingData';

export default function PricingCards() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section ref={sectionRef} className="bg-black py-section-medium">
      <div className="container-large px-[17px] md:px-0">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`transition-all duration-1400 ${
                isVisible 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform translate-y-4'
              }`}
              style={{ transitionDelay: `${0.2 + index * 0.3}s` }}
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
  );
}

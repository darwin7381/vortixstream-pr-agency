import { useState, useEffect, useRef } from 'react';
import imgHeader69 from "figma:asset/011184c5e7bdd0650ef3ae611cc4753b68515de2.png";

export default function ClientsHero() {
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
    <section 
      ref={sectionRef}
      className="relative bg-black py-section-small md:py-section-large overflow-hidden"
      style={{ 
        backgroundImage: `url('${imgHeader69}')`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%'
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Dynamic Universe Background */}
      <div className="absolute inset-0">
        {/* Base Gradient Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 25% 35%, rgba(29,53,87,0.18) 0%, transparent 50%),
              radial-gradient(circle at 75% 65%, rgba(255,116,0,0.06) 0%, transparent 40%),
              radial-gradient(circle at 50% 80%, rgba(16,34,68,0.12) 0%, transparent 45%),
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
        <div className="text-center max-w-content-xlarge mx-auto">
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
              transitionDelay: '0.3s'
            }}
          >
            Trusted by Industry Leaders
          </h1>
          <p 
            className={`text-white text-base md:text-lg opacity-80 transition-all duration-1300 ${
              isVisible 
              ? 'opacity-80 transform translate-y-0 blur-0' 
              : 'opacity-0 transform translate-y-2 blur-sm'
            }`}
            style={{ transitionDelay: '0.6s' }}
          >
            Join hundreds of successful companies who trust us with their PR needs
          </p>
        </div>
      </div>
    </section>
  );
}

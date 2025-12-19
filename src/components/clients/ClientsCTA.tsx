import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { handleGetStartedClick } from '../../utils/navigationHelpers';
import imgHeader69 from "figma:asset/011184c5e7bdd0650ef3ae611cc4753b68515de2.png";

export default function ClientsCTA() {
  const navigate = useNavigate();
  const location = useLocation();
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
      className="relative bg-black py-section-large overflow-hidden"
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
        <div className="text-center max-w-content-xlarge mx-auto">
          <div 
            className={`transition-all duration-1400 ${
              isVisible 
              ? 'opacity-100 transform translate-y-0 blur-0' 
              : 'opacity-0 transform translate-y-4 blur-sm'
            }`}
            style={{ transitionDelay: '0.3s' }}
          >
            <h2 
              className="text-white text-3xl sm:text-4xl md:text-5xl mb-6"
              style={{ 
                fontFamily: 'Space Grotesk, sans-serif', 
                fontWeight: 'medium', 
                letterSpacing: '-0.02em'
              }}
            >
              Elevate Your Media Presence
            </h2>
          </div>
          <div 
            className={`transition-all duration-1300 ${
              isVisible 
              ? 'opacity-100 transform translate-y-0 blur-0' 
              : 'opacity-0 transform translate-y-2 blur-sm'
            }`}
            style={{ transitionDelay: '0.7s' }}
          >
            <p className="text-white text-base md:text-lg opacity-80 mb-6 md:mb-8">
              Let us help amplify your brand's voice and reach your target audience through strategic media placement.
            </p>
          </div>
          <div 
            className={`transition-all duration-1300 ${
              isVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-4'
            }`}
            style={{ transitionDelay: '1.1s' }}
          >
            <Button 
              onClick={() => handleGetStartedClick(navigate, location.pathname)}
              className="
                border border-[#FF7400] text-white overflow-hidden
                px-8 py-[20px] rounded-md transition-all duration-300
                hover:scale-105 hover:shadow-[0_0_25px_rgba(255,116,0,0.4)]
                text-[12px] md:text-[16px] font-medium
                before:absolute before:inset-0 before:bg-black/20 before:opacity-0 before:transition-opacity before:duration-300
                hover:before:opacity-100 relative
              "
              style={{ 
                background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' 
              }}
            >
              <span className="relative z-10">Get Started</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}




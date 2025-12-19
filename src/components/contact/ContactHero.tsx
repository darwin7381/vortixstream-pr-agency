import { useState, useEffect, useRef } from 'react';
import imgHeader69 from "figma:asset/011184c5e7bdd0650ef3ae611cc4753b68515de2.png";

export default function ContactHero() {
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
        <div className="text-center max-w-content-xlarge mx-auto">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF7400]/10 to-[#1D3557]/10 border border-white/10 mb-8 transition-all duration-1000 ${
              isVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-4'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            <div className="w-2 h-2 bg-[#FF7400] rounded-full animate-pulse" />
            <span className="text-white/80 text-sm font-medium">We're Here to Help</span>
          </div>

          {/* Main Title */}
          <h1 
            className={`text-white text-4xl sm:text-5xl md:text-6xl xl:text-7xl mb-6 leading-tight transition-all duration-1400 ${
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
            Let's Build Something
            <span className="block mt-2">
              <span 
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, #FF7400 0%, #1D3557 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Amazing Together
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p 
            className={`text-white/70 text-base md:text-lg xl:text-xl max-w-3xl mx-auto mb-12 leading-relaxed transition-all duration-1300 ${
              isVisible 
              ? 'opacity-100 transform translate-y-0 blur-0' 
              : 'opacity-0 transform translate-y-2 blur-sm'
            }`}
            style={{ transitionDelay: '0.6s' }}
          >
            Whether you're looking to amplify your brand, launch a groundbreaking product, or establish thought leadership in the blockchain and AI space, our team is ready to turn your vision into reality.
          </p>

          {/* Stats Grid */}
          <div 
            className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto transition-all duration-1200 ${
              isVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-6'
            }`}
            style={{ transitionDelay: '0.9s' }}
          >
            {[
              { value: '24h', label: 'Response Time' },
              { value: '500+', label: 'Projects Delivered' },
              { value: '95%', label: 'Client Satisfaction' },
              { value: '150+', label: 'Media Partners' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/8 hover:border-white/20 transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div 
                    className="text-2xl md:text-3xl font-bold mb-1"
                    style={{
                      background: 'linear-gradient(135deg, #FF7400 0%, #1D3557 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-xs md:text-sm">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}




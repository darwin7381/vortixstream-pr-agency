import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { publisherStats, publisherContent } from '../constants/publisherData';
import svgPaths from "../imports/svg-pn1p9ady5y";

export default function PublisherHeroSection() {
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
      className="relative bg-[#4c4c4c] py-section-large overflow-hidden"
    >
      {/* Dynamic Universe Background */}
      <div className="absolute inset-0">
        {/* Base Gradient Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 25% 35%, rgba(29,53,87,0.15) 0%, transparent 50%),
              radial-gradient(circle at 75% 65%, rgba(255,116,0,0.08) 0%, transparent 40%),
              radial-gradient(circle at 50% 80%, rgba(16,34,68,0.12) 0%, transparent 45%),
              linear-gradient(135deg, #4c4c4c 0%, #2a2a2a 50%, #4c4c4c 100%)
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

      <div className="relative z-10 container-global">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center publisher-hero-layout">
            {/* Content */}
            <div className="flex-1 space-y-6 lg:space-y-8 publisher-hero-content">
              {/* Tagline */}
              <div 
                className={`transition-all duration-1300 ${
                  isVisible 
                    ? 'opacity-100 transform translate-y-0 blur-0' 
                    : 'opacity-0 transform translate-y-2 blur-sm'
                }`}
                style={{ transitionDelay: '0.3s' }}
              >
                <p className="text-white text-[12px] md:text-[16px] publisher-hero-tagline font-semibold">
                  {publisherContent.hero.tagline}
                </p>
              </div>

              {/* Main Heading */}
              <div 
                className={`transition-all duration-1400 ${
                  isVisible 
                    ? 'opacity-100 transform translate-y-0 blur-0' 
                    : 'opacity-0 transform translate-y-3 blur-sm'
                }`}
                style={{ transitionDelay: '0.6s' }}
              >
                <h1 
                  className="text-white text-[32px] md:text-[52px] publisher-hero-title font-medium leading-[1.2] tracking-[-0.32px] md:tracking-[-0.52px]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {publisherContent.hero.title}
                </h1>
              </div>

              {/* Description */}
              <div 
                className={`transition-all duration-1300 ${
                  isVisible 
                    ? 'opacity-100 transform translate-y-0 blur-0' 
                    : 'opacity-0 transform translate-y-2 blur-sm'
                }`}
                style={{ transitionDelay: '0.9s' }}
              >
                <p className="text-white text-[12px] md:text-[18px] publisher-hero-description opacity-90">
                  {publisherContent.hero.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div 
                className={`flex flex-col sm:flex-row gap-4 sm:gap-6 transition-all duration-1300 ${
                  isVisible 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-4'
                }`}
                style={{ transitionDelay: '1.2s' }}
              >
                <Button 
                  className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black px-8 py-[20px] text-[12px] md:text-[16px] publisher-hero-button-text font-medium rounded-md transition-all duration-300"
                >
                  {publisherContent.hero.buttons.primary}
                </Button>
                <Button
                  variant="ghost"
                  className="text-white hover:text-[#FF7400] hover:bg-transparent px-8 py-[20px] text-[12px] md:text-[16px] publisher-hero-button-text font-medium rounded-md transition-all duration-500 ease-in-out hover:animate-[text-pulse_2s_ease-in-out_infinite] hover:[text-shadow:0_0_6px_rgba(255,116,0,0.4),0_0_12px_rgba(255,116,0,0.2),0_0_18px_rgba(255,116,0,0.1)] flex items-center gap-2"
                >
                  {publisherContent.hero.buttons.secondary}
                  <svg className="w-4 h-4 md:w-6 md:h-6 transition-colors duration-500" fill="none" viewBox="0 0 24 24">
                    <path d={svgPaths.p116eba00} fill="currentColor" stroke="currentColor" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 space-y-8 lg:space-y-12 publisher-hero-stats">
              <div className="grid grid-cols-2 gap-6 lg:gap-8">
                {publisherStats.map((stat, index) => (
                  <div 
                    key={stat.label}
                    className={`relative border-l-2 border-white pl-6 lg:pl-8 transition-all duration-1400 ${
                      isVisible 
                        ? 'opacity-100 transform translate-y-0' 
                        : 'opacity-0 transform translate-y-4'
                    }`}
                    style={{ transitionDelay: `${1.0 + index * 0.2}s` }}
                  >
                    <div className="text-white text-[44px] md:text-[56px] lg:text-[80px] publisher-stat-number font-bold leading-[1.3]" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {stat.number}
                    </div>
                    <div className="text-white text-[14px] md:text-[18px] lg:text-[22px] publisher-stat-label font-medium tracking-[-0.18px] lg:tracking-[-0.22px]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
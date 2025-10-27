import { useState, useEffect, useRef } from 'react';
import { stats } from '../constants/statsData';

export default function StatsSection() {
  const [counters, setCounters] = useState([0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for triggering animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Counter animation effect
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;

    stats.forEach((stat, index) => {
      let currentStep = 0;
      const increment = stat.targetNumber / steps;

      const timer = setInterval(() => {
        currentStep++;
        const newValue = Math.min(Math.round(increment * currentStep), stat.targetNumber);
        
        setCounters(prev => {
          const newCounters = [...prev];
          newCounters[index] = newValue;
          return newCounters;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    });
  }, [isVisible]);

  // Icon components for each stat
  const StatIcon = ({ type }: { type: string }) => {
    const iconClass = "w-full h-full";
    
    switch (type) {
      case "document":
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 9H8" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        );
      case "network":
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="12" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M12 9V7M12 17V15M9 12H7M17 12H15" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        );
      case "rocket":
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 16.5C4.5 16.5 5.5 15.5 8 15.5S11.5 16.5 11.5 16.5L9 19L4.5 16.5Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M12 15L9 18" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8.5 8.5L12 5L19 2L17 9L13.5 12.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="13" cy="8" r="1" fill="currentColor"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden">
      {/* Enhanced Animated Cosmic Background */}
      <div 
        className="absolute inset-0 opacity-100"
        style={{
          background: `
            radial-gradient(circle at 15% 25%, rgba(255, 116, 0, 0.18) 0%, transparent 45%),
            radial-gradient(circle at 85% 75%, rgba(29, 53, 87, 0.22) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 116, 0, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 25% 80%, rgba(29, 53, 87, 0.15) 0%, transparent 40%),
            linear-gradient(135deg, #000000 0%, #1a1a2e 20%, #16213e 40%, #0f0f23 60%, #1a1a2e 80%, #000000 100%)
          `
        }}
      />
      
      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.2 + Math.random() * 0.3,
              animation: `float-particle ${2.5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Enhanced Grid Pattern with Gradient */}
      <div 
        className="absolute inset-0 opacity-8"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          mask: 'radial-gradient(ellipse at center, white 0%, white 70%, transparent 100%)',
          WebkitMask: 'radial-gradient(ellipse at center, white 0%, white 70%, transparent 100%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 container-global py-section-large">
          <h2 className="text-[24px] sm:text-[28px] md:text-[44px] font-medium text-white mb-8 sm:mb-10 md:mb-20 tracking-[-0.24px] sm:tracking-[-0.28px] md:tracking-[-0.44px] font-['Space_Grotesk:Medium'] text-left">
            Impact at a Glance
          </h2>
          
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="group relative h-full flex"
                style={{
                  animation: isVisible ? `stat-card-entrance 0.8s ease-out ${index * 0.2}s both` : ''
                }}
              >
                {/* Card Background with Enhanced Effects */}
                <div className="relative w-full flex flex-col bg-gradient-to-br from-white/5 via-white/8 to-white/3 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-8 transition-all duration-500 ease-out hover:border-white/25 hover:bg-gradient-to-br hover:from-white/8 hover:via-white/12 hover:to-white/5 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:scale-[1.02] group-hover:backdrop-blur-md">
                  
                  {/* Subtle Inner Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon Container */}
                  <div className="relative mb-3 sm:mb-4 md:mb-6 flex justify-start">
                    <div className="relative group/icon">
                      {/* Icon Background with Glow Effect */}
                      <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:bg-gradient-to-br group-hover/icon:from-[#FF7400]/30 group-hover/icon:to-[#1D3557]/30 group-hover/icon:border-white/40 group-hover/icon:shadow-[0_0_20px_rgba(255,116,0,0.3)]">
                        
                        {/* Icon Glow Ring */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF7400]/10 to-[#1D3557]/10 blur-sm scale-110 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" />
                        
                        {/* Icon */}
                        <div className="relative w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 text-white/90 group-hover/icon:text-white transition-colors duration-300">
                          <StatIcon type={stat.icon} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Number Display with Animation */}
                  <div className="relative mb-2 sm:mb-3 md:mb-4">
                    <div className="text-[32px] sm:text-[40px] md:text-[56px] lg:text-[64px] font-bold text-white leading-[1.1] font-['Roboto:Bold'] transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                      {isVisible ? counters[index] : 0}
                      <span className="text-[0.7em] ml-1">+</span>
                    </div>
                    
                    {/* Number Glow Effect */}
                    <div className="absolute inset-0 text-[32px] sm:text-[40px] md:text-[56px] lg:text-[64px] font-bold leading-[1.1] font-['Roboto:Bold'] opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm">
                      {isVisible ? counters[index] : 0}
                      <span className="text-[0.7em] ml-1">+</span>
                    </div>
                  </div>

                  {/* Label and Description */}
                  <div className="relative space-y-1 sm:space-y-2 flex-grow flex flex-col justify-end">
                    <h3 className="text-[13px] sm:text-[15px] md:text-[18px] lg:text-[20px] font-semibold text-white/95 tracking-[-0.13px] sm:tracking-[-0.15px] md:tracking-[-0.18px] lg:tracking-[-0.2px] font-['Space_Grotesk:SemiBold'] leading-[1.3] group-hover:text-white transition-colors duration-300">
                      {stat.label}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] md:text-[14px] text-white/70 font-['Noto_Sans:Regular'] leading-[1.4] group-hover:text-white/85 transition-colors duration-300">
                      {stat.description}
                    </p>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-1 h-1 bg-white/30 rounded-full group-hover:bg-[#FF7400] group-hover:shadow-[0_0_6px_rgba(255,116,0,0.6)] transition-all duration-300" />
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/20 rounded-full group-hover:bg-[#1D3557] group-hover:shadow-[0_0_6px_rgba(29,53,87,0.6)] transition-all duration-300 delay-100" />
                </div>

                {/* Enhanced Border Left Accent */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-10 sm:h-12 md:h-20 bg-gradient-to-b from-[#FF7400] via-white to-[#1D3557] rounded-r-full opacity-60 group-hover:opacity-100 group-hover:w-1 sm:group-hover:w-1.5 group-hover:shadow-[0_0_12px_rgba(255,116,0,0.6)] transition-all duration-500" />
              </div>
            ))}
          </div>
      </div>
    </section>
  );
}
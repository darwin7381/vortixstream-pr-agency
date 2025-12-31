import { useState, useEffect, useRef } from 'react';
import { publisherFeatures, publisherContent, publisherStats } from '../../constants/publisherData';
import svgPaths from "../../imports/svg-f7gq800qcd";
import PublisherApplicationModal from './PublisherApplicationModal';

const CheckIcon = () => (
  <div className="size-4 flex-shrink-0">
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
      <path
        clipRule="evenodd"
        d={svgPaths.p24ff3080}
        fill="white"
        fillRule="evenodd"
      />
    </svg>
  </div>
);

export default function PublisherFeaturesSection() {
  const [visibleDiff, setVisibleDiff] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const diffRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Differentiators intersection observer
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    diffRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleDiff(prev => new Set([...prev, index]));
            }
          },
          { threshold: 0.3 }
        );
        
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => observers.forEach(observer => observer.disconnect());
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden py-section-large">
      {/* CSS Animations */}
      <style>{`
        @keyframes gentle-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        .float-card {
          animation: gentle-float 4s ease-in-out infinite;
        }
      `}</style>

      {/* ServicesSection Background */}
      <div 
        className="absolute inset-0 opacity-100"
        style={{
          background: `
            radial-gradient(circle at 15% 20%, rgba(29, 53, 87, 0.18) 0%, transparent 45%),
            radial-gradient(circle at 85% 30%, rgba(255, 116, 0, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 50% 40%, rgba(29, 53, 87, 0.15) 0%, transparent 35%),
            radial-gradient(circle at 30% 70%, rgba(255, 116, 0, 0.08) 0%, transparent 40%),
            linear-gradient(135deg, #000000 0%, #16213e 15%, #1a1a2e 30%, #0f0f23 45%, #1a1a2e 60%, #161616 75%, #191919 90%, #191919 100%)
          `
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => {
          const topPosition = Math.random() * 100;
          const opacity = topPosition > 70 ? 0.1 : 0.25;
          
          return (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${topPosition}%`,
                opacity: opacity,
                animation: `float-particle ${2.5 + Math.random() * 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          );
        })}
      </div>

      {/* Enhanced Grid Pattern with Gradient Fade */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.8,
          mask: 'linear-gradient(to bottom, white 0%, white 60%, transparent 90%)',
          WebkitMask: 'linear-gradient(to bottom, white 0%, white 60%, transparent 90%)'
        }}
      />

      <div className="relative z-10 container-global">
        <div className="container-large">
          
          {/* Compact Header */}
          <h2 className="text-[40px] md:text-[52px] font-medium text-white mb-6 md:mb-8 tracking-[-0.4px] md:tracking-[-0.52px] leading-[1.1]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {publisherContent.whyPartner.title}
          </h2>

          {/* Main Layout: Left Content + Right Stats */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mb-8 md:mb-12">
            
            {/* Left: Description + CTA */}
            <div className="flex-1 space-y-5">
              <p className="text-[12px] md:text-[18px] text-white opacity-90 leading-relaxed max-w-[520px]">
                {publisherContent.whyPartner.description}
              </p>

              <div className="inline-block">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="relative flex justify-center items-center gap-2 px-6 py-[20px] rounded-md border border-[#FF7400] text-white transition-all duration-200 hover:before:absolute hover:before:inset-0 hover:before:bg-black/20 hover:before:rounded-md text-[12px] md:text-[16px] font-semibold"
                  style={{ 
                    background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' 
                  }}
                >
                  Become a Publisher Partner
                </button>
              </div>
            </div>

            {/* Right: Compact Stats Grid */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-4">
                {publisherStats.map((stat, index) => (
                  <div 
                    key={index}
                    className="group relative h-full flex"
                  >
                    <div className="relative w-full flex flex-col bg-gradient-to-br from-white/5 via-white/8 to-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all duration-500 ease-out hover:border-white/25 hover:bg-gradient-to-br hover:from-white/8 hover:via-white/12 hover:to-white/5 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:scale-[1.02]">
                      
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="flex flex-col">
                        <div className="relative mb-1.5">
                          <div className="text-[28px] md:text-[36px] font-bold text-white leading-[1.1] transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            {stat.number}
                          </div>
                        </div>

                        <div className="relative">
                          <h3 className="text-[11px] md:text-[13px] font-semibold text-white/95 tracking-[-0.11px] md:tracking-[-0.13px] leading-[1.3] group-hover:text-white transition-colors duration-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            {stat.label}
                          </h3>
                        </div>
                      </div>

                      <div className="absolute top-3 right-3 w-1 h-1 bg-white/30 rounded-full group-hover:bg-[#FF7400] group-hover:shadow-[0_0_6px_rgba(255,116,0,0.6)] transition-all duration-300" />
                    </div>

                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-gradient-to-b from-[#FF7400] via-white to-[#1D3557] rounded-r-full opacity-60 group-hover:opacity-100 group-hover:w-1 group-hover:shadow-[0_0_12px_rgba(255,116,0,0.6)] transition-all duration-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compact Features List - 動態佈局 */}
          <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {publisherFeatures.map((item, index) => (
                <div 
                  key={index}
                  ref={el => { diffRefs.current[index] = el; }}
                  className={`group relative transition-all duration-1000 ease-out ${
                    visibleDiff.has(index) 
                      ? 'opacity-100 translate-y-0 translate-x-0 float-card' 
                      : 'opacity-0 translate-y-6 -translate-x-4'
                  }`}
                  style={{ 
                    transitionDelay: `${0.3 + index * 0.15}s`,
                    animationDelay: `${index * 0.3}s`
                  }}
                >
                  <div className="relative flex items-center gap-4 p-4 md:p-5 rounded-xl bg-gradient-to-br from-white/[0.03] via-white/[0.05] to-white/[0.02] border border-white/5 hover:border-white/15 hover:from-white/[0.05] hover:to-white/[0.03] transition-all duration-500 hover:scale-[1.01] hover:-translate-y-0.5">
                    
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative flex-shrink-0">
                      <CheckIcon />
                    </div>
                    
                    <div className="relative flex-1">
                      <h3 className="text-white text-[16px] md:text-[20px] font-medium leading-[1.3] tracking-[-0.16px] md:tracking-[-0.2px] mb-1.5 group-hover:text-white transition-colors duration-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {item.title}
                      </h3>
                      <p className="text-white/90 text-[12px] md:text-[14px] opacity-90 leading-[1.5] group-hover:opacity-100 transition-opacity duration-300">
                        {item.description}
                      </p>
                    </div>

                    <div className="absolute top-3 right-3 w-1 h-1 bg-white/20 rounded-full group-hover:bg-[#FF7400] group-hover:shadow-[0_0_6px_rgba(255,116,0,0.6)] transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Publisher Application Modal */}
      <PublisherApplicationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}

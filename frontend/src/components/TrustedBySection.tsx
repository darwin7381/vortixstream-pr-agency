import { useState, useEffect, useRef } from 'react';
import svgPaths from "../imports/svg-f7gq800qcd";

interface TrustedBySectionProps {
  showTitle?: boolean;
  title?: string;
}

export default function TrustedBySection({ 
  showTitle = false, 
  title = "Trusted by industry leaders" 
}: TrustedBySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Section intersection observer
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

  // Enhanced Logo Card Component with larger size for better brand visibility
  const LogoCard = ({ 
    variant, 
    style = 'gradient',
    className = '',
    index = 0
  }: { 
    variant: 'a' | 'b';
    style?: 'default' | 'gradient' | 'border' | 'glow' | 'minimal';
    className?: string;
    index?: number;
  }) => {
    const getCardStyles = () => {
      switch (style) {
        case 'gradient':
          return 'bg-gradient-to-br from-[#FF7400] via-[#1D3557] to-[#FF7400] p-[0.8px] hover:p-[1.6px] transition-all duration-300';
        case 'border':
          return 'bg-[#191919] border border-white/20 hover:border-[#FF7400] transition-all duration-300';
        case 'glow':
          return 'bg-[#191919] hover:bg-gradient-to-br hover:from-[#FF7400]/10 hover:to-[#1D3557]/10 hover:shadow-[0_0_30px_rgba(255,116,0,0.2)] transition-all duration-500';
        case 'minimal':
          return 'bg-transparent border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300';
        default:
          return 'bg-[#191919] hover:bg-[#1f1f1f] transition-all duration-300';
      }
    };

    // Larger logo sizes for better brand visibility
    const getInnerContent = () => (
      <div className={`h-[28px] sm:h-[36px] lg:h-[40px] w-[180px] sm:w-[220px] lg:w-[240px] mx-auto ${style === 'gradient' ? 'filter brightness-110' : ''}`}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 140 56">
          {variant === 'a' ? (
            <g>
              <path
                clipRule="evenodd"
                d={svgPaths.pa2af180}
                fill="white"
                fillRule="evenodd"
              />
              <path d={svgPaths.p17de2200} fill="white" />
              <path
                clipRule="evenodd"
                d={svgPaths.p13bdce00}
                fill="white"
                fillRule="evenodd"
              />
              <path d={svgPaths.p28c4400} fill="white" />
              <path
                clipRule="evenodd"
                d={svgPaths.p240e7470}
                fill="white"
                fillRule="evenodd"
              />
              <path d={svgPaths.p29af83f0} fill="white" />
              <path
                clipRule="evenodd"
                d={svgPaths.p3e155c00}
                fill="white"
                fillRule="evenodd"
              />
              <path d={svgPaths.p2759ce70} fill="white" />
            </g>
          ) : (
            <path
              clipRule="evenodd"
              d={svgPaths.p36cda200}
              fill="white"
              fillRule="evenodd"
            />
          )}
        </svg>
      </div>
    );

    const animationClass = isVisible 
      ? `opacity-100 translate-y-0 scale-100` 
      : `opacity-0 translate-y-4 scale-95`;

    if (style === 'gradient') {
      return (
        <div className={`${getCardStyles()} rounded-xl sm:rounded-2xl h-[144px] sm:h-[168px] lg:h-[180px] w-full cursor-pointer group transition-all duration-1000 hover:scale-[1.02] ${animationClass} ${className}`} style={{ transitionDelay: `${index * 0.12}s` }}>
          <div className="bg-[#191919] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 h-full w-full flex items-center justify-center group-hover:bg-[#1f1f1f] transition-all duration-300">
            {getInnerContent()}
          </div>
        </div>
      );
    }

    return (
      <div className={`${getCardStyles()} rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 h-[144px] sm:h-[168px] lg:h-[180px] w-full flex items-center justify-center cursor-pointer group transition-all duration-1000 hover:scale-[1.02] ${animationClass} ${className}`} style={{ transitionDelay: `${index * 0.12}s` }}>
        {getInnerContent()}
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="relative py-section-small md:py-section-medium overflow-hidden" style={{
        background: `
          linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 50%, #1a1a1a 100%)
        `
      }}>
      {/* Clean Minimal Background - No Animation */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, rgba(29, 53, 87, 0.03) 0%, transparent 50%, rgba(16, 34, 68, 0.02) 100%)
          `
        }}
      />

      <div className="relative z-10 container-large px-[20px] xl:px-[64px] mx-auto">
        <div className="max-w-[1400px] mx-auto">
          {/* Optional Title Section */}
          {showTitle && (
            <div 
              className={`text-center mb-10 md:mb-16 transition-all duration-1300 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '0.4s' }}
            >
              <p className="text-[12px] md:text-[18px] font-bold text-white font-sans font-bold">
                {title}
              </p>
            </div>
          )}
          
          {/* Enhanced Responsive Grid Layout with Staggered Animation */}
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              <LogoCard variant="a" index={0} />
              <LogoCard variant="b" index={1} />
              <LogoCard variant="a" index={2} />
              <LogoCard variant="b" index={3} />
              <LogoCard variant="a" index={4} />
              <LogoCard variant="b" index={5} />
            </div>
            
            {/* Row 2 */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              <LogoCard variant="b" index={6} />
              <LogoCard variant="a" index={7} />
              <LogoCard variant="b" index={8} />
              <LogoCard variant="a" index={9} />
              <LogoCard variant="b" index={10} />
              <LogoCard variant="a" index={11} />
            </div>
            
            {/* Row 3 */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              <LogoCard variant="a" index={12} />
              <LogoCard variant="b" index={13} />
              <LogoCard variant="a" index={14} />
              <LogoCard variant="b" index={15} />
              <LogoCard variant="a" index={16} />
              <LogoCard variant="b" index={17} />
            </div>
            
            {/* Row 4 */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              <LogoCard variant="b" index={18} />
              <LogoCard variant="a" index={19} />
              <LogoCard variant="b" index={20} />
              <LogoCard variant="a" index={21} />
              <LogoCard variant="b" index={22} />
              <LogoCard variant="a" index={23} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
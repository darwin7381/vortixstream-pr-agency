/**
 * ⚠️ 重要原則：
 * 1. ❌ 禁止 fallback
 * 2. ❌ 禁止檢查邏輯
 * 3. ✅ 使用 map 動態渲染所有 logo
 */
import { useState, useEffect, useRef } from 'react';

interface PartnerLogo {
  id: number;
  name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
}

interface TrustedBySectionProps {
  showTitle?: boolean;
  title?: string;
}

export default function TrustedBySection({ 
  showTitle = false, 
  title = "Trusted by industry leaders" 
}: TrustedBySectionProps) {
  const [partners, setPartners] = useState<PartnerLogo[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/public/content/partners')
      .then(res => res.json())
      .then(setPartners)
      .catch(console.error);
  }, []);

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

  const LogoCard = ({ logo, index }: { logo: PartnerLogo; index: number }) => {
    const animationClass = isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95';

    return (
      <div 
        className={`bg-gradient-to-br from-[#FF7400] via-[#1D3557] to-[#FF7400] p-[0.8px] hover:p-[1.2px] rounded-xl h-[120px] sm:h-[140px] w-full cursor-pointer group transition-all duration-1000 hover:scale-[1.02] ${animationClass}`} 
        style={{ transitionDelay: `${index * 0.12}s` }}
        onClick={() => logo.website_url && window.open(logo.website_url, '_blank')}
      >
        <div className="bg-[#191919] rounded-xl p-4 h-full w-full flex items-center justify-center group-hover:bg-[#1f1f1f] transition-all duration-300">
          <img 
            src={logo.logo_url} 
            alt={logo.name}
            className="max-h-full max-w-full object-contain filter brightness-110"
            loading="lazy"
          />
        </div>
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
          
          {/* 動態渲染所有合作夥伴 Logo */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {partners.map((logo, index) => (
              <LogoCard key={logo.id} logo={logo} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
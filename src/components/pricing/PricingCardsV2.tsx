import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PackageCardV2 from './PackageCardV2';
import PackageDetailModal from './PackageDetailModal';
import { pricingPackagesV2, Package } from '../../constants/pricingDataV2';
import { handleContactClick } from '../../utils/navigationHelpers';

export default function PricingCardsV2() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
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
    <>
      <section 
        ref={sectionRef} 
        id="packages-section" 
        className="relative w-full overflow-hidden py-section-large"
      >
        {/* Extended Cosmic Background with Smooth Transition - Same as What We Offer */}
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
        
        {/* Floating Particles - Fading Distribution */}
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
        
        {/* Bottom Fade Overlay for Seamless Transition */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, rgba(25,25,25,0.3) 40%, rgba(25,25,25,0.7) 70%, rgba(25,25,25,0.9) 90%, #191919 100%)`
          }}
        />

        {/* Content */}
        <div className="relative z-10 container-large px-[17px] md:px-[17px]">
          {/* Section Header */}
          <div 
            className={`text-center max-w-4xl mx-auto mb-12 md:mb-20 transition-all duration-1000 ${
              isVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-4'
            }`}
          >
            <div 
              className="mb-3 md:mb-4 transition-all duration-1300"
              style={{ transitionDelay: '0.3s' }}
            >
              <span className="text-[16px] font-semibold text-white">
                Packages
              </span>
            </div>
            <h2 
              className="text-[40px] md:text-[52px] font-medium text-white mb-5 md:mb-6 tracking-[-0.4px] md:tracking-[-0.52px] transition-all duration-1400"
              style={{ 
                fontFamily: 'Space Grotesk, sans-serif',
                transitionDelay: '0.7s'
              }}
            >
              PACKAGES
            </h2>
            <p 
              className="text-[12px] md:text-[18px] text-white/80 transition-all duration-1300"
              style={{ transitionDelay: '1.1s' }}
            >
              Global distribution, Asia-market localization and founder-focused plans. Below is a high-level view; each package can be customized.
            </p>
          </div>

          {/* Three Column Layout - No borders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingPackagesV2.map((category, categoryIndex) => (
              <div 
                key={category.id}
                className={`
                  transition-all duration-1000
                  ${isVisible 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-6'
                  }
                `}
                style={{ transitionDelay: `${categoryIndex * 150}ms` }}
              >
                {/* Category Header */}
                <div className="mb-6">
                  <h3 
                    className="text-white text-2xl md:text-3xl font-bold mb-3"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {category.title}
                  </h3>
                  {category.badges && (
                    <div className="flex flex-wrap items-center gap-2">
                      {category.badges.map((badge, badgeIndex) => (
                        <span
                          key={badgeIndex}
                          className="
                            px-3 py-1 rounded-full text-xs
                            bg-white/5 border border-white/10 text-white/60
                            transition-all duration-300
                          "
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Package Cards - Stacked vertically */}
                <div className="space-y-6">
                  {category.packages.map((pkg) => (
                    <PackageCardV2
                      key={pkg.id}
                      package={pkg}
                      onViewDetails={() => setSelectedPackage(pkg)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div 
            className={`mt-16 text-center transition-all duration-1000 ${
              isVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-4'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <div className="inline-block p-8 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-2xl max-w-2xl">
              <h3 
                className="text-white text-xl md:text-2xl font-semibold mb-3"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Need a Custom Package?
              </h3>
              <p className="text-white/60 text-base mb-6">
                Every project is unique. Let's discuss how we can tailor our services to meet your specific needs and goals.
              </p>
              <button
                onClick={() => handleContactClick(navigate, location.pathname)}
                className="
                  px-8 py-3 rounded-lg font-medium text-white text-sm
                  border border-[#FF7400]
                  hover:scale-105 hover:shadow-[0_0_25px_rgba(255,116,0,0.3)]
                  transition-all duration-300
                  relative overflow-hidden
                  before:absolute before:inset-0 before:bg-black/20 before:opacity-0 before:transition-opacity before:duration-300
                  hover:before:opacity-100
                "
                style={{
                  background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)'
                }}
              >
                <span className="relative z-10">Contact Us</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <PackageDetailModal
        package={selectedPackage!}
        isOpen={!!selectedPackage}
        onClose={() => setSelectedPackage(null)}
      />
    </>
  );
}

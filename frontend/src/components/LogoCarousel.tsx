import { useEffect, useState } from 'react';
import { contentAPI, CarouselLogo as CarouselLogoType } from '../api/client';

export default function LogoCarousel() {
  const [logos, setLogos] = useState<CarouselLogoType[]>([]);
  const [subtitle, setSubtitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 從 CMS 載入跑馬燈 Logo 和副標題
    const fetchData = async () => {
      try {
        // 載入 Logos
        const logosData = await contentAPI.getCarouselLogos();
        setLogos(logosData);

        // 載入副標題（無條件使用 CMS 值，包括空字串）
        const settingsData = await contentAPI.getSiteSettings();
        setSubtitle(settingsData.carousel_subtitle || '');
      } catch (error) {
        console.error('Failed to fetch carousel data:', error);
        setLogos([]);
        setSubtitle('');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 如果正在載入或沒有 logo，則顯示佔位符或隱藏
  if (loading || logos.length === 0) {
    return null;
  }

  const MediaLogo = ({ logo }: { logo: CarouselLogoType }) => (
    <div className="h-12 md:h-16 w-auto flex-shrink-0 flex items-center justify-center group cursor-pointer">
      <img 
        src={logo.logo_url} 
        alt={logo.alt_text || logo.name}
        title={logo.name}
        className="h-full w-auto object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          filter: 'grayscale(100%)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.filter = 'grayscale(0%)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = 'grayscale(100%)';
        }}
        loading="lazy"
      />
    </div>
  );

  return (
    <section className="relative w-full overflow-hidden py-8 md:py-12">
      {/* Subtle Cosmic Background for Continuity */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(circle at 25% 30%, rgba(255, 116, 0, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 70%, rgba(29, 53, 87, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 116, 0, 0.05) 0%, transparent 40%),
            linear-gradient(135deg, #000000 0%, #1a1a2e 30%, #16213e 50%, #1a1a2e 70%, #000000 100%)
          `
        }}
      />
      
      {/* Light Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-15"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Very Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Small Subtitle - Only show if subtitle exists */}
        {subtitle && (
          <div className="text-center mb-6 md:mb-8 px-5 md:px-16">
            <p className="text-[11px] md:text-[16px] text-white/70 font-sans leading-[1.4]">
              {subtitle}
            </p>
          </div>
        )}
        
        {/* Full Width Carousel Container */}
        <div className="relative w-full overflow-hidden">
          {/* Carousel Track */}
          <div 
            className="flex items-center gap-8 md:gap-12"
            style={{
              animation: 'logo-scroll 30s linear infinite',
              width: 'max-content'
            }}
          >
            {/* First set of logos */}
            {logos.map((logo) => (
              <div key={`set1-${logo.id}`} className="flex items-center gap-8 md:gap-12">
                <MediaLogo logo={logo} />
              </div>
            ))}
            
            {/* Second set of logos (duplicate for seamless loop) */}
            {logos.map((logo) => (
              <div key={`set2-${logo.id}`} className="flex items-center gap-8 md:gap-12">
                <MediaLogo logo={logo} />
              </div>
            ))}
            
            {/* Third set of logos (duplicate for seamless loop) */}
            {logos.map((logo) => (
              <div key={`set3-${logo.id}`} className="flex items-center gap-8 md:gap-12">
                <MediaLogo logo={logo} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Gradient Overlays to fade edges */}
        <div className="absolute top-0 left-0 w-32 md:w-48 h-full bg-gradient-to-r from-black via-black/50 to-transparent pointer-events-none z-20" />
        <div className="absolute top-0 right-0 w-32 md:w-48 h-full bg-gradient-to-l from-black via-black/50 to-transparent pointer-events-none z-20" />
      </div>
    </section>
  );
}
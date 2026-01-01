/**
 * ⚠️ 重要原則：
 * 1. ❌ 禁止 fallback
 * 2. ❌ 禁止檢查邏輯
 * 3. ✅ 使用 API 動態載入
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";

interface TypewriterProps {
  words: string[];
}

function TypewriterText({ words }: TypewriterProps) {
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  // 找出最長的詞語來設定容器最小寬度
  const longestWord = words.reduce((longest, word) => 
    word.length > longest.length ? word : longest, ''
  );

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    if (isWaiting) {
      const waitTimeout = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(waitTimeout);
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        } else {
          setCurrentText(currentWord.substring(0, currentText.length - 1));
        }
      } else {
        if (currentText === currentWord) {
          setIsWaiting(true);
        } else {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
        }
      }
    }, isDeleting ? 100 : 200);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, isWaiting, currentWordIndex, words]);

  return (
    <span className="text-[#FF7400] inline-block relative">
      {/* 隱藏的最長文字，用來撐開容器寬度 */}
      <span className="invisible absolute">{longestWord}</span>
      {/* 實際顯示的打字機文字 */}
      <span className="relative">
        {currentText}
        <span className="animate-pulse">|</span>
      </span>
    </span>
  );
}


export default function HeroNewSection() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [heroData, setHeroData] = useState<any>(null);
  const [mediaLogos, setMediaLogos] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    fetch(`${import.meta.env.VITE_API_URL}/public/content/hero/home`)
      .then(r => r.json())
      .then(setHeroData)
      .catch(console.error);
    fetch(`${import.meta.env.VITE_API_URL}/public/content/hero/home/logos`)
      .then(r => r.json())
      .then(setMediaLogos)
      .catch(console.error);
    return () => clearTimeout(timer);
  }, []);

  const handleCTA = (desktopUrl?: string, mobileUrl?: string) => {
    const isMobile = window.innerWidth < 1024;
    const url = isMobile ? (mobileUrl || desktopUrl) : desktopUrl;
    if (!url) return;
    
    if (url.startsWith('#')) {
      const element = document.getElementById(url.substring(1));
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 72 - 20,
          behavior: 'smooth'
        });
      }
    } else {
      navigate(url);
    }
  };

  return (
    <section className="relative w-full bg-black overflow-hidden">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #000000 0%, #0a0a0f 50%, #000000 100%)
          `,
          zIndex: 0
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3,
              animation: `float-particle ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          zIndex: 5
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10">
        <div className="container-global">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center py-16 sm:py-20 md:py-24 lg:py-28">
            
            {/* Left Column - Text Content & Buttons */}
            <div className="w-full">
              {/* Content Wrapper - 限制最大寬度 */}
              <div className="max-w-[560px]">
                {/* Text Content */}
                <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7 xl:space-y-8">
                  {/* Small Label */}
                  <div 
                    className={`transition-all duration-1300 ease-out ${
                      isLoaded 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: '0.2s' }}
                  >
                    <p className="text-[10px] sm:text-[11px] md:text-[12px] lg:text-[12px] text-white/60 font-sans tracking-[0.12em] uppercase">
                      PR & Distribution for Web3 + AI
                    </p>
                  </div>

                  {/* Main Headline */}
                  <div className="space-y-1 sm:space-y-2">
                    <h1 className="text-[32px] sm:text-[38px] md:text-[44px] lg:text-[48px] xl:text-[52px] 2xl:text-[56px] font-medium leading-[1.3] sm:leading-[1.32] md:leading-[1.35] lg:leading-[1.38] tracking-[-0.02em] font-heading font-medium">
                      <span 
                        className={`block text-white transition-all duration-1500 ease-out ${
                          isLoaded 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-6'
                        }`}
                        style={{ 
                          transitionDelay: '0.4s',
                          filter: isLoaded ? 'blur(0px)' : 'blur(2px)'
                        }}
                      >
                        {heroData?.title_prefix}
                      </span>
                      <span 
                        className={`block transition-all duration-1500 ease-out ${
                          isLoaded 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-6'
                        }`}
                        style={{ 
                          transitionDelay: '1.0s',
                          filter: isLoaded ? 'blur(0px)' : 'blur(2px)'
                        }}
                      >
                        {heroData?.title_highlights && <TypewriterText words={heroData.title_highlights} />}
                      </span>
                    </h1>
                  </div>

                  {/* Description */}
                  <div 
                    className={`transition-all duration-1300 ease-out ${
                      isLoaded 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: '1.3s' }}
                  >
                    <p className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-[15px] xl:text-[16px] text-white/70 font-sans leading-[1.5] sm:leading-[1.55] md:leading-[1.6]">
                      {heroData?.subtitle}
                    </p>
                  </div>
                </div>
                
                {/* CTA Buttons - 完全重新實現 */}
                <div 
                  className={`flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-start justify-start mt-6 md:mt-8 transition-all duration-1300 ease-out ${
                    isLoaded 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: '1.6s' }}
                >
                  {/* Primary CTA - View Packages */}
                  <Button 
                    onClick={() => handleCTA(heroData?.cta_primary_url, heroData?.cta_primary_url_mobile)}
                    className="group relative h-12 lg:h-14 px-4 sm:px-5 lg:px-7 text-[13px] sm:text-[14px] lg:text-[15px] font-semibold !text-black hover:!text-black focus:!text-black bg-gradient-to-br from-[#FF7400] to-[#E6690A] border-0 rounded-[0.75rem] hover:-translate-y-[1px] focus:ring-2 focus:ring-[#FF7400]/40 focus:ring-offset-2 transition-all duration-300 ease-out overflow-hidden btn-brand-shadow flex-1"
                    style={{ 
                      textShadow: '0 1px 2px rgba(255,255,255,0.3)'
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2 !text-black hover:!text-black focus:!text-black transition-colors duration-300">
                      {heroData?.cta_primary_text}
                      <span 
                        className="material-symbols-outlined text-[14px] sm:text-[16px] lg:text-[18px] !text-black hover:!text-black focus:!text-black group-hover:animate-[arrow-slide_300ms_ease-out_forwards] transition-all duration-300"
                        style={{ fontVariationSettings: "'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24" }}
                      >
                        arrow_forward
                      </span>
                    </span>
                    {/* Hover enhancement overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
                  </Button>

                  {/* Secondary CTA - Submit Press Release */}
                  <Button 
                    variant="outline"
                    className="group relative h-12 lg:h-14 px-4 sm:px-5 lg:px-7 text-[13px] sm:text-[14px] lg:text-[15px] font-semibold !text-white hover:!text-white focus:!text-white bg-transparent border border-white/30 rounded-[0.75rem] hover:bg-white/8 hover:border-white/50 hover:-translate-y-[1px] focus:ring-2 focus:ring-[#FF7400]/40 focus:ring-offset-2 transition-all duration-300 ease-out overflow-hidden flex-1"
                    onClick={() => window.open('#', '_blank')} // 這裡填入實際的表單連結
                  >
                    <span className="relative z-10 !text-white hover:!text-white focus:!text-white transition-colors duration-300">
                      {heroData?.cta_secondary_text}
                    </span>
                    {/* Subtle hover background overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Element (僅桌面版顯示) */}
            <div 
              className={`relative hidden lg:flex items-center justify-center w-full h-full transition-all duration-1500 ease-out ${
                isLoaded 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: '0.8s' }}
            >
              {/* Central Glow - 縮小範圍 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[200px] h-[200px] bg-[#8B5CF6] rounded-full blur-[60px] opacity-15 animate-pulse"></div>
              </div>
              
              {/* Logo Container - 填滿右側欄，使用 relative 定位 */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* 中央 Vortix Logo */}
                <div className="relative z-20 w-[160px] h-[160px] lg:w-[200px] lg:h-[200px] xl:w-[240px] xl:h-[240px] 2xl:w-[280px] 2xl:h-[280px]">
                  <img 
                    src={heroData?.center_logo_url}
                    alt="Vortix"
                    className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                  />
                </div>
                
                {/* Media Logo Cloud - 基於整個右側欄空間 */}
                <div className="absolute inset-0" style={{ width: '100%', height: '100%' }}>
                  {mediaLogos.map((logo, index) => {
                    const sizeMap = { sm: { w: '80px', h: '32px' }, md: { w: '100px', h: '40px' }, lg: { w: '115px', h: '50px' }};
                    const size = sizeMap[logo.size as keyof typeof sizeMap] ?? sizeMap.md;
                    const randomSpeed = logo.animation_speed ?? (5 + Math.random() * 3);
                    const randomDelay = Math.random() * 2;
                    const style: any = { 
                      top: logo.position_top, 
                      opacity: logo.opacity, 
                      position: 'absolute', 
                      zIndex: 10,
                      maxWidth: size.w,
                      maxHeight: size.h,
                      animation: `float-particle ${randomSpeed}s ease-in-out infinite`,
                      animationDelay: `${randomDelay}s`
                    };
                    if (logo.position_left) style.left = logo.position_left;
                    if (logo.position_right) style.right = logo.position_right;
                    return (
                      <div key={logo.id} style={style}>
                        <img src={logo.logo_url} alt={logo.name} className="w-full h-full object-contain" style={{ display: 'block', border: 'none' }} loading="lazy" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import VortixLogoMark from '../assets/Vortix Logo mark.png';

// Typewriter Text Component - 保留原有的打字機效果
function TypewriterText() {
  const words = [
    "Web3 & AI"
  ];
  
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

// Media Logo Cloud Component - 右側的媒體 logo 雲（擴大分布範圍）
function MediaLogoCloud() {
  const mediaLogos = [
    { name: 'CoinTelegraph', opacity: 0.4, size: 'sm', position: { top: '5%', left: '15%' } },
    { name: 'CoinDesk', opacity: 0.5, size: 'md', position: { top: '8%', right: '20%' } },
    { name: 'Cryp', opacity: 0.3, size: 'sm', position: { top: '20%', left: '-5%' } },
    { name: 'BlockTempo', opacity: 0.6, size: 'lg', position: { top: '25%', right: '10%' } },
    { name: 'NextAsia', opacity: 0.4, size: 'md', position: { top: '45%', left: '5%' } },
    { name: 'TechCrunch', opacity: 0.5, size: 'sm', position: { top: '55%', right: '5%' } },
    { name: 'Decrypt', opacity: 0.3, size: 'md', position: { top: '75%', left: '10%' } },
    { name: 'TheBlock', opacity: 0.4, size: 'sm', position: { top: '82%', right: '25%' } },
    { name: 'Yahoo', opacity: 0.35, size: 'lg', position: { top: '70%', right: '15%' } },
    { name: 'VentureBeat', opacity: 0.35, size: 'md', position: { top: '35%', left: '-10%' } },
    { name: 'Benzinga', opacity: 0.4, size: 'sm', position: { top: '60%', right: '-5%' } },
    { name: 'CryptoNews', opacity: 0.3, size: 'md', position: { top: '90%', left: '25%' } },
  ];

  return (
    <div className="absolute inset-0" style={{ width: '140%', height: '140%', left: '-20%', top: '-20%' }}>
      {mediaLogos.map((logo, index) => (
        <div
          key={`${logo.name}-${index}`}
          className={`absolute text-white font-['Space_Grotesk:Medium'] whitespace-nowrap
            ${logo.size === 'sm' ? 'text-[9px] lg:text-[10px] xl:text-[11px] 2xl:text-[12px]' : ''}
            ${logo.size === 'md' ? 'text-[11px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px]' : ''}
            ${logo.size === 'lg' ? 'text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]' : ''}
          `}
          style={{
            ...logo.position,
            animation: `float-particle ${5 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: logo.opacity
          }}
        >
          {logo.name}
        </div>
      ))}
    </div>
  );
}

export default function HeroNewSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[100vh] bg-black overflow-hidden">
      {/* Background Gradient - 響應式調整 */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #000000 0%, #0a0a0f 50%, #000000 100%)
          `
        }}
      />

      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
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

      {/* Main Content Container */}
      <div className="relative z-10 h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 h-full max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center min-h-[100vh] py-16 sm:py-20 md:py-24 lg:py-28">
            
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
                    <p className="text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] text-white/60 font-['Noto_Sans:Regular'] tracking-[0.12em] uppercase">
                      PR & Distribution for Web3 + AI
                    </p>
                  </div>

                  {/* Main Headline */}
                  <div className="space-y-1 sm:space-y-2">
                    <h1 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] xl:text-[60px] 2xl:text-[68px] font-medium leading-[1.05] sm:leading-[1.08] md:leading-[1.1] tracking-[-0.02em] font-['Space_Grotesk:Medium']">
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
                        Strategic PR & Global
                      </span>
                      <span 
                        className={`block text-white transition-all duration-1500 ease-out ${
                          isLoaded 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-6'
                        }`}
                        style={{ 
                          transitionDelay: '0.7s',
                          filter: isLoaded ? 'blur(0px)' : 'blur(2px)'
                        }}
                      >
                        Press Distribution for
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
                        <TypewriterText />
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
                    <p className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] text-white/70 font-['Noto_Sans:Regular'] leading-[1.5] sm:leading-[1.55] md:leading-[1.6]">
                      Fast, reliable coverage — global & Asia — with optional narrative support and founder visibility. Our lean team handling distribution, strategy and AI-backed narrative checks.
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
                    className="group relative h-12 lg:h-14 px-4 sm:px-6 lg:px-8 text-sm sm:text-base lg:text-lg font-semibold !text-black hover:!text-black focus:!text-black bg-gradient-to-br from-[#FF7400] to-[#E6690A] border-0 rounded-[0.75rem] hover:-translate-y-[1px] focus:ring-2 focus:ring-[#FF7400]/40 focus:ring-offset-2 transition-all duration-300 ease-out overflow-hidden btn-brand-shadow flex-1"
                    style={{ 
                      textShadow: '0 1px 2px rgba(255,255,255,0.3)'
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2 !text-black hover:!text-black focus:!text-black transition-colors duration-300">
                      View Packages
                      <span 
                        className="material-symbols-outlined text-[16px] sm:text-[18px] lg:text-[20px] !text-black hover:!text-black focus:!text-black group-hover:animate-[arrow-slide_300ms_ease-out_forwards] transition-all duration-300"
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
                    className="group relative h-12 lg:h-14 px-4 sm:px-6 lg:px-8 text-sm sm:text-base lg:text-lg font-semibold !text-white hover:!text-white focus:!text-white bg-transparent border border-white/30 rounded-[0.75rem] hover:bg-white/8 hover:border-white/50 hover:-translate-y-[1px] focus:ring-2 focus:ring-[#FF7400]/40 focus:ring-offset-2 transition-all duration-300 ease-out overflow-hidden flex-1"
                    onClick={() => window.open('#', '_blank')} // 這裡填入實際的表單連結
                  >
                    <span className="relative z-10 !text-white hover:!text-white focus:!text-white transition-colors duration-300">
                      Submit Press Release
                    </span>
                    {/* Subtle hover background overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Element (僅桌面版顯示) */}
            <div 
              className={`relative hidden lg:flex items-center justify-center transition-all duration-1500 ease-out ${
                isLoaded 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: '0.8s' }}
            >
              {/* Central Vortix Logo with Glow */}
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-[#8B5CF6] rounded-full blur-[60px] lg:blur-[70px] xl:blur-[80px] opacity-25 lg:opacity-30 animate-pulse"></div>
                
                {/* Logo Container - 響應式大小 */}
                <div className="relative w-[240px] h-[240px] lg:w-[280px] lg:h-[280px] xl:w-[320px] xl:h-[320px] 2xl:w-[360px] 2xl:h-[360px] flex items-center justify-center">
                  <div className="relative w-[160px] h-[160px] lg:w-[200px] lg:h-[200px] xl:w-[240px] xl:h-[240px] 2xl:w-[280px] 2xl:h-[280px]">
                    <img 
                      src={VortixLogoMark}
                      alt="Vortix"
                      className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                    />
                  </div>
                  
                  {/* Orbiting Media Logos */}
                  <MediaLogoCloud />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

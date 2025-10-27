import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import imgHeader5 from "figma:asset/7a3cf72794ede6f0d72d00cf4c95706206092950.png";

// Typewriter Text Component - 優化穩定性
function TypewriterText() {
  const words = [
    "Crypto and AI",
    "Blockchain and Web3", 
    "DeFi and NFTs",
    "Smart Contracts",
    "Digital Assets",
    "AI and Machine Learning"
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
      }, 2000); // Wait 2 seconds before deleting
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
    }, isDeleting ? 100 : 200); // Faster deletion, slower typing

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, isWaiting, currentWordIndex, words]);

  return (
    <span className="text-[#FF7400] inline-block relative">
      {/* 隱藏的最長文字，用來撐開容器寬度，確保不會因文字長度變化而換行 */}
      <span className="invisible absolute">{longestWord}</span>
      {/* 實際顯示的打字機文字 */}
      <span className="relative">
        {currentText}
        <span className="animate-pulse">|</span>
      </span>
    </span>
  );
}

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mount
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      className="relative w-full h-[812px] md:h-[900px] bg-black bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${imgHeader5}')` 
      }}
    >
      {/* 使用 absolute 定位確保內容不會因文字變化而移動 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container-global w-full relative z-10">
          <div className="max-w-content-medium">
            {/* Content with Progressive Entrance Animations */}
            <div className="space-y-5 md:space-y-6 text-white">
              {/* Main Headline with Staggered Animation - 設定固定高度避免跳動 */}
              <div className="min-h-[120px] md:min-h-[180px] flex flex-col justify-center">
                <h1 className="text-[44px] md:text-[72px] font-medium leading-[1.2] tracking-[-0.44px] md:tracking-[-0.72px] font-['Space_Grotesk:Medium']">
                  <span 
                    className={`block transition-all duration-1500 ease-out ${
                      isLoaded 
                        ? 'opacity-100 translate-y-0 translate-x-0' 
                        : 'opacity-0 translate-y-8 translate-x-4'
                    }`}
                    style={{ 
                      transitionDelay: '0.4s',
                      filter: isLoaded ? 'blur(0px)' : 'blur(2px)'
                    }}
                  >
                    Shaping Influence:
                  </span>
                  <span 
                    className={`block transition-all duration-1500 ease-out ${
                      isLoaded 
                        ? 'opacity-100 translate-y-0 translate-x-0' 
                        : 'opacity-0 translate-y-8 translate-x-4'
                    }`}
                    style={{ 
                      transitionDelay: '0.9s',
                      filter: isLoaded ? 'blur(0px)' : 'blur(2px)'
                    }}
                  >
                    Disruptive PR Strategies for <TypewriterText />
                  </span>
                </h1>
              </div>
              
              {/* Description with Delayed Entrance - 設定固定高度容器 */}
              <div className="min-h-[60px] md:min-h-[80px] flex items-start">
                <p 
                  className={`text-[12px] md:text-[18px] leading-[1.5] font-normal font-['Noto_Sans:Regular'] transition-all duration-1300 ease-out ${
                    isLoaded 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-6'
                  }`}
                  style={{ 
                    transitionDelay: '1.4s',
                    filter: isLoaded ? 'blur(0px)' : 'blur(1px)'
                  }}
                >
                  Get your crypto and AI news in front of the right people—fast, reliably, and on the industry's most influential platforms.
                </p>
              </div>
            </div>
            
            {/* Action Buttons with Enhanced Entrance - 固定位置 */}
            <div 
              className={`flex flex-row gap-3 sm:gap-4 items-start justify-start mt-6 md:mt-8 transition-all duration-1300 ease-out ${
                isLoaded 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '2.0s' }}
            >
              {/* Primary CTA - Submit Now */}
              <Button 
                className="group relative h-12 lg:h-14 px-4 sm:px-6 lg:px-8 text-sm sm:text-base lg:text-lg font-semibold !text-black hover:!text-black focus:!text-black bg-gradient-to-br from-[#FF7400] to-[#E6690A] border-0 rounded-[0.75rem] hover:-translate-y-[1px] focus:ring-2 focus:ring-[#FF7400]/40 focus:ring-offset-2 transition-all duration-300 ease-out overflow-hidden btn-brand-shadow flex-1 max-w-[180px] sm:max-w-none"
                style={{ 
                  textShadow: '0 1px 2px rgba(255,255,255,0.3)'
                }}
              >
                <span className="relative z-10 flex items-center gap-2 !text-black hover:!text-black focus:!text-black transition-colors duration-300">
                  Submit Now
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

              {/* Secondary CTA - Get Your Quote */}
              <Button 
                variant="outline"
                className="group relative h-12 lg:h-14 px-4 sm:px-6 lg:px-8 text-sm sm:text-base lg:text-lg font-semibold !text-white hover:!text-white focus:!text-white bg-transparent border border-white/30 rounded-[0.75rem] hover:bg-white/8 hover:border-white/50 hover:-translate-y-[1px] focus:ring-2 focus:ring-[#FF7400]/40 focus:ring-offset-2 transition-all duration-300 ease-out overflow-hidden flex-1 max-w-[180px] sm:max-w-none"
              >
                <span className="relative z-10 !text-white hover:!text-white focus:!text-white transition-colors duration-300">
                  Get Your Quote
                </span>
                {/* Subtle hover background overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
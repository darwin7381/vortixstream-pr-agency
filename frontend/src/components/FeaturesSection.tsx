import { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { features } from '../constants/servicesData';
import svgPaths from "../imports/svg-f7gq800qcd";

const imgCatAstronaut = 'https://img.vortixpr.com/VortixPR_Website/Left_Point_Cat-2.png';

export default function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleFeatures, setVisibleFeatures] = useState(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Section intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Feature items intersection observer
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    featureRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleFeatures(prev => new Set([...prev, index]));
            }
          },
          { threshold: 0.5 }
        );
        
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => observers.forEach(observer => observer.disconnect());
  }, []);

  const CheckIcon = () => (
    <div className="size-4">
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

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-[600px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden"
      style={{
        background: '#050505'
      }}
    >
      {/* Background Image Layer - Clean and Visible */}
      <div 
        className="absolute inset-0 w-full h-full bg-no-repeat cat-astronaut-bg"
        style={{ 
          backgroundImage: `url('${imgCatAstronaut}')`,
          backgroundPosition: 'center right',
          zIndex: 1
        }}
      />
      
      {/* Light Text Readability Overlay - Much Smaller Coverage */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            linear-gradient(to right, 
              rgba(5,5,5,0.4) 0%, 
              rgba(5,5,5,0.25) 15%, 
              rgba(5,5,5,0.1) 25%, 
              transparent 40%
            )
          `,
          zIndex: 2
        }}
      />
      
      {/* Mobile-specific overlay - Very Light */}
      <div 
        className="absolute inset-0 w-full h-full md:hidden"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 100%)',
          zIndex: 3
        }}
      />
      
      {/* Enhanced 貓咪太空人手指脈衝光效果 */}
      <div 
        className={`absolute pointer-events-none finger-pulse-container transition-opacity duration-1500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ zIndex: 15, transitionDelay: '1.6s' }}
      >
        {/* 外層光暈 */}
        <div 
          className="absolute -inset-3 rounded-full animate-[finger-pulse_3.5s_ease-in-out_infinite]"
          style={{
            background: `radial-gradient(circle, rgba(255, 116, 0, 0.15) 0%, rgba(255, 116, 0, 0.08) 40%, transparent 70%)`,
            animationDelay: '0s'
          }}
        />
        
        {/* 中層光暈 */}
        <div 
          className="absolute -inset-2 rounded-full animate-[finger-pulse_3.5s_ease-in-out_infinite]"
          style={{
            background: `radial-gradient(circle, rgba(255, 116, 0, 0.25) 0%, rgba(255, 116, 0, 0.12) 50%, transparent 80%)`,
            animationDelay: '0.5s'
          }}
        />
        
        {/* 內層核心光點 */}
        <div 
          className="w-3 h-3 rounded-full animate-[finger-pulse_3.5s_ease-in-out_infinite]"
          style={{
            background: `radial-gradient(circle, rgba(255, 116, 0, 0.8) 0%, rgba(255, 116, 0, 0.4) 60%, transparent 100%)`,
            animationDelay: '1s'
          }}
        />
      </div>

      {/* Content Layer */}
      <div 
        className="relative px-5 md:px-16 py-16 md:py-28 h-full flex items-center"
        style={{ zIndex: 10 }}
      >
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="max-w-[600px] lg:max-w-[650px]">
            
            {/* Content Container with Enhanced Background for Better Readability */}
            <div className="relative">
              
              {/* Optional: Additional background overlay for text area only */}
              <div 
                className="absolute inset-0 -inset-x-6 -inset-y-8 rounded-3xl opacity-40"
                style={{
                  background: `
                    radial-gradient(ellipse at top left, 
                      rgba(0,0,0,0.8) 0%, 
                      rgba(0,0,0,0.6) 40%, 
                      transparent 70%
                    )
                  `
                }}
              />
              
              {/* Enhanced Main Content with Progressive Animation */}
              <div className="relative space-y-6 lg:space-y-8">
                <div className="space-y-3 lg:space-y-6">
                  <div 
                    className={`transition-all duration-1300 ease-out ${
                      isVisible 
                        ? 'opacity-100 translate-y-0 translate-x-0' 
                        : 'opacity-0 translate-y-4 -translate-x-2'
                    }`}
                    style={{ transitionDelay: '0.4s' }}
                  >
                    <span className="text-[16px] font-semibold text-white font-['Noto_Sans:SemiBold']">
                      Maximize
                    </span>
                  </div>
                  <h2 
                    className={`text-[40px] md:text-[52px] lg:text-[56px] font-medium text-white tracking-[-0.4px] md:tracking-[-0.52px] lg:tracking-[-0.56px] font-['Space_Grotesk:Medium'] leading-[1.1] transition-all duration-1500 ease-out ${
                      isVisible 
                        ? 'opacity-100 translate-y-0 translate-x-0' 
                        : 'opacity-0 translate-y-6 -translate-x-4'
                    }`}
                    style={{ transitionDelay: '0.8s' }}
                  >
                    Elevate Your Crypto News Coverage Today
                  </h2>
                  <p 
                    className={`text-[12px] md:text-[18px] lg:text-[20px] text-white font-['Noto_Sans:Regular'] leading-[1.6] max-w-[500px] transition-all duration-1300 ease-out ${
                      isVisible 
                        ? 'opacity-100 translate-y-0 translate-x-0' 
                        : 'opacity-0 translate-y-4 -translate-x-2'
                    }`}
                    style={{ transitionDelay: '1.2s' }}
                  >
                    Unlock the potential of your crypto and AI projects with our extensive media network. We ensure your news reaches the right audiences, amplifying your impact in the blockchain space.
                  </p>
                </div>

                <div className="space-y-4 py-2">
                  {features.map((feature, index) => (
                    <div 
                      key={index} 
                      ref={el => featureRefs.current[index] = el}
                      className={`flex items-start gap-4 transition-all duration-1200 ease-out ${
                        visibleFeatures.has(index) 
                          ? 'opacity-100 translate-y-0 translate-x-0' 
                          : 'opacity-0 translate-y-3 -translate-x-3'
                      }`}
                      style={{ transitionDelay: `${1.6 + index * 0.4}s` }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <CheckIcon />
                      </div>
                      <p className="text-[12px] md:text-[16px] lg:text-[18px] text-white font-['Noto_Sans:Regular'] leading-[1.5]">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                <div 
                  className={`flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center pt-2 transition-all duration-1300 ease-out ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: '2.8s' }}
                >
                  <Button variant="outline" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black text-[12px] md:text-[16px] py-[20px] px-8 hover:scale-105 transition-all duration-300">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom edge fade for seamless transition to next section */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)`
        }}
      />
    </section>
  );
}
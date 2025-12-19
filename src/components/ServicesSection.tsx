import { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import { services } from '../constants/servicesData';
import catAstronautImage from "figma:asset/b7052d9717896b616452306e15a912bfa180d66c.png";

interface ServicesSectionProps {
  onContactClick?: () => void;
}

export default function ServicesSection({ onContactClick }: ServicesSectionProps = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Main section intersection observer
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

  // Individual items intersection observer
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    itemRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleItems(prev => new Set([...prev, index]));
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

  const ServiceIcon = () => (
    <div className="size-12 relative">
      <div className="size-full relative group-hover:animate-[planet-orbit_6s_ease-in-out_infinite]">
        <svg className="size-full drop-shadow-sm" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.2278 10.9835C11.5173 10.9835 11.7638 10.8818 11.9675 10.6785C12.171 10.475 12.2728 10.2285 12.2728 9.93899C12.2728 9.64949 12.1701 9.40291 11.9648 9.19924C11.7593 8.99574 11.5118 8.89399 11.2223 8.89399C10.9328 8.89399 10.6872 8.99665 10.4855 9.20199C10.284 9.40749 10.1833 9.65499 10.1833 9.94449C10.1833 10.234 10.2849 10.4796 10.4883 10.6812C10.6918 10.8827 10.9383 10.9835 11.2278 10.9835ZM21.186 23.0255C20.5848 23.0255 19.6343 22.6757 18.3345 21.976C17.0347 21.2763 15.6545 20.4102 14.194 19.3777C13.844 19.5071 13.4824 19.5967 13.1093 19.6467C12.7359 19.6967 12.3578 19.7217 11.975 19.7217C10.0252 19.7217 8.36609 19.0375 6.99775 17.669C5.62925 16.3007 4.945 14.6416 4.945 12.6917C4.945 12.3084 4.97 11.9354 5.02 11.5727C5.07 11.2101 5.15967 10.8517 5.289 10.4977C4.2525 9.04124 3.38442 7.6599 2.68475 6.35374C1.98509 5.04757 1.63525 4.09807 1.63525 3.50524C1.63525 3.17224 1.74342 2.89466 1.95975 2.67249C2.17609 2.45016 2.45934 2.33899 2.8095 2.33899C3.35784 2.33899 4.08625 2.59199 4.99475 3.09799C5.90325 3.60399 6.84084 4.12399 7.8075 4.65799C8.01067 4.76766 8.13809 4.92691 8.18975 5.13574C8.24159 5.34441 8.2155 5.55041 8.1115 5.75374C8.0035 5.96091 7.8385 6.08932 7.6165 6.13899C7.39467 6.18866 7.18209 6.16149 6.97875 6.05749C6.43275 5.72816 5.87425 5.41449 5.30325 5.11649C4.73225 4.81849 4.15709 4.53816 3.57775 4.27549C3.92042 5.06015 4.30109 5.82499 4.71975 6.56999C5.13842 7.31499 5.59375 8.06049 6.08575 8.80649C6.71375 7.83716 7.53992 7.06657 8.56425 6.49474C9.58875 5.92274 10.7257 5.63674 11.975 5.63674C13.9267 5.63674 15.5904 6.32482 16.9663 7.70099C18.3421 9.07716 19.03 10.7412 19.03 12.6932C19.03 13.9241 18.744 15.0519 18.172 16.0767C17.6002 17.1016 16.8316 17.928 15.8663 18.556C16.6111 19.0472 17.3584 19.5043 18.1083 19.9275C18.8583 20.3507 19.6339 20.7358 20.4353 21.083C20.1686 20.5037 19.8831 19.9243 19.5788 19.345C19.2744 18.7657 18.9596 18.205 18.6343 17.663C18.5263 17.4597 18.4981 17.2522 18.5498 17.0407C18.6014 16.8291 18.7288 16.6702 18.932 16.5642C19.1353 16.4582 19.3469 16.4301 19.5668 16.4797C19.7868 16.5294 19.9488 16.6559 20.0528 16.8592C20.5828 17.8179 21.0976 18.7545 21.5973 19.669C22.0969 20.5835 22.3468 21.3137 22.3468 21.8595C22.3468 22.1965 22.2376 22.4751 22.0193 22.6952C21.8009 22.9154 21.5232 23.0255 21.186 23.0255ZM13.7295 15.4835C13.9552 15.4835 14.1438 15.4072 14.2955 15.2547C14.447 15.1021 14.5228 14.9129 14.5228 14.6872C14.5228 14.4616 14.4461 14.2729 14.2928 14.1212C14.1393 13.9697 13.9491 13.894 13.7223 13.894C13.4954 13.894 13.3072 13.9707 13.1575 14.124C13.008 14.2775 12.9333 14.4677 12.9333 14.6945C12.9333 14.9213 13.0095 15.1096 13.162 15.2592C13.3147 15.4087 13.5038 15.4835 13.7295 15.4835ZM14.9748 11.9835C15.1203 11.9835 15.248 11.9296 15.358 11.8217C15.4678 11.7139 15.5228 11.5873 15.5228 11.442C15.5228 11.2965 15.4684 11.1687 15.3598 11.0587C15.2511 10.9489 15.1235 10.894 14.977 10.894C14.8303 10.894 14.703 10.9483 14.595 11.057C14.4872 11.1657 14.4333 11.2932 14.4333 11.4397C14.4333 11.5864 14.4872 11.7137 14.595 11.8217C14.7028 11.9296 14.8294 11.9835 14.9748 11.9835ZM12.3023 17.9445C11.1841 17.046 10.0658 16.0375 8.9475 14.919C7.829 13.8007 7.08725 12.9325 6.72225 12.3145L6.69725 12.652L6.67225 12.9895C6.69225 13.7417 6.86175 14.4322 7.18075 15.061C7.49975 15.6898 7.91392 16.233 8.42325 16.6905C8.93275 17.1478 9.52275 17.4912 10.1933 17.7205C10.8638 17.9498 11.5668 18.0245 12.3023 17.9445ZM14.337 17.5162C15.2395 17.0749 15.9703 16.4237 16.5295 15.5625C17.0888 14.7012 17.3685 13.7384 17.3685 12.6742C17.3685 11.1627 16.8463 9.88882 15.8018 8.85249C14.7571 7.81632 13.479 7.29824 11.9675 7.29824C10.9033 7.29824 9.94475 7.57591 9.09175 8.13124C8.23892 8.68641 7.59184 9.41524 7.1505 10.3177C8.16484 11.6781 9.277 12.9619 10.487 14.1692C11.6972 15.3766 12.9805 16.4922 14.337 17.5162Z" fill="white"/>
        </svg>
      </div>
    </div>
  );

  return (
    <section id="services-section" className="relative w-full overflow-hidden py-section-large">
      {/* Extended Cosmic Background with Smooth Transition */}
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
      <div ref={sectionRef} className="relative z-10 container-global">
        <div className="container-large">
          {/* Enhanced Section Header with Progressive Animation */}
          <div className="text-center mb-12 md:mb-20 max-w-content-large mx-auto">
            <div 
              className={`mb-3 md:mb-4 transition-all duration-1300 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '0.3s' }}
            >
              <span className="text-[16px] font-semibold text-white font-['Noto_Sans:SemiBold']">
                Services
              </span>
            </div>
            <h2 
              className={`text-[40px] md:text-[52px] font-medium text-white mb-5 md:mb-6 tracking-[-0.4px] md:tracking-[-0.52px] font-['Space_Grotesk:Medium'] transition-all duration-1400 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '0.7s' }}
            >
              What We Offer
            </h2>
            <p 
              className={`text-[12px] md:text-[18px] text-white font-['Noto_Sans:Regular'] transition-all duration-1300 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '1.1s' }}
            >
              At VortixPR, we amplify blockchain, Web3, and AI projects through strategic media engagement. Our global network ensures your message resonates with the right audience.
            </p>
          </div>

          {/* Desktop: 3 Column Layout with Enhanced Animations */}
          <div className="hidden md:block mb-12 md:mb-20">
            <div className="grid grid-cols-3 gap-8 items-center max-w-[1200px] mx-auto">
              {/* Left Column - Services 1 & 2 */}
              <div className="space-y-12">
                {/* Service 1: Blockchain / Crypto PR */}
                <div 
                  ref={el => itemRefs.current[0] = el}
                  className={`text-center rounded-xl p-4 transition-all duration-1400 ease-out hover:animate-[subtle-glow_2s_ease-in-out_infinite] hover:bg-white/[0.02] group ${
                    visibleItems.has(0) 
                      ? 'opacity-100 translate-y-0 translate-x-0' 
                      : 'opacity-0 translate-y-8 -translate-x-4'
                  }`}
                  style={{ transitionDelay: '0.5s' }}
                >
                  <div className="flex justify-center mb-5">
                    <ServiceIcon />
                  </div>
                  <h3 className="text-[24px] font-medium text-white mb-3 tracking-[-0.24px] font-['Space_Grotesk:Medium']">
                    {services[0].title}
                  </h3>
                  <p className="text-[14px] text-white font-['Noto_Sans:Regular']">
                    {services[0].description}
                  </p>
                </div>

                {/* Service 2: AI Product PR */}
                <div 
                  ref={el => itemRefs.current[1] = el}
                  className={`text-center rounded-xl p-4 transition-all duration-1400 ease-out hover:animate-[subtle-glow_2s_ease-in-out_infinite] hover:bg-white/[0.02] group ${
                    visibleItems.has(1) 
                      ? 'opacity-100 translate-y-0 translate-x-0' 
                      : 'opacity-0 translate-y-8 -translate-x-4'
                  }`}
                  style={{ transitionDelay: '1.2s' }}
                >
                  <div className="flex justify-center mb-5">
                    <ServiceIcon />
                  </div>
                  <h3 className="text-[24px] font-medium text-white mb-3 tracking-[-0.24px] font-['Space_Grotesk:Medium']">
                    {services[1].title}
                  </h3>
                  <p className="text-[14px] text-white font-['Noto_Sans:Regular']">
                    {services[1].description}
                  </p>
                </div>
              </div>

              {/* Center Column - Enhanced Cat Astronaut Avatar */}
              <div className="flex justify-center">
                <div 
                  className={`relative transition-all duration-1500 ease-out ${
                    isVisible 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : 'opacity-0 scale-95 translate-y-6'
                  }`}
                  style={{ transitionDelay: '0.8s' }}
                >
                  {/* Enhanced Outer glow ring with animation */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF7400]/20 via-[#1D3557]/10 to-[#FF7400]/20 blur-lg scale-110 animate-[avatar-glow_4s_ease-in-out_infinite]"></div>
                  
                  {/* Inner glow ring */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-sm animate-[avatar-inner-glow_3s_ease-in-out_infinite]"></div>
                  
                  {/* Orbiting particles */}
                  <div className="absolute inset-0">
                    <div className="absolute w-2 h-2 bg-[#FF7400] rounded-full opacity-60 animate-[particle-orbit-1_8s_linear_infinite]" />
                    <div className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-40 animate-[particle-orbit-2_6s_linear_infinite]" />
                    <div className="absolute w-1 h-1 bg-[#1D3557] rounded-full opacity-50 animate-[particle-orbit-3_10s_linear_infinite]" />
                  </div>
                  
                  {/* Main avatar container */}
                  <div 
                    className="relative w-[400px] h-[400px] rounded-full border-2 border-white/20 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,116,0,0.3)] hover:border-white/40 group overflow-hidden"
                  >
                    {/* Cat Astronaut Image - 100% Fill */}
                    <img 
                      src={catAstronautImage} 
                      alt="Cat Astronaut" 
                      className="absolute inset-0 w-full h-full object-cover rounded-full"
                    />
                    {/* Subtle overlay for better cosmic integration */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-transparent to-black/20 group-hover:bg-gradient-to-br group-hover:from-[#FF7400]/5 group-hover:via-transparent group-hover:to-[#1D3557]/5 transition-all duration-500"></div>
                  </div>
                </div>
              </div>

              {/* Right Column - Services 3 & 4 */}
              <div className="space-y-12">
                {/* Service 3: Global & Regional Media Distribution */}
                <div 
                  ref={el => itemRefs.current[2] = el}
                  className={`text-center rounded-xl p-4 transition-all duration-1400 ease-out hover:animate-[subtle-glow_2s_ease-in-out_infinite] hover:bg-white/[0.02] group ${
                    visibleItems.has(2) 
                      ? 'opacity-100 translate-y-0 translate-x-0' 
                      : 'opacity-0 translate-y-8 translate-x-4'
                  }`}
                  style={{ transitionDelay: '1.4s' }}
                >
                  <div className="flex justify-center mb-5">
                    <ServiceIcon />
                  </div>
                  <h3 className="text-[24px] font-medium text-white mb-3 tracking-[-0.24px] font-['Space_Grotesk:Medium']">
                    {services[2].title}
                  </h3>
                  <p className="text-[14px] text-white font-['Noto_Sans:Regular']">
                    {services[2].description}
                  </p>
                </div>

                {/* Service 4: Influencer Marketing */}
                <div 
                  ref={el => itemRefs.current[3] = el}
                  className={`text-center rounded-xl p-4 transition-all duration-1400 ease-out hover:animate-[subtle-glow_2s_ease-in-out_infinite] hover:bg-white/[0.02] group ${
                    visibleItems.has(3) 
                      ? 'opacity-100 translate-y-0 translate-x-0' 
                      : 'opacity-0 translate-y-8 translate-x-4'
                  }`}
                  style={{ transitionDelay: '2.1s' }}
                >
                  <div className="flex justify-center mb-5">
                    <ServiceIcon />
                  </div>
                  <h3 className="text-[24px] font-medium text-white mb-3 tracking-[-0.24px] font-['Space_Grotesk:Medium']">
                    {services[3].title}
                  </h3>
                  <p className="text-[14px] text-white font-['Noto_Sans:Regular']">
                    {services[3].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Mobile Layout */}
          <div className="md:hidden mb-12">
            <div className="space-y-12">
              {services.map((service, index) => (
                <div 
                  key={index} 
                  ref={el => itemRefs.current[index + 4] = el}
                  className={`text-center rounded-xl p-4 transition-all duration-1400 ease-out hover:animate-[subtle-glow_2s_ease-in-out_infinite] hover:bg-white/[0.02] group ${
                    visibleItems.has(index + 4) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${0.4 + index * 0.4}s` }}
                >
                  <div className="flex justify-center mb-5">
                    <ServiceIcon />
                  </div>
                  <h3 className="text-[20px] font-medium text-white mb-3 tracking-[-0.2px] font-['Space_Grotesk:Medium']">
                    {service.title}
                  </h3>
                  <p className="text-[12px] text-white font-['Noto_Sans:Regular']">
                    {service.description}
                  </p>
                </div>
              ))}
              
              {/* Enhanced Mobile Avatar */}
              <div 
                className={`mt-12 flex justify-center transition-all duration-1500 ease-out ${
                  isVisible 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 translate-y-8'
                }`}
                style={{ transitionDelay: '2.0s' }}
              >
                <div className="relative">
                  {/* Enhanced outer glow ring - smaller for mobile */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF7400]/20 via-[#1D3557]/10 to-[#FF7400]/20 blur-md scale-110 animate-[avatar-glow_4s_ease-in-out_infinite]"></div>
                  
                  {/* Inner glow ring */}
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-sm animate-[avatar-inner-glow_3s_ease-in-out_infinite]"></div>
                  
                  {/* Orbiting particles - scaled for mobile */}
                  <div className="absolute inset-0">
                    <div className="absolute w-1.5 h-1.5 bg-[#FF7400] rounded-full opacity-60 animate-[particle-orbit-1_8s_linear_infinite]" />
                    <div className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-[particle-orbit-2_6s_linear_infinite]" />
                  </div>
                  
                  {/* Main avatar container - responsive sizing */}
                  <div 
                    className="relative w-[280px] h-[280px] rounded-full border-2 border-white/20 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,116,0,0.3)] hover:border-white/40 group overflow-hidden"
                  >
                    {/* Cat Astronaut Image - 100% Fill */}
                    <img 
                      src={catAstronautImage} 
                      alt="Cat Astronaut" 
                      className="absolute inset-0 w-full h-full object-cover rounded-full"
                    />
                    {/* Subtle overlay for better cosmic integration */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-transparent to-black/20 group-hover:bg-gradient-to-br group-hover:from-[#FF7400]/5 group-hover:via-transparent group-hover:to-[#1D3557]/5 transition-all duration-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-row gap-6 items-center justify-center">
            <Button 
              onClick={onContactClick}
              variant="outline" 
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black text-[12px] md:text-[16px] py-[20px]"
            >
              Get Started
            </Button>
            <Button 
              onClick={onContactClick}
              variant="ghost" 
              className="text-white transition-all duration-500 ease-in-out hover:bg-transparent hover:text-[#FF7400] hover:animate-[text-pulse_2s_ease-in-out_infinite] hover:[text-shadow:0_0_6px_rgba(255,116,0,0.4),0_0_12px_rgba(255,116,0,0.2),0_0_18px_rgba(255,116,0,0.1)] text-[12px] md:text-[16px] py-[20px]"
            >
              Contact Us
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
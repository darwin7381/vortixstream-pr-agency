import { useState, useEffect, useRef } from 'react';
import svgPaths from "../imports/svg-f7gq800qcd";

const imgCatAstronaut = "https://img.vortixpr.com/VortixPR_Website/Left_Point_Cat-2.png";

// Check Icon - Using FeaturesSection style
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

export default function LyroSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 } // Lower threshold for earlier activation
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden py-section-large bg-[#050508]">

            {/* --- CSS ANIMATIONS --- */}
            <style>{`
                @keyframes cinematic-fade-up {
                    0% { opacity: 0; transform: translateY(30px); filter: blur(10px); }
                    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
                @keyframes rotate-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes float-y {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes pulse-ring {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.05); opacity: 0.5; }
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
                @keyframes lyro-finger-pulse {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(0.8);
                        box-shadow: 
                            0 0 8px rgba(255, 116, 0, 0.4),
                            0 0 16px rgba(255, 116, 0, 0.2),
                            0 0 24px rgba(255, 116, 0, 0.1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.2);
                        box-shadow: 
                            0 0 12px rgba(255, 116, 0, 0.6),
                            0 0 24px rgba(255, 116, 0, 0.3),
                            0 0 36px rgba(255, 116, 0, 0.15),
                            0 0 48px rgba(255, 116, 0, 0.08);
                    }
                }
                .tech-ring {
                    border: 1px dashed rgba(255, 255, 255, 0.2); 
                    border-radius: 50%;
                }
                
                /* Lyro 區域專用的手指脈衝定位 - 鏡像貓咪 */
                /* 計算公式：鏡像後位置 = 圖片寬度 - 原本位置 */
                .lyro-finger-pulse-container {
                    position: absolute;
                    pointer-events: none;
                }
                
                /* 小螢幕手機版 (< 768px) - 圖片 100.1%, 原本 22%, 鏡像後 78.1% */
                @media (max-width: 767px) {
                    .lyro-finger-pulse-container {
                        top: calc(33% - 80px) !important;
                        right: 78.1% !important;
                        transform: translateX(50%) translateY(-50%);
                    }
                }
                
                /* 中螢幕平板版 (768px - 1023px) - 圖片 63%, 原本 16%, 鏡像後 47% */
                @media (min-width: 768px) and (max-width: 1023px) {
                    .lyro-finger-pulse-container {
                        top: calc(37% - 160px) !important;
                        right: 47% !important;
                        transform: translateX(50%) translateY(-50%);
                    }
                }
                
                /* 大螢幕桌面版 (≥ 1024px) - 圖片 50.4%, 原本 12%, 鏡像後 38.4% */
                @media (min-width: 1024px) {
                    .lyro-finger-pulse-container {
                        top: calc(40% - 160px) !important;
                        right: 38.4% !important;
                        transform: translateX(50%) translateY(-50%);
                    }
                }
                
                /* 超大螢幕優化 (≥ 1440px) - 圖片 50.4%, 原本 11%, 鏡像後 39.4% */
                @media (min-width: 1440px) {
                    .lyro-finger-pulse-container {
                        top: calc(39% - 160px) !important;
                        right: 39.4% !important;
                        transform: translateX(50%) translateY(-50%);
                    }
                }
            `}</style>

            {/* --- BACKGROUND --- */}
            <div
                className="absolute inset-0 opacity-100 pointer-events-none"
                style={{
                    background: `
                    radial-gradient(circle at 15% 20%, rgba(29, 53, 87, 0.3) 0%, transparent 45%),
                    radial-gradient(circle at 85% 30%, rgba(255, 116, 0, 0.2) 0%, transparent 50%),
                    linear-gradient(135deg, #000000 0%, #16213e 20%, #050508 100%)
                  `
                }}
            />

            {/* Twinkling Stars / Data Points */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-[2px] h-[2px] bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Engine Rings (Rotating + Pulsing) */}
            <div className={`absolute top-1/2 left-0 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div
                    className="absolute inset-0 tech-ring"
                    style={{ animation: 'rotate-slow 60s linear infinite' }}
                />
                <div
                    className="absolute inset-[20%] tech-ring opacity-70"
                    style={{ animation: 'rotate-slow 40s linear infinite reverse, pulse-ring 8s ease-in-out infinite' }}
                />
            </div>

            {/* Background Image Layer - Cat Astronaut (鏡像版本 - 還是在右側) */}
            <div 
                className="absolute inset-0 w-full h-full bg-no-repeat cat-astronaut-bg"
                style={{ 
                    backgroundImage: `url('${imgCatAstronaut}')`,
                    backgroundPosition: 'center right',
                    zIndex: 1
                }}
            />

            {/* Lyro 區域的貓咪太空人手指脈衝光效果 */}
            <div 
                className={`lyro-finger-pulse-container transition-opacity duration-1500 ${
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

            {/* --- CONTENT --- */}
            <div className="relative z-10 container-global">
                <div className="container-large relative">
                    <div className="max-w-[600px] lg:max-w-[650px]">

                        {/* Header */}
                        <div className="mb-12 md:mb-16">
                            <div
                                className="inline-flex items-center gap-3 mb-4"
                                style={{
                                    animation: isVisible ? 'cinematic-fade-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' : 'none',
                                    opacity: 0
                                }}
                            >
                                <div className="w-2 h-2 rounded-full bg-[#FF7400] shadow-[0_0_10px_#FF7400] animate-pulse"></div>
                                <span className="text-[14px] text-[#FF7400] font-mono tracking-widest uppercase font-bold">
                                    #lyro_engine
                                </span>
                            </div>

                            <h2
                                className="text-[40px] md:text-[52px] font-medium text-white font-['Space_Grotesk:Medium'] tracking-[-0.4px] md:tracking-[-0.52px] drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                style={{
                                    animation: isVisible ? 'cinematic-fade-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards 100ms' : 'none',
                                    opacity: 0
                                }}
                            >
                                Lyro — AI Narrative Engine
                                <span className="block mt-2 text-[#94A3B8] font-light text-[24px] md:text-[32px]">(Coming Soon)</span>
                            </h2>
                        </div>

                        {/* Description - Smaller text */}
                        <div
                            className="mb-8"
                            style={{
                                animation: isVisible ? 'cinematic-fade-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards 200ms' : 'none',
                                opacity: 0
                            }}
                        >
                            <p
                                className="text-[12px] md:text-[16px] font-['Noto_Sans:Regular'] leading-relaxed drop-shadow-md"
                                style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                            >
                                Lyro is our internal AI tool that analyzes your announcement before distribution. It checks for clarity, angle suitability, and how well LLMs can surface your story in search, news, and AI feeds.
                            </p>
                        </div>

                        {/* System Capabilities */}
                        <div className="flex flex-col gap-6">
                            <h3
                                className="text-sm font-mono text-gray-400 uppercase tracking-widest"
                                style={{
                                    animation: isVisible ? 'cinematic-fade-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards 300ms' : 'none',
                                    opacity: 0
                                }}
                            >
                                System Capabilities ::
                            </h3>

                            <ul className="space-y-4">
                                {[
                                    "Narrative optimization",
                                    "Media angle suggestions",
                                    "LLM visibility forecasting",
                                    "Asia geo-angle adjustments"
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className="group relative inline-flex items-center gap-6 p-4 rounded-xl transition-all duration-300 hover:bg-white/[0.05] border border-white/20"
                                        style={{
                                            animation: isVisible ? `cinematic-fade-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards ${400 + (index * 100)}ms, float-y 6s ease-in-out infinite ${index * 1}s` : 'none',
                                            opacity: 0
                                        }}
                                    >
                                        <div className="flex-shrink-0">
                                            <CheckIcon />
                                        </div>
                                        <span className="relative text-[12px] md:text-[16px] text-white font-['Noto_Sans:Regular'] transition-transform duration-300 group-hover:translate-x-2">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}

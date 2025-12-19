import { useState, useEffect, useRef } from 'react';

// Premium Check Icon
const CheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#FF7400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
                .tech-ring {
                    border: 1px dashed rgba(255, 255, 255, 0.2); 
                    border-radius: 50%;
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

            {/* --- CONTENT --- */}
            <div className="relative z-10 container-global">
                <div className="container-large relative">

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
                            className="text-4xl md:text-5xl lg:text-6xl font-medium text-white font-['Space_Grotesk:Medium'] tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            style={{
                                animation: isVisible ? 'cinematic-fade-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards 100ms' : 'none',
                                opacity: 0
                            }}
                        >
                            Lyro — Al Narrative Engine
                            <span className="block mt-2 text-[#94A3B8] font-light text-3xl md:text-4xl lg:text-5xl">(Coming Soon)</span>
                        </h2>
                    </div>

                    {/* Split Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                        {/* Left: Paragraph - FORCED WHITE */}
                        <div
                            className="max-w-xl"
                            style={{
                                animation: isVisible ? 'cinematic-fade-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards 200ms' : 'none',
                                opacity: 0
                            }}
                        >
                            {/* INLINE COLOR STYLE TO FORCE VISIBILITY */}
                            <p
                                className="text-xl md:text-2xl font-['Noto_Sans:Regular'] leading-relaxed drop-shadow-md"
                                style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                            >
                                Lyro is our internal AI tool that analyzes your announcement before distribution. It checks for clarity, angle suitability, and how well LLMs can surface your story in search, news, and AI feeds.
                            </p>
                        </div>

                        {/* Right: Floating Holographic List */}
                        <div className="flex flex-col gap-8">
                            <div className="relative">
                                <h3
                                    className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-6 border-b border-white/20 pb-2 w-fit"
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
                                            className="group relative flex items-center gap-5 p-4 rounded-xl transition-all duration-300 hover:bg-white/[0.05] border border-transparent hover:border-white/20"
                                            style={{
                                                animation: isVisible ? `cinematic-fade-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards ${400 + (index * 100)}ms, float-y 6s ease-in-out infinite ${index * 1}s` : 'none',
                                                opacity: 0
                                            }}
                                        >
                                            <div className="relative flex-shrink-0 w-8 h-8 rounded-full bg-[#FF7400]/10 flex items-center justify-center border border-[#FF7400]/20 transition-all duration-300 group-hover:bg-[#FF7400] group-hover:scale-110 group-hover:shadow-[0_0_20px_#FF7400]">
                                                <CheckIcon />
                                            </div>
                                            <span className="relative text-lg md:text-xl text-white font-['Space_Grotesk:Medium'] tracking-wide transition-transform duration-300 group-hover:translate-x-2">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}

/**
 * ⚠️ 重要原則（絕對不可違反）：
 * 1. ❌ 禁止任何 fallback
 * 2. ❌ 禁止任何檢查邏輯（禁止 if (loading)、if (data.length) 等）
 * 3. ❌ 禁止寫死數量（禁止 slice(0,2)、slice(2,5) 等）
 * 4. ✅ 組件必須總是渲染
 * 5. ✅ 使用 map 動態渲染所有資料
 */
import { useState, useEffect, useRef } from 'react';
import { contentAPI, type Stat, type Differentiator } from '../api/client';
import StatsCardCompact from './StatsCardCompact';

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleDiff, setVisibleDiff] = useState(new Set());
  const [stats, setStats] = useState<Stat[]>([]);
  const [differentiators, setDifferentiators] = useState<Differentiator[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const diffRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 載入 stats 和 differentiators
  useEffect(() => {
    contentAPI.getStats().then(setStats).catch(console.error);
    contentAPI.getDifferentiators().then(setDifferentiators).catch(console.error);
  }, []);

  // Intersection Observer for triggering animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Differentiators intersection observer
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    diffRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleDiff(prev => new Set([...prev, index]));
            }
          },
          { threshold: 0.3 }
        );
        
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => observers.forEach(observer => observer.disconnect());
  }, [differentiators]);

  // Check icon for differentiators
  const CheckIcon = () => (
    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-[#FF7400] to-[#1D3557] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" viewBox="0 0 16 16">
        <path
          d="M13.5 4.5L6 12L2.5 8.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden">
      {/* Floating Animation Styles */}
      <style>{`
        @keyframes gentle-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        .float-card {
          animation: gentle-float 4s ease-in-out infinite;
        }
      `}</style>

      {/* Enhanced Animated Cosmic Background */}
      <div 
        className="absolute inset-0 opacity-100"
        style={{
          background: `
            radial-gradient(circle at 15% 25%, rgba(255, 116, 0, 0.18) 0%, transparent 45%),
            radial-gradient(circle at 85% 75%, rgba(29, 53, 87, 0.22) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 116, 0, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 25% 80%, rgba(29, 53, 87, 0.15) 0%, transparent 40%),
            linear-gradient(135deg, #000000 0%, #1a1a2e 20%, #16213e 40%, #0f0f23 60%, #1a1a2e 80%, #000000 100%)
          `
        }}
      />
      
      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.2 + Math.random() * 0.3,
              animation: `float-particle ${2.5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Enhanced Grid Pattern with Gradient */}
      <div 
        className="absolute inset-0 opacity-8"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          mask: 'radial-gradient(ellipse at center, white 0%, white 70%, transparent 100%)',
          WebkitMask: 'radial-gradient(ellipse at center, white 0%, white 70%, transparent 100%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 container-global py-section-large">
          <h2 className="text-[24px] sm:text-[28px] md:text-[44px] font-medium text-white mb-8 sm:mb-10 md:mb-20 tracking-[-0.24px] sm:tracking-[-0.28px] md:tracking-[-0.44px] font-heading font-medium text-left">
            Why Vortix Is Different?
          </h2>
          
          {/* Stats Cards - 動態渲染 */}
          <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
            <StatsCardCompact stats={stats.map(stat => ({
              number: `${stat.value}${stat.suffix}`,
              targetNumber: stat.value,
              suffix: stat.suffix,
              label: stat.label,
              description: stat.description
            }))} />
          </div>

          {/* Differentiators Section - 動態網格佈局 */}
          <div className="max-w-[1100px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {differentiators.map((item, index) => (
                <div 
                  key={index}
                  ref={el => { diffRefs.current[index] = el; }}
                  className={`group relative transition-all duration-1000 ease-out ${
                    visibleDiff.has(index) 
                      ? 'opacity-100 translate-y-0 translate-x-0 float-card' 
                      : 'opacity-0 translate-y-6 -translate-x-4'
                  }`}
                  style={{ 
                    transitionDelay: `${0.8 + index * 0.15}s`,
                    animationDelay: `${index * 0.3}s`
                  }}
                >
                  {/* Card with minimal glassmorphism */}
                  <div className="relative flex items-center gap-4 sm:gap-5 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/[0.03] via-white/[0.05] to-white/[0.02] border border-white/5 hover:border-white/15 hover:from-white/[0.05] hover:to-white/[0.03] transition-all duration-500 hover:scale-[1.01] hover:-translate-y-0.5">
                    
                    {/* Subtle Inner Glow on Hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Check Icon */}
                    <div className="relative flex-shrink-0">
                      <CheckIcon />
                    </div>
                    
                    {/* Text */}
                    <div className="relative flex-1">
                      <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] text-white/90 leading-[1.5] font-sans group-hover:text-white transition-colors duration-300">
                        {item.text}
                      </p>
                    </div>

                    {/* Decorative Corner Dot */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-1 h-1 bg-white/20 rounded-full group-hover:bg-[#FF7400] group-hover:shadow-[0_0_6px_rgba(255,116,0,0.6)] transition-all duration-300" />
                  </div>

                  {/* Enhanced Border Left Accent */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 sm:h-10 bg-gradient-to-b from-[#FF7400] via-white to-[#1D3557] rounded-r-full opacity-50 group-hover:opacity-100 group-hover:w-1 group-hover:shadow-[0_0_12px_rgba(255,116,0,0.6)] transition-all duration-500" />
                </div>
                ))}
              </div>
            </div>
      </div>
    </section>
  );
}

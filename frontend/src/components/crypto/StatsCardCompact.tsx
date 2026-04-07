import { useState, useEffect, useRef } from 'react';

interface StatCardCompactProps {
  stats: Array<{
    number: string;
    targetNumber: number;
    suffix: string;
    label: string;
    description: string;
  }>;
}

export default function StatsCardCompact({ stats }: StatCardCompactProps) {
  const [counters, setCounters] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  // Counter animation effect
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;

    // Initialize counters array with correct length
    setCounters(new Array(stats.length).fill(0));

    stats.forEach((stat, index) => {
      let currentStep = 0;
      const increment = stat.targetNumber / steps;

      const timer = setInterval(() => {
        currentStep++;
        const newValue = Math.min(Math.round(increment * currentStep), stat.targetNumber);
        
        setCounters(prev => {
          const newCounters = [...prev];
          newCounters[index] = newValue;
          return newCounters;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    });
  }, [isVisible, stats]);

  return (
    <div ref={sectionRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="group relative h-full flex"
          style={{
            animation: isVisible ? `stat-card-entrance 0.8s ease-out ${index * 0.2}s both` : ''
          }}
        >
          {/* Card Background with Enhanced Effects */}
          <div className="relative w-full flex flex-col bg-gradient-to-br from-white/5 via-white/8 to-white/3 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 transition-all duration-500 ease-out hover:border-white/25 hover:bg-gradient-to-br hover:from-white/8 hover:via-white/12 hover:to-white/5 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:scale-[1.02] group-hover:backdrop-blur-md">
            
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* 手機版橫向容器 */}
            <div className="flex items-center gap-4 sm:block sm:gap-0">
              {/* Number Display with Animation - 較小尺寸 */}
              <div className="relative min-w-[30%] sm:min-w-0 flex-shrink-0 sm:flex-shrink-1 mb-0 sm:mb-3 md:mb-4 lg:mb-5">
                <div className="text-[40px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-bold text-white leading-[1.1] font-sans font-bold transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  {isVisible ? counters[index] : 0}
                  <span className="text-[0.7em] ml-1">{stat.suffix}</span>
                </div>
                
                {/* Number Glow Effect */}
                <div className="absolute inset-0 text-[40px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-bold leading-[1.1] font-sans font-bold opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm">
                  {isVisible ? counters[index] : 0}
                  <span className="text-[0.7em] ml-1">{stat.suffix}</span>
                </div>
              </div>

              {/* Label and Description */}
              <div className="relative flex-1 sm:flex-grow space-y-1 sm:space-y-1.5 flex flex-col justify-center sm:justify-end">
                <h3 className="text-[13px] sm:text-[14px] md:text-[16px] lg:text-[17px] font-semibold text-white/95 tracking-[-0.13px] sm:tracking-[-0.14px] md:tracking-[-0.16px] lg:tracking-[-0.17px] font-heading font-semibold leading-[1.3] group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </h3>
                <p className="text-[10px] sm:text-[11px] md:text-[13px] text-white/70 font-sans leading-[1.4] group-hover:text-white/85 transition-colors duration-300">
                  {stat.description}
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-1 h-1 bg-white/30 rounded-full group-hover:bg-[#FF7400] group-hover:shadow-[0_0_6px_rgba(255,116,0,0.6)] transition-all duration-300" />
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/20 rounded-full group-hover:bg-[#1D3557] group-hover:shadow-[0_0_6px_rgba(29,53,87,0.6)] transition-all duration-300 delay-100" />
          </div>

          {/* Enhanced Border Left Accent */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-10 sm:h-12 md:h-16 bg-gradient-to-b from-[#FF7400] via-white to-[#1D3557] rounded-r-full opacity-60 group-hover:opacity-100 group-hover:w-1 sm:group-hover:w-1.5 group-hover:shadow-[0_0_12px_rgba(255,116,0,0.6)] transition-all duration-500" />
        </div>
      ))}
    </div>
  );
}

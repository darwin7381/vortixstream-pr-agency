import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function NewsletterSuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // 開始倒數計時
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // 倒數結束，跳轉回首頁
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 清理定時器
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
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
      
      {/* Grid Pattern */}
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
      <div className="relative z-10 container-global text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Icon Background with Glow Effect */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#FF7400]/30 group-hover:to-[#1D3557]/30 group-hover:border-white/40">
                
                {/* Icon Glow Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF7400]/10 to-[#1D3557]/10 blur-sm scale-110 opacity-100 animate-pulse" />
                
                {/* Success Check Icon */}
                <Check className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white/90" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-6">
            <h1 className="text-[32px] sm:text-[40px] md:text-[56px] lg:text-[64px] font-bold text-white leading-[1.1] font-['Space_Grotesk:Bold'] tracking-[-0.32px] sm:tracking-[-0.4px] md:tracking-[-0.56px] lg:tracking-[-0.64px]">
              Successfully Subscribed!
            </h1>
            
            <p className="text-[16px] sm:text-[18px] md:text-[20px] text-white/80 font-['Noto_Sans:Regular'] leading-[1.5] max-w-lg mx-auto">
              Thank you for subscribing to our newsletter. You'll receive updates about our latest features and releases.
            </p>
          </div>

          {/* Countdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="relative">
                {/* Countdown Circle */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/20 flex items-center justify-center relative">
                  {/* Animated Border */}
                  <div 
                    className="absolute inset-0 rounded-full border-2 border-[#FF7400] transition-all duration-1000"
                    style={{
                      transform: `rotate(${(5 - countdown) * 72}deg)`,
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((5 - countdown) * 72 * Math.PI / 180)}% ${50 - 50 * Math.sin((5 - countdown) * 72 * Math.PI / 180)}%, 50% 50%)`
                    }}
                  />
                  
                  {/* Countdown Number */}
                  <span className="text-[24px] sm:text-[28px] font-bold text-white font-['Roboto:Bold']">
                    {countdown}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-[14px] sm:text-[16px] text-white/60 font-['Noto_Sans:Regular']">
              Redirecting to homepage in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
          </div>

          {/* Manual Return Button */}
          <div className="pt-4">
            <button
              onClick={() => onNavigate('home')}
              className="text-[14px] sm:text-[16px] text-white/60 hover:text-white underline font-['Noto_Sans:Regular'] transition-colors duration-300"
            >
              Return to homepage now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
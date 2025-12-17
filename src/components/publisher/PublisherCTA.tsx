import { Button } from '../ui/button';
import { publisherContent } from '../../constants/publisherData';

export default function PublisherCTASection() {
  return (
    <section className="bg-black py-section-large">
      <div className="container-global">
        <div className="max-w-[1280px] mx-auto">
          {/* CTA Card with Space Cat Astronaut Background */}
          <div className="relative rounded-2xl overflow-hidden border border-white">
            {/* Custom Space Background */}
            <div 
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 20% 30%, rgba(29,53,87,0.4) 0%, transparent 40%),
                  radial-gradient(circle at 80% 70%, rgba(255,116,0,0.15) 0%, transparent 35%),
                  radial-gradient(circle at 60% 20%, rgba(16,34,68,0.3) 0%, transparent 30%),
                  linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 30%, #16213e 70%, #0f0f23 100%)
                `
              }}
            />
            
            {/* Cat Astronaut with Color Harmony */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `url('https://files.blocktempo.ai/VortixStream_cf/sketch_cat.png')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'calc(100% - 10px) center',
                opacity: 0.9,
                filter: 'brightness(0.85) contrast(1.1) sepia(0.15) saturate(0.8)',
                mixBlendMode: 'normal'
              }}
            />
            
            {/* Color Harmony Overlay for Cat */}
            <div 
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 75% 50%, rgba(29,53,87,0.1) 0%, transparent 60%),
                  radial-gradient(circle at 85% 40%, rgba(16,34,68,0.08) 0%, transparent 40%)
                `,
                pointerEvents: 'none'
              }}
            />
            
            {/* Space Stars */}
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: `${1 + Math.random() * 2}px`,
                  height: `${1 + Math.random() * 2}px`,
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  opacity: 0.6 + Math.random() * 0.4,
                  animation: `float-particle ${2 + Math.random() * 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
            
            {/* Shooting Stars */}
            <div 
              className="absolute w-16 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
              style={{
                top: '20%',
                right: '15%',
                transform: 'rotate(-30deg)',
                animation: 'hero-light-stream-1 8s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-30"
              style={{
                top: '70%',
                left: '20%',
                transform: 'rotate(45deg)',
                animation: 'hero-light-stream-2 10s ease-in-out infinite'
              }}
            />
            
            {/* Dark overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="relative z-10 px-8 py-16 md:px-16 md:py-20">
              <div className="max-w-[768px] space-y-6 lg:space-y-8">
                <div className="space-y-5 lg:space-y-6">
                  <h2 
                    className="text-white text-[32px] md:text-[52px] publisher-cta-title font-medium leading-[1.2] tracking-[-0.32px] md:tracking-[-0.52px]"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {publisherContent.cta.title}
                  </h2>
                  <p className="text-white text-[12px] md:text-[18px] publisher-section-description opacity-90">
                    {publisherContent.cta.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="border border-[#FF7400] text-white overflow-hidden px-8 py-[20px] text-[12px] md:text-[16px] publisher-hero-button-text font-medium rounded-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,116,0,0.4)] before:absolute before:inset-0 before:bg-black/20 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 relative"
                    style={{ 
                      background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' 
                    }}
                  >
                    <span className="relative z-10">{publisherContent.cta.buttons.primary}</span>
                  </Button>
                  <Button 
                    className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black px-8 py-[20px] text-[12px] md:text-[16px] publisher-hero-button-text font-medium rounded-md transition-all duration-300"
                  >
                    {publisherContent.cta.buttons.secondary}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
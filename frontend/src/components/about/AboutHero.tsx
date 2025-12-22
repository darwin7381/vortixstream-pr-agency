import { Button } from '../ui/button';
import { MaterialSymbol } from '../ui/material-symbol';
import { aboutContent } from '../../constants/aboutData';

export default function AboutHero() {
  return (
    <section className="bg-black py-section-large">
      <div className="container-global">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="flex-1 space-y-6 lg:space-y-8 text-center lg:text-left">
              {/* Main Heading */}
              <div>
                <h1 
                  className="text-white text-[32px] md:text-[52px] font-medium leading-[1.2] tracking-[-0.32px] md:tracking-[-0.52px]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {aboutContent.hero.title}
                </h1>
              </div>

              {/* Description */}
              <div>
                <p className="text-white text-[12px] md:text-[18px] opacity-90">
                  {aboutContent.hero.description}
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex justify-center lg:justify-start">
                <Button 
                  className="border border-[#FF7400] text-white overflow-hidden px-8 py-[20px] text-[12px] md:text-[16px] font-medium rounded-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,116,0,0.4)] before:absolute before:inset-0 before:bg-black/20 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 relative"
                  style={{ 
                    background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' 
                  }}
                >
                  <span className="relative z-10">{aboutContent.hero.cta}</span>
                </Button>
              </div>
            </div>

            {/* Image Placeholder */}
            <div className="flex-1">
              <div className="aspect-[600/400] bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent border border-white/10 rounded-2xl flex items-center justify-center">
                <div className="text-white/20 text-center">
                  <MaterialSymbol name="business" size={64} className="mx-auto mb-4" />
                  <p className="text-[14px]">VortixPR Visual</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



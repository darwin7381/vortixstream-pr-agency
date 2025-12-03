import { Button } from './ui/button';
import { MaterialSymbol } from './ui/material-symbol';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Footer from './Footer';
import { aboutContent } from '../constants/aboutData';
import { Linkedin, Twitter } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
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

      {/* Our Team Section */}
      <section className="bg-black py-section-large">
        <div className="container-global">
          <div className="max-w-[1280px] mx-auto space-y-12 lg:space-y-16">
            {/* Section Header */}
            <div className="text-center max-w-[768px] mx-auto space-y-4">
              <h2 
                className="text-white text-[44px] md:text-[72px] font-medium leading-[1.2] tracking-[-0.44px] md:tracking-[-0.72px]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {aboutContent.team.title}
              </h2>
              <p className="text-white text-[12px] md:text-[18px] opacity-90">
                {aboutContent.team.subtitle}
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {aboutContent.team.members.map((member, index) => (
                <div 
                  key={member.name}
                  className="group text-center space-y-4 hover:scale-[1.02] transition-transform duration-300"
                >
                  {/* Avatar */}
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-0.5">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <ImageWithFallback
                          src={member.avatar}
                          alt={`${member.name} - ${member.position}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    
                    {/* Placeholder if needed */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
                      <MaterialSymbol name="person" size={48} className="text-white/40" />
                    </div>
                  </div>

                  {/* Name & Position */}
                  <div className="space-y-1">
                    <h3 
                      className="text-white text-[18px] md:text-[20px] font-medium leading-[1.3] tracking-[-0.18px] md:tracking-[-0.2px]"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {member.name}
                    </h3>
                    <p className="text-white/80 text-[12px] md:text-[14px] leading-[1.4]">
                      {member.position}
                    </p>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-3">
                    <a 
                      href={member.linkedin}
                      className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                    >
                      <Linkedin size={16} className="text-white" />
                    </a>
                    <a 
                      href={member.twitter}
                      className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                    >
                      <Twitter size={16} className="text-white" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
import { MaterialSymbol } from '../ui/material-symbol';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { aboutContent } from '../../constants/aboutData';
import { Linkedin, Twitter } from 'lucide-react';

export default function AboutTeam() {
  return (
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
  );
}



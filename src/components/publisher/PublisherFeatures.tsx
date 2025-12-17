import { ImageWithFallback } from '../figma/ImageWithFallback';
import { publisherFeatures, publisherContent } from '../../constants/publisherData';

export default function PublisherFeaturesSection() {
  return (
    <section className="bg-black py-section-large">
      <div className="container-global">
        <div className="max-w-[1280px] mx-auto space-y-12 lg:space-y-20">
          {/* Section Header */}
          <div className="text-center max-w-[768px] mx-auto space-y-5 lg:space-y-6">
            <h2 
              className="text-white text-[44px] md:text-[72px] publisher-section-title font-medium leading-[1.2] tracking-[-0.44px] md:tracking-[-0.72px]"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {publisherContent.whyPartner.title}
            </h2>
            <p className="text-white text-[12px] md:text-[18px] publisher-section-description opacity-90">
              {publisherContent.whyPartner.description}
            </p>
          </div>

          {/* Features Grid */}
          <div className="space-y-8 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 publisher-features-grid">
              {publisherFeatures.map((feature, index) => (
                <div 
                  key={feature.title} 
                  className="group relative bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent border border-white/10 rounded-xl p-6 lg:p-8 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 hover:animate-[subtle-glow_2s_ease-in-out_infinite] hover:shadow-lg hover:shadow-white/5"
                >
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative space-y-4 lg:space-y-5">
                    {/* Enhanced Moon Icon Container */}
                    <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl p-3 border border-white/10 group-hover:border-white/20 transition-all duration-500">
                      <ImageWithFallback
                        src="https://files.blocktempo.ai/VortixStream_cf/moon-icon-bk.svg"
                        alt="Feature Icon"
                        className="w-full h-full object-contain group-hover:animate-[moon-float_3s_ease-in-out_infinite] transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 
                        className="text-white text-[20px] md:text-[24px] lg:text-[28px] publisher-feature-title font-medium leading-[1.3] tracking-[-0.2px] md:tracking-[-0.24px] lg:tracking-[-0.28px] group-hover:text-white transition-colors duration-300"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-white/90 text-[12px] md:text-[14px] lg:text-[16px] publisher-feature-description opacity-90 leading-[1.6] group-hover:opacity-100 transition-opacity duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
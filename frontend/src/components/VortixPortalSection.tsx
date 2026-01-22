import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import TemplateDownloadForm from './template/TemplateDownloadForm';

export default function VortixPortalSection() {
  const [sectionData, setSectionData] = useState<any>(null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/public/content/sections/vortix_portal`)
      .then(r => r.json())
      .then(setSectionData)
      .catch(console.error);
  }, []);

  return (
    <section className="bg-black py-section-large">
      <div className="container-global">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center publisher-content-layout publisher-features-content">
            {/* Image First (Desktop Left, Mobile Top) */}
            <div className="flex-1 publisher-content-item">
              <ImageWithFallback
                src={sectionData?.image_url}
                alt="Vortix Portal Dashboard"
                className="w-full aspect-[600/640] rounded-2xl object-cover"
              />
            </div>

            {/* Content Second (Desktop Right, Mobile Bottom) */}
            <div className="flex-1 space-y-6 lg:space-y-8 publisher-content-item">
              {/* Header with Orange Label */}
              <div className="mb-12 md:mb-16">
                {/* Orange Label */}
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#FF7400] shadow-[0_0_10px_#FF7400] animate-pulse"></div>
                  <span className="text-[14px] text-[#FF7400] font-mono tracking-widest uppercase font-bold">
                    {sectionData?.label}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-[40px] md:text-[52px] font-medium text-white font-heading tracking-[-0.4px] md:tracking-[-0.52px] drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  {sectionData?.title}
                  <span className="block mt-2 text-[#94A3B8] font-light text-[24px] md:text-[32px]">{sectionData?.subtitle}</span>
                </h2>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-[12px] md:text-[16px] font-sans leading-relaxed drop-shadow-md text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  {sectionData?.description}
                </p>
              </div>

              {/* Features Section */}
              <div className="space-y-3">
                <h3 className="text-white text-[16px] md:text-[18px] font-semibold">
                  {sectionData?.features_label}
                </h3>
                <div className="space-y-4 py-2">
                  {sectionData?.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      </div>
                      <p className="text-white text-[12px] md:text-[16px] publisher-feature-list-text leading-[1.5]">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8 inline-block">
                <button 
                  onClick={() => setIsWaitlistOpen(true)}
                  className="relative flex justify-center items-center gap-2 px-6 py-[20px] rounded-md border border-[#FF7400] text-white transition-all duration-200 hover:before:absolute hover:before:inset-0 hover:before:bg-black/20 hover:before:rounded-md text-[12px] md:text-[16px] font-semibold"
                  style={{ 
                    background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' 
                  }}
                >
                  {sectionData?.cta_primary?.text}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      <TemplateDownloadForm 
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </section>
  );
}


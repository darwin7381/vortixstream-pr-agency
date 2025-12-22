import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MaterialSymbol } from './ui/material-symbol';
import { publisherPlatformFeatures, publisherContent } from '../constants/publisherData';

interface EverythingYouNeedSectionProps {
  reverse?: boolean;
}

export default function EverythingYouNeedSection({ reverse = false }: EverythingYouNeedSectionProps) {
  return (
    <section className="bg-black py-section-large">
      <div className="container-global">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center publisher-content-layout publisher-features-content">
            {reverse ? (
              <>
                {/* Image First (Desktop Right, Mobile Top) */}
                <div className="flex-1 publisher-content-item lg:order-2">
                  <ImageWithFallback
                    src="https://files.blocktempo.ai/VortixStream_cf/Catronut-ezgif-optimize(4).gif"
                    alt="Dashboard Features"
                    className="w-full aspect-[600/640] rounded-2xl object-cover"
                  />
                </div>

                {/* Content Second (Desktop Left, Mobile Bottom) */}
                <div className="flex-1 space-y-6 lg:space-y-8 publisher-content-item lg:order-1">
                  <div className="space-y-5 lg:space-y-6">
                    <h2 
                      className="text-white text-[32px] md:text-[44px] publisher-section-subtitle font-medium leading-[1.2] tracking-[-0.32px] md:tracking-[-0.44px]"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {publisherContent.everythingNeeded.title}
                    </h2>
                    <p className="text-white text-[12px] md:text-[18px] publisher-section-description opacity-90">
                      {publisherContent.everythingNeeded.description}
                    </p>
                  </div>

                  {/* Feature List */}
                  <div className="space-y-4 py-2">
                    {publisherPlatformFeatures.map((feature, index) => (
                      <div key={feature} className="flex items-center gap-4">
                        <MaterialSymbol 
                          name="ev_shadow" 
                          variant="outlined"
                          size={16} 
                          className="text-white flex-shrink-0" 
                        />
                        <p className="text-white text-[12px] md:text-[16px] publisher-feature-list-text leading-[1.5]">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Content First (Desktop Left, Mobile Top) */}
                <div className="flex-1 space-y-6 lg:space-y-8 publisher-content-item">
                  <div className="space-y-5 lg:space-y-6">
                    <h2 
                      className="text-white text-[32px] md:text-[44px] publisher-section-subtitle font-medium leading-[1.2] tracking-[-0.32px] md:tracking-[-0.44px]"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {publisherContent.everythingNeeded.title}
                    </h2>
                    <p className="text-white text-[12px] md:text-[18px] publisher-section-description opacity-90">
                      {publisherContent.everythingNeeded.description}
                    </p>
                  </div>

                  {/* Feature List */}
                  <div className="space-y-4 py-2">
                    {publisherPlatformFeatures.map((feature, index) => (
                      <div key={feature} className="flex items-center gap-4">
                        <MaterialSymbol 
                          name="ev_shadow" 
                          variant="outlined"
                          size={16} 
                          className="text-white flex-shrink-0" 
                        />
                        <p className="text-white text-[12px] md:text-[16px] publisher-feature-list-text leading-[1.5]">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Second (Desktop Right, Mobile Bottom) */}
                <div className="flex-1 publisher-content-item">
                  <ImageWithFallback
                    src="https://files.blocktempo.ai/VortixStream_cf/Catronut-ezgif-optimize(4).gif"
                    alt="Dashboard Features"
                    className="w-full aspect-[600/640] rounded-2xl object-cover"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
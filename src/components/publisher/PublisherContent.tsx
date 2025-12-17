import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MaterialSymbol } from '../ui/material-symbol';
import { publisherPlatformFeatures, paymentMethods, publisherContent } from '../../constants/publisherData';

export default function PublisherContentSections() {
  return (
    <>
      {/* Everything You Need Section */}
      <section className="bg-black py-section-large">
        <div className="container-global">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center publisher-content-layout publisher-features-content">
              {/* Content */}
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

              {/* Image */}
              <div className="flex-1 publisher-content-item">
                <ImageWithFallback
                  src="https://files.blocktempo.ai/VortixStream_cf/Catronut-ezgif-optimize(4).gif"
                  alt="Dashboard Features"
                  className="w-full aspect-[600/640] rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Options Section */}
      <section className="bg-black py-section-large">
        <div className="container-global">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center publisher-content-layout publisher-payment-content">
              {/* Image */}
              <div className="flex-1 order-2 lg:order-1 publisher-content-item">
                <ImageWithFallback
                  src="https://files.blocktempo.ai/VortixStream_cf/CatronutBTC-ezgif-optimize.gif"
                  alt="Payment Options"
                  className="w-full aspect-[600/640] rounded-2xl object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-6 lg:space-y-8 order-1 lg:order-2 publisher-content-item">
                <div className="space-y-3 lg:space-y-4">
                  <p className="text-white text-[16px] font-semibold">{publisherContent.payments.sectionLabel}</p>
                  <h2 
                    className="text-white text-[32px] md:text-[52px] publisher-payment-title font-medium leading-[1.2] tracking-[-0.32px] md:tracking-[-0.52px]"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {publisherContent.payments.title}
                  </h2>
                  <p className="text-white text-[12px] md:text-[18px] publisher-section-description opacity-90">
                    {publisherContent.payments.description}
                  </p>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4 py-2">
                  {paymentMethods.map((method, index) => (
                    <div key={method} className="flex items-center gap-4">
                      <MaterialSymbol 
                        name="ev_shadow" 
                        variant="outlined"
                        size={24} 
                        className="text-white flex-shrink-0" 
                      />
                      <p className="text-white text-[12px] md:text-[16px] publisher-payment-list-text leading-[1.5]">
                        {method}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div>
                  <Button 
                    className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black px-8 py-[20px] text-[12px] md:text-[16px] publisher-hero-button-text font-medium rounded-md transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
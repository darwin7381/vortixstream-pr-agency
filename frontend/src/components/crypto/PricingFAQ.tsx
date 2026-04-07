import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface PricingFAQProps {
  faqs: FAQItem[];
}

export default function PricingFAQ({ faqs }: PricingFAQProps) {
  const [openItems, setOpenItems] = useState<number[]>([0]); // 預設第一個項目展開

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="bg-black py-16 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 xl:px-16">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl xl:text-6xl mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 'medium', letterSpacing: '-0.02em' }}>
            FAQs
          </h2>
          <p className="text-white text-base md:text-lg opacity-80 max-w-2xl mx-auto">
            Got questions? We've got answers. Can't find what you're looking for? Contact us.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          <div className="border-b-2 border-white">
            {faqs.map((faq, index) => (
              <div key={index} className="border-t-2 border-white">
                {/* Question */}
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full py-4 md:py-6 px-0 flex items-center justify-between text-left hover:bg-white/5 transition-colors duration-200"
                >
                  <h3 className="text-white text-base md:text-lg pr-6" style={{ fontWeight: 'bold' }}>
                    {faq.question}
                  </h3>
                  <ChevronDown 
                    className={`w-6 h-6 md:w-8 md:h-8 text-white flex-shrink-0 transition-transform duration-300 ${
                      openItems.includes(index) ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Answer */}
                {openItems.includes(index) && (
                  <div className="pb-6 px-0">
                    <p className="text-white text-sm md:text-base opacity-80 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  // 基本內容
  title?: string;
  description?: string;
  faqs: FAQItem[];
  
  // 樣式控制
  className?: string;
  maxWidth?: 'default' | 'narrow' | 'wide'; // FAQ容器最大寬度
  variant?: 'default' | 'bordered'; // FAQ樣式變體
  
  // CTA區域控制
  showCTA?: boolean;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  
  // 默認展開項目
  defaultOpenItems?: string[];
}

export default function FAQSection({
  title = "FAQs",
  description = "Get answers to common questions about our PR services and approach to blockchain and AI communications.",
  faqs,
  className = "",
  maxWidth = 'default',
  variant = 'default',
  showCTA = true,
  ctaTitle = "Still have questions?",
  ctaDescription = "Our team of PR experts is ready to discuss your specific needs and create a customized strategy for your blockchain or AI project.",
  ctaPrimaryText = "Schedule a Consultation",
  ctaSecondaryText = "Contact Support",
  onPrimaryAction,
  onSecondaryAction,
  defaultOpenItems = ["item-0"]
}: FAQSectionProps) {
  
  // For bordered variant, we need custom state management
  const [openItems, setOpenItems] = useState<number[]>([0]); // 預設第一個項目展開

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };
  
  // 動態設置最大寬度
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'narrow': return 'max-w-[768px]';
      case 'wide': return 'max-w-[1024px]';
      default: return 'max-w-[900px]';
    }
  };

  return (
    <section className={`bg-black py-16 md:py-28 relative overflow-hidden ${className}`}>
      {/* 微妙的背景效果 */}
      <div 
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* 浮動粒子效果 */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 py-section-small px-[17px]">
        <div className="max-w-[1280px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-20 max-w-[768px] mx-auto">
            <h2 className="text-[40px] md:text-[52px] font-medium text-white mb-5 md:mb-6 tracking-[-0.4px] md:tracking-[-0.52px] font-heading font-medium">
              {title}
            </h2>
            <p className="text-[12px] md:text-[18px] text-white font-sans">
              {description}
            </p>
          </div>

          {/* FAQ Content */}
          <div className={`${getMaxWidthClass()} mx-auto mb-12 md:mb-16`}>
            {variant === 'bordered' ? (
              // Bordered style (for pricing page) - Custom implementation
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
            ) : (
              // Default card style (for home page) - Shadcn Accordion
              <Accordion type="multiple" defaultValue={defaultOpenItems} className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/8 hover:border-white/20 transition-all duration-300 group"
                  >
                    <AccordionTrigger className="px-6 py-4 md:px-8 md:py-6 text-left hover:no-underline group-hover:text-white/90">
                      <span className="text-[14px] md:text-[18px] font-semibold text-white font-sans font-semibold leading-[1.4]">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 md:px-8 md:pb-6">
                      <p className="text-[12px] md:text-[16px] text-white/80 font-sans leading-[1.6]">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

          {/* CTA Section */}
          {showCTA && (
            <div className="text-center">
              <div className="max-w-[600px] mx-auto mb-8">
                <h3 className="text-[24px] md:text-[32px] font-medium text-white mb-4 tracking-[-0.24px] md:tracking-[-0.32px] font-heading font-medium">
                  {ctaTitle}
                </h3>
                <p className="text-[12px] md:text-[16px] text-white/80 font-sans leading-[1.6]">
                  {ctaDescription}
                </p>
              </div>
              
              <div className="flex flex-row gap-3 md:gap-6 items-center justify-center max-w-[500px] mx-auto">
                <Button 
                  onClick={onPrimaryAction}
                  className="relative flex-1 md:flex-none flex justify-center items-center gap-2 px-4 md:px-8 py-[20px] rounded-md border border-[#FF7400] text-white transition-all duration-200 hover:before:absolute hover:before:inset-0 hover:before:bg-black/20 hover:before:rounded-md text-[12px] md:text-[16px]"
                  style={{ 
                    background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' 
                  }}
                >
                  {ctaPrimaryText}
                </Button>
                <Button 
                  onClick={onSecondaryAction}
                  variant="outline" 
                  className="flex-1 md:flex-none border-2 border-white text-white bg-transparent hover:bg-white hover:text-black text-[12px] md:text-[16px] py-[20px] px-4 md:px-8 transition-all duration-300"
                >
                  {ctaSecondaryText}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
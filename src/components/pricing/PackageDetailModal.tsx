import { X } from 'lucide-react';
import { Package } from '../../constants/pricingDataV2';
import { Button } from '../ui/button';

interface PackageDetailModalProps {
  package: Package;
  isOpen: boolean;
  onClose: () => void;
}

export default function PackageDetailModal({ 
  package: pkg, 
  isOpen, 
  onClose 
}: PackageDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      {/* Modal Content */}
      <div 
        className="
          relative bg-gradient-to-br from-[#0a0a0a] to-black
          border-2 border-white/20 rounded-2xl 
          max-w-2xl w-full max-h-[85vh] overflow-y-auto
          shadow-[0_0_50px_rgba(255,116,0,0.15)]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="
            absolute top-6 right-6 p-2 rounded-lg 
            bg-white/5 hover:bg-white/10 
            text-white/60 hover:text-white 
            transition-all duration-300 z-10
          "
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4 pr-12">
              <h2 
                className="text-white text-3xl md:text-4xl font-bold"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {pkg.name}
              </h2>
              <div className="text-[#FF7400] text-2xl md:text-3xl font-bold whitespace-nowrap">
                {pkg.price}
              </div>
            </div>
            <p className="text-white/50 text-sm uppercase tracking-wide font-medium">
              {pkg.description}
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

          {/* Detailed Sections */}
          {pkg.detailedInfo?.sections && (
            <div className="space-y-7 mb-8">
              {pkg.detailedInfo.sections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h3 className="text-white text-sm font-bold mb-3 uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <div className="space-y-2.5">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start gap-3 pl-1">
                        <div className="w-1.5 h-1.5 bg-[#FF7400] rounded-full mt-2 flex-shrink-0" />
                        <p className="text-white/70 text-sm leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Note */}
          {pkg.detailedInfo?.note && (
            <div className="mb-8 p-4 bg-[#1D3557]/10 border border-[#1D3557]/30 rounded-lg">
              <p className="text-white/80 text-sm italic leading-relaxed">
                {pkg.detailedInfo.note}
              </p>
            </div>
          )}

          {/* CTA Button */}
          <Button
            className="
              w-full border border-[#FF7400] text-white overflow-hidden
              py-3 px-6 rounded-lg transition-all duration-300
              hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,116,0,0.4)]
              relative
              before:absolute before:inset-0 before:bg-black/20 before:opacity-0 before:transition-opacity before:duration-300
              hover:before:opacity-100
            "
            style={{
              background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)'
            }}
          >
            <span className="relative z-10 font-semibold text-base">
              {pkg.detailedInfo?.ctaText || 'Get Started'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}


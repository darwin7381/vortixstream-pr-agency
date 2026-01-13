import { X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { type PRPackage } from '../../api/client';
import { Button } from '../ui/button';
import { handleGetStartedClick } from '../../utils/navigationHelpers';

interface PackageDetailModalProps {
  package: PRPackage;
  isOpen: boolean;
  onClose: () => void;
}

export default function PackageDetailModal({ 
  package: pkg, 
  isOpen, 
  onClose 
}: PackageDetailModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 glass-backdrop" />

      {/* Modal Content */}
      <div 
        className="
          relative glass-modal
          border border-white/30 rounded-2xl 
          max-w-2xl w-full
          shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_80px_rgba(255,255,255,0.05),inset_0_0_0_1px_rgba(255,255,255,0.1)]
          flex flex-col
        "
        style={{ maxHeight: '85vh' }}
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

        {/* Scrollable Content */}
        <div className="p-8 md:p-10 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4 pr-12">
              <h2 
                className="text-white text-3xl md:text-4xl font-bold"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {pkg.name}
              </h2>
              <div className="text-[#FF7400] text-3xl md:text-[2.5rem] font-bold whitespace-nowrap">
                {pkg.price}
              </div>
            </div>
            <p className="text-white/50 text-sm uppercase tracking-wide font-medium mb-6">
              {pkg.description}
            </p>
            
            {/* Badge and Media Logos Row */}
            {(pkg.badge || pkg.mediaLogos) && (
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                {pkg.badge && (
                  <div 
                    className="
                      px-4 py-1.5 rounded-full 
                      bg-[#FF7400]/10 
                      border border-[#FF7400]/30
                      relative
                    "
                  >
                    <span className="text-[#FF7400]/90 text-[11px] font-bold uppercase tracking-wider">
                      {pkg.badge}
                    </span>
                  </div>
                )}
                {/* Media Logos */}
                {pkg.mediaLogos && pkg.mediaLogos.map((logo, index) => (
                  <img 
                    key={index}
                    src={logo.url}
                    alt={logo.name}
                    className="h-8 w-auto object-contain opacity-60"
                    style={{
                      filter: 'brightness(1.2)'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Main Features with Green Checkmarks */}
          <div className="space-y-3 mb-8">
            {pkg.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="none">
                  <path 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    fill="#22C55E"
                    fillRule="evenodd" 
                    clipRule="evenodd"
                    strokeWidth="0.5"
                    stroke="#22C55E"
                  />
                </svg>
                <p className="text-white text-base leading-relaxed">
                  {feature}
                </p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

          {/* Detailed Sections */}
          {pkg.detailedInfo?.sections && (
            <div className="space-y-6 mb-8">
              {pkg.detailedInfo.sections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-[#FF7400] rounded-full flex-shrink-0" />
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

          {/* Note and CTA Button in Same Row */}
          {pkg.detailedInfo?.note && (
            <div className="flex items-center justify-between gap-6">
              <p className="text-white/70 text-sm flex-1">
                {pkg.detailedInfo.note}
              </p>
              <Button
                onClick={() => {
                  handleGetStartedClick(navigate, location.pathname);
                  onClose();
                }}
                className="
                  border border-[#FF7400] text-white overflow-hidden flex-shrink-0
                  py-3 px-8 rounded-lg transition-all duration-300
                  hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,116,0,0.4)]
                  relative
                  before:absolute before:inset-0 before:bg-black/20 before:opacity-0 before:transition-opacity before:duration-300
                  hover:before:opacity-100
                "
                style={{
                  background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)'
                }}
              >
                <span className="relative z-10 font-semibold text-base whitespace-nowrap">
                  {pkg.detailedInfo?.ctaText || 'Get Started'}
                </span>
              </Button>
            </div>
          )}
          
          {/* CTA Button Only (if no note) */}
          {!pkg.detailedInfo?.note && (
            <Button
              onClick={() => {
                handleGetStartedClick(navigate, location.pathname);
                onClose();
              }}
              className="
                w-full border border-[#FF7400] text-white overflow-hidden
                py-3 px-8 rounded-lg transition-all duration-300
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
          )}
        </div>
      </div>
    </div>
  );
}


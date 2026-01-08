import { useState } from 'react';
import { X, Mail, Sparkles, FileText } from 'lucide-react';
import { PRTemplate } from '../../constants/templateData';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/useAuth';
import EmailLoginModal from './EmailLoginModal';

interface TemplatePreviewModalProps {
  template: PRTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (template: PRTemplate) => void;
}

export default function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onDownload
}: TemplatePreviewModalProps) {
  const { user, loginWithGoogle } = useAuth();
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleEmailToMe = () => {
    if (user) {
      // User is logged in - send directly
      alert(`Template will be sent to ${user.email}`);
      console.log('Sending template to:', user.email);
    } else {
      // User not logged in - show email/login modal
      setShowEmailModal(true);
    }
  };

  const handleEmailSubmit = (email: string) => {
    console.log('Sending template to:', email);
    alert(`Template will be sent to ${email}`);
    setShowEmailModal(false);
  };

  const handleGoogleLogin = async () => {
    // Use the same Google login method as LoginPage
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login failed:', error);
      alert('Google login failed. Please try again.');
    }
  };

  const handleOtherLogin = () => {
    // Close current modals and navigate to login page
    setShowEmailModal(false);
    onClose();
    window.location.href = '/login';
  };

  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-white text-[24px] md:text-[28px] font-sans font-bold">
                {template.title}
              </h2>
              <span
                className="text-[12px] font-sans font-semibold px-3 py-1 rounded-full border"
                style={{
                  color: template.categoryColor,
                  backgroundColor: `${template.categoryColor}20`,
                  borderColor: `${template.categoryColor}40`
                }}
              >
                {template.category}
              </span>
            </div>
            <p className="text-white/70 text-[14px] font-sans">
              {template.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            aria-label="Close preview"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Template Content Preview */}
          <div>
            <h3 className="text-white text-[18px] font-sans font-bold mb-3 flex items-center gap-2">
              <FileText size={20} className="text-[#FF7400]" />
              Template Content Preview
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-white/80 text-[14px] leading-relaxed space-y-4">
                {template.content.split('\n').map((line, index, allLines) => {
                  // Remove ### at the end
                  if (line.trim() === '###') return null;
                  
                  // Helper function to process line (add links and highlights)
                  const processLine = (text: string) => {
                    // Convert markdown links to HTML links first
                    let processed = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, linkText, url) => {
                      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#3B82F6] hover:text-[#60A5FA] underline transition-colors">${linkText}</a>`;
                    });
                    // Then highlight remaining parameters in brackets (without showing the brackets)
                    processed = processed.replace(/\[([^\]]+)\]/g, '<span class="bg-[#FF7400]/20 text-[#FF7400] px-1.5 py-0.5 rounded font-semibold">$1</span>');
                    return processed;
                  };
                  
                  // Images - ![alt](url)
                  const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
                  if (imageMatch) {
                    const [, alt, url] = imageMatch;
                    return (
                      <div key={index} className="my-6">
                        <img 
                          src={url} 
                          alt={alt} 
                          className="w-full rounded-lg border border-white/10"
                          loading="lazy"
                        />
                      </div>
                    );
                  }
                  
                  // Image captions (lines starting with *)
                  if (line.trim().startsWith('*') && line.trim().endsWith('*')) {
                    const caption = line.trim().slice(1, -1);
                    return <div key={index} className="text-white/50 text-[12px] italic text-center -mt-4 mb-4">{caption}</div>;
                  }
                  
                  // FOR IMMEDIATE RELEASE
                  if (line.includes('FOR IMMEDIATE RELEASE')) {
                    return <div key={index} className="font-bold text-[#FF7400] text-[12px] tracking-wider mb-6 uppercase">{line}</div>;
                  }
                  
                  // Main headline (H1) - First substantive line after FOR IMMEDIATE RELEASE
                  // Check by position and length, ignore emoji/bullet prefixes
                  if (index > 0 && index <= 5 && line.length > 40 && !line.startsWith(' ') && !line.startsWith('*') && !line.match(/^[•\-]/)) {
                    const previousLines = allLines.slice(0, index).filter(l => l.length > 40 && !l.includes('FOR IMMEDIATE RELEASE') && !l.startsWith('*'));
                    
                    // First long line = H1 (main headline)
                    if (previousLines.length === 0) {
                      return <h1 key={index} className="font-bold text-white text-[24px] leading-tight mb-3 mt-4" dangerouslySetInnerHTML={{ __html: processLine(line) }} />;
                    }
                    // Second long line = H2 (subheadline)
                    if (previousLines.length === 1) {
                      return <h2 key={index} className="text-white/90 text-[18px] font-semibold mb-6 leading-snug" dangerouslySetInnerHTML={{ __html: processLine(line) }} />;
                    }
                  }
                  
                  // Section headers ending with colon
                  if (line.match(/^[A-Z][^:]+:$/) && !line.includes('–')) {
                    return <h3 key={index} className="font-bold text-white text-[16px] mt-6 mb-3" dangerouslySetInnerHTML={{ __html: processLine(line) }} />;
                  }
                  
                  // Section headers (About, Media Contact, etc.)
                  if (line.match(/^(About |Media Contact|Resources:|Availability|Capital Allocation|Pricing and|Key Achievement|Section Header|Partnership Highlights|Customer Benefits|Event Details|Featured Speakers|Summit Highlights|Registration and|Team Pedigree|Market Opportunity|Beta Program|Technical Enhancements|Headline Features)/)) {
                    return <h3 key={index} className="font-bold text-white text-[16px] mt-6 mb-3" dangerouslySetInnerHTML={{ __html: processLine(line) }} />;
                  }
                  
                  // Bullet points with emojis - should be prominent
                  if (line.match(/^[🚀💡🎨🔒📈👥🌏]/)) {
                    return <div key={index} className="font-semibold text-white text-[15px] mt-4 mb-2" dangerouslySetInnerHTML={{ __html: processLine(line) }} />;
                  }
                  
                  // Regular bullet points
                  if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                    return <div key={index} className="text-white/70 ml-4 mb-1.5 text-[14px]" dangerouslySetInnerHTML={{ __html: processLine(line) }} />;
                  }
                  
                  // Quotes (lines with " and reasonable length)
                  if (line.includes('"') && line.length > 50) {
                    return <div key={index} className="italic text-white/85 border-l-3 border-[#FF7400] pl-4 my-4 py-2" dangerouslySetInnerHTML={{ __html: processLine(line) }} />;
                  }
                  
                  // Empty lines
                  if (!line.trim()) {
                    return <div key={index} className="h-3" />;
                  }
                  
                  // Regular paragraphs
                  return <div key={index} className="text-white/75 text-[14px] leading-relaxed" dangerouslySetInnerHTML={{ __html: processLine(line) }} />;
                })}
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div>
            <h3 className="text-white text-[18px] font-sans font-bold mb-3">
              📌 What's Included
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {template.includes.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-white/70 text-[14px] font-sans"
                >
                  <span className="text-[#FF7400] mt-1">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div>
            <h3 className="text-white text-[18px] font-sans font-bold mb-3">
              💼 Use Cases
            </h3>
            <div className="space-y-2">
              {template.useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-white/70 text-[14px] font-sans"
                >
                  <span className="w-1.5 h-1.5 bg-[#FF7400] rounded-full" />
                  {useCase}
                </div>
              ))}
            </div>
          </div>

          {/* Industry Tags */}
          {template.industryTags.length > 0 && (
            <div>
              <h3 className="text-white text-[18px] font-sans font-bold mb-3">
                🏢 Industries
              </h3>
              <div className="flex flex-wrap gap-2">
                {template.industryTags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-[12px] font-sans text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="bg-gradient-to-r from-[#FF7400]/10 to-[#1D3557]/10 border border-[#FF7400]/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-white/70 text-[14px] font-sans">
                <span className="text-[#FF7400] font-bold">{template.downloadCount.toLocaleString()}</span> people have used this template
              </div>
              <div className="text-white/60 text-[12px] font-sans">
                🔥 Popular
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-black/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Email to Me Button */}
            <Button
              onClick={handleEmailToMe}
              className="bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/30 transition-all h-12"
            >
              <Mail size={18} className="mr-2" />
              {user ? 'Email to Me' : 'Get Template via Email'}
            </Button>

            {/* Use Template Button */}
            <Button
              onClick={() => onDownload(template)}
              className="bg-gradient-to-r from-[#FF7400] to-[#FF7400]/80 text-white border border-[#FF7400] hover:shadow-[0_8px_25px_rgba(255,116,0,0.3)] transition-all h-12"
            >
              <Sparkles size={18} className="mr-2" />
              Use Template
            </Button>
          </div>

          {/* Info Text */}
          <div className="mt-4 text-center">
            <p className="text-white/50 text-[12px] font-sans">
              {user ? (
                <>Will be sent to <span className="text-[#FF7400]">{user.email}</span></>
              ) : (
                <>No account required • Instant delivery</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Email/Login Modal */}
      <EmailLoginModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        templateTitle={template.title}
        onEmailSubmit={handleEmailSubmit}
        onGoogleLogin={handleGoogleLogin}
        onOtherLogin={handleOtherLogin}
      />
    </div>
  );
}


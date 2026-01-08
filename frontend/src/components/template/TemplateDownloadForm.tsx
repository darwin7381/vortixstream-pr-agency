import { useState } from 'react';
import { X, Mail, Sparkles, Zap, Wand2, Check } from 'lucide-react';
import { PRTemplate } from '../../constants/templateData';
import { Button } from '../ui/button';

interface TemplateDownloadFormProps {
  template: PRTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplateDownloadForm({
  template,
  isOpen,
  onClose
}: TemplateDownloadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subscribeNewsletter: true,
    interestedInService: true
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !template) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 模擬提交到 waitlist
    console.log('AI Waitlist signup:', {
      ...formData,
      templateId: template.id,
      templateTitle: template.title,
      feature: 'ai-editor'
    });

    setSubmitted(true);

    // 3秒後關閉
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        subscribeNewsletter: true,
        interestedInService: true
      });
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {!submitted ? (
          <>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Side - Benefits (Hidden on mobile, shown on desktop) */}
              <div className="hidden md:block p-8 bg-gradient-to-br from-white/[0.02] to-transparent border-r border-white/10">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-[#10B981]/20 border border-[#10B981]/40 rounded-xl flex items-center justify-center mb-4">
                    <Wand2 size={24} className="text-[#10B981]" />
                  </div>
                  <h3 className="text-white text-[20px] font-sans font-bold mb-2">
                    Early Access Benefits
                  </h3>
                </div>

                {/* Benefits List */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#10B981]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={14} className="text-[#10B981]" />
                    </div>
                    <div>
                      <h4 className="text-white text-[14px] font-sans font-semibold mb-1">
                        AI-Powered Writing
                      </h4>
                      <p className="text-white/60 text-[12px] font-sans">
                        Generate professional PR in seconds
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#10B981]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={14} className="text-[#10B981]" />
                    </div>
                    <div>
                      <h4 className="text-white text-[14px] font-sans font-semibold mb-1">
                        50% Launch Discount
                      </h4>
                      <p className="text-white/60 text-[12px] font-sans">
                        Exclusive pricing for early adopters
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#10B981]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={14} className="text-[#10B981]" />
                    </div>
                    <div>
                      <h4 className="text-white text-[14px] font-sans font-semibold mb-1">
                        Priority Support
                      </h4>
                      <p className="text-white/60 text-[12px] font-sans">
                        Direct access to our team
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 text-white/60 text-[12px] font-sans">
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-[#FF7400] to-[#10B981] rounded-full border-2 border-black" />
                      <div className="w-7 h-7 bg-gradient-to-br from-[#10B981] to-[#FF7400] rounded-full border-2 border-black" />
                      <div className="w-7 h-7 bg-gradient-to-br from-[#FF7400]/70 to-[#10B981]/70 rounded-full border-2 border-black" />
                    </div>
                    <span><span className="text-[#FF7400] font-bold">247</span> people joined</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="p-8">
                {/* Header */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 bg-[#FF7400]/20 border border-[#FF7400]/40 text-[#FF7400] text-[11px] font-sans font-bold px-3 py-1.5 rounded-full mb-3">
                    <Sparkles size={11} className="animate-pulse" />
                    Coming Soon
                  </div>
                  <h2 className="text-white text-[22px] font-sans font-bold mb-2">
                    AI PR Editor Waitlist
                  </h2>
                  <p className="text-white/70 text-[13px] font-sans">
                    Get early access to <span className="text-[#FF7400] font-semibold">{template.title}</span> in our AI-powered PR editor
                  </p>
                </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-white text-[13px] font-sans font-semibold mb-2">
                    Email <span className="text-[#FF7400]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-[14px] font-sans placeholder:text-white/40 focus:outline-none focus:border-[#FF7400]/50 focus:ring-2 focus:ring-[#FF7400]/20 transition-all"
                  />
                </div>

                {/* Name & Title */}
                <div>
                  <label className="block text-white text-[13px] font-sans font-semibold mb-2">
                    Name & Title <span className="text-white/40 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Chen, Marketing Director"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-[14px] font-sans placeholder:text-white/40 focus:outline-none focus:border-[#FF7400]/50 focus:ring-2 focus:ring-[#FF7400]/20 transition-all"
                  />
                </div>

                {/* Subscribe */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.subscribeNewsletter}
                      onChange={(e) => setFormData({ ...formData, subscribeNewsletter: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF7400] focus:ring-[#FF7400]/20"
                    />
                    <span className="text-white/70 text-[13px] font-sans group-hover:text-white/90 transition-colors">
                      Subscribe to monthly PR tips
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF7400] to-[#FF7400]/80 text-white border border-[#FF7400] hover:shadow-[0_8px_25px_rgba(255,116,0,0.3)] transition-all h-12 mt-6"
                >
                  <Sparkles size={16} className="mr-2" />
                  Join Waitlist
                </Button>

                {/* Mobile Benefits (shown only on mobile) */}
                <div className="md:hidden mt-6 pt-6 border-t border-white/10">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-white/70 text-[12px] font-sans">
                      <Check size={14} className="text-[#10B981]" />
                      <span>AI-powered writing in seconds</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-[12px] font-sans">
                      <Check size={14} className="text-[#10B981]" />
                      <span>50% launch discount</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-[12px] font-sans">
                      <Check size={14} className="text-[#10B981]" />
                      <span>Priority support</span>
                    </div>
                  </div>
                </div>

                <p className="text-white/50 text-[11px] font-sans text-center mt-4">
                  No credit card required
                </p>
              </form>
            </div>
          </div>
          </>
        ) : (
          // Success State
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#FF7400] rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={48} className="text-white animate-pulse" />
            </div>
            <h3 className="text-white text-[26px] font-sans font-bold mb-3">
              You're on the Waitlist! 🎉
            </h3>
            <p className="text-white/70 text-[15px] font-sans mb-2">
              We'll notify you at
            </p>
            <p className="text-[#FF7400] text-[16px] font-sans font-semibold mb-6">
              {formData.email}
            </p>
            <div className="flex items-center justify-center gap-2 text-[#10B981] text-[14px] font-sans">
              <Mail size={16} />
              Check your inbox for confirmation
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


import { useState } from 'react';
import { X, Mail, Zap, LogIn, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { templateAPI } from '../../api/templateClient';

interface EmailLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateTitle: string;
  onEmailSubmit: (email: string) => Promise<void>;
  onGoogleLogin: () => void;
  onOtherLogin: () => void;
}

export default function EmailLoginModal({
  isOpen,
  onClose,
  templateTitle,
  onEmailSubmit,
  onGoogleLogin,
  onOtherLogin
}: EmailLoginModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // 呼叫真實 API（onEmailSubmit 會處理）
      await onEmailSubmit(email);
      setEmail('');
    } catch (error) {
      console.error('❌ Email submission failed:', error);
      setSubmitError('Failed to send email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 glass-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="
        relative glass-modal w-full max-w-2xl 
        border border-white/30 rounded-2xl 
        shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_80px_rgba(255,255,255,0.05),inset_0_0_0_1px_rgba(255,255,255,0.1)]
        overflow-hidden
      ">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        >
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Side - Email Form */}
          <div className="p-8 border-r border-white/20">
            <div className="mb-6">
              <div className="w-12 h-12 bg-[#FF7400]/20 border border-[#FF7400]/40 rounded-xl flex items-center justify-center mb-4">
                <Mail size={24} className="text-[#FF7400]" />
              </div>
              <h3 
                className="text-white text-[20px] font-bold mb-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Email Template to Me
              </h3>
              <p className="text-white/70 text-[14px] font-sans">
                Enter your email to receive <span className="text-[#FF7400] font-semibold">{templateTitle}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-[14px] font-sans placeholder:text-white/40 focus:outline-none focus:border-[#FF7400]/50 focus:ring-2 focus:ring-[#FF7400]/20 transition-all"
                />
              </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#FF7400] to-[#FF7400]/80 text-white border border-[#FF7400] hover:shadow-[0_8px_25px_rgba(255,116,0,0.3)] transition-all h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail size={18} className="mr-2" />
                      Send Template
                    </>
                  )}
                </Button>

                {/* Error message */}
                {submitError && (
                  <p className="text-red-400 text-[12px] font-sans mt-2">
                    {submitError}
                  </p>
                )}
            </form>

            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex items-start gap-2 text-white/60 text-[12px] font-sans">
                <span className="text-[#FF7400]">💡</span>
                <span>We'll send the template to your inbox within seconds. No spam, ever.</span>
              </div>
            </div>
          </div>

          {/* Right Side - Google Login */}
          <div className="p-8 bg-gradient-to-br from-white/[0.02] to-transparent">
            <div className="mb-6">
              <div className="w-12 h-12 bg-[#10B981]/20 border border-[#10B981]/40 rounded-xl flex items-center justify-center mb-4">
                <Zap size={24} className="text-[#10B981]" />
              </div>
              <h3 
                className="text-white text-[20px] font-bold mb-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Or Sign Up for More
              </h3>
              <p className="text-white/70 text-[14px] font-sans mb-1">
                <span className="text-[#10B981] font-semibold">5-second registration</span> unlocks:
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2 text-white/70 text-[13px] font-sans">
                <span className="text-[#10B981] mt-0.5">✓</span>
                <span>Save templates to your account</span>
              </div>
              <div className="flex items-start gap-2 text-white/70 text-[13px] font-sans">
                <span className="text-[#10B981] mt-0.5">✓</span>
                <span>Access from any device</span>
              </div>
              <div className="flex items-start gap-2 text-white/70 text-[13px] font-sans">
                <span className="text-[#10B981] mt-0.5">✓</span>
                <span>Manage all your PR materials</span>
              </div>
              <div className="flex items-start gap-2 text-white/70 text-[13px] font-sans">
                <span className="text-[#10B981] mt-0.5">✓</span>
                <span>Early access to AI features</span>
              </div>
            </div>

            {/* Google Login Button */}
            <Button
              onClick={onGoogleLogin}
              className="w-full bg-white hover:bg-white/90 text-gray-900 border border-white/20 transition-all h-12 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-semibold">Continue with Google</span>
            </Button>

            {/* Other Login Method */}
            <div className="mt-3 text-center">
              <button
                onClick={onOtherLogin}
                className="text-white/60 hover:text-white text-[13px] font-sans font-semibold underline transition-colors inline-flex items-center gap-1"
              >
                <LogIn size={14} />
                Other Sign In Methods
              </button>
            </div>

            {/* Terms */}
            <div className="mt-4 text-center">
              <p className="text-white/50 text-[11px] font-sans">
                By signing up, you agree to our Terms & Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


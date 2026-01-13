import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { newsletterContent } from '../../constants/blogData';
import { newsletterAPI } from '../../api/client';
import { Check, Mail } from 'lucide-react';

export default function BlogNewsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && !loading) {
      setLoading(true);
      setError(null);
      try {
        await newsletterAPI.subscribe(email, 'blog');
        console.log('Successfully subscribed:', email);
        setSubscribedEmail(email);
        setEmail('');
        setSuccess(true);
      } catch (error) {
        console.error('Failed to subscribe:', error);
        setError('Subscription failed. Please try again later.');
        
        // Auto-hide error after 5 seconds
        setTimeout(() => setError(null), 5000);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 glass-backdrop"
            onClick={() => setSuccess(false)}
          />

          {/* Modal */}
          <div className="
            relative glass-modal w-full max-w-md
            border border-white/30 rounded-2xl
            shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_80px_rgba(255,255,255,0.05),inset_0_0_0_1px_rgba(255,255,255,0.1)]
            overflow-hidden
          ">
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#FF7400] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={48} className="text-white" />
              </div>
              <h3
                className="text-white text-[26px] font-bold mb-3"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Welcome Aboard! 🎉
              </h3>
              <p className="text-white/70 text-[15px] font-sans mb-2">
                You've successfully subscribed to our Newsletter
              </p>
              <p className="text-[#FF7400] text-[16px] font-sans font-semibold mb-6">
                {subscribedEmail}
              </p>
              <div className="flex items-center justify-center gap-2 text-[#10B981] text-[14px] font-sans mb-6">
                <Mail size={16} />
                Check your inbox for confirmation
              </div>
              <Button
                onClick={() => setSuccess(false)}
                className="bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <section className="bg-gradient-to-br from-gray-950 via-black to-gray-900 py-section-medium">
        <div className="container-global">
        <div className="max-w-[800px] mx-auto text-center">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating Particles */}
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-[#FF7400] rounded-full opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float-particle ${3 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 space-y-6 lg:space-y-8">
            {/* Newsletter Title */}
            <h2 
              className="text-white text-[24px] md:text-[32px] lg:text-[40px] font-medium leading-[1.2] tracking-[-0.24px] md:tracking-[-0.32px] lg:tracking-[-0.4px]"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {newsletterContent.title}
            </h2>

            {/* Newsletter Description */}
            <p className="text-white/80 text-[12px] md:text-[16px] lg:text-[18px] leading-[1.6] max-w-2xl mx-auto">
              {newsletterContent.description}
            </p>

            {/* Subscription Form */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletterContent.placeholder}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-[#FF7400] focus:ring-1 focus:ring-[#FF7400] h-12 text-[14px] md:text-[16px]"
                  required
                />
              </div>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#1D3557] to-[#FF7400] hover:from-[#FF7400] hover:to-[#1D3557] text-white px-8 py-3 h-12 text-[14px] md:text-[16px] font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,116,0,0.3)]"
              >
                {newsletterContent.buttonText}
              </Button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="max-w-md mx-auto p-4 bg-red-500/20 border border-red-500/40 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-red-400 text-[14px] font-sans text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Additional Info */}
            <p className="text-white/50 text-[10px] md:text-[12px]">
              Join 2,500+ PR professionals who trust our insights • No spam, unsubscribe anytime
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}



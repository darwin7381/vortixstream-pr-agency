import { Sparkles, Zap, MessageSquare, Palette } from 'lucide-react';
import { Button } from '../ui/button';

export default function ComingSoonBanner() {
  return (
    <div className="mt-20">
      <div className="bg-gradient-to-br from-[#FF7400]/10 via-[#1D3557]/10 to-[#FF7400]/5 border border-[#FF7400]/20 rounded-2xl p-8 md:p-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7400]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1D3557]/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FF7400]/20 border border-[#FF7400]/40 text-[#FF7400] text-[12px] font-sans font-bold px-4 py-2 rounded-full mb-6">
            <Sparkles size={14} className="animate-pulse" />
            Coming Soon
          </div>

          {/* Title */}
          <h3 className="text-white text-[28px] md:text-[36px] font-sans font-bold mb-4 leading-tight">
            AI-Powered Generation
            <span className="block text-[#FF7400] mt-2">Making PR Writing Effortlessly Professional</span>
          </h3>

          {/* Description */}
          <p className="text-white/80 text-[16px] md:text-[18px] font-sans leading-relaxed mb-8 max-w-3xl">
            Simply answer a few questions, and our AI generates professional-grade press releases. Select any paragraph to instantly rewrite, expand, or adjust the tone—no experience required.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#FF7400]/30 transition-all">
              <div className="w-10 h-10 bg-[#FF7400]/20 border border-[#FF7400]/40 rounded-lg flex items-center justify-center mb-3">
                <Sparkles size={20} className="text-[#FF7400]" />
              </div>
              <h4 className="text-white text-[16px] font-sans font-bold mb-2">
                Smart Draft Generation
              </h4>
              <p className="text-white/60 text-[13px] font-sans leading-relaxed">
                Professional PR in 10 seconds
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#FF7400]/30 transition-all">
              <div className="w-10 h-10 bg-[#FF7400]/20 border border-[#FF7400]/40 rounded-lg flex items-center justify-center mb-3">
                <Zap size={20} className="text-[#FF7400]" />
              </div>
              <h4 className="text-white text-[16px] font-sans font-bold mb-2">
                One-Click Optimization
              </h4>
              <p className="text-white/60 text-[13px] font-sans leading-relaxed">
                Rewrite and expand selections
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#FF7400]/30 transition-all">
              <div className="w-10 h-10 bg-[#FF7400]/20 border border-[#FF7400]/40 rounded-lg flex items-center justify-center mb-3">
                <MessageSquare size={20} className="text-[#FF7400]" />
              </div>
              <h4 className="text-white text-[16px] font-sans font-bold mb-2">
                Multiple Tone Options
              </h4>
              <p className="text-white/60 text-[13px] font-sans leading-relaxed">
                Switch between formal, casual, technical
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#FF7400]/30 transition-all">
              <div className="w-10 h-10 bg-[#FF7400]/20 border border-[#FF7400]/40 rounded-lg flex items-center justify-center mb-3">
                <Palette size={20} className="text-[#FF7400]" />
              </div>
              <h4 className="text-white text-[16px] font-sans font-bold mb-2">
                Online Editor
              </h4>
              <p className="text-white/60 text-[13px] font-sans leading-relaxed">
                Cloud-saved, edit anytime
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Button
              onClick={() => {
                // 滾動到聯絡表單或開啟 modal
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = '/contact';
                }
              }}
              className="bg-gradient-to-r from-[#FF7400] to-[#FF7400]/80 text-white border border-[#FF7400] hover:shadow-[0_8px_25px_rgba(255,116,0,0.3)] transition-all"
            >
              <Sparkles size={18} className="mr-2" />
              Get Early Access
            </Button>

            <div className="flex items-center gap-2 text-white/60 text-[14px] font-sans">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF7400] to-[#1D3557] rounded-full border-2 border-black" />
                <div className="w-8 h-8 bg-gradient-to-br from-[#1D3557] to-[#FF7400] rounded-full border-2 border-black" />
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF7400]/70 to-[#1D3557]/70 rounded-full border-2 border-black" />
              </div>
              <span><span className="text-[#FF7400] font-bold">127</span> early access sign-ups</span>
            </div>
          </div>

          {/* Feature Highlight */}
          <div className="mt-8 bg-black/30 border border-white/10 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <h4 className="text-white text-[16px] font-sans font-bold mb-2">
                  Why Choose AI Generation Over Templates?
                </h4>
                <ul className="space-y-2 text-white/70 text-[14px] font-sans">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF7400] mt-1">✓</span>
                    <span>Every release is unique and tailored to your brand</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF7400] mt-1">✓</span>
                    <span>AI learns your brand voice for better results over time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF7400] mt-1">✓</span>
                    <span>Edit and optimize instantly without re-downloading</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF7400] mt-1">✓</span>
                    <span>Cloud-saved versions enable seamless team collaboration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


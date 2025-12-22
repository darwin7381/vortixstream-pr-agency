import { X } from 'lucide-react';
import { useState } from 'react';

interface PublisherApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PublisherApplicationModal({ 
  isOpen, 
  onClose 
}: PublisherApplicationModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    websiteUrl: '',
    monthlyTraffic: '',
    contentType: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: 實際的表單提交邏輯
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
        setFormData({
          companyName: '',
          contactName: '',
          email: '',
          websiteUrl: '',
          monthlyTraffic: '',
          contentType: '',
          message: ''
        });
      }, 2000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
          max-w-2xl w-full
          shadow-[0_0_50px_rgba(255,116,0,0.15)]
          flex flex-col
        "
        style={{ maxHeight: '90vh' }}
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
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#FF7400] shadow-[0_0_10px_#FF7400] animate-pulse"></div>
              <span className="text-[12px] text-[#FF7400] font-mono tracking-widest uppercase font-bold">
                Publisher Network
              </span>
            </div>
            <h2 
              className="text-white text-3xl md:text-4xl font-bold mb-3"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Become a Publisher Partner
            </h2>
            <p className="text-white/60 text-sm md:text-base leading-relaxed">
              Join 500+ publishers earning revenue through premium content syndication. Fill out the form below and our team will review your application within 24 hours.
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company/Website Name */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Company/Website Name <span className="text-[#FF7400]">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 border border-white/10
                  text-white placeholder-white/30
                  focus:bg-white/8 focus:border-[#FF7400]/50 focus:outline-none
                  transition-all duration-300
                "
                placeholder="Enter your company or website name"
              />
            </div>

            {/* Contact Name */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Contact Name <span className="text-[#FF7400]">*</span>
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 border border-white/10
                  text-white placeholder-white/30
                  focus:bg-white/8 focus:border-[#FF7400]/50 focus:outline-none
                  transition-all duration-300
                "
                placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Email Address <span className="text-[#FF7400]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 border border-white/10
                  text-white placeholder-white/30
                  focus:bg-white/8 focus:border-[#FF7400]/50 focus:outline-none
                  transition-all duration-300
                "
                placeholder="your@email.com"
              />
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Website URL <span className="text-[#FF7400]">*</span>
              </label>
              <input
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                required
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 border border-white/10
                  text-white placeholder-white/30
                  focus:bg-white/8 focus:border-[#FF7400]/50 focus:outline-none
                  transition-all duration-300
                "
                placeholder="https://yourwebsite.com"
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly Traffic */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Monthly Traffic
                </label>
                <select
                  name="monthlyTraffic"
                  value={formData.monthlyTraffic}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border border-white/10
                    text-white
                    focus:bg-white/8 focus:border-[#FF7400]/50 focus:outline-none
                    transition-all duration-300
                  "
                >
                  <option value="" className="bg-black">Select range</option>
                  <option value="<10k" className="bg-black">Less than 10K</option>
                  <option value="10k-50k" className="bg-black">10K - 50K</option>
                  <option value="50k-100k" className="bg-black">50K - 100K</option>
                  <option value="100k-500k" className="bg-black">100K - 500K</option>
                  <option value="500k+" className="bg-black">500K+</option>
                </select>
              </div>

              {/* Content Type */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Content Type
                </label>
                <select
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border border-white/10
                    text-white
                    focus:bg-white/8 focus:border-[#FF7400]/50 focus:outline-none
                    transition-all duration-300
                  "
                >
                  <option value="" className="bg-black">Select type</option>
                  <option value="crypto" className="bg-black">Crypto/Blockchain</option>
                  <option value="ai" className="bg-black">AI/Technology</option>
                  <option value="web3" className="bg-black">Web3/DeFi</option>
                  <option value="general" className="bg-black">General News</option>
                  <option value="other" className="bg-black">Other</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Additional Information
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 border border-white/10
                  text-white placeholder-white/30
                  focus:bg-white/8 focus:border-[#FF7400]/50 focus:outline-none
                  transition-all duration-300
                  resize-none
                "
                placeholder="Tell us more about your website and audience..."
              />
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Submit Button */}
            {submitStatus === 'success' ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 text-green-400 text-base font-semibold">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Application Submitted Successfully!
                </div>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  w-full border border-[#FF7400] text-white overflow-hidden
                  py-4 px-8 rounded-lg transition-all duration-300
                  hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,116,0,0.4)]
                  relative
                  before:absolute before:inset-0 before:bg-black/20 before:opacity-0 before:transition-opacity before:duration-300
                  hover:before:opacity-100
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                "
                style={{
                  background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)'
                }}
              >
                <span className="relative z-10 font-semibold text-base">
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </span>
              </button>
            )}

            {/* Privacy Note */}
            <p className="text-white/40 text-xs text-center">
              By submitting this form, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}


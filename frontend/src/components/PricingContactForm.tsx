import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ChevronDown, Mail, MessageCircle, Send } from 'lucide-react';
import { contactAPI } from '../api/client';

export default function PricingContactForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    industry: '',
    projectDescription: '',
    budgetRange: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // 調用後端 API
      await contactAPI.submit({
        name: formData.fullName,
        email: formData.email,
        company: formData.company,
        phone: '', // 這個表單沒有電話欄位
        message: `產業: ${formData.industry}\n預算範圍: ${formData.budgetRange}\n\n專案描述:\n${formData.projectDescription}`
      });
      
      // 成功後清空表單
      setFormData({
        fullName: '',
        email: '',
        company: '',
        industry: '',
        projectDescription: '',
        budgetRange: ''
      });
      
      // 顯示成功訊息
      alert('感謝您的提交！我們會盡快與您聯繫。');
      
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      alert('提交失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#191919] py-16 md:py-28">
      <div className="max-w-7xl mx-auto px-5 xl:px-16">
        {/* Section Title */}
        <div className="text-left mb-12 md:mb-16">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl xl:text-6xl mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 'medium', letterSpacing: '-0.02em' }}>
            Get Your Custom Quote
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-3xl">
            Fill out the form below and we'll get back to you within 24 hours with a tailored proposal.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Contact Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-base mb-3">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-0 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-base mb-3">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@company.com"
                    className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-0 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Company Name and Industry Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-base mb-3">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your company"
                    className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-0 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-base mb-3">Industry</label>
                  <div className="relative">
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-white/40 focus:ring-0 transition-colors"
                      required
                    >
                      <option value="" disabled className="bg-[#1a1a1a]">Select your industry</option>
                      <option value="technology" className="bg-[#1a1a1a]">Technology</option>
                      <option value="healthcare" className="bg-[#1a1a1a]">Healthcare</option>
                      <option value="finance" className="bg-[#1a1a1a]">Finance</option>
                      <option value="retail" className="bg-[#1a1a1a]">Retail</option>
                      <option value="manufacturing" className="bg-[#1a1a1a]">Manufacturing</option>
                      <option value="education" className="bg-[#1a1a1a]">Education</option>
                      <option value="real-estate" className="bg-[#1a1a1a]">Real Estate</option>
                      <option value="entertainment" className="bg-[#1a1a1a]">Entertainment</option>
                      <option value="non-profit" className="bg-[#1a1a1a]">Non-Profit</option>
                      <option value="other" className="bg-[#1a1a1a]">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-white text-base mb-3">Project Description</label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Tell us about your project, goals, and what kind of PR support you're looking for..."
                  className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-0 transition-colors resize-none"
                  required
                />
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-white text-base mb-3">Budget Range</label>
                <div className="relative">
                  <select
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-white/40 focus:ring-0 transition-colors"
                    required
                  >
                    <option value="" disabled className="bg-[#1a1a1a]">Select budget range</option>
                    <option value="under-10k" className="bg-[#1a1a1a]">Under $10,000</option>
                    <option value="10k-25k" className="bg-[#1a1a1a]">$10,000 - $25,000</option>
                    <option value="25k-50k" className="bg-[#1a1a1a]">$25,000 - $50,000</option>
                    <option value="50k-100k" className="bg-[#1a1a1a]">$50,000 - $100,000</option>
                    <option value="100k-plus" className="bg-[#1a1a1a]">$100,000+</option>
                    <option value="discuss" className="bg-[#1a1a1a]">Let's Discuss</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    relative w-1/2 mx-auto border border-[#FF7400] text-white overflow-hidden
                    py-[10px] px-6 rounded-lg transition-all duration-300 flex justify-center items-center
                    hover:scale-105 hover:shadow-[0_0_25px_rgba(255,116,0,0.4)]
                    before:absolute before:inset-0 before:bg-black/20 before:opacity-0 before:transition-opacity before:duration-300
                    hover:before:opacity-100
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  "
                  style={{ 
                    background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' 
                  }}
                >
                  <span className="relative z-10">
                    {isSubmitting ? '發送中...' : 'Request Custom Quote'}
                  </span>
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column - Contact Methods */}
          <div className="space-y-6">
            {/* Email Us Card - Stats Section Style */}
            <div className="group relative">
              {/* Card Background with Enhanced Effects */}
              <div className="relative bg-gradient-to-br from-white/5 via-white/8 to-white/3 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-6 transition-all duration-500 ease-out hover:border-white/25 hover:bg-gradient-to-br hover:from-white/8 hover:via-white/12 hover:to-white/5 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:scale-[1.02] group-hover:backdrop-blur-md">
                
                {/* Subtle Inner Glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-start gap-4 mb-4 relative">
                  {/* Enhanced Icon Container */}
                  <div className="relative group/icon">
                    {/* Icon Background with Glow Effect */}
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:bg-gradient-to-br group-hover/icon:from-[#FF7400]/30 group-hover/icon:to-[#1D3557]/30 group-hover/icon:border-white/40 group-hover/icon:shadow-[0_0_20px_rgba(255,116,0,0.3)]">
                      
                      {/* Icon Glow Ring */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF7400]/10 to-[#1D3557]/10 blur-sm scale-110 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" />
                      
                      {/* Icon */}
                      <Mail className="w-6 h-6 text-white/90 group-hover/icon:text-white transition-colors duration-300 relative z-10" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white text-lg mb-2 font-semibold tracking-[-0.18px] group-hover:text-white transition-colors duration-300">Email Us</h3>
                    <p className="text-white/70 text-sm mb-3 group-hover:text-white/85 transition-colors duration-300">Get a response within 24 hours</p>
                    <a href="mailto:hello@vortixpr.com" className="text-[#FF7400] hover:text-[#FF7400]/80 transition-colors font-medium">
                      hello@vortixpr.com
                    </a>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-[#FF7400]/10 to-[#1D3557]/10 hover:from-[#FF7400]/20 hover:to-[#1D3557]/20 text-white border border-white/20 hover:border-white/40 py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-[0_4px_16px_rgba(255,116,0,0.2)]"
                  onClick={() => window.location.href = 'mailto:hello@vortixpr.com'}
                >
                  Send Email
                </Button>
                
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-1 h-1 bg-white/30 rounded-full group-hover:bg-[#FF7400] group-hover:shadow-[0_0_6px_rgba(255,116,0,0.6)] transition-all duration-300" />
              </div>
              
              {/* Enhanced Border Left Accent */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-16 bg-gradient-to-b from-[#FF7400] via-white to-[#1D3557] rounded-r-full opacity-60 group-hover:opacity-100 group-hover:w-1 group-hover:shadow-[0_0_12px_rgba(255,116,0,0.6)] transition-all duration-500" />
            </div>

            {/* Telegram Card - Stats Section Style */}
            <div className="group relative">
              {/* Card Background with Enhanced Effects */}
              <div className="relative bg-gradient-to-br from-white/5 via-white/8 to-white/3 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-6 transition-all duration-500 ease-out hover:border-white/25 hover:bg-gradient-to-br hover:from-white/8 hover:via-white/12 hover:to-white/5 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:scale-[1.02] group-hover:backdrop-blur-md">
                
                {/* Subtle Inner Glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-start gap-4 mb-4 relative">
                  {/* Enhanced Icon Container */}
                  <div className="relative group/icon">
                    {/* Icon Background with Glow Effect */}
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:bg-gradient-to-br group-hover/icon:from-[#FF7400]/30 group-hover/icon:to-[#1D3557]/30 group-hover/icon:border-white/40 group-hover/icon:shadow-[0_0_20px_rgba(255,116,0,0.3)]">
                      
                      {/* Icon Glow Ring */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF7400]/10 to-[#1D3557]/10 blur-sm scale-110 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" />
                      
                      {/* Icon */}
                      <MessageCircle className="w-6 h-6 text-white/90 group-hover/icon:text-white transition-colors duration-300 relative z-10" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white text-lg mb-2 font-semibold tracking-[-0.18px] group-hover:text-white transition-colors duration-300">Telegram</h3>
                    <p className="text-white/70 text-sm mb-3 group-hover:text-white/85 transition-colors duration-300">Quick chat support</p>
                    <a href="https://t.me/VortixPR" target="_blank" rel="noopener noreferrer" className="text-[#FF7400] hover:text-[#FF7400]/80 transition-colors font-medium">
                      @VortixPR
                    </a>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-[#FF7400]/10 to-[#1D3557]/10 hover:from-[#FF7400]/20 hover:to-[#1D3557]/20 text-white border border-white/20 hover:border-white/40 py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-[0_4px_16px_rgba(255,116,0,0.2)]"
                  onClick={() => window.open('https://t.me/VortixPR', '_blank')}
                >
                  Open Telegram
                </Button>
                
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-1 h-1 bg-white/30 rounded-full group-hover:bg-[#FF7400] group-hover:shadow-[0_0_6px_rgba(255,116,0,0.6)] transition-all duration-300" />
              </div>
              
              {/* Enhanced Border Left Accent */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-16 bg-gradient-to-b from-[#FF7400] via-white to-[#1D3557] rounded-r-full opacity-60 group-hover:opacity-100 group-hover:w-1 group-hover:shadow-[0_0_12px_rgba(255,116,0,0.6)] transition-all duration-500" />
            </div>

            {/* Service Level Agreement - Enhanced Style */}
            <div className="mt-8 group relative">
              <div className="relative bg-gradient-to-br from-white/3 via-white/5 to-white/2 backdrop-blur-sm border border-white/8 rounded-xl sm:rounded-2xl p-6 transition-all duration-500 ease-out hover:border-white/20 hover:bg-gradient-to-br hover:from-white/5 hover:via-white/8 hover:to-white/3 hover:shadow-[0_8px_32px_rgba(255,255,255,0.05)] group-hover:backdrop-blur-md">
                
                {/* Subtle Inner Glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF7400]/3 via-transparent to-[#1D3557]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <h4 className="text-[#FF7400] text-sm mb-4 font-semibold tracking-[-0.14px] relative">Service Level Agreement</h4>
                <div className="space-y-3 relative">
                  <div className="flex items-center gap-3 text-white/70 text-sm group-hover:text-white/85 transition-colors duration-300">
                    <div className="w-1.5 h-1.5 bg-[#FF7400] rounded-full shadow-[0_0_4px_rgba(255,116,0,0.6)]"></div>
                    <span>24-hour response guarantee</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70 text-sm group-hover:text-white/85 transition-colors duration-300">
                    <div className="w-1.5 h-1.5 bg-[#FF7400] rounded-full shadow-[0_0_4px_rgba(255,116,0,0.6)]"></div>
                    <span>Custom proposals within 48 hours</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70 text-sm group-hover:text-white/85 transition-colors duration-300">
                    <div className="w-1.5 h-1.5 bg-[#FF7400] rounded-full shadow-[0_0_4px_rgba(255,116,0,0.6)]"></div>
                    <span>Full privacy & NDA protection</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70 text-sm group-hover:text-white/85 transition-colors duration-300">
                    <div className="w-1.5 h-1.5 bg-[#FF7400] rounded-full shadow-[0_0_4px_rgba(255,116,0,0.6)]"></div>
                    <span>No obligation consultations</span>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute bottom-4 right-4 w-1 h-1 bg-white/20 rounded-full group-hover:bg-[#1D3557] group-hover:shadow-[0_0_6px_rgba(29,53,87,0.6)] transition-all duration-300 delay-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
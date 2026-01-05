import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import { newsletterAPI, contentAPI, type FooterSection, type FooterTextSettings, type SiteSettings } from '../api/client';
import VortixLogoWhite from '../assets/VortixLogo White_Horizontal.png';

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // CMS 資料
  const [footerSections, setFooterSections] = useState<FooterSection[]>([]);
  const [footerText, setFooterText] = useState<FooterTextSettings>({
    copyright: '© 2025 VortixPR. All rights reserved.',
    newsletter_description: 'Join our newsletter to stay up to date on features and releases.',
  });
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const lang = 'en'; // 目前固定英文

  // 載入 Footer 資料
  useEffect(() => {
    Promise.all([
      contentAPI.getFooterSections(lang),
      contentAPI.getFooterTextSettings(lang),
      contentAPI.getSiteSettings(),
    ]).then(([sections, text, settings]) => {
      if (sections && sections.length > 0) setFooterSections(sections);
      if (text) setFooterText(text);
      if (settings) setSiteSettings(settings);
    }).catch((error) => {
      console.error('Failed to load footer:', error);
      // 如果 CMS 載入失敗，使用原有的 footerData 內容
      setFooterSections([
        {
          id: 1,
          title: 'Map',
          section_key: 'map',
          display_order: 1,
          links: [
            { id: 1, label: 'Home', url: '/', target: '_self', display_order: 1 },
            { id: 2, label: 'Services', url: '/services', target: '_self', display_order: 2 },
            { id: 3, label: 'Packages', url: '/pricing', target: '_self', display_order: 3 },
            { id: 4, label: 'Our Client', url: '/clients', target: '_self', display_order: 4 },
            { id: 5, label: 'Publisher', url: '/publisher', target: '_self', display_order: 5 },
            { id: 6, label: 'About', url: '/about', target: '_self', display_order: 6 },
            { id: 7, label: 'Contact', url: '/contact', target: '_self', display_order: 7 },
          ]
        },
        {
          id: 2,
          title: 'Resources',
          section_key: 'resources',
          display_order: 2,
          links: [
            { id: 8, label: 'Blog', url: '/blog', target: '_self', display_order: 1 },
            { id: 9, label: 'Template', url: '/template', target: '_self', display_order: 2 },
            { id: 10, label: 'Concept', url: '/concept', target: '_self', display_order: 3 },
          ]
        },
      ]);
    });
  }, [lang]);
  
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: siteSettings?.social_facebook },
    { name: 'Instagram', icon: Instagram, url: siteSettings?.social_instagram },
    { name: 'X', icon: Twitter, url: siteSettings?.social_twitter },
    { name: 'LinkedIn', icon: Linkedin, url: siteSettings?.social_linkedin },
  ].filter(link => link.url);

  const handleSubscribe = async () => {
    // 清除之前的錯誤
    setError('');
    
    // 檢查 email 是否包含 @ 符號
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 調用後端 API 訂閱
      await newsletterAPI.subscribe(email, 'footer');
      
      // Email 驗證通過，導航到成功頁面
      navigate('/newsletter-success');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      setError('訂閱失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CompanyLogo = () => (
    <div className="flex items-center">
      <img
        src={VortixLogoWhite}
        alt="VortixPR Logo"
        className="h-10 sm:h-12 md:h-14 xl:h-16 2xl:h-20 shrink-0 w-auto object-contain"
        style={{ 
          maxWidth: 'none',
          display: 'block'
        }}
        onError={(e) => {
          console.error('Footer VortixPR Logo failed to load:', e);
        }}
        onLoad={() => {
          console.log('Footer VortixPR Logo loaded successfully');
        }}
      />
    </div>
  );

  return (
    <footer className="bg-black py-section-medium">
      <div className="container-large px-[20px] xl:px-[64px] mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 lg:gap-12 xl:gap-16 mb-16 md:mb-20">
            
            {/* Newsletter Section - Left side */}
            <div className="space-y-8">
              <CompanyLogo />
              <p className="text-white text-[14px] font-sans leading-[1.5] max-w-[320px]">
                {footerText.newsletter_description || 'Join our newsletter to stay up to date on features and releases.'}
              </p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex gap-4">
                    <Input 
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`flex-1 bg-transparent border text-white placeholder:text-gray-400 text-[14px] rounded-md px-4 py-3 h-[44px] transition-colors ${
                        error ? 'border-red-500 focus:border-red-500' : 'border-white focus:border-[#FF7400]'
                      }`}
                    />
                    <Button 
                      onClick={handleSubscribe}
                      disabled={isSubmitting}
                      className="bg-transparent border border-white text-white hover:bg-white hover:text-black text-[14px] px-6 py-3 rounded-md h-[44px] whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? '訂閱中...' : 'Subscribe'}
                    </Button>
                  </div>
                  {error && (
                    <p className="text-red-400 text-[12px] font-sans leading-[1.4] animate-pulse">
                      {error}
                    </p>
                  )}
                </div>
                <p className="text-white text-[12px] font-sans leading-[1.4] max-w-[320px]">
                  By subscribing you agree to with our <span className="underline cursor-pointer">Privacy Policy</span> and provide consent to receive updates from our company.
                </p>
              </div>
            </div>

            {/* Dynamic Footer Sections from CMS */}
            {footerSections.map((section) => (
              <div key={section.id} className="space-y-6">
                <h4 className="text-white text-[16px] font-sans font-semibold">
                  {section.title}
                </h4>
                <div className="space-y-4">
                  {section.links.map((link) => (
                    <a 
                      key={link.id} 
                      href={link.url}
                      onClick={(e) => {
                        if (!link.url.startsWith('http')) {
                          e.preventDefault();
                          navigate(link.url);
                        }
                      }}
                      target={link.target}
                      className="block text-white text-[14px] font-sans hover:text-gray-300 transition-colors leading-[1.4] cursor-pointer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}

            {/* Social Media Section */}
            {socialLinks.length > 0 && (
              <div className="space-y-6">
                <h4 className="text-white text-[16px] font-sans font-semibold">
                  Follow us
                </h4>
                <div className="space-y-4">
                  {socialLinks.map(({ name, icon: Icon, url }) => (
                    <a 
                      key={name}
                      href={url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white text-[14px] font-sans hover:text-gray-300 transition-colors leading-[1.4]"
                    >
                      <Icon size={16} className="flex-shrink-0" />
                      {name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-white pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-8">
              <p className="text-white text-[14px] font-sans">
                {footerText.copyright || '© 2025 VortixPR. All rights reserved.'}
              </p>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <a 
                  href="#" 
                  className="text-white text-[14px] font-sans underline hover:text-gray-300 transition-colors"
                >
                  Privacy Policy
                </a>
                <a 
                  href="#" 
                  className="text-white text-[14px] font-sans underline hover:text-gray-300 transition-colors"
                >
                  Terms of Service
                </a>
                <a 
                  href="#" 
                  className="text-white text-[14px] font-sans underline hover:text-gray-300 transition-colors"
                >
                  Cookies Settings
                </a>
              </div>
            </div>
          </div>
      </div>
    </footer>
  );
}
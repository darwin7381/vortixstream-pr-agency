import { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import { mapLinks, newsCategoryLinks, policyLinks } from '../constants/footerData';
import { Route } from '../hooks/useRouter';


interface FooterProps {
  onNavigate?: (route: Route) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const socialLinks = [
    { name: 'Facebook', icon: Facebook },
    { name: 'Instagram', icon: Instagram },
    { name: 'X', icon: Twitter },
    { name: 'LinkedIn', icon: Linkedin },
    { name: 'Youtube', icon: Youtube }
  ];

  const handleSubscribe = () => {
    // 清除之前的錯誤
    setError('');
    
    // 檢查 email 是否包含 @ 符號
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Email 驗證通過，導航到成功頁面
    if (onNavigate) {
      onNavigate('newsletter-success');
    }
  };

  const CompanyLogo = () => (
    <div className="flex items-center">
      <img
        src="https://files.blocktempo.ai/votrixstream-2.png"
        alt="VortixStream Logo"
        className="h-10 sm:h-12 md:h-14 xl:h-16 2xl:h-20 shrink-0 w-auto object-contain"
        style={{ 
          maxWidth: 'none',
          display: 'block'
        }}
        onError={(e) => {
          console.error('Footer VortixStream Logo failed to load:', e);
        }}
        onLoad={() => {
          console.log('Footer VortixStream Logo loaded successfully');
        }}
      />
    </div>
  );

  return (
    <footer className="bg-black py-section-medium">
      <div className="container-large px-[20px] xl:px-[64px] mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 lg:gap-12 xl:gap-16 mb-16 md:mb-20">
            
            {/* Newsletter Section - Left side, 40% width */}
            <div className="space-y-8">
              <CompanyLogo />
              <p className="text-white text-[14px] font-['Noto_Sans:Regular'] leading-[1.5] max-w-[320px]">
                Join our newsletter to stay up to date on features and releases.
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
                      className="bg-transparent border border-white text-white hover:bg-white hover:text-black text-[14px] px-6 py-3 rounded-md h-[44px] whitespace-nowrap transition-colors"
                    >
                      Subscribe
                    </Button>
                  </div>
                  {error && (
                    <p className="text-red-400 text-[12px] font-['Noto_Sans:Regular'] leading-[1.4] animate-pulse">
                      {error}
                    </p>
                  )}
                </div>
                <p className="text-white text-[12px] font-['Noto_Sans:Regular'] leading-[1.4] max-w-[320px]">
                  By subscribing you agree to with our <span className="underline cursor-pointer">Privacy Policy</span> and provide consent to receive updates from our company.
                </p>
              </div>
            </div>

            {/* Map Section */}
            <div className="space-y-6">
              <h4 className="text-white text-[16px] font-['Noto_Sans:SemiBold'] font-semibold">
                Map
              </h4>
              <div className="space-y-4">
                {mapLinks.map((link) => (
                  <a 
                    key={link} 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (link === 'Concept' && onNavigate) {
                        onNavigate('concept');
                      }
                    }}
                    className="block text-white text-[14px] font-['Noto_Sans:Regular'] hover:text-gray-300 transition-colors leading-[1.4] cursor-pointer"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* News Category Section */}
            <div className="space-y-6">
              <h4 className="text-white text-[16px] font-['Noto_Sans:SemiBold'] font-semibold">
                News Category
              </h4>
              <div className="space-y-4">
                {newsCategoryLinks.map((link) => (
                  <a 
                    key={link} 
                    href="#" 
                    className="block text-white text-[14px] font-['Noto_Sans:Regular'] hover:text-gray-300 transition-colors leading-[1.4]"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Follow Us Section */}
            <div className="space-y-6">
              <h4 className="text-white text-[16px] font-['Noto_Sans:SemiBold'] font-semibold">
                Follow us
              </h4>
              <div className="space-y-4">
                {socialLinks.map(({ name, icon: Icon }) => (
                  <a 
                    key={name}
                    href="#" 
                    className="flex items-center gap-3 text-white text-[14px] font-['Noto_Sans:Regular'] hover:text-gray-300 transition-colors leading-[1.4]"
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-white pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-8">
              <p className="text-white text-[14px] font-['Noto_Sans:Regular']">
                © 2025 VortixStream. All rights reserved.
              </p>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {policyLinks.map((link) => (
                  <a 
                    key={link} 
                    href="#" 
                    className="text-white text-[14px] font-['Noto_Sans:Regular'] underline hover:text-gray-300 transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
      </div>
    </footer>
  );
}
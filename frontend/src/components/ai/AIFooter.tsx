import { useNavigate } from 'react-router-dom';
import VortixLogoWhite from '../../assets/VortixLogo White_Horizontal.png';

const AI_FOOTER_LINKS = {
  map: [
    { label: 'Home', url: '/' },
    { label: 'Services', url: '/services' },
    { label: 'Pricing', url: '/pricing' },
    { label: 'Clients', url: '/clients' },
    { label: 'Publisher', url: '/publisher' },
    { label: 'About', url: '/about' },
  ],
  resources: [
    { label: 'Blog', url: '/blog' },
    { label: 'Crypto PR →', url: '/crypto' },
  ],
};

export default function AIFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-black py-16 md:py-20">
      <div className="container-large px-[20px] xl:px-[64px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-8 lg:gap-12 xl:gap-16 mb-16 md:mb-20">

          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center">
              <img
                src={VortixLogoWhite}
                alt="VortixPR Logo"
                className="h-10 sm:h-12 md:h-14 xl:h-16 w-auto object-contain"
              />
            </div>
            <p className="text-white text-[14px] font-sans leading-[1.5] max-w-[320px]">
              The PR agency for AI startups and technical founders. From stealth to Series B — we get your story told in the publications that matter.
            </p>
          </div>

          {/* Map Column */}
          <div className="space-y-6">
            <h4 className="text-white text-[16px] font-sans font-semibold">Map</h4>
            <div className="space-y-4">
              {AI_FOOTER_LINKS.map.map((link) => (
                <button
                  key={link.url}
                  onClick={() => navigate(link.url)}
                  className="block text-white text-[14px] font-sans hover:text-gray-300 transition-colors leading-[1.4] cursor-pointer text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resources Column */}
          <div className="space-y-6">
            <h4 className="text-white text-[16px] font-sans font-semibold">Resources</h4>
            <div className="space-y-4">
              {AI_FOOTER_LINKS.resources.map((link) => (
                <button
                  key={link.url}
                  onClick={() => navigate(link.url)}
                  className="block text-white text-[14px] font-sans hover:text-gray-300 transition-colors leading-[1.4] cursor-pointer text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-white/60 text-[12px] font-sans">
            © {new Date().getFullYear()} VortixPR. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <button
              onClick={() => navigate('/privacy-policy')}
              className="text-white/60 text-[12px] font-sans hover:text-white transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => navigate('/terms-of-service')}
              className="text-white/60 text-[12px] font-sans hover:text-white transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => navigate('/cookie-policy')}
              className="text-white/60 text-[12px] font-sans hover:text-white transition-colors"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

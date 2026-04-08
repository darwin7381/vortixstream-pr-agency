import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { type User } from '../../contexts/AuthContext';
import VortixLogoWhite from '../../assets/VortixLogo White_Horizontal.png';

function VortixPRLogo({ className = "" }: { className?: string }) {
  return (
    <div className="flex items-center">
      <img
        src={VortixLogoWhite}
        alt="VortixPR"
        className={`h-10 sm:h-11 md:h-12 lg:h-10 xl:h-11 w-auto object-contain transition-opacity duration-300 hover:opacity-80 ${className}`}
      />
    </div>
  );
}

function MobileMenuToggle({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="lg:hidden flex items-center justify-center p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 text-white hover:bg-white/10 rounded-md transition-colors duration-200"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
    </button>
  );
}

interface AINavigationProps {
  user?: User | null;
  onLogout?: () => void;
  onQuickLogin?: () => void;
}

const AI_NAV_ITEMS = [
  { id: 1, label: 'About', url: '/about' },
  { id: 2, label: 'Services', url: '/services' },
  { id: 3, label: 'Packages', url: '/pricing' },
  { id: 4, label: 'Clients', url: '/clients' },
  { id: 5, label: 'Publisher', url: '/publisher' },
];

export default function AINavigation({ user, onLogout, onQuickLogin }: AINavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = location.pathname;

  const handleNavClick = (url: string) => {
    if (url.startsWith('#')) {
      const el = document.getElementById(url.substring(1));
      if (el) {
        window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
      }
    } else {
      navigate(url);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black w-full fixed top-0 left-0 z-50 shadow-lg">
      {/* Desktop Navigation Bar */}
      <div className="hidden lg:flex items-center justify-between h-[72px] px-[20px] xl:px-[64px]">
        {/* Logo */}
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <VortixPRLogo />
        </button>

        {/* Desktop Nav Links */}
        <div className="flex items-center space-x-6 lg:space-x-8 xl:space-x-10">
          {AI_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.url)}
              className={`text-[16px] transition-all duration-300 hover:[text-shadow:0_0_6px_rgba(255,255,255,0.3)] relative py-2 ${
                currentPath === item.url ? 'text-[#FF7400]' : 'text-white hover:text-white/90'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center space-x-4">
          {/* Cross-brand link to Vortix Crypto */}
          <button
            onClick={() => navigate('/crypto')}
            className="text-xs text-gray-400 hover:text-white transition-colors duration-200 border border-gray-600 hover:border-gray-400 rounded-full px-3 py-1"
          >
            Crypto Services →
          </button>

          {user ? (
            <button
              onClick={onLogout}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black py-[20px] px-6"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                className="relative flex justify-center items-center gap-2 px-6 py-[20px] rounded-md border border-[#FF7400] text-white transition-all duration-200 hover:before:absolute hover:before:inset-0 hover:before:bg-black/20 hover:before:rounded-md"
                style={{ background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' }}
                onClick={onQuickLogin ?? (() => navigate('/login'))}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden flex items-center justify-between h-14 sm:h-16 md:h-[72px] px-[20px]">
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <VortixPRLogo />
        </button>
        <MobileMenuToggle
          isOpen={isMobileMenuOpen}
          toggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-black border-t border-gray-800 shadow-xl">
          <div className="px-[20px] py-6 space-y-4 max-h-[calc(100vh-56px)] overflow-y-auto">
            <div className="space-y-0.5">
              {AI_NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.url)}
                  className={`block w-full text-left text-[16px] py-3.5 px-3 rounded-lg hover:bg-white/5 transition-all duration-300 font-medium ${
                    currentPath === item.url ? 'text-[#FF7400] bg-[#FF7400]/5' : 'text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-800/70 pt-4 space-y-3">
              <button
                onClick={() => { navigate('/crypto'); setIsMobileMenuOpen(false); }}
                className="block w-full text-left text-sm text-gray-400 px-3 py-2"
              >
                Crypto Services →
              </button>

              {user ? (
                <button
                  onClick={onLogout}
                  className="block w-full text-left text-sm text-red-400 px-3 py-2"
                >
                  Sign Out
                </button>
              ) : (
                <Button
                  className="w-full flex justify-center items-center gap-2 px-6 py-[20px] rounded-md border border-[#FF7400] text-white"
                  style={{ background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' }}
                  onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

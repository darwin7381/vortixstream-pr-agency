import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User as UserIcon, Settings, LogOut, CreditCard, LayoutDashboard } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
    navigate(url);
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
            // 已登入用戶界面 — 與 crypto 一致
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-3 bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300 rounded-full p-2 border border-gray-700/50 hover:border-gray-600/70">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-[#FF7400] text-white text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <p className="text-white text-sm font-medium truncate max-w-[100px]">
                    {user.name}
                  </p>
                  <p className="text-gray-400 text-xs truncate max-w-[100px]">
                    {user.email}
                  </p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-black border border-gray-600 min-w-[200px] mt-2 shadow-xl"
              >
                <div className="px-4 py-3 border-b border-gray-800">
                  <p className="text-white font-medium text-sm">{user.name}</p>
                  <p className="text-gray-400 text-xs truncate">{user.email}</p>
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 bg-[#FF7400]/10 text-[#FF7400] border border-[#FF7400]/20">
                    {user.role === 'super_admin' ? 'Super Admin' :
                     user.role === 'admin' ? 'Admin' :
                     user.role === 'publisher' ? 'Publisher' : 'User'}
                  </div>
                </div>

                {(user.role === 'admin' || user.role === 'super_admin') && (
                  <>
                    <DropdownMenuItem
                      onClick={() => navigate('/admin')}
                      className="cursor-pointer px-4 py-3 text-sm text-white hover:bg-gray-800 flex items-center gap-3"
                    >
                      <LayoutDashboard size={16} />
                      Admin Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-800" />
                  </>
                )}

                <DropdownMenuItem className="cursor-pointer px-4 py-3 text-sm text-white hover:bg-gray-800 flex items-center gap-3">
                  <UserIcon size={16} />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer px-4 py-3 text-sm text-white hover:bg-gray-800 flex items-center gap-3">
                  <CreditCard size={16} />
                  Billing & Plans
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer px-4 py-3 text-sm text-white hover:bg-gray-800 flex items-center gap-3">
                  <Settings size={16} />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="cursor-pointer px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 flex items-center gap-3"
                >
                  <LogOut size={16} />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

            <div className="border-t border-gray-800/70 pt-4">
              {user ? (
                // 已登入用戶手機版界面 — 與 crypto 一致
                <div className="space-y-3">
                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-[#FF7400] text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{user.name}</p>
                        <p className="text-gray-400 text-xs truncate">{user.email}</p>
                      </div>
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#FF7400]/10 text-[#FF7400] border border-[#FF7400]/20">
                        {user.role === 'super_admin' ? 'Super Admin' :
                         user.role === 'admin' ? 'Admin' :
                         user.role === 'publisher' ? 'Publisher' : 'User'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(user.role === 'admin' || user.role === 'super_admin') && (
                      <>
                        <button
                          onClick={() => { navigate('/admin'); setIsMobileMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-white text-sm hover:bg-gray-800/50 rounded-lg transition-colors duration-200 font-medium"
                        >
                          <LayoutDashboard size={16} />
                          Admin Dashboard
                        </button>
                        <div className="border-t border-gray-800/50"></div>
                      </>
                    )}

                    <button className="w-full flex items-center gap-3 px-4 py-3 text-white text-sm hover:bg-gray-800/50 rounded-lg transition-colors duration-200">
                      <UserIcon size={16} />
                      Profile Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-white text-sm hover:bg-gray-800/50 rounded-lg transition-colors duration-200">
                      <CreditCard size={16} />
                      Billing & Plans
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-white text-sm hover:bg-gray-800/50 rounded-lg transition-colors duration-200">
                      <Settings size={16} />
                      Account Settings
                    </button>
                    <div className="border-t border-gray-800/50 pt-2">
                      <button
                        onClick={() => { onLogout?.(); setIsMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 text-sm hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors duration-200"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => { navigate('/crypto'); setIsMobileMenuOpen(false); }}
                    className="w-full text-sm text-gray-400 hover:text-white transition-colors duration-200 border border-gray-700 hover:border-gray-500 rounded-lg py-3 text-center"
                  >
                    Crypto Services →
                  </button>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-white/80 text-white bg-transparent hover:bg-white hover:text-black hover:border-white py-[18px] text-[16px] font-medium rounded-lg transition-all duration-300 hover:shadow-md"
                    onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full relative flex justify-center items-center gap-2 px-6 py-[18px] rounded-lg border border-[#FF7400] text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(255,116,0,0.3)] text-[16px] font-medium"
                    style={{ background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' }}
                    onClick={() => { onQuickLogin?.(); setIsMobileMenuOpen(false); }}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

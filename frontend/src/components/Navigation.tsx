import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Settings, LogOut, CreditCard, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { contentAPI, type NavItem, type NavCTA } from '../api/client';
import { User as UserType } from '../contexts/AuthContext';

// VortixPR Logo - 使用本地資源

import VortixLogoWhite from '../assets/VortixLogo White_Horizontal.png';

// VortixPR Logo 組件
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

// Mobile Menu Toggle
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

interface NavigationProps {
  user?: UserType | null;
  onLogout?: () => void;
  onQuickLogin?: () => void;
}

/**
 * Global Navigation Component
 * 全域導航組件，在所有頁面頂部顯示 VortixPR Logo
 * - 固定定位確保始終可見
 * - 響應式設計支援所有設備
 * - 直接導入 logo 確保顯示正確
 */
export default function Navigation({ user, onLogout, onQuickLogin }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [navCTA, setNavCTA] = useState<NavCTA | null>({ text: 'Get Started', url: '/contact' });
  const lang = 'en'; // 目前固定英文，下週加語言切換

  // 載入 Navigation 資料
  useEffect(() => {
    Promise.all([
      contentAPI.getNavigationItems(lang),
      contentAPI.getNavigationCTA(lang),
    ]).then(([items, cta]) => {
      if (items && items.length > 0) setNavItems(items);
      if (cta) setNavCTA(cta);
    }).catch((error) => {
      console.error('Failed to load navigation:', error);
      // 如果 CMS 載入失敗，使用原有的預設值
      setNavItems([
        { id: 1, label: 'About', desktop_url: '#about-section', mobile_url: '/about', target: '_self', parent_id: null, display_order: 1 },
        { id: 2, label: 'Services', desktop_url: '#services-section', mobile_url: '/services', target: '_self', parent_id: null, display_order: 2 },
        { id: 3, label: 'Packages', desktop_url: '#packages-section', mobile_url: '/pricing', target: '_self', parent_id: null, display_order: 3 },
        { id: 4, label: 'Publisher', desktop_url: '#publisher-section', mobile_url: '/publisher', target: '_self', parent_id: null, display_order: 4 },
        { id: 5, label: 'Contact', desktop_url: '#contact-section', mobile_url: '/contact', target: '_self', parent_id: null, display_order: 5 },
        { id: 6, label: 'Lyro', desktop_url: '#lyro-section', mobile_url: '/lyro', target: '_self', parent_id: null, display_order: 6 },
      ]);
    });
  }, [lang]);

  // 獲取當前路徑
  const currentPath = location.pathname;

  // 處理導航點擊
  const handleNavClick = (item: any) => {
    const isDesktop = window.innerWidth >= 1024;
    const url = isDesktop ? item.desktop_url : (item.mobile_url || item.desktop_url);
    
    if (url?.startsWith('#')) {
      const sectionId = url.substring(1);
      if (currentPath !== '/') {
        navigate('/');
        setTimeout(() => {
          const section = document.getElementById(sectionId);
          if (section) {
            window.scrollTo({ top: section.offsetTop - 72, behavior: 'smooth' });
          }
        }, 100);
      } else {
        const section = document.getElementById(sectionId);
        if (section) {
          window.scrollTo({ top: section.offsetTop - 72, behavior: 'smooth' });
        }
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
        {/* Desktop VortixPR Logo */}
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <VortixPRLogo />
        </button>
        
        {/* Desktop Navigation */}
        <div className="flex items-center space-x-6 lg:space-x-8 xl:space-x-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`text-white text-[16px] transition-all duration-500 ease-in-out hover:animate-[text-pulse_2s_ease-in-out_infinite] hover:[text-shadow:0_0_6px_rgba(255,255,255,0.3),0_0_12px_rgba(255,255,255,0.15),0_0_18px_rgba(255,255,255,0.08)] relative py-2 ${
                (currentPath === (item.mobile_url || item.desktop_url) || currentPath === item.desktop_url) ? 'text-[#FF7400]' : 'text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            // 已登入用戶界面
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
                
                {/* Admin Dashboard 連結（僅管理員可見） */}
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
                  <User size={16} />
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
            // 未登入用戶界面
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
                style={{ 
                  background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' 
                }}
                onClick={onQuickLogin}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden flex items-center justify-between h-14 sm:h-16 md:h-[72px] px-[20px] xl:px-[64px]">
        {/* Mobile VortixPR Logo */}
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <VortixPRLogo />
        </button>
        
        {/* Mobile Menu Toggle */}
        <MobileMenuToggle 
          isOpen={isMobileMenuOpen} 
          toggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-black border-t border-gray-800 shadow-xl">
          <div className="px-[20px] xl:px-[64px] py-6 space-y-4 max-h-[calc(100vh-56px)] sm:max-h-[calc(100vh-64px)] md:max-h-[calc(100vh-72px)] overflow-y-auto">
            {/* Navigation Links */}
            <div className="space-y-0.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`block w-full text-left text-[16px] py-3.5 px-3 rounded-lg hover:bg-white/5 transition-all duration-300 ease-in-out hover:animate-[text-pulse_2s_ease-in-out_infinite] hover:[text-shadow:0_0_6px_rgba(255,255,255,0.3),0_0_12px_rgba(255,255,255,0.15),0_0_18px_rgba(255,255,255,0.08)] active:bg-white/10 font-medium relative ${
                    (currentPath === (item.mobile_url || item.desktop_url) || currentPath === item.desktop_url) ? 'text-[#FF7400] bg-[#FF7400]/5' : 'text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* Mobile Action Buttons */}
            <div className="border-t border-gray-800/70 pt-4">
              {user ? (
                // 已登入用戶手機版界面
                <div className="space-y-3">
                  {/* 用戶資訊卡片 */}
                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-[#FF7400] text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">
                          {user.name}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#FF7400]/10 text-[#FF7400] border border-[#FF7400]/20">
                        {user.role === 'publisher' ? 'Publisher' : 'User'}
                      </div>
                    </div>
                  </div>

                  {/* 用戶選項按鈕 */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-white text-sm hover:bg-gray-800/50 rounded-lg transition-colors duration-200">
                      <User size={16} />
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
                // 未登入用戶手機版界面
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-white/80 text-white bg-transparent hover:bg-white hover:text-black hover:border-white py-[18px] text-[16px] font-medium rounded-lg transition-all duration-300 hover:shadow-md"
                    onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                  >
                    Login
                  </Button>
                  <Button 
                    className="w-full relative flex justify-center items-center gap-2 px-6 py-[18px] rounded-lg border border-[#FF7400] text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(255,116,0,0.3)] text-[16px] font-medium"
                    style={{ 
                      background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' 
                    }}
                    onClick={() => { onQuickLogin?.(); setIsMobileMenuOpen(false); }}
                  >
                    Sign Up
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
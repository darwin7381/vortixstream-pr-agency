import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Settings, LogOut, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { navItems, resourceItems } from '../constants/navigationData';
import { User as UserType } from '../hooks/useAuth';

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
  const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false);

  // 獲取當前路徑
  const currentPath = location.pathname;

  // 處理導航點擊 - 桌面版 scroll，手機版跳轉
  const handleNavClick = (itemName: string) => {
    const isDesktop = window.innerWidth >= 1024; // lg breakpoint
    
    // About 永遠跳轉到詳細頁面
    if (itemName === 'About') {
      navigate('/about');
      setIsMobileMenuOpen(false);
      return;
    }
    
    // 處理有首頁預覽區域的項目
    const sectionMap: { [key: string]: { id: string; path: string } } = {
      'Services': { id: 'services-section', path: '/services' },
      'Packages': { id: 'packages-section', path: '/pricing' },
      'Our Client': { id: 'clients-section', path: '/clients' },
      'Publisher': { id: 'publisher-section', path: '/publisher' }
    };
    
    const config = sectionMap[itemName];
    if (!config) return;
    
    // 桌面版：scroll 到首頁區域
    if (isDesktop) {
      // 如果不在首頁，先跳轉到首頁
      if (currentPath !== '/') {
        navigate('/');
        // 等待頁面跳轉完成後滾動
        setTimeout(() => {
          const section = document.getElementById(config.id);
          if (section) {
            const navbarHeight = 72; // 桌面版 navbar 高度
            const targetPosition = section.offsetTop - navbarHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else {
        // 已在首頁，直接滾動
        const section = document.getElementById(config.id);
        if (section) {
          const navbarHeight = 72;
          const targetPosition = section.offsetTop - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    } 
    // 手機版：跳轉到詳細頁面
    else {
      navigate(config.path);
    }
    
    // 關閉手機選單
    setIsMobileMenuOpen(false);
  };

  // 處理 Resources 下拉選單點擊
  const handleResourceClick = (itemName: string) => {
    if (itemName === 'Blog') {
      navigate('/blog');
    }
    // 其他資源項目暫時無功能
    // 關閉手機選單
    setIsMobileMenuOpen(false);
    setIsMobileResourcesOpen(false);
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
              key={item}
              onClick={() => handleNavClick(item)}
              className={`text-white text-[16px] transition-all duration-500 ease-in-out hover:animate-[text-pulse_2s_ease-in-out_infinite] hover:[text-shadow:0_0_6px_rgba(255,255,255,0.3),0_0_12px_rgba(255,255,255,0.15),0_0_18px_rgba(255,255,255,0.08)] relative py-2 ${
                (item === 'Services' && (currentPath === '/services' || (currentPath === '/' && document.getElementById('services-section')))) ||
                (item === 'Packages' && (currentPath === '/pricing' || (currentPath === '/' && document.getElementById('packages-section')))) ||
                (item === 'Our Client' && (currentPath === '/clients' || (currentPath === '/' && document.getElementById('clients-section')))) ||
                (item === 'Publisher' && (currentPath === '/publisher' || (currentPath === '/' && document.getElementById('publisher-section')))) ||
                (item === 'About' && currentPath === '/about')
                  ? 'text-[#FF7400]' 
                  : 'text-white'
              }`}
            >
              {item}
            </button>
          ))}
          
          {/* Desktop Resources Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`flex items-center space-x-2 text-[16px] transition-all duration-500 ease-in-out hover:animate-[text-pulse_2s_ease-in-out_infinite] hover:[text-shadow:0_0_6px_rgba(255,255,255,0.3),0_0_12px_rgba(255,255,255,0.15),0_0_18px_rgba(255,255,255,0.08)] focus:outline-none py-2 ${
              currentPath.startsWith('/blog') ? 'text-[#FF7400]' : 'text-white'
            }`}>
              <span>Resources</span>
              <ChevronDown size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="bg-black border border-gray-600 min-w-[160px] mt-2 shadow-xl"
            >
              {resourceItems.map((item) => (
                <DropdownMenuItem 
                  key={item}
                  onClick={() => handleResourceClick(item)}
                  className={`cursor-pointer px-4 py-3 text-[14px] transition-colors duration-200 hover:bg-gray-800 ${
                    (item === 'Blog' && currentPath.startsWith('/blog'))
                      ? 'text-[#FF7400] bg-gray-800/50' 
                      : 'text-white'
                  }`}
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
                    {user.role === 'publisher' ? 'Publisher' : 'User'}
                  </div>
                </div>
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
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`block w-full text-left text-[16px] py-3.5 px-3 rounded-lg hover:bg-white/5 transition-all duration-300 ease-in-out hover:animate-[text-pulse_2s_ease-in-out_infinite] hover:[text-shadow:0_0_6px_rgba(255,255,255,0.3),0_0_12px_rgba(255,255,255,0.15),0_0_18px_rgba(255,255,255,0.08)] active:bg-white/10 font-medium ${
                    (item === 'Services' && currentPath === '/services') ||
                    (item === 'Packages' && currentPath === '/pricing') ||
                    (item === 'Our Client' && currentPath === '/clients') ||
                    (item === 'Publisher' && currentPath === '/publisher') ||
                    (item === 'About' && currentPath === '/about')
                      ? 'text-[#FF7400] bg-[#FF7400]/5' 
                      : 'text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
              
              {/* Resources Button with same spacing as other nav items */}
              <div className="">
              <button
                onClick={() => setIsMobileResourcesOpen(!isMobileResourcesOpen)}
                className={`flex items-center justify-between w-full text-[16px] py-3.5 px-3 rounded-lg hover:bg-white/5 transition-all duration-300 active:bg-white/10 ${
                  currentPath.startsWith('/blog') ? 'text-[#FF7400] bg-[#FF7400]/5' : 'text-white'
                }`}
              >
                <span className="font-medium">Resources</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-all duration-300 ${isMobileResourcesOpen ? 'rotate-180 text-[#FF7400]' : ''} ${
                    currentPath.startsWith('/blog') ? 'text-[#FF7400]' : 'text-gray-400'
                  }`}
                />
              </button>
              
              {isMobileResourcesOpen && (
                <div className="mt-1 ml-2 mr-1 bg-gray-900/30 rounded-lg border border-gray-800/50 overflow-hidden">
                  <div className="py-1">
                    {resourceItems.map((item, index) => (
                      <button
                        key={item} 
                        onClick={() => handleResourceClick(item)}
                        className={`block w-full text-left text-[15px] py-3 px-4 transition-all duration-300 ease-in-out hover:bg-gray-800/50 active:bg-gray-700/50 ${
                          index !== resourceItems.length - 1 ? 'border-b border-gray-800/30' : ''
                        } ${
                          (item === 'Blog' && currentPath.startsWith('/blog'))
                            ? 'text-[#FF7400] bg-[#FF7400]/10 font-medium' 
                            : 'text-gray-200 hover:text-white hover:animate-[text-pulse_2s_ease-in-out_infinite] hover:[text-shadow:0_0_4px_rgba(255,255,255,0.25),0_0_8px_rgba(255,255,255,0.12)]'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-1.5 h-1.5 rounded-full mr-3 transition-colors duration-300 ${
                            (item === 'Blog' && currentPath.startsWith('/blog'))
                              ? 'bg-[#FF7400] shadow-sm shadow-[#FF7400]/50' 
                              : 'bg-gray-600'
                          }`} />
                          {item}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              </div>
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
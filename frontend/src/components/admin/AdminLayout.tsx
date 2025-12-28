import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  Package,
  MessageSquare,
  Mail,
  ChevronDown,
  Folder,
  Menu,
  X,
  Home,
  Image,
  List,
  Search,
  Bell,
  Settings,
  LogOut,
  UserCircle,
  Moon,
  Sun,
  Users
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import VortixLogoWhite from '../../assets/VortixLogo White_Horizontal.png';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  icon: any;
  path?: string;
  children?: NavItem[];
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const isActive = (path: string) => {
    // 精確匹配路徑
    return location.pathname === path;
  };

  // 檢查路徑是否在某個父選單下
  const isPathInMenu = (menuLabel: string, children?: NavItem[]): boolean => {
    if (!children) return false;
    return children.some(child => child.path && location.pathname.startsWith(child.path));
  };

  // 根據當前路徑自動展開相應的父選單
  useEffect(() => {
    const menusToExpand: string[] = [];
    
    navStructure.forEach(item => {
      if (item.children && isPathInMenu(item.label, item.children)) {
        menusToExpand.push(item.label);
      }
    });
    
    setExpandedMenus(menusToExpand);
  }, [location.pathname]);

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuKey) 
        ? prev.filter(k => k !== menuKey)
        : [...prev, menuKey]
    );
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const navStructure: NavItem[] = [
    { 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/admin' 
    },
    { 
      label: 'Blog 文章', 
      icon: FileText, 
      path: '/admin/blog' 
    },
    { 
      label: 'Pricing 方案', 
      icon: DollarSign, 
      path: '/admin/pricing' 
    },
    {
      label: 'PR Packages',
      icon: Package,
      children: [
        { label: 'Packages 列表', icon: List, path: '/admin/pr-packages' },
        { label: '分類管理', icon: Folder, path: '/admin/pr-packages/categories' },
      ]
    },
    { 
      label: '媒體圖庫', 
      icon: Image, 
      path: '/admin/media' 
    },
    { 
      label: '聯絡表單', 
      icon: MessageSquare, 
      path: '/admin/contact' 
    },
    { 
      label: 'Newsletter', 
      icon: Mail, 
      path: '/admin/newsletter' 
    },
    {
      label: '用戶管理',
      icon: Users,
      children: [
        { label: '用戶列表', icon: List, path: '/admin/users' },
        { label: '邀請管理', icon: Mail, path: '/admin/invitations' },
      ]
    },
    { 
      label: '系統設定', 
      icon: Settings, 
      path: '/admin/settings' 
    },
  ];

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.label);
    const active = item.path ? isActive(item.path) : false;

    // 檢查是否有任何子項目是活躍的（用於父項目狀態）
    const hasActiveChild = hasChildren && item.children!.some(child => 
      child.path && isActive(child.path)
    );

    if (hasChildren) {
      return (
        <div key={item.label} className="space-y-1">
          {/* 父項目 - 不可點擊，只能展開/收合 */}
          <button
            onClick={() => toggleMenu(item.label)}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all ${
              hasActiveChild
                ? 'bg-orange-600/10 text-orange-300'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
              <Icon size={20} />
              {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
            </div>
            {!sidebarCollapsed && (
              <ChevronDown 
                size={16} 
                className={`transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
              />
            )}
          </button>
          
          {/* 子項目列表 */}
          {isExpanded && !sidebarCollapsed && (
            <div className="space-y-1">
              {item.children!.map(child => {
                const ChildIcon = child.icon;
                const childActive = child.path ? isActive(child.path) : false;
                
                return (
                  <Link
                    key={child.path}
                    to={child.path!}
                    className={`flex items-center gap-3 pl-12 pr-4 py-2.5 rounded-lg transition-all ${
                      childActive
                        ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <ChildIcon size={18} />
                    <span className="text-sm font-medium">{child.label}</span>
                    {childActive && (
                      <div className="ml-auto w-1 h-4 bg-white rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // 一般項目（無子項目）
    return (
      <Link
        key={item.label}
        to={item.path!}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          active
            ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
        title={sidebarCollapsed ? item.label : undefined}
      >
        <Icon size={20} />
        {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
        {active && !sidebarCollapsed && (
          <div className="ml-auto w-1 h-6 bg-white rounded-full"></div>
        )}
      </Link>
    );
  };
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950 overflow-hidden">
      {/* 左側側邊欄 - 固定高度 */}
      <aside className={`bg-gray-900 text-white flex flex-col transition-all duration-300 flex-shrink-0 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        {/* Logo 區域 */}
        <div className="h-16 px-4 flex items-center justify-center border-b border-gray-800 flex-shrink-0">
          {!sidebarCollapsed ? (
            <img
              src={VortixLogoWhite}
              alt="VortixPR"
              className="h-8 w-auto object-contain cursor-pointer"
              onClick={() => navigate('/admin')}
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl cursor-pointer"
              onClick={() => navigate('/admin')}
            >
              V
            </div>
          )}
        </div>
        
        {/* 導航選單 - 可滾動 */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navStructure.map(item => renderNavItem(item))}
        </nav>
        
        {/* 底部資訊 */}
        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          {!sidebarCollapsed && (
            <div className="text-center">
              <p className="text-xs text-gray-500">© 2025 VortixPR</p>
              <p className="text-xs text-gray-600 mt-1">v1.0.0</p>
            </div>
          )}
        </div>
      </aside>
      
      {/* 右側主要區域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 頂部導航欄 - 專業設計 */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-6">
            {/* 頁面標題 */}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {location.pathname === '/admin' && 'Dashboard'}
              {location.pathname === '/admin/blog' && 'Blog 文章管理'}
              {location.pathname.includes('/admin/blog/') && 'Blog 文章編輯'}
              {location.pathname === '/admin/pricing' && 'Pricing 方案管理'}
              {location.pathname.includes('/admin/pricing/') && 'Pricing 方案編輯'}
              {location.pathname === '/admin/pr-packages' && 'PR Packages 管理'}
              {location.pathname.includes('/admin/pr-packages/edit') && 'PR Package 編輯'}
              {location.pathname.includes('/admin/pr-packages/categories') && 'PR Package 分類管理'}
              {location.pathname === '/admin/contact' && '聯絡表單管理'}
              {location.pathname === '/admin/newsletter' && 'Newsletter 訂閱者'}
              {location.pathname === '/admin/media' && '媒體圖庫'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* 全局搜索 */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="搜索..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>
            
            {/* 主題切換 */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={theme === 'light' ? '切換到深色模式' : '切換到淺色模式'}
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-gray-600" />
              ) : (
                <Sun size={20} className="text-yellow-400" />
              )}
            </button>
            
            {/* 通知圖標 */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
                title="通知"
              >
                <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            </div>
            
            {/* 設置圖標 */}
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="設置"
            >
              <Settings size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            
            {/* 分隔線 */}
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
            
            {/* 用戶下拉選單 */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role === 'super_admin' ? '超級管理員' : 
                     user?.role === 'admin' ? '管理員' :
                     user?.role === 'publisher' ? '出版商' : '用戶'}
                  </p>
                </div>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full shadow-md" />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                )}
                <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
              
              {/* 用戶下拉選單 */}
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded">
                        {user?.role === 'super_admin' ? '超級管理員' : 
                         user?.role === 'admin' ? '管理員' :
                         user?.role === 'publisher' ? '出版商' : '用戶'}
                      </span>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        <Home size={18} />
                        <span className="text-sm font-medium">返回前台網站</span>
                      </button>
                      <button
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        <UserCircle size={18} />
                        <span className="text-sm font-medium">個人資料</span>
                      </button>
                      <button
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        <Settings size={18} />
                        <span className="text-sm font-medium">帳號設置</span>
                      </button>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        <Home size={18} />
                        <span className="text-sm font-medium">返回前台網站</span>
                      </button>
                      <button
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">登出</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        
        {/* 主要內容區 - 可滾動 */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* 自訂滾動條樣式 */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}

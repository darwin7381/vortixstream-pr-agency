import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  Package,
  MessageSquare,
  Mail,
  ChevronDown,
  Folder,
  List,
  Menu,
  X,
  Home
} from 'lucide-react';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['PR Packages']);
  
  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuKey) 
        ? prev.filter(k => k !== menuKey)
        : [...prev, menuKey]
    );
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // 收合時自動收起所有子選單
    if (!sidebarCollapsed) {
      setExpandedMenus([]);
    } else {
      setExpandedMenus(['PR Packages']);
    }
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
      label: '聯絡表單', 
      icon: MessageSquare, 
      path: '/admin/contact' 
    },
    { 
      label: 'Newsletter', 
      icon: Mail, 
      path: '/admin/newsletter' 
    },
  ];

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.label);
    const active = item.path ? isActive(item.path) : false;

    // 檢查是否有任何子項目是活躍的
    const hasActiveChild = hasChildren && item.children!.some(child => 
      child.path && isActive(child.path)
    );

    if (hasChildren) {
      return (
        <div key={item.label} className="space-y-1">
          <button
            onClick={() => toggleMenu(item.label)}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all group ${
              hasActiveChild
                ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
              <Icon size={20} className={hasActiveChild ? 'text-orange-400' : ''} />
              {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
            </div>
            {!sidebarCollapsed && (
              <div className={`transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
                <ChevronDown size={16} />
              </div>
            )}
          </button>
          
          {isExpanded && !sidebarCollapsed && (
            <div className="space-y-1 pl-4">
              {item.children!.map(child => renderNavItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        to={item.path!}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
          active
            ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg'
            : level === 0
            ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`}
        title={sidebarCollapsed ? item.label : undefined}
      >
        <Icon size={20} className={active ? 'drop-shadow-md' : ''} />
        {!sidebarCollapsed && (
          <span className="font-medium">{item.label}</span>
        )}
        {active && !sidebarCollapsed && (
          <div className="ml-auto w-1 h-6 bg-white rounded-full"></div>
        )}
      </Link>
    );
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* 側邊欄 */}
      <aside className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        {/* Logo 和收合按鈕 */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-2xl font-bold text-white">
                  <span className="text-orange-500">Vortix</span> Admin
                </h1>
                <p className="text-gray-400 text-sm mt-1">管理後台</p>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className={`p-2 hover:bg-gray-800 rounded-lg transition-all ${
                sidebarCollapsed ? 'mx-auto' : ''
              }`}
              title={sidebarCollapsed ? '展開側邊欄' : '收合側邊欄'}
            >
              {sidebarCollapsed ? <Menu size={24} /> : <X size={24} />}
            </button>
          </div>
        </div>
        
        {/* 導航選單 */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navStructure.map(item => renderNavItem(item))}
        </nav>
        
        {/* 底部區域 */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all w-full group ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title={sidebarCollapsed ? '返回前台' : undefined}
          >
            <Home size={20} />
            {!sidebarCollapsed && <span className="font-medium">返回前台</span>}
          </button>
        </div>
      </aside>
      
      {/* 主要內容區 */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

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

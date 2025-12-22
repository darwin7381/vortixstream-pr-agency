import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  Package, 
  LogOut,
  Settings,
  Users,
  Mail
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/blog', label: 'Blog 文章', icon: FileText },
    { path: '/admin/pricing', label: 'Pricing 方案', icon: DollarSign },
    { path: '/admin/pr-packages', label: 'PR Packages', icon: Package },
  ];
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* 側邊欄 */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-orange-500">Vortix</span> Admin
          </h1>
          <p className="text-gray-400 text-sm mt-1">管理後台</p>
        </div>
        
        {/* 導航選單 */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* 底部區域 */}
        <div className="p-4 border-t border-gray-800 space-y-1">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all w-full"
          >
            <LogOut size={20} />
            <span className="font-medium">返回前台</span>
          </button>
        </div>
      </aside>
      
      {/* 主要內容區 */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}


import { Outlet } from 'react-router-dom';
import AINavigation from '../components/ai/AINavigation';
import AIFooter from '../components/ai/AIFooter';
import CompareBar from '../components/compare/CompareBar';
import { User } from '../contexts/AuthContext';

interface AILayoutProps {
  user?: User | null;
  onLogout?: () => void;
  onQuickLogin?: () => void;
}

export default function AILayout({ user, onLogout, onQuickLogin }: AILayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <AINavigation user={user} onLogout={onLogout} onQuickLogin={onQuickLogin} />
      <div className="pt-16">
        <Outlet />
      </div>
      <AIFooter />
      <CompareBar />
    </div>
  );
}

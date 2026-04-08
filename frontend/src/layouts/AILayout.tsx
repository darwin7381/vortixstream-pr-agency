import { Outlet } from 'react-router-dom';
import AINavigation from '../components/ai/AINavigation';
import AIFooter from '../components/ai/AIFooter';
import { User } from '../contexts/AuthContext';

interface AILayoutProps {
  user?: User | null;
  onLogout?: () => void;
}

export default function AILayout({ user, onLogout }: AILayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <AINavigation user={user} onLogout={onLogout} />
      <div className="pt-16">
        <Outlet />
      </div>
      <AIFooter />
    </div>
  );
}

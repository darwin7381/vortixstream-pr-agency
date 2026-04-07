import { Outlet } from 'react-router-dom';
import CryptoNavigation from '../components/crypto/CryptoNavigation';
import CryptoFooter from '../components/crypto/CryptoFooter';
import CompareBar from '../components/compare/CompareBar';
import { User } from '../contexts/AuthContext';

interface CryptoLayoutProps {
  user?: User | null;
  onLogout?: () => void;
  onQuickLogin?: () => void;
}

export default function CryptoLayout({ user, onLogout, onQuickLogin }: CryptoLayoutProps) {
  return (
    <>
      <CryptoNavigation user={user} onLogout={onLogout} onQuickLogin={onQuickLogin} />
      <div className="pt-14 sm:pt-16 md:pt-[72px] lg:pt-[72px]">
        <Outlet />
      </div>
      <CryptoFooter />
      <CompareBar />
    </>
  );
}

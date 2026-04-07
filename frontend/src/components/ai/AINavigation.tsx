import { Link, useLocation } from 'react-router-dom';
import { type User } from '../../contexts/AuthContext';

interface AINavigationProps {
  user?: User | null;
  onLogout?: () => void;
}

export default function AINavigation({ user, onLogout }: AINavigationProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `text-sm font-medium transition ${
      isActive(path) ? 'text-black' : 'text-gray-600 hover:text-black'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-tight">
            VortixPR
          </Link>

          {/* Main nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/services" className={linkClass('/services')}>Services</Link>
            <Link to="/pricing" className={linkClass('/pricing')}>Pricing</Link>
            <Link to="/about" className={linkClass('/about')}>About</Link>
            <Link to="/clients" className={linkClass('/clients')}>Clients</Link>
            <Link to="/publisher" className={linkClass('/publisher')}>Publisher</Link>
          </div>

          {/* Right side: cross-brand link + auth */}
          <div className="flex items-center space-x-4">
            <Link
              to="/crypto"
              className="text-xs text-gray-500 hover:text-black transition border border-gray-300 rounded-full px-3 py-1"
            >
              Crypto Services →
            </Link>
            {user ? (
              <button onClick={onLogout} className="text-sm text-gray-600 hover:text-black">
                Logout
              </button>
            ) : (
              <Link to="/login" className="text-sm font-medium text-black hover:underline">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

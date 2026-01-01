import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
        theme === 'dark'
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } ${className}`}
      title={theme === 'light' ? '切換到深色模式' : '切換到淺色模式'}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <>
          <Moon size={20} />
          {showLabel && <span className="text-sm font-medium">深色</span>}
        </>
      ) : (
        <>
          <Sun size={20} />
          {showLabel && <span className="text-sm font-medium">淺色</span>}
        </>
      )}
    </button>
  );
}



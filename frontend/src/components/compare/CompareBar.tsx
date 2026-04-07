import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, GitCompareArrows } from 'lucide-react';
import { useCompare } from '../../contexts/CompareContext';

export default function CompareBar() {
  const { items, removeItem, clearAll, count } = useCompare();
  const navigate = useNavigate();

  if (count === 0) return null;

  const bar = (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        background: 'linear-gradient(180deg, #2a2a3e 0%, #1e1e30 100%)',
        borderTop: '2px solid rgba(255,116,0,0.5)',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.7), 0 -2px 0 rgba(255,116,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 20px' }}>
        <div className="flex items-center gap-3 md:gap-4">
          {/* Label */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <GitCompareArrows className="w-5 h-5 text-[#FF7400]" />
            <span className="text-white font-semibold text-sm hidden sm:inline">
              Compare
            </span>
            <span className="
              inline-flex items-center justify-center
              w-6 h-6 rounded-full
              bg-[#FF7400] text-white text-xs font-bold
            ">
              {count}
            </span>
          </div>

          {/* Items Preview */}
          <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {items.map((item) => (
              <div
                key={item.slug}
                className="
                  flex items-center gap-2 px-3 py-1.5
                  rounded-lg flex-shrink-0
                "
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <div className="flex flex-col">
                  <span className="text-white text-xs font-medium truncate max-w-[120px]">
                    {item.name}
                  </span>
                  <span className="text-white/40 text-[10px]">{item.price}</span>
                </div>
                <button
                  onClick={() => removeItem(item.slug)}
                  className="p-0.5 rounded text-white/30 hover:text-white/70 hover:bg-white/10 transition-all duration-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={clearAll}
              className="text-white/40 hover:text-white/70 text-xs transition-colors duration-200 hidden sm:block"
            >
              Clear all
            </button>
            <button
              onClick={() => navigate('/compare')}
              disabled={count < 2}
              className="
                flex items-center gap-1.5
                px-4 py-2 rounded-lg
                text-white text-sm font-medium
                transition-all duration-300
                disabled:opacity-40 disabled:cursor-not-allowed
              "
              style={{
                background: count >= 2 ? 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,116,0,0.5)',
              }}
            >
              <span>Compare Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const portalRoot = document.getElementById('compare-bar-root');
  if (!portalRoot) return bar;
  return createPortal(bar, portalRoot);
}

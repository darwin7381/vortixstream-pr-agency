import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Trash2, GitCompareArrows } from 'lucide-react';
import { useCompare, type CompareItem } from '../../contexts/CompareContext';
import { handleGetStartedClick } from '../../utils/navigationHelpers';
import { Button } from '../ui/button';

function getAllFeatures(items: CompareItem[]): string[] {
  const featureSet = new Set<string>();
  items.forEach((item) => item.features.forEach((f) => featureSet.add(f)));
  return Array.from(featureSet);
}

function CompareEmptyState() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <GitCompareArrows className="w-10 h-10 text-white/20" />
      </div>
      <div>
        <h2
          className="text-white text-2xl md:text-3xl font-bold mb-3"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          No packages to compare
        </h2>
        <p className="text-white/50 text-base max-w-md">
          Add packages to your compare list from the pricing page to see them side by side.
        </p>
      </div>
      <Link
        to="/pricing"
        className="
          flex items-center gap-2 px-6 py-3 rounded-lg
          text-white text-sm font-medium
          border border-[#FF7400]
          hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,116,0,0.3)]
          transition-all duration-300
        "
        style={{
          background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)',
        }}
      >
        <ArrowLeft className="w-4 h-4" />
        Browse Packages
      </Link>
    </div>
  );
}

export default function ComparePage() {
  const { items, removeItem, clearAll } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();

  const allFeatures = getAllFeatures(items);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 30% 40%, rgba(255,116,0,0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(29,53,87,0.12) 0%, transparent 50%),
              linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)
            `,
          }}
        />

        <div className="relative z-10 container-large px-[17px] md:px-[17px]">
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/pricing" className="text-white/40 hover:text-white/70 transition-colors">
              Packages
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-white/70">Compare</span>
          </nav>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1
                className="text-white text-3xl md:text-5xl font-bold"
                style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
              >
                Compare Packages
              </h1>
              <p className="text-white/50 text-base md:text-lg mt-3">
                {items.length > 0
                  ? `Comparing ${items.length} package${items.length !== 1 ? 's' : ''} side by side`
                  : 'Select packages to compare'}
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 text-white/40 hover:text-red-400 text-sm transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      {items.length === 0 ? (
        <CompareEmptyState />
      ) : (
        <section className="pb-20">
          <div className="container-large px-[17px] md:px-[17px]">
            {/* Comparison Table */}
            <div className="overflow-x-auto -mx-[17px] px-[17px]">
              <div
                className="grid gap-4 min-w-[640px]"
                style={{
                  gridTemplateColumns: `200px repeat(${items.length}, 1fr)`,
                }}
              >
                {/* ===== HEADER ROW ===== */}
                <div /> {/* empty corner cell */}
                {items.map((item) => (
                  <div
                    key={item.slug}
                    className="p-5 rounded-t-2xl bg-gradient-to-b from-white/8 to-white/3 border border-white/10 border-b-0 relative"
                  >
                    <button
                      onClick={() => removeItem(item.slug)}
                      className="absolute top-3 right-3 p-1 rounded text-white/30 hover:text-white/60 hover:bg-white/10 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {item.badge && (
                      <div className="mb-2">
                        <span className="text-[#FF7400]/80 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF7400]/10 border border-[#FF7400]/20">
                          {item.badge}
                        </span>
                      </div>
                    )}
                    <Link
                      to={`/packages/${item.slug}`}
                      className="text-white font-semibold text-base hover:text-[#FF7400] transition-colors"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {item.name}
                    </Link>
                    <p className="text-white/40 text-xs mt-1 line-clamp-2">{item.description}</p>
                  </div>
                ))}

                {/* ===== PRICE ROW ===== */}
                <div className="flex items-center px-4 text-white/50 text-sm font-medium uppercase tracking-wider">
                  Price
                </div>
                {items.map((item) => (
                  <div
                    key={item.slug}
                    className="px-5 py-4 bg-white/[0.02] border-x border-white/10"
                  >
                    <span
                      className="text-[#FF7400] text-2xl font-bold"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {item.price}
                    </span>
                  </div>
                ))}

                {/* ===== PUBLICATIONS ROW ===== */}
                <div className="flex items-center px-4 text-white/50 text-sm font-medium uppercase tracking-wider">
                  Publications
                </div>
                {items.map((item) => (
                  <div
                    key={item.slug}
                    className="px-5 py-4 bg-white/[0.02] border-x border-white/10"
                  >
                    <span className="text-white font-semibold text-lg">
                      {item.guaranteed_publications
                        ? `${item.guaranteed_publications}+`
                        : '—'}
                    </span>
                    <span className="text-white/40 text-xs ml-1">guaranteed</span>
                  </div>
                ))}

                {/* ===== FEATURES COMPARISON ===== */}
                <div className="flex items-center px-4 pt-6 pb-2 col-span-full">
                  <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                    Features
                  </span>
                  <div className="flex-1 h-px bg-white/10 ml-4" />
                </div>

                {allFeatures.map((feature, featureIndex) => (
                  <div key={`feature-row-${featureIndex}`} className="contents">
                    <div className="flex items-center px-4 py-2.5">
                      <span className="text-white/60 text-sm leading-tight">{feature}</span>
                    </div>
                    {items.map((item) => {
                      const has = item.features.includes(feature);
                      return (
                        <div
                          key={`${item.slug}-${featureIndex}`}
                          className={`
                            flex items-center justify-center px-5 py-2.5
                            border-x border-white/10
                            ${featureIndex % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}
                          `}
                        >
                          {has ? (
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                              <path
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                fill="#22C55E"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <div className="w-4 h-px bg-white/15" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* ===== CTA ROW ===== */}
                <div /> {/* empty label cell */}
                {items.map((item) => (
                  <div
                    key={item.slug}
                    className="px-5 py-6 rounded-b-2xl bg-gradient-to-b from-transparent to-white/[0.03] border-x border-b border-white/10 flex flex-col gap-3"
                  >
                    <Button
                      onClick={() => handleGetStartedClick(navigate, location.pathname)}
                      className="
                        w-full border border-[#FF7400] text-white overflow-hidden
                        py-3 px-4 rounded-lg transition-all duration-300
                        hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,116,0,0.3)]
                        relative
                        before:absolute before:inset-0 before:bg-black/20 before:opacity-0 before:transition-opacity before:duration-300
                        hover:before:opacity-100
                      "
                      style={{
                        background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)',
                      }}
                    >
                      <span className="relative z-10 font-semibold text-sm">Choose Plan</span>
                    </Button>
                    <Link
                      to={`/packages/${item.slug}`}
                      className="text-center text-white/40 hover:text-white/70 text-xs transition-colors"
                    >
                      View full details →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

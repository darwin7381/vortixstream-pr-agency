import { Link } from 'react-router-dom';
import { ExternalLink, GitCompareArrows, Check } from 'lucide-react';
import { type PRPackage } from '../../api/client';
import { useCompare } from '../../contexts/CompareContext';

interface PackageCardV2Props {
  package: PRPackage;
  onViewDetails: () => void;
}

export default function PackageCardV2({ 
  package: pkg,
  onViewDetails
}: PackageCardV2Props) {
  const { isInCompare, toggleItem, isFull } = useCompare();
  const slug = (pkg as Record<string, unknown>).slug as string || (pkg.id as unknown as string);
  const inCompare = isInCompare(slug);

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleItem({
      id: String(pkg.id),
      slug,
      name: pkg.name,
      price: pkg.price,
      description: pkg.description,
      badge: pkg.badge,
      guaranteed_publications: (pkg as Record<string, unknown>).guaranteedPublications as number | null ?? pkg.guaranteed_publications,
      features: pkg.features,
      category_id: (pkg as Record<string, unknown>).categoryId as string ?? pkg.category_id ?? '',
    });
  };
  return (
    <div
      className="
        group relative 
        bg-gradient-to-br from-white/5 via-white/8 to-white/3 
        backdrop-blur-sm border border-white/10 
        rounded-2xl p-6
        transition-all duration-500 ease-out
        hover:border-white/25 
        hover:bg-gradient-to-br hover:from-white/8 hover:via-white/12 hover:to-white/5
        hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] 
        hover:scale-[1.02]
      "
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Header */}
      <div className="relative mb-5">
        <div className="flex items-start justify-between mb-2">
          <h3 
            className="text-white text-xl font-semibold"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {pkg.name}
          </h3>
          <div className="text-white/70 text-xl md:text-2xl font-bold whitespace-nowrap ml-3">
            {pkg.price}
          </div>
        </div>
        <p className="text-white/50 text-sm mb-3">
          {pkg.description}
        </p>
        
        {/* Media Logos - 緊湊顯示 */}
        {pkg.mediaLogos && pkg.mediaLogos.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {pkg.mediaLogos.slice(0, 4).map((logo, index) => (
              <img 
                key={index}
                src={logo.url}
                alt={logo.name}
                className="h-6 w-auto object-contain opacity-50 hover:opacity-70 transition-opacity duration-300"
                style={{
                  filter: 'brightness(1.2)'
                }}
              />
            ))}
            {pkg.mediaLogos.length > 4 && (
              <span className="text-white/40 text-xs ml-1">
                +{pkg.mediaLogos.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Features List - Show only first 2 features */}
      <div className="relative space-y-2.5 mb-5">
        {pkg.features.slice(0, 2).map((feature, index) => (
          <div key={index} className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 bg-white/40 rounded-full flex-shrink-0" />
            <p className="text-white/70 text-sm leading-relaxed">
              {feature}
            </p>
          </div>
        ))}
        {pkg.features.length > 2 && (
          <p className="text-white/40 text-sm pl-4">
            +{pkg.features.length - 2} more features
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="relative space-y-2">
        <div className="flex gap-2">
          <button
            onClick={onViewDetails}
            className="
              flex-1 py-2.5 px-4
              bg-white/5 hover:bg-white/10 rounded-lg
              text-white/70 hover:text-white text-sm
              transition-all duration-300
              border border-white/10 hover:border-white/20
            "
          >
            Quick view
          </button>
          <Link
            to={`/packages/${slug}`}
            className="
              flex items-center gap-1.5 py-2.5 px-4
              bg-[#FF7400]/10 hover:bg-[#FF7400]/20 rounded-lg
              text-[#FF7400]/80 hover:text-[#FF7400] text-sm font-medium
              transition-all duration-300
              border border-[#FF7400]/20 hover:border-[#FF7400]/40
            "
          >
            Details
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
        <button
          onClick={handleCompareToggle}
          disabled={!inCompare && isFull}
          className={`
            w-full py-2 px-4 rounded-lg text-xs font-medium
            flex items-center justify-center gap-1.5
            transition-all duration-300
            ${inCompare
              ? 'bg-[#FF7400]/15 border border-[#FF7400]/30 text-[#FF7400]'
              : 'bg-white/[0.02] border border-white/8 text-white/40 hover:text-white/60 hover:border-white/15'
            }
            disabled:opacity-30 disabled:cursor-not-allowed
          `}
        >
          {inCompare ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Added to Compare
            </>
          ) : (
            <>
              <GitCompareArrows className="w-3.5 h-3.5" />
              + Compare
            </>
          )}
        </button>
      </div>
    </div>
  );
}




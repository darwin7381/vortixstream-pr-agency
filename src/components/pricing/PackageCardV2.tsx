import { Package } from '../../constants/pricingDataV2';

interface PackageCardV2Props {
  package: Package;
  onViewDetails: () => void;
}

export default function PackageCardV2({ 
  package: pkg,
  onViewDetails
}: PackageCardV2Props) {
  return (
    <div
      className="
        relative bg-[#0a0a0a] border-2 border-white/10 rounded-2xl p-6
        transition-all duration-300 ease-out
        hover:border-[#FF7400]/40 hover:shadow-[0_0_30px_rgba(255,116,0,0.1)]
      "
    >
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-start justify-between mb-2">
          <h3 
            className="text-white text-xl font-semibold"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {pkg.name}
          </h3>
          <div className="text-white/60 text-base font-normal whitespace-nowrap ml-3">
            {pkg.price}
          </div>
        </div>
        <p className="text-white/50 text-sm">
          {pkg.description}
        </p>
      </div>

      {/* Features List - Show only first 3-4 features */}
      <div className="space-y-2.5 mb-5">
        {pkg.features.slice(0, 3).map((feature, index) => (
          <div key={index} className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 bg-white/40 rounded-full flex-shrink-0" />
            <p className="text-white/70 text-sm leading-relaxed">
              {feature}
            </p>
          </div>
        ))}
        {pkg.features.length > 3 && (
          <p className="text-white/40 text-sm pl-4">
            +{pkg.features.length - 3} more features
          </p>
        )}
      </div>

      {/* View Details Button */}
      <button
        onClick={onViewDetails}
        className="
          w-full py-2.5 px-4
          bg-white/5 hover:bg-white/10 rounded-lg
          text-white/70 hover:text-white text-sm
          transition-all duration-300
          border border-white/10 hover:border-white/20
        "
      >
        View details
      </button>
    </div>
  );
}


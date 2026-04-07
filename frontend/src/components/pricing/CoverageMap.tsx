import { useState, memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface CoverageData {
  countries: string[];
  media_by_country: Record<string, string[]>;
  total_outlets?: number;
  total_countries?: number;
}

interface CoverageMapProps {
  coverage: CoverageData;
  className?: string;
}

const COUNTRY_NAME_MAP: Record<string, string> = {
  '840': 'US', '826': 'GB', '392': 'JP', '410': 'KR',
  '158': 'TW', '702': 'SG', '276': 'DE', '250': 'FR',
  '036': 'AU', '124': 'CA', '356': 'IN', '764': 'TH',
  '704': 'VN', '360': 'ID', '608': 'PH', '458': 'MY',
  '344': 'HK', '156': 'CN', '380': 'IT', '724': 'ES',
  '528': 'NL', '756': 'CH', '076': 'BR', '484': 'MX',
  '710': 'ZA', '784': 'AE', '682': 'SA', '376': 'IL',
  '643': 'RU', '616': 'PL', '752': 'SE', '578': 'NO',
  '208': 'DK', '246': 'FI', '040': 'AT', '056': 'BE',
  '620': 'PT', '372': 'IE', '554': 'NZ', '032': 'AR',
  '170': 'CO', '152': 'CL', '604': 'PE',
};

const ISO_TO_NAME: Record<string, string> = {
  US: 'United States', GB: 'United Kingdom', JP: 'Japan', KR: 'South Korea',
  TW: 'Taiwan', SG: 'Singapore', DE: 'Germany', FR: 'France',
  AU: 'Australia', CA: 'Canada', IN: 'India', TH: 'Thailand',
  VN: 'Vietnam', ID: 'Indonesia', PH: 'Philippines', MY: 'Malaysia',
  HK: 'Hong Kong', CN: 'China', IT: 'Italy', ES: 'Spain',
  NL: 'Netherlands', CH: 'Switzerland', BR: 'Brazil', MX: 'Mexico',
  ZA: 'South Africa', AE: 'UAE', SA: 'Saudi Arabia', IL: 'Israel',
  RU: 'Russia', PL: 'Poland', SE: 'Sweden', NO: 'Norway',
  DK: 'Denmark', FI: 'Finland', AT: 'Austria', BE: 'Belgium',
  PT: 'Portugal', IE: 'Ireland', NZ: 'New Zealand', AR: 'Argentina',
  CO: 'Colombia', CL: 'Chile', PE: 'Peru',
};

function CoverageMap({ coverage, className = '' }: CoverageMapProps) {
  const [tooltipContent, setTooltipContent] = useState<{
    name: string;
    iso: string;
    media: string[];
    x: number;
    y: number;
  } | null>(null);

  const coveredSet = new Set(coverage.countries);

  const handleMouseEnter = (
    geo: { properties: { name: string }; id: string },
    event: React.MouseEvent
  ) => {
    const isoCode = COUNTRY_NAME_MAP[geo.id] || '';
    if (!coveredSet.has(isoCode)) return;

    const media = coverage.media_by_country[isoCode] || [];
    const rect = (event.currentTarget as Element).closest('svg')?.getBoundingClientRect();
    
    setTooltipContent({
      name: ISO_TO_NAME[isoCode] || geo.properties.name,
      iso: isoCode,
      media,
      x: event.clientX - (rect?.left || 0),
      y: event.clientY - (rect?.top || 0) - 10,
    });
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        <ComposableMap
          projectionConfig={{
            rotate: [-10, 0, 0],
            scale: 147,
          }}
          className="w-full h-auto"
          style={{ background: 'transparent' }}
        >
          <ZoomableGroup center={[0, 20]} zoom={1} minZoom={1} maxZoom={1}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isoCode = COUNTRY_NAME_MAP[geo.id] || '';
                  const isCovered = coveredSet.has(isoCode);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(e) => handleMouseEnter(geo, e as unknown as React.MouseEvent)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: isCovered ? '#FF7400' : 'rgba(255,255,255,0.06)',
                          stroke: 'rgba(255,255,255,0.08)',
                          strokeWidth: 0.5,
                          outline: 'none',
                          transition: 'fill 0.3s ease',
                          filter: isCovered ? 'drop-shadow(0 0 6px rgba(255,116,0,0.4))' : 'none',
                        },
                        hover: {
                          fill: isCovered ? '#FF8C2A' : 'rgba(255,255,255,0.1)',
                          stroke: isCovered ? 'rgba(255,116,0,0.6)' : 'rgba(255,255,255,0.15)',
                          strokeWidth: isCovered ? 1 : 0.5,
                          outline: 'none',
                          cursor: isCovered ? 'pointer' : 'default',
                        },
                        pressed: {
                          fill: isCovered ? '#FF7400' : 'rgba(255,255,255,0.06)',
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltipContent && (
          <div
            className="absolute z-50 pointer-events-none"
            style={{
              left: tooltipContent.x,
              top: tooltipContent.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#FF7400]" />
                <span
                  className="text-white font-semibold text-sm"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {tooltipContent.name}
                </span>
              </div>
              {tooltipContent.media.length > 0 && (
                <div className="space-y-1">
                  {tooltipContent.media.map((m, i) => (
                    <p key={i} className="text-white/60 text-xs pl-4">
                      {m}
                    </p>
                  ))}
                </div>
              )}
            </div>
            {/* Arrow */}
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-black/90 border-r border-b border-white/20 transform rotate-45 -mt-1" />
            </div>
          </div>
        )}
      </div>

      {/* Coverage Stats */}
      <div className="flex items-center justify-center gap-8 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF7400] shadow-[0_0_8px_rgba(255,116,0,0.5)]" />
          <span className="text-white/60 text-sm">
            <span className="text-white font-semibold">{coverage.total_countries || coverage.countries.length}</span> Countries
          </span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">
            <span className="text-white font-semibold">{coverage.total_outlets || '—'}</span> Media Outlets
          </span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white/10 border border-white/20" />
          <span className="text-white/40 text-sm">Not covered</span>
        </div>
      </div>
    </div>
  );
}

export default memo(CoverageMap);

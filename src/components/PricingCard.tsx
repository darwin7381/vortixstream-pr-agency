import { useState } from 'react';
import { Button } from './ui/button';
import { Check } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  className?: string;
}

export default function PricingCard({ 
  name, 
  price, 
  description, 
  features, 
  isPopular = false,
  className = "" 
}: PricingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`
        relative bg-black border-2 rounded-2xl p-6 md:p-8 h-full flex flex-col
        transition-all duration-300 ease-out
        hover:transform hover:scale-[1.02]
        ${isPopular 
          ? 'border-[#FF7400] hover:shadow-[0_0_25px_rgba(255,116,0,0.3)]' 
          : 'border-white hover:border-white/40 hover:bg-white/[0.02]'
        }
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Most Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-[#FF7400] text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-lg">
            Most Popular
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col items-end mb-8">
        {/* Price Info */}
        <div className="text-left w-full">
          <h3 className="text-white text-lg md:text-xl tracking-tight mb-2 transition-colors duration-300">
            {name}
          </h3>
          <div 
            className={`
              text-white text-4xl md:text-6xl lg:text-7xl mb-2 transition-all duration-300
              ${isHovered ? 'text-shadow-glow' : ''}
            `}
            style={{ 
              fontFamily: 'Roboto, sans-serif', 
              fontWeight: 'bold',
              textShadow: isHovered ? '0 0 8px rgba(255,255,255,0.3)' : 'none'
            }}
          >
            {price}
          </div>
          <p className="text-white text-sm md:text-base opacity-80 transition-opacity duration-300">
            {description}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className={`w-full h-0.5 mb-8 transition-all duration-300 ${
        isHovered ? 'bg-white' : isPopular ? 'bg-[#FF7400]' : 'bg-white'
      }`}></div>

      {/* Features */}
      <div className="flex-1">
        <p className="text-white text-sm md:text-base mb-4">Includes:</p>
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <Check className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#22C55E' }} />
              <p className="text-white text-sm md:text-base leading-relaxed">{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-8">
        <Button 
          className="
            relative w-full border border-[#FF7400] text-white overflow-hidden
            py-3 px-6 rounded-md transition-all duration-300
            hover:scale-105 hover:shadow-[0_0_25px_rgba(255,116,0,0.4)]
            before:absolute before:inset-0 before:bg-black/20 before:opacity-0 before:transition-opacity before:duration-300
            hover:before:opacity-100
          "
          style={{ 
            background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' 
          }}
        >
          <span className="relative z-10">Get started</span>
        </Button>
      </div>
    </div>
  );
}
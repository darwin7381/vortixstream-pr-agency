/**
 * PR Packages Grid - 純粹的 Packages 網格組件（可重用）
 * 
 * 用途：
 * - 在不同頁面顯示 PR Packages 網格
 * - 不包含背景、標題等裝飾元素
 * - 只負責核心的 packages 展示邏輯
 */
import { useState, useEffect } from 'react';
import PackageCardV2 from './PackageCardV2';
import { prPackagesAPI, type PRPackageCategory, type PRPackage } from '../../api/client';

interface PRPackagesGridProps {
  /** 是否顯示動畫效果 */
  showAnimation?: boolean;
  /** 自訂類名 */
  className?: string;
  /** 是否顯示 loading 狀態 */
  showLoading?: boolean;
  /** Package 選擇回調 */
  onPackageSelect?: (pkg: PRPackage) => void;
}

export default function PRPackagesGrid({ 
  showAnimation = true,
  className = '',
  showLoading = true,
  onPackageSelect
}: PRPackagesGridProps) {
  const [isVisible, setIsVisible] = useState(!showAnimation);
  const [pricingPackagesV2, setPricingPackagesV2] = useState<PRPackageCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch PR Packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const data = await prPackagesAPI.getPackagesByCategory();
        setPricingPackagesV2(data);
      } catch (error) {
        console.error('Failed to fetch PR packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Animation trigger
  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  if (loading && showLoading) {
    return (
      <div className={`flex items-center justify-center py-20 ${className}`}>
        <div className="text-white/60">Loading packages...</div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${className}`}>
      {pricingPackagesV2.map((category, categoryIndex) => (
        <div 
          key={category.id}
          className={`
            transition-all duration-1000
            ${isVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-6'
            }
          `}
          style={{ transitionDelay: showAnimation ? `${categoryIndex * 150}ms` : '0ms' }}
        >
          {/* Category Header */}
          <div className="mb-6">
            <h3 
              className="text-white text-2xl md:text-3xl font-bold mb-3"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {category.title}
            </h3>
            {category.badges && (
              <div className="flex flex-wrap items-center gap-2">
                {category.badges.map((badge, badgeIndex) => (
                  <span
                    key={badgeIndex}
                    className="
                      px-3 py-1 rounded-full text-xs
                      bg-white/5 border border-white/10 text-white/60
                      transition-all duration-300
                    "
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Package Cards - Stacked vertically */}
          <div className="space-y-6">
            {category.packages.map((pkg) => (
              <PackageCardV2
                key={pkg.id}
                package={pkg}
                onViewDetails={() => onPackageSelect?.(pkg)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


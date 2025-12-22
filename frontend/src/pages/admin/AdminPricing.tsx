import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { pricingAPI } from '../../api/client';
import { Star, Check } from 'lucide-react';

export default function AdminPricing() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await pricingAPI.getPackages();
        setPackages(data);
      } catch (error) {
        console.error('Failed to fetch pricing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">載入中...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pricing 方案管理</h1>
          <p className="text-gray-600 mt-2">共 {packages.length} 個方案</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6 hover:border-orange-500 transition-all relative"
            >
              {pkg.is_popular && (
                <div className="absolute -top-3 right-4">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    <Star size={14} className="fill-white" />
                    熱門
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-3">{pkg.name}</h3>
              
              <div className="mb-4">
                <span className="text-4xl font-bold text-orange-600">${pkg.price}</span>
                <span className="text-gray-600 ml-2">/ {pkg.billing_period === 'monthly' ? '月' : '年'}</span>
              </div>

              <p className="text-gray-600 mb-6">{pkg.description}</p>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">包含功能</p>
                {pkg.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-500">
                <span>狀態: {pkg.status}</span>
                <span>排序: {pkg.display_order}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}


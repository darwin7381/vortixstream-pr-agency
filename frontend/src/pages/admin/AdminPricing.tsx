import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { pricingAPI, type PricingPackage } from '../../api/client';
import { Star, Check, Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminPricing() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await pricingAPI.getPackages('all');
      setPackages(data);
    } catch (error) {
      console.error('Failed to fetch pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pkg: PricingPackage) => {
    if (confirm(`Are you sure you want to delete「${pkg.name}」plan?`)) {
      try {
        await pricingAPI.deletePackage(pkg.id);
        alert('planDeleted successfully');
        fetchPackages();
      } catch (error) {
        console.error('Failed to delete:', error);
        alert('Delete failed');
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-gray-600 dark:text-gray-400">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pricing Plans Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Total {packages.length}  plans</p>
          </div>
          <button
            onClick={() => navigate('/admin/pricing/new')}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-orange-500 transition-all relative"
            >
              {pkg.is_popular && (
                <div className="absolute -top-3 right-4">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    <Star size={14} className="fill-white" />
                    Popular
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => navigate(`/admin/pricing/edit/${pkg.id}`)}
                  className="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(pkg)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 pr-20">{pkg.name}</h3>
              
              <div className="mb-4">
                <span className="text-4xl font-bold text-orange-600 dark:text-orange-400">${pkg.price}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">/ {pkg.billing_period === 'monthly' ? 'month' : 'year'}</span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">{pkg.description}</p>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Features Included</p>
                {pkg.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check size={18} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Status: {pkg.status}</span>
                <span>Display Order: {pkg.display_order}</span>
              </div>
            </div>
          ))}
        </div>

        {packages.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Noplan</p>
            <button
              onClick={() => navigate('/admin/pricing/new')}
              className="mt-4 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-500 font-medium"
            >
              Create第一 plans
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


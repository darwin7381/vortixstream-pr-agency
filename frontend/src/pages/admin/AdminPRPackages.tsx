import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { prPackagesAPI } from '../../api/client';
import { Package, Image, FileText, Plus, Edit, Trash2, Folder } from 'lucide-react';

export default function AdminPRPackages() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await prPackagesAPI.getPackagesByCategory('all');
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch PR packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pkgSlug: string, pkgName: string) => {
    if (confirm(`Are you sure you want to delete「${pkgName}」?`)) {
      try {
        // First get complete package data through slug to get actual database ID
        const pkg = await prPackagesAPI.getPackage(pkgSlug);
        await prPackagesAPI.deletePackage((pkg as any).id);
        alert('Package Deleted successfully');
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
        <div className="p-8">Loading...</div>
      </AdminLayout>
    );
  }

  const totalPackages = categories.reduce((sum, cat) => sum + cat.packages.length, 0);

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PR Packages Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{categories.length} categories，Total {totalPackages}  packages</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin/pr-packages/categories')}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
            >
              <Folder size={20} />
              Manage Categories
            </button>
            <button
              onClick={() => navigate('/admin/pr-packages/new')}
              className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
            >
              <Plus size={20} />
              Add Package
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {categories.map((category, catIdx) => (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {/* CategoryTitle */}
              <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{category.title}</h2>
                    {category.badges && category.badges.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {category.badges.map((badge: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">ID: {category.id}</span>
                </div>
              </div>

              {/* Package List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.packages.map((pkg: any, pkgIdx: number) => (
                  <div
                    key={pkg.id}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-orange-500 hover:shadow-md transition-all relative"
                  >
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-1">
                      <button
                        onClick={() => navigate(`/admin/pr-packages/edit/${pkg.id}`)}
                        className="p-1.5 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id, pkg.name)}
                        className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Package Title */}
                    <div className="flex items-start justify-between mb-4 pr-16">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{pkg.name}</h3>
                        {pkg.badge && (
                          <span className="inline-block text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <Package className="text-orange-600 dark:text-orange-400 flex-shrink-0" size={24} />
                    </div>

                    {/* Price */}
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-3">{pkg.price}</p>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{pkg.description}</p>

                    {/* Guaranteed Publications */}
                    {pkg.guaranteedPublications && (
                      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                          ✓ {pkg.guaranteedPublications} Guaranteed Publications
                        </p>
                      </div>
                    )}

                    {/* Media Logos */}
                    {pkg.mediaLogos && pkg.mediaLogos.length > 0 && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                          <Image size={14} />
                          Media Logos: {pkg.mediaLogos.length} items
                        </p>
                        <div className="space-y-1">
                          {pkg.mediaLogos.map((logo: any, idx: number) => (
                            <p key={idx} className="text-xs text-blue-600 dark:text-blue-400">• {logo.name}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Key Features</p>
                      <div className="space-y-2">
                        {pkg.features.slice(0, 3).map((feature: string, idx: number) => (
                          <p key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                            <span>{feature}</span>
                          </p>
                        ))}
                        {pkg.features.length > 3 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">+{pkg.features.length - 3} more features</p>
                        )}
                      </div>
                    </div>

                    {/* Detailed Info */}
                    {pkg.detailedInfo && pkg.detailedInfo.sections && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <FileText size={14} />
                          Detailed Info: {pkg.detailedInfo.sections.length} itemssections
                        </p>
                        <div className="space-y-2">
                          {pkg.detailedInfo.sections.map((section: any, idx: number) => (
                            <div key={idx} className="text-xs">
                              <span className="font-medium text-gray-700 dark:text-gray-300">{section.title}</span>
                              <span className="text-gray-500 dark:text-gray-400"> ({section.items.length} items)</span>
                            </div>
                          ))}
                        </div>
                        {pkg.detailedInfo.note && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-3 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                            {pkg.detailedInfo.note}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}


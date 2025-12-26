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
    if (confirm(`確定要刪除「${pkgName}」嗎？`)) {
      try {
        // 先通過 slug 獲取完整的 package 數據來得到實際的數據庫 ID
        const pkg = await prPackagesAPI.getPackage(pkgSlug);
        await prPackagesAPI.deletePackage((pkg as any).id);
        alert('Package 已刪除');
        fetchPackages();
      } catch (error) {
        console.error('Failed to delete:', error);
        alert('刪除失敗');
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">載入中...</div>
      </AdminLayout>
    );
  }

  const totalPackages = categories.reduce((sum, cat) => sum + cat.packages.length, 0);

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PR Packages 管理</h1>
            <p className="text-gray-600 mt-2">{categories.length} 個分類，共 {totalPackages} 個 packages</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin/pr-packages/categories')}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
            >
              <Folder size={20} />
              管理分類
            </button>
            <button
              onClick={() => navigate('/admin/pr-packages/new')}
              className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
            >
              <Plus size={20} />
              新增 Package
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {categories.map((category, catIdx) => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* 分類標題 */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{category.title}</h2>
                    {category.badges && category.badges.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {category.badges.map((badge: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm font-medium rounded-full"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">ID: {category.id}</span>
                </div>
              </div>

              {/* Packages 列表 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.packages.map((pkg: any, pkgIdx: number) => (
                  <div
                    key={pkg.id}
                    className="border-2 border-gray-200 rounded-xl p-5 hover:border-orange-500 hover:shadow-md transition-all relative"
                  >
                    {/* 操作按鈕 */}
                    <div className="absolute top-3 right-3 flex gap-1">
                      <button
                        onClick={() => navigate(`/admin/pr-packages/edit/${pkg.id}`)}
                        className="p-1.5 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                        title="編輯"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id, pkg.name)}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="刪除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Package 標題 */}
                    <div className="flex items-start justify-between mb-4 pr-16">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                        {pkg.badge && (
                          <span className="inline-block text-xs font-bold text-orange-600 uppercase tracking-wide">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <Package className="text-orange-600 flex-shrink-0" size={24} />
                    </div>

                    {/* 價格 */}
                    <p className="text-2xl font-bold text-orange-600 mb-3">{pkg.price}</p>

                    {/* 描述 */}
                    <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>

                    {/* 保證發布數 */}
                    {pkg.guaranteedPublications && (
                      <div className="mb-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-semibold text-green-700">
                          ✓ {pkg.guaranteedPublications} Guaranteed Publications
                        </p>
                      </div>
                    )}

                    {/* Media Logos */}
                    {pkg.mediaLogos && pkg.mediaLogos.length > 0 && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-2">
                          <Image size={14} />
                          Media Logos: {pkg.mediaLogos.length} 個
                        </p>
                        <div className="space-y-1">
                          {pkg.mediaLogos.map((logo: any, idx: number) => (
                            <p key={idx} className="text-xs text-blue-600">• {logo.name}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">主要功能</p>
                      <div className="space-y-2">
                        {pkg.features.slice(0, 3).map((feature: string, idx: number) => (
                          <p key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-600 mt-1">✓</span>
                            <span>{feature}</span>
                          </p>
                        ))}
                        {pkg.features.length > 3 && (
                          <p className="text-xs text-gray-500">+{pkg.features.length - 3} 更多功能</p>
                        )}
                      </div>
                    </div>

                    {/* Detailed Info */}
                    {pkg.detailedInfo && pkg.detailedInfo.sections && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <FileText size={14} />
                          詳細資訊: {pkg.detailedInfo.sections.length} 個區塊
                        </p>
                        <div className="space-y-2">
                          {pkg.detailedInfo.sections.map((section: any, idx: number) => (
                            <div key={idx} className="text-xs">
                              <span className="font-medium text-gray-700">{section.title}</span>
                              <span className="text-gray-500"> ({section.items.length} items)</span>
                            </div>
                          ))}
                        </div>
                        {pkg.detailedInfo.note && (
                          <p className="text-xs text-gray-500 italic mt-3 p-2 bg-gray-50 rounded">
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


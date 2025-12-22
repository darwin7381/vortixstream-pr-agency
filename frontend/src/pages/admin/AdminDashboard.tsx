import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { blogAPI, pricingAPI, prPackagesAPI } from '../../api/client';
import { FileText, DollarSign, Package, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogCount: 0,
    pricingCount: 0,
    prPackagesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogData, pricingData, prPackagesData] = await Promise.all([
          blogAPI.getPosts({ page: 1, page_size: 1 }),
          pricingAPI.getPackages(),
          prPackagesAPI.getPackagesByCategory(),
        ]);

        setStats({
          blogCount: blogData.total,
          pricingCount: pricingData.length,
          prPackagesCount: prPackagesData.reduce((sum, cat) => sum + cat.packages.length, 0),
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">歡迎回來，管理您的 VortixPR 內容</p>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Blog 文章</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '-' : stats.blogCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="text-blue-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pricing 方案</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '-' : stats.pricingCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="text-green-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">PR Packages</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '-' : stats.prPackagesCount}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Package className="text-orange-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">快速操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/blog/new"
              className="flex items-center gap-4 p-5 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all group"
            >
              <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <FileText className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">新增 Blog 文章</h3>
                <p className="text-sm text-gray-600">建立新的部落格文章</p>
              </div>
            </Link>

            <Link
              to="/admin/blog"
              className="flex items-center gap-4 p-5 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">管理文章</h3>
                <p className="text-sm text-gray-600">編輯或刪除現有文章</p>
              </div>
            </Link>

            <Link
              to="/admin/pricing"
              className="flex items-center gap-4 p-5 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
            >
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">查看定價</h3>
                <p className="text-sm text-gray-600">檢視定價方案</p>
              </div>
            </Link>

            <Link
              to="/admin/pr-packages"
              className="flex items-center gap-4 p-5 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Package className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">PR Packages</h3>
                <p className="text-sm text-gray-600">檢視 PR 套餐</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


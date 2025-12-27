import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { blogAPI, pricingAPI, prPackagesAPI, contactAdminAPI, newsletterAdminAPI } from '../../api/client';
import { FileText, DollarSign, Package, Mail, MessageSquare, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogCount: 0,
    pricingCount: 0,
    prPackagesCount: 0,
    contactCount: 0,
    newsletterCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogData, pricingData, prPackagesData, contactData, newsletterStats] = await Promise.all([
          blogAPI.getPosts({ page: 1, page_size: 1 }),
          pricingAPI.getPackages(),
          prPackagesAPI.getPackagesByCategory(),
          contactAdminAPI.getSubmissions({ limit: 1 }),
          newsletterAdminAPI.getStats(),
        ]);

        setStats({
          blogCount: blogData.total,
          pricingCount: pricingData.length,
          prPackagesCount: prPackagesData.reduce((sum, cat) => sum + cat.packages.length, 0),
          contactCount: contactData.length,
          newsletterCount: newsletterStats.active_count,
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">歡迎回來，管理您的 VortixPR 內容</p>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Blog 文章</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{loading ? '-' : stats.blogCount}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="text-blue-600 dark:text-blue-400" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Pricing 方案</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{loading ? '-' : stats.pricingCount}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="text-green-600 dark:text-green-400" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">PR Packages</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{loading ? '-' : stats.prPackagesCount}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Package className="text-orange-600 dark:text-orange-400" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">聯絡提交</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{loading ? '-' : stats.contactCount}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <MessageSquare className="text-purple-600 dark:text-purple-400" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Newsletter</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{loading ? '-' : stats.newsletterCount}</p>
              </div>
              <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                <Users className="text-pink-600 dark:text-pink-400" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">快速操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/admin/blog/new"
              className="flex items-center gap-4 p-5 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all group"
            >
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                <FileText className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">新增 Blog 文章</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">建立新的部落格文章</p>
              </div>
            </Link>

            <Link
              to="/admin/blog"
              className="flex items-center gap-4 p-5 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
            >
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <FileText className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">管理文章</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">編輯或刪除現有文章</p>
              </div>
            </Link>

            <Link
              to="/admin/pricing"
              className="flex items-center gap-4 p-5 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group"
            >
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                <DollarSign className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">查看定價</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">檢視定價方案</p>
              </div>
            </Link>

            <Link
              to="/admin/pr-packages"
              className="flex items-center gap-4 p-5 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
            >
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                <Package className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PR Packages</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">檢視 PR 套餐</p>
              </div>
            </Link>

            <Link
              to="/admin/contact"
              className="flex items-center gap-4 p-5 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all group"
            >
              <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg group-hover:bg-pink-200 dark:group-hover:bg-pink-900/50 transition-colors">
                <MessageSquare className="text-pink-600 dark:text-pink-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">聯絡表單</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">查看和回覆用戶訊息</p>
              </div>
            </Link>

            <Link
              to="/admin/newsletter"
              className="flex items-center gap-4 p-5 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
            >
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                <Mail className="text-indigo-600 dark:text-indigo-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Newsletter</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">管理訂閱者列表</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


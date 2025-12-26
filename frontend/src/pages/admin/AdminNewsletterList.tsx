import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { newsletterAdminAPI, type NewsletterSubscriber } from '../../api/client';
import { Mail, MapPin, Clock, X, Trash2, TrendingUp } from 'lucide-react';

export default function AdminNewsletterList() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const [subscribersData, statsData] = await Promise.all([
        newsletterAdminAPI.getSubscribers({
          status: statusFilter,
          limit: 200,
          search: searchTerm || undefined,
        }),
        newsletterAdminAPI.getStats(),
      ]);
      setSubscribers(subscribersData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleUnsubscribe = async (id: number, email: string) => {
    if (confirm(`確定要取消 ${email} 的訂閱嗎？`)) {
      try {
        await newsletterAdminAPI.updateStatus(id, 'unsubscribed');
        alert('訂閱已取消');
        fetchData();
      } catch (error) {
        console.error('Failed to unsubscribe:', error);
        alert('操作失敗');
      }
    }
  };

  const handleReactivate = async (id: number, email: string) => {
    if (confirm(`確定要重新啟用 ${email} 的訂閱嗎？`)) {
      try {
        await newsletterAdminAPI.updateStatus(id, 'active');
        alert('訂閱已重新啟用');
        fetchData();
      } catch (error) {
        console.error('Failed to reactivate:', error);
        alert('操作失敗');
      }
    }
  };

  const handleDelete = async (id: number, email: string) => {
    if (confirm(`確定要永久刪除 ${email} 嗎？此操作無法撤銷。`)) {
      try {
        await newsletterAdminAPI.deleteSubscriber(id);
        alert('訂閱者已刪除');
        fetchData();
      } catch (error) {
        console.error('Failed to delete:', error);
        alert('刪除失敗');
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchData();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">載入中...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Newsletter 訂閱者</h1>
          <p className="text-gray-600 mt-2">管理所有 newsletter 訂閱</p>
        </div>

        {/* 統計卡片 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">活躍訂閱</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active_count}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <X className="text-gray-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">已取消訂閱</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.unsubscribed_count}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">總訂閱數</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_count}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 篩選和搜尋 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              活躍
            </button>
            <button
              onClick={() => setStatusFilter('unsubscribed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'unsubscribed'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              已取消
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋電郵地址..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              搜尋
            </button>
          </form>
        </div>

        {/* 訂閱者列表 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  電郵
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  來源
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  訂閱時間
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <span className="font-medium text-gray-900">{subscriber.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={14} />
                      {subscriber.source || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        subscriber.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {subscriber.status === 'active' ? '活躍' : '已取消'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      {new Date(subscriber.subscribed_at).toLocaleDateString('zh-TW')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {subscriber.status === 'active' ? (
                        <button
                          onClick={() => handleUnsubscribe(subscriber.id, subscriber.email)}
                          className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                          title="取消訂閱"
                        >
                          <X size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(subscriber.id, subscriber.email)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="重新啟用"
                        >
                          <Mail size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(subscriber.id, subscriber.email)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="刪除"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {subscribers.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">沒有找到訂閱者</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}


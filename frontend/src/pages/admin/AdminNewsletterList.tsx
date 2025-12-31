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
    if (confirm(`Are you sure you want to Cancel ${email} ?`)) {
      try {
        await newsletterAdminAPI.updateStatus(id, 'unsubscribed');
        alert('Subscription cancelled successfully');
        fetchData();
      } catch (error) {
        console.error('Failed to unsubscribe:', error);
        alert('Operation failed');
      }
    }
  };

  const handleReactivate = async (id: number, email: string) => {
    if (confirm(`Are you sure you want to Reactivate ${email} ?`)) {
      try {
        await newsletterAdminAPI.updateStatus(id, 'active');
        alert('Subscription reactivated successfully');
        fetchData();
      } catch (error) {
        console.error('Failed to reactivate:', error);
        alert('Operation failed');
      }
    }
  };

  const handleDelete = async (id: number, email: string) => {
    if (confirm(`Are you sure you want to permanently delete ${email} ?This action cannot be undone。`)) {
      try {
        await newsletterAdminAPI.deleteSubscriber(id);
        alert('subscriberDeleted successfully');
        fetchData();
      } catch (error) {
        console.error('Failed to delete:', error);
        alert('Delete failed');
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
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Newsletter Subscribers</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage all newsletter subscriptions</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active_count}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <X className="text-gray-600 dark:text-gray-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cancelled Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unsubscribed_count}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Mail className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_count}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 flex gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('unsubscribed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'unsubscribed'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Cancelled successfully
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search email address..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* Subscriber List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Subscribed At
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{subscriber.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin size={14} />
                      {subscriber.source || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        subscriber.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {subscriber.status === 'active' ? 'Active' : 'Cancelled successfully'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400 dark:text-gray-500" />
                      {new Date(subscriber.subscribed_at).toLocaleDateString('en-US')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {subscriber.status === 'active' ? (
                        <button
                          onClick={() => handleUnsubscribe(subscriber.id, subscriber.email)}
                          className="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                          title="Unsubscribe"
                        >
                          <X size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(subscriber.id, subscriber.email)}
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                          title="Reactivate"
                        >
                          <Mail size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(subscriber.id, subscriber.email)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
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
              <p className="text-gray-500 dark:text-gray-400 text-lg">No subscribers found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}


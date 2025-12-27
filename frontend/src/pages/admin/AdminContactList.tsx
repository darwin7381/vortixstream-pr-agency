import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { contactAdminAPI, type ContactSubmission } from '../../api/client';
import { Mail, Building2, Phone, MessageSquare, Clock, Check, Trash2 } from 'lucide-react';

export default function AdminContactList() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSubmissions = async () => {
    try {
      const data = await contactAdminAPI.getSubmissions({
        status: statusFilter,
        limit: 100,
        search: searchTerm || undefined,
      });
      setSubmissions(data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await contactAdminAPI.updateStatus(id, newStatus);
      alert('狀態已更新');
      fetchSubmissions();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('更新失敗');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`確定要刪除來自「${name}」的提交嗎？`)) {
      try {
        await contactAdminAPI.deleteSubmission(id);
        alert('提交已刪除');
        fetchSubmissions();
      } catch (error) {
        console.error('Failed to delete:', error);
        alert('刪除失敗');
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchSubmissions();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600 dark:text-gray-400">載入中...</div>
        </div>
      </AdminLayout>
    );
  }

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    read: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    replied: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  };

  const statusLabels: Record<string, string> = {
    new: '新',
    read: '已讀',
    replied: '已回覆',
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">聯絡表單提交</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">共 {submissions.length} 個提交</p>
        </div>

        {/* 篩選和搜尋 */}
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
              全部
            </button>
            <button
              onClick={() => setStatusFilter('new')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'new'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              新提交
            </button>
            <button
              onClick={() => setStatusFilter('read')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'read'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              已讀
            </button>
            <button
              onClick={() => setStatusFilter('replied')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'replied'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              已回覆
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋姓名、電郵、公司..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              搜尋
            </button>
          </form>
        </div>

        {/* 提交列表 */}
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:border-orange-500 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{submission.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[submission.status]}`}>
                      {statusLabels[submission.status]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span>{submission.email}</span>
                    </div>
                    {submission.company && (
                      <div className="flex items-center gap-2">
                        <Building2 size={16} />
                        <span>{submission.company}</span>
                      </div>
                    )}
                    {submission.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>{submission.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{new Date(submission.created_at).toLocaleString('zh-TW')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {submission.status === 'new' && (
                    <button
                      onClick={() => handleStatusChange(submission.id, 'read')}
                      className="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                      title="標記為已讀"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  {submission.status === 'read' && (
                    <button
                      onClick={() => handleStatusChange(submission.id, 'replied')}
                      className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                      title="標記為已回覆"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(submission.id, submission.name)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="刪除"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <MessageSquare size={18} className="mt-0.5 flex-shrink-0" />
                  <p className="whitespace-pre-wrap">{submission.message}</p>
                </div>
              </div>
            </div>
          ))}

          {submissions.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">沒有找到提交</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}


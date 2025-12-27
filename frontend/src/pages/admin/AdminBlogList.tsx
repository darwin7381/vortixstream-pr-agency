import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { blogAPI, type BlogPost } from '../../api/client';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminBlogList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const data = await blogAPI.getPosts({ page_size: 100 });
      setPosts(data.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (post: BlogPost) => {
    if (confirm(`確定要刪除「${post.title}」嗎？`)) {
      try {
        await blogAPI.deletePost(post.id);
        alert('文章已刪除');
        fetchPosts();
      } catch (error) {
        console.error('Failed to delete:', error);
        alert('刪除失敗');
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400">載入中...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog 文章管理</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">共 {posts.length} 篇文章</p>
          </div>
          <button
            onClick={() => navigate('/admin/blog/new')}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            新增文章
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  標題
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  分類
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  發布日期
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{post.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : post.status === 'draft'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {post.status === 'published' ? '已發布' : post.status === 'draft' ? '草稿' : post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('zh-TW')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="預覽"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                        className="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                        title="編輯"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(post)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
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

          {posts.length === 0 && (
            <div className="text-center py-16">
              <FileText className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400 text-lg">暫無文章</p>
              <button
                onClick={() => navigate('/admin/blog/new')}
                className="mt-4 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-500 font-medium"
              >
                建立第一篇文章
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}


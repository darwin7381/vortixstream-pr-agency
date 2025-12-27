import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageInputField from '../../components/admin/ImageInputField';
import { blogAPI } from '../../api/client';
import { ArrowLeft, Save } from 'lucide-react';

const categories = [
  'PR Strategy',
  'Media Strategy',
  'Brand Building',
  'Crisis Management',
  'Globalization',
  'Data Analytics',
];

export default function AdminBlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id); // 只有編輯模式需要載入

  const [formData, setFormData] = useState({
    title: '',
    category: 'PR Strategy',
    excerpt: '',
    content: '',
    author: 'VortixPR Team',
    read_time: 5,
    image_url: '',
    status: 'draft',
  });

  // 載入現有文章數據（編輯模式）
  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      const post = await blogAPI.getPostById(Number(id));
      setFormData({
        title: post.title,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        read_time: post.read_time,
        image_url: post.image_url || '',
        status: post.status,
      });
    } catch (error) {
      console.error('Failed to load post:', error);
      alert('載入文章失敗');
      navigate('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (id) {
        // 更新現有文章
        await blogAPI.updatePost(Number(id), formData);
        alert('文章已更新');
      } else {
        // 創建新文章
        await blogAPI.createPost(formData as any);
        alert('文章已建立');
      }
      navigate('/admin/blog');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('儲存失敗');
    } finally {
      setSaving(false);
    }
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
        <button
          onClick={() => navigate('/admin/blog')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          返回列表
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {id ? '編輯' : '新增'}文章
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-4xl">
          <div className="space-y-6">
            {/* 標題 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                標題 *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* 分類 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分類 *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 摘要 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                摘要 *
              </label>
              <textarea
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* 內容 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                內容 * (支援 Markdown)
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                placeholder="# 標題&#10;&#10;內容..."
              />
            </div>

            {/* 圖片 URL - 使用圖片選擇器 */}
            <ImageInputField
              label="圖片 URL"
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              folder="blog"
              placeholder="選擇或上傳 Blog 文章圖片"
            />

            <div className="grid grid-cols-3 gap-4">
              {/* 閱讀時間 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  閱讀時間（分鐘）
                </label>
                <input
                  type="number"
                  value={formData.read_time}
                  onChange={(e) =>
                    setFormData({ ...formData, read_time: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* 作者 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">作者</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* 狀態 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">狀態</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="draft">草稿</option>
                  <option value="published">已發布</option>
                  <option value="archived">已封存</option>
                </select>
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                <Save size={18} />
                {id ? '更新' : '建立'}文章
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/blog')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}


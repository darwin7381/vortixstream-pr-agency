import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageInputField from '../../components/admin/ImageInputField';
import { blogAPI, type BlogPost } from '../../api/client';
import { ArrowLeft, Save, ExternalLink, RefreshCw, CheckCircle, AlertCircle, X } from 'lucide-react';

const PRESET_CATEGORIES = [
  'PR Strategy',
  'Media Strategy',
  'Brand Building',
  'Crisis Management',
  'Globalization',
  'Data Analytics',
  'Asia PR',
  'Web3 PR',
  'AI PR',
  'Thought Leadership',
];

type ToastType = 'success' | 'error';

export default function AdminBlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [notionInfo, setNotionInfo] = useState<{ notion_page_id: string | null; sync_source: string | null } | null>(null);
  const [categories, setCategories] = useState<string[]>(PRESET_CATEGORIES);
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'PR Strategy',
    excerpt: '',
    content: '',
    author: 'VortixPR Team',
    read_time: 5,
    image_url: '',
    status: 'draft' as string,
    tags: [] as string[],
  });

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    // 載入分類列表
    blogAPI.getCategories().then(cats => {
      const apiCats = cats.map(c => c.name);
      const merged = Array.from(new Set([...PRESET_CATEGORIES, ...apiCats]));
      setCategories(merged);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      const post: BlogPost = await blogAPI.getPostById(Number(id));
      setFormData({
        title: post.title,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        read_time: post.read_time,
        image_url: post.image_url || '',
        status: post.status,
        tags: post.tags || [],
      });
      setNotionInfo({
        notion_page_id: post.notion_page_id || null,
        sync_source: post.sync_source || null,
      });
      // 如果分類不在列表中，加進去
      if (post.category && !categories.includes(post.category)) {
        setCategories(prev => Array.from(new Set([...prev, post.category])));
      }
    } catch (error) {
      console.error('Failed to load post:', error);
      showToast('error', 'Failed to load post');
      navigate('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEdit) {
        const result = await blogAPI.updatePost(Number(id), formData);
        if ((result as any)._notion_sync_warning) {
          showToast('error', `Saved, but Notion sync failed: ${(result as any)._notion_sync_warning}`);
        } else {
          showToast('success', 'Post updated successfully');
        }
      } else {
        await blogAPI.createPost(formData as any);
        showToast('success', 'Post created successfully');
        setTimeout(() => navigate('/admin/blog'), 1500);
      }
    } catch (error) {
      console.error('Failed to save:', error);
      showToast('error', 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <RefreshCw size={24} className="animate-spin text-gray-400" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-5xl">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </div>
        )}

        {/* Top Nav */}
        <button
          onClick={() => navigate('/admin/blog')}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Blog Posts
        </button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Post' : 'New Post'}
            </h1>
            {isEdit && notionInfo?.notion_page_id && (
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full font-medium">
                  <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
                  Notion synced · {notionInfo.notion_page_id.slice(0, 8)}...
                </span>
                <a
                  href={`https://notion.so/${notionInfo.notion_page_id.replace(/-/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  Open in Notion <ExternalLink size={11} />
                </a>
              </div>
            )}
          </div>
          {isEdit && formData.status === 'published' && (
            <a
              href={`/blog/${id ? '' : ''}`}
              className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 transition-colors"
            >
              View live <ExternalLink size={14} />
            </a>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Post title"
                    className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Excerpt / Meta Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    placeholder="Brief summary used in previews and SEO meta description"
                    className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 text-sm resize-none"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Content
                    {notionInfo?.notion_page_id && (
                      <span className="ml-2 text-xs text-gray-400 font-normal">(HTML – synced from Notion)</span>
                    )}
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={20}
                    className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 font-mono text-xs leading-relaxed"
                    placeholder="HTML content (auto-generated from Notion sync)"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Publish Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Publish Settings</h3>
                <div className="space-y-4">

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      title="Post status"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                    {notionInfo?.notion_page_id && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                        Status change will sync to Notion automatically.
                      </p>
                    )}
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Author name"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Read Time */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      Read Time (min)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={formData.read_time}
                      onChange={(e) => setFormData({ ...formData, read_time: Number(e.target.value) })}
                      placeholder="5"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Save / Cancel */}
                <div className="flex flex-col gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2.5 rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm font-medium transition-colors"
                  >
                    {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/admin/blog')}
                    className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Category & Image */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Category & Image</h3>
                <div className="space-y-4">

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      list="category-list"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Select or type category"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                    />
                    <datalist id="category-list">
                      {categories.map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>

                  {/* Cover Image */}
                  <ImageInputField
                    label="Cover Image"
                    value={formData.image_url}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                    folder="blog-covers"
                    placeholder="Select or upload cover image"
                    compact
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Tags</h3>

                {/* Tag Pills */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs rounded-full font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          title={`Remove ${tag}`}
                          onClick={() => setFormData(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Tag Input */}
                <div className="flex gap-2">
                  <input
                    ref={tagInputRef}
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
                        e.preventDefault();
                        const newTag = tagInput.trim().replace(/,$/, '');
                        if (newTag && !formData.tags.includes(newTag)) {
                          setFormData(f => ({ ...f, tags: [...f.tags, newTag] }));
                        }
                        setTagInput('');
                      } else if (e.key === 'Backspace' && !tagInput && formData.tags.length > 0) {
                        setFormData(f => ({ ...f, tags: f.tags.slice(0, -1) }));
                      }
                    }}
                    placeholder="Type tag + Enter"
                    className="flex-1 min-w-0 px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newTag = tagInput.trim();
                      if (newTag && !formData.tags.includes(newTag)) {
                        setFormData(f => ({ ...f, tags: [...f.tags, newTag] }));
                      }
                      setTagInput('');
                      tagInputRef.current?.focus();
                    }}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                  Press Enter or comma to add
                </p>
              </div>

              {/* Notion Info */}
              {notionInfo?.notion_page_id && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Notion Info</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Source</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium capitalize">
                        {notionInfo.sync_source || 'notion'}
                      </span>
                    </div>
                    <div className="flex items-start justify-between text-xs gap-2">
                      <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">Page ID</span>
                      <span className="text-gray-700 dark:text-gray-300 font-mono break-all text-right">
                        {notionInfo.notion_page_id.slice(0, 18)}...
                      </span>
                    </div>
                    <a
                      href={`https://notion.so/${notionInfo.notion_page_id.replace(/-/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 mt-3 w-full py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                      Open in Notion <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

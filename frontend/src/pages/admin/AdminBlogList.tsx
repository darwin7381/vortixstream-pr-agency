import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { blogAPI, type AdminBlogPost } from '../../api/client';
import {
  Plus, Edit, Trash2, Search, RefreshCw,
  FileText, BookOpen, Archive, ExternalLink,
  ArrowUpDown, ArrowUp, ArrowDown,
} from 'lucide-react';

type StatusFilter = 'all' | 'published' | 'draft' | 'archived';
type SortKey = 'title' | 'author' | 'status' | 'updated_at' | 'category';
type SortDir = 'asc' | 'desc';

const STATUS_TABS: { key: StatusFilter; label: string; icon: React.ReactNode }[] = [
  { key: 'all',       label: 'All',       icon: <BookOpen size={14} /> },
  { key: 'published', label: 'Published', icon: <FileText size={14} /> },
  { key: 'draft',     label: 'Draft',     icon: <Edit size={14} /> },
  { key: 'archived',  label: 'Archived',  icon: <Archive size={14} /> },
];

const STATUS_SELECT_CLASS: Record<string, string> = {
  published: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
  draft:     'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
  archived:  'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600',
};

export default function AdminBlogList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [statusChanging, setStatusChanging] = useState<number | null>(null);

  // Client-side sorting
  const [sortKey, setSortKey] = useState<SortKey>('updated_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const PAGE_SIZE = 50;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await blogAPI.getAdminPosts({
        page,
        page_size: PAGE_SIZE,
        status: statusFilter,
        search,
      });
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleTabChange = (tab: StatusFilter) => {
    setStatusFilter(tab);
    setPage(1);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleStatusChange = async (post: AdminBlogPost, newStatus: string) => {
    if (post.status === newStatus) return;
    setStatusChanging(post.id);
    try {
      await blogAPI.updatePostStatus(post.id, newStatus);
      await fetchPosts();
    } catch {
      alert('Status update failed');
    } finally {
      setStatusChanging(null);
    }
  };

  const handleDelete = async (post: AdminBlogPost) => {
    if (!confirm(`Delete「${post.title}」?\n\nThis will also archive the Notion card.`)) return;
    try {
      await blogAPI.deletePost(post.id);
      await fetchPosts();
    } catch {
      alert('Delete failed');
    }
  };

  // Client-side sort
  const sortedPosts = [...posts].sort((a, b) => {
    let av = (a as Record<string, unknown>)[sortKey] as string ?? '';
    let bv = (b as Record<string, unknown>)[sortKey] as string ?? '';
    av = String(av).toLowerCase();
    bv = String(bv).toLowerCase();
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const tabCounts: Record<StatusFilter, number | null> = {
    all:       statusFilter === 'all'       ? total : null,
    published: statusFilter === 'published' ? total : null,
    draft:     statusFilter === 'draft'     ? total : null,
    archived:  statusFilter === 'archived'  ? total : null,
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown size={13} className="opacity-30" />;
    return sortDir === 'asc'
      ? <ArrowUp size={13} className="text-orange-500" />
      : <ArrowDown size={13} className="text-orange-500" />;
  };

  const ThSortable = ({ col, label, className = '' }: { col: SortKey; label: string; className?: string }) => (
    <th
      className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200 transition-colors ${className}`}
      onClick={() => handleSort(col)}
    >
      <span className="inline-flex items-center gap-1.5">
        {label}
        <SortIcon col={col} />
      </span>
    </th>
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {total} article{total !== 1 ? 's' : ''} total
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchPosts}
              title="Refresh"
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => navigate('/admin/blog/new')}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2.5 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              <Plus size={18} />
              New Post
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Status Tabs */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === tab.key
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tabCounts[tab.key] !== null && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    statusFilter === tab.key
                      ? 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {tabCounts[tab.key]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search by title or author..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 dark:bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw size={24} className="animate-spin text-gray-400" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No posts found</p>
              {search && (
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try a different search term</p>
              )}
              {!search && statusFilter === 'all' && (
                <button
                  onClick={() => navigate('/admin/blog/new')}
                  className="mt-4 text-orange-600 dark:text-orange-400 hover:text-orange-700 font-medium text-sm"
                >
                  Create your first post →
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10">
                      #
                    </th>
                    <ThSortable col="title"      label="Title"    />
                    <ThSortable col="category"   label="Category" className="hidden md:table-cell" />
                    <ThSortable col="author"     label="Author"   className="hidden lg:table-cell" />
                    <ThSortable col="status"     label="Status"   />
                    <ThSortable col="updated_at" label="Updated"  className="hidden xl:table-cell" />
                    <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {sortedPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">

                      {/* ID */}
                      <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500 font-mono">
                        {post.id}
                      </td>

                      {/* Title */}
                      <td className="px-4 py-3 max-w-xs">
                        <div className="flex items-start gap-2">
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">
                              {post.title}
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate font-mono">
                              /{post.slug}
                            </div>
                          </div>
                          {post.notion_page_id && (
                            <span
                              title="Synced from Notion"
                              className="flex-shrink-0 mt-0.5 text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded font-medium"
                            >
                              N
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="inline-flex px-2.5 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full whitespace-nowrap">
                          {post.category}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-600 dark:text-gray-400">
                        {post.author || '—'}
                      </td>

                      {/* Status — native select, styled as pill */}
                      <td className="px-4 py-3">
                        <div className="relative inline-block">
                          {statusChanging === post.id ? (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_SELECT_CLASS[post.status] ?? STATUS_SELECT_CLASS.archived}`}>
                              <RefreshCw size={10} className="animate-spin" />
                              Saving…
                            </span>
                          ) : (
                            <select
                              value={post.status}
                              title="Change status"
                              onChange={e => handleStatusChange(post, e.target.value)}
                              className={`appearance-none cursor-pointer px-2.5 py-1 pr-5 text-xs font-semibold rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 ${STATUS_SELECT_CLASS[post.status] ?? STATUS_SELECT_CLASS.archived}`}
                            >
                              <option value="published">Published</option>
                              <option value="draft">Draft</option>
                              <option value="archived">Archived</option>
                            </select>
                          )}
                        </div>
                      </td>

                      {/* Updated At */}
                      <td className="px-4 py-3 hidden xl:table-cell text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(post.updated_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                          {post.status === 'published' && (
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="View live"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                            className="p-1.5 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(post)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Page {page} of {totalPages} · {total} total
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

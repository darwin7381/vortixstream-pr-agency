import { useState, useEffect } from 'react';
import { Eye, Plus, Trash2, Edit, Download, Mail, Users, Loader2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { templateAPI, PRTemplate } from '../../api/templateClient';
import { templateAdminAPI } from '../../api/templateAdminClient';

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<PRTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<PRTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<PRTemplate | null>(null);

  // Fetch templates
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templateAPI.getTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  // Get category color class
  const getCategoryColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      '#FF7400': 'text-[#FF7400] bg-[#FF7400]/10 border-[#FF7400]/30',
      '#FBBF24': 'text-[#FBBF24] bg-[#FBBF24]/10 border-[#FBBF24]/30',
      '#EF4444': 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30',
      '#8B5CF6': 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/30',
      '#3B82F6': 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/30',
      '#6366F1': 'text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/30',
      '#10B981': 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30',
    };
    return colorMap[color] || 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  };

  const handleDelete = async (template: PRTemplate) => {
    if (!window.confirm(`確定要刪除「${template.title}」模板嗎？此操作無法復原。`)) {
      return;
    }

    try {
      await templateAdminAPI.deleteTemplate(template.id);
      alert('刪除成功！');
      fetchTemplates(); // 刷新列表
    } catch (error: any) {
      console.error('Failed to delete template:', error);
      alert(error.message || '刪除失敗，請稍後再試');
    }
  };

  const handleEdit = (template: PRTemplate) => {
    setEditingTemplate(template);
  };

  const handleSaveEdit = async (updatedTemplate: PRTemplate) => {
    try {
      await templateAdminAPI.updateTemplate(updatedTemplate.id, {
        title: updatedTemplate.title,
        description: updatedTemplate.description,
        content: updatedTemplate.content,
      });
      
      alert('更新成功！');
      setEditingTemplate(null);
      fetchTemplates(); // 刷新列表
    } catch (error: any) {
      console.error('Failed to update template:', error);
      alert(error.message || '更新失敗，請稍後再試');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={48} className="text-orange-500 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">Loading templates...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PR Templates</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage professional press release templates
            </p>
          </div>
          <button className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm">
            <Plus size={20} />
            New Template
          </button>
        </div>

        {/* Stats Summary - 必須在這裡！ */}
        {!error && templates.length > 0 && (
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <div className="text-gray-600 dark:text-gray-400 text-[13px] mb-2">Total Templates</div>
              <div className="text-gray-900 dark:text-white text-[28px] font-bold">
                {templates.length}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <div className="text-gray-600 dark:text-gray-400 text-[13px] mb-2">Total Views</div>
              <div className="text-gray-900 dark:text-white text-[28px] font-bold">
                {templates.reduce((sum, t) => sum + t.preview_count, 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <div className="text-gray-600 dark:text-gray-400 text-[13px] mb-2">Email Requests</div>
              <div className="text-gray-900 dark:text-white text-[28px] font-bold">
                {templates.reduce((sum, t) => sum + t.email_request_count, 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <div className="text-gray-600 dark:text-gray-400 text-[13px] mb-2">Waitlist</div>
              <div className="text-green-600 dark:text-green-400 text-[28px] font-bold">
                {templates.reduce((sum, t) => sum + t.waitlist_count, 0).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {error ? (
          // Error state
          <div className="text-center py-20">
            <div className="text-6xl mb-6">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Failed to Load
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button onClick={fetchTemplates} className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700">
              Retry
            </button>
          </div>
        ) : (
          // Templates table
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-6 py-4 text-left text-white/80 text-[13px] font-sans font-semibold uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <Eye size={16} className="inline mr-1" />
                    Views
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <Mail size={16} className="inline mr-1" />
                    Emails
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <Users size={16} className="inline mr-1" />
                    Waitlist
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {templates.map((template) => (
                  <tr
                    key={template.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Template Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: `${template.category_color}20`,
                            border: `1px solid ${template.category_color}40`
                          }}
                        >
                          <Download size={18} style={{ color: template.category_color }} />
                        </div>
                        <div>
                          <h3 className="text-gray-900 dark:text-white text-[15px] font-semibold mb-1">
                            {template.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-[13px] line-clamp-1">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-sans font-semibold border ${getCategoryColorClass(template.category_color)}`}
                      >
                        {template.category}
                      </span>
                    </td>

                    {/* Stats */}
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-900 dark:text-white text-[14px] font-semibold">
                        {template.preview_count.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-900 dark:text-white text-[14px] font-semibold">
                        {template.email_request_count.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 dark:text-green-400 text-[14px] font-semibold">
                        {template.waitlist_count.toLocaleString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewTemplate(template)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                          title="Preview"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(template)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(template)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
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

            {/* Empty state */}
            {templates.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      No templates found
                    </p>
                  </td>
                </tr>
              </tbody>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-gray-900 dark:text-white text-[20px] font-bold">
                {previewTemplate.title}
              </h2>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <pre className="text-gray-800 dark:text-gray-200 text-[13px] font-mono leading-relaxed whitespace-pre-wrap">
                {previewTemplate.content}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-gray-900 dark:text-white text-[20px] font-bold">
                Edit Template: {editingTemplate.title}
              </h2>
              <button
                onClick={() => setEditingTemplate(null)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                ×
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingTemplate.title}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingTemplate.description}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Content (Markdown)
                  </label>
                  <textarea
                    value={editingTemplate.content}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                    rows={20}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingTemplate(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(editingTemplate)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}


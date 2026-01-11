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
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    description: '',
    category: 'Launch',
    category_color: '#FF7400',
    icon: 'Rocket',
    content: '',
    industry_tags: [] as string[],
    use_cases: [] as string[],
    includes: [] as string[],
  });

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
        industry_tags: updatedTemplate.industry_tags,
        use_cases: updatedTemplate.use_cases,
        includes: updatedTemplate.includes,
      });
      
      alert('更新成功！');
      setEditingTemplate(null);
      fetchTemplates(); // 刷新列表
    } catch (error: any) {
      console.error('Failed to update template:', error);
      alert(error.message || '更新失敗，請稍後再試');
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.title || !newTemplate.content) {
      alert('請填寫標題和內容');
      return;
    }

    try {
      await templateAdminAPI.createTemplate(newTemplate);
      alert('模板創建成功！');
      setShowNewModal(false);
      setNewTemplate({
        title: '',
        description: '',
        category: 'Launch',
        category_color: '#FF7400',
        icon: 'Rocket',
        content: '',
        industry_tags: [],
        use_cases: [],
        includes: [],
      });
      fetchTemplates(); // 刷新列表
    } catch (error: any) {
      console.error('Failed to create template:', error);
      alert(error.message || '創建失敗，請稍後再試');
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
          <button 
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
          >
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
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewTemplate(null)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
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
              <div 
                className="prose prose-sm max-w-none
                  [&_h1]:text-gray-900 [&_h1]:dark:text-white [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4
                  [&_h2]:text-gray-800 [&_h2]:dark:text-gray-100 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:my-3
                  [&_h3]:text-gray-900 [&_h3]:dark:text-white [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3
                  [&_p]:text-gray-700 [&_p]:dark:text-gray-300 [&_p]:text-sm [&_p]:my-3 [&_p]:leading-relaxed
                  [&_ul]:my-3 [&_ul]:pl-6 [&_ul]:list-disc [&_ul]:space-y-1.5
                  [&_li]:text-gray-600 [&_li]:dark:text-gray-400 [&_li]:text-sm
                  [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic
                  [&_a]:text-blue-500 [&_a]:hover:text-blue-600 [&_a]:underline
                  [&_img]:w-full [&_img]:rounded-lg [&_img]:my-6
                  [&_strong]:font-bold
                  [&_code]:bg-gray-100 [&_code]:dark:bg-gray-700 [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs"
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    const { marked } = require('marked');
                    let html = String(marked.parse(previewTemplate.content));
                    // 處理 {{參數}} 高亮
                    html = html.replace(/{{([^}]+)}}/g, '<span style="background-color: rgba(255, 116, 0, 0.2); color: #FF7400; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-weight: 600; font-style: normal;">$1</span>');
                    return html;
                  })()
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTemplate && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setEditingTemplate(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
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
            <div className="p-6">
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

                {/* Industry Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Industry Tags
                  </label>
                  <input
                    type="text"
                    value={editingTemplate.industry_tags.join(', ')}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, industry_tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                    placeholder="Tech, SaaS, Startup"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Use Cases */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Use Cases
                  </label>
                  <textarea
                    value={editingTemplate.use_cases.join('\n')}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, use_cases: e.target.value.split('\n').filter(t => t.trim()) })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Includes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    What's Included
                  </label>
                  <textarea
                    value={editingTemplate.includes.join('\n')}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, includes: e.target.value.split('\n').filter(t => t.trim()) })}
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
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Use Markdown syntax and {'{{param}}'} for placeholders
                  </p>
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

      {/* New Template Modal */}
      {showNewModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowNewModal(false)}
        >
          <div 
            className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-gray-900 dark:text-white text-[20px] font-bold">
                Create New Template
              </h2>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                  placeholder="e.g. Product Launch"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  rows={3}
                  placeholder="Brief description of the template..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Category & Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Launch">Launch</option>
                    <option value="Finance">Finance</option>
                    <option value="Recognition">Recognition</option>
                    <option value="Event">Event</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Update">Update</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    value={newTemplate.category_color}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category_color: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Industry Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Industry Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newTemplate.industry_tags.join(', ')}
                  onChange={(e) => setNewTemplate({ ...newTemplate, industry_tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                  placeholder="e.g. Tech, SaaS, Startup"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Use Cases */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Use Cases (one per line)
                </label>
                <textarea
                  value={newTemplate.use_cases.join('\n')}
                  onChange={(e) => setNewTemplate({ ...newTemplate, use_cases: e.target.value.split('\n').filter(t => t.trim()) })}
                  rows={3}
                  placeholder="New product launches&#10;Major feature updates&#10;Service announcements"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Includes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  What's Included (one per line)
                </label>
                <textarea
                  value={newTemplate.includes.join('\n')}
                  onChange={(e) => setNewTemplate({ ...newTemplate, includes: e.target.value.split('\n').filter(t => t.trim()) })}
                  rows={3}
                  placeholder="Headline formula&#10;Quote templates&#10;Media contact format"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Content (Markdown) *
                </label>
                <textarea
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  rows={20}
                  placeholder="# Title&#10;## Subtitle&#10;&#10;Content with {{parameters}}..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Use Markdown syntax (# ## ###) and {'{{param}}'} for placeholders
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-end gap-3 sticky bottom-0 bg-white dark:bg-gray-800">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}


import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Mail, Eye, RefreshCw, Loader2, Monitor, Tablet, Smartphone, Maximize } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { API_BASE_URL } from '../../config/api';
import { authenticatedGet } from '../../utils/apiClient';

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  recipient: string;
}

type ViewportSize = 'fullwidth' | 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_SIZES = {
  fullwidth: { width: '100%', label: 'Full Width', icon: Maximize },
  desktop: { width: 700, label: 'Desktop', icon: Monitor },
  tablet: { width: 480, label: 'Tablet', icon: Tablet },
  mobile: { width: 320, label: 'Mobile', icon: Smartphone },
};

export default function AdminEmailPreview() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewportSize, setViewportSize] = useState<ViewportSize>('fullwidth');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await authenticatedGet(`${API_BASE_URL}/admin/email-preview/list`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to load templates');
      }
      
      const data = await response.json();
      
      if (data && data.templates && Array.isArray(data.templates)) {
        setTemplates(data.templates);
        
        // Auto-select first template
        if (data.templates.length > 0) {
          loadPreview(data.templates[0].id);
        }
      }
    } catch (err: any) {
      console.error('Load templates error:', err);
      setError(err.message || 'Failed to load email templates');
    } finally {
      setLoading(false);
    }
  };

  const loadPreview = async (templateId: string) => {
    setPreviewLoading(true);
    setError(null);
    setSelectedTemplate(templateId);
    
    try {
      const response = await authenticatedGet(`${API_BASE_URL}/admin/email-preview/${templateId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load preview: ${response.status}`);
      }
      
      const html = await response.text();
      setPreviewHtml(html);
    } catch (err: any) {
      setError(err.message || 'Failed to load email preview');
      console.error('Preview error:', err);
    } finally {
      setPreviewLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={48} className="text-orange-500 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">Loading email templates...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Email Template Preview
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Preview and review all email templates with sample data
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400 text-sm">
              ❌ {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Template List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
              <h2 className="text-gray-900 dark:text-white text-lg font-semibold mb-4">
                Email Templates
              </h2>
              
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => loadPreview(template.id)}
                    disabled={previewLoading}
                    className={`
                      w-full text-left p-3 rounded-lg transition-all border
                      ${selectedTemplate === template.id 
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 shadow-sm' 
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                      ${previewLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="text-gray-900 dark:text-white text-sm font-semibold mb-1">
                      {template.name}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                      To: {template.recipient}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={() => selectedTemplate && loadPreview(selectedTemplate)}
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm"
                  disabled={!selectedTemplate || previewLoading}
                >
                  <RefreshCw size={14} className="mr-2" />
                  Refresh Preview
                </Button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-600 dark:text-blue-400 text-xs">
                  💡 Templates use sample data for preview
                </p>
              </div>
            </div>
          </div>

          {/* Main - Preview Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
              {/* Preview Header */}
              <div className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-900 dark:text-white text-sm font-semibold">
                      {templates.find(t => t.id === selectedTemplate)?.name || 'Preview'}
                    </span>
                  </div>
                  
                  {previewLoading && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                      <Loader2 size={14} className="animate-spin" />
                      Loading...
                    </div>
                  )}
                </div>

                {/* Viewport Size Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400 text-xs font-medium mr-2">
                    Viewport:
                  </span>
                  {(Object.keys(VIEWPORT_SIZES) as ViewportSize[]).map((size) => {
                    const { label, icon: Icon } = VIEWPORT_SIZES[size];
                    return (
                      <button
                        key={size}
                        onClick={() => setViewportSize(size)}
                        className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                          ${viewportSize === size
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                          }
                        `}
                      >
                        <Icon size={14} />
                        {label}
                      </button>
                    );
                  })}
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                    {viewportSize === 'fullwidth' 
                      ? '(Full Width)' 
                      : `(${VIEWPORT_SIZES[viewportSize].width}px)`
                    }
                  </span>
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-[600px] flex items-center justify-center">
                {previewHtml ? (
                  <div 
                    className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
                    style={viewportSize === 'fullwidth' 
                      ? { width: '100%' }
                      : { 
                          width: `${VIEWPORT_SIZES[viewportSize].width}px`,
                          maxWidth: '100%'
                        }
                    }
                  >
                    <iframe
                      srcDoc={previewHtml}
                      className="w-full h-[700px] border-0"
                      title="Email Preview"
                      sandbox="allow-same-origin"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[600px]">
                    <div className="text-center">
                      <Mail className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Select a template to preview
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Template Info */}
            {selectedTemplate && (
              <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
                <h3 className="text-gray-900 dark:text-white text-sm font-semibold mb-3">
                  Template Information
                </h3>
                <div className="text-gray-600 dark:text-gray-400 text-sm space-y-2">
                  <div>
                    <span className="text-gray-500 dark:text-gray-500">Description:</span>{' '}
                    {templates.find(t => t.id === selectedTemplate)?.description}
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-500">Recipient:</span>{' '}
                    {templates.find(t => t.id === selectedTemplate)?.recipient}
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-500">Template File:</span>{' '}
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-orange-600 dark:text-orange-400 text-xs">
                      app/templates/emails/{selectedTemplate}/*.html
                    </code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

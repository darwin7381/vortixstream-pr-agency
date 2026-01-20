import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Mail, Eye, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { authenticatedGet } from '../../utils/apiClient';

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  recipient: string;
}

export default function AdminEmailPreview() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      console.log('Loading templates...');
      const data = await authenticatedGet('/api/admin/email-preview/list');
      console.log('Templates loaded:', data);
      
      if (data && data.templates && Array.isArray(data.templates)) {
        setTemplates(data.templates);
        
        // Auto-select first template
        if (data.templates.length > 0) {
          loadPreview(data.templates[0].id);
        }
      } else {
        console.error('Invalid response:', data);
        setError(`Invalid response format: ${JSON.stringify(data)}`);
      }
    } catch (err: any) {
      console.error('Load templates error:', err);
      setError(err.message || 'Failed to load email templates. Check console for details.');
    }
  };

  const loadPreview = async (templateId: string) => {
    setLoading(true);
    setError(null);
    setSelectedTemplate(templateId);
    
    try {
      // Use fetch directly for HTML response (authenticatedGet expects JSON)
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/admin/email-preview/${templateId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to load preview');
      
      const html = await response.text();
      setPreviewHtml(html);
    } catch (err) {
      setError('Failed to load email preview');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-8 h-8 text-[#FF7400]" />
            <h1 
              className="text-white text-[32px] font-bold"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Email Template Preview
            </h1>
          </div>
          <p className="text-white/60 text-[16px] font-sans">
            Preview and review all email templates with sample data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Template List */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h2 className="text-white text-[16px] font-sans font-semibold mb-4">
                Email Templates
              </h2>
              
              <div className="space-y-2">
                {Array.isArray(templates) && templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => loadPreview(template.id)}
                    className={`
                      w-full text-left p-3 rounded-lg transition-all
                      ${selectedTemplate === template.id 
                        ? 'bg-[#FF7400]/20 border-2 border-[#FF7400]' 
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }
                    `}
                  >
                    <div className="text-white text-[14px] font-sans font-semibold mb-1">
                      {template.name}
                    </div>
                    <div className="text-white/60 text-[12px] font-sans">
                      To: {template.recipient}
                    </div>
                  </button>
                ))}
              </div>

              {(!templates || templates.length === 0) && !error && (
                <div className="text-white/40 text-[13px] text-center py-4">
                  Loading templates...
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/10">
                <Button
                  onClick={() => selectedTemplate && loadPreview(selectedTemplate)}
                  className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all text-[13px]"
                  disabled={!selectedTemplate || loading}
                >
                  <RefreshCw size={14} className="mr-2" />
                  Refresh Preview
                </Button>
              </div>

              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 text-[12px] font-sans">
                  💡 Templates are loaded with sample data for preview purposes
                </p>
              </div>
            </div>
          </div>

          {/* Main - Preview Area */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              {/* Preview Header */}
              <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#FF7400]" />
                  <span className="text-white text-[14px] font-sans font-semibold">
                    {templates.find(t => t.id === selectedTemplate)?.name || 'Preview'}
                  </span>
                </div>
                
                {loading && (
                  <div className="flex items-center gap-2 text-white/60 text-[13px]">
                    <RefreshCw size={14} className="animate-spin" />
                    Loading...
                  </div>
                )}
              </div>

              {/* Preview Content */}
              <div className="p-6 bg-white min-h-[600px]">
                {error ? (
                  <div className="text-center py-12">
                    <div className="text-red-500 text-[16px] mb-4">
                      ❌ {error}
                    </div>
                    <Button
                      onClick={() => selectedTemplate && loadPreview(selectedTemplate)}
                      className="bg-[#FF7400] text-white hover:bg-[#FF7400]/90"
                    >
                      Retry
                    </Button>
                  </div>
                ) : previewHtml ? (
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full h-[800px] border-0"
                    title="Email Preview"
                  />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Select a template to preview
                  </div>
                )}
              </div>
            </div>

            {/* Template Info */}
            {selectedTemplate && (
              <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white text-[14px] font-sans font-semibold mb-2">
                  Template Information
                </h3>
                <div className="text-white/70 text-[13px] font-sans space-y-1">
                  <p>
                    <span className="text-white/50">Description:</span>{' '}
                    {templates.find(t => t.id === selectedTemplate)?.description}
                  </p>
                  <p>
                    <span className="text-white/50">Recipient:</span>{' '}
                    {templates.find(t => t.id === selectedTemplate)?.recipient}
                  </p>
                  <p>
                    <span className="text-white/50">Template File:</span>{' '}
                    <code className="bg-white/10 px-2 py-0.5 rounded text-[#FF7400]">
                      app/templates/emails/{selectedTemplate}/*.html
                    </code>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

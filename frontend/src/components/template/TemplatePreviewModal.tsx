import { useState } from 'react';
import { X, Mail, Sparkles, FileText, Loader2 } from 'lucide-react';
import { marked } from 'marked';
import { PRTemplate, templateAPI } from '../../api/templateClient';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/useAuth';
import EmailLoginModal from './EmailLoginModal';

interface TemplatePreviewModalProps {
  template: PRTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (template: PRTemplate) => void;
}

export default function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onDownload
}: TemplatePreviewModalProps) {
  const { user, loginWithGoogle } = useAuth();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleEmailToMe = async () => {
    if (user && template) {
      // User is logged in - send directly
      setIsSendingEmail(true);
      try {
        const response = await templateAPI.requestEmail(template.id, { email: user.email });
        alert(response.message);
        console.log('✅ Email sent:', response);
      } catch (error) {
        console.error('❌ Failed to send email:', error);
        alert('Failed to send email. Please try again.');
      } finally {
        setIsSendingEmail(false);
      }
    } else {
      // User not logged in - show email/login modal
      setShowEmailModal(true);
    }
  };

  const handleEmailSubmit = async (email: string) => {
    if (!template) return;
    
    try {
      const response = await templateAPI.requestEmail(template.id, { email });
      console.log('✅ Email sent:', response);
      alert(response.message);
      setShowEmailModal(false);
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    // Use the same Google login method as LoginPage
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login failed:', error);
      alert('Google login failed. Please try again.');
    }
  };

  const handleOtherLogin = () => {
    // Close current modals and navigate to login page
    setShowEmailModal(false);
    onClose();
    window.location.href = '/login';
  };

  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-white text-[24px] md:text-[28px] font-sans font-bold">
                {template.title}
              </h2>
              <span
                className="text-[12px] font-sans font-semibold px-3 py-1 rounded-full border"
                style={{
                  color: template.category_color,
                  backgroundColor: `${template.category_color}20`,
                  borderColor: `${template.category_color}40`
                }}
              >
                {template.category}
              </span>
            </div>
            <p className="text-white/70 text-[14px] font-sans">
              {template.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            aria-label="Close preview"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Template Content Preview */}
          <div>
            <h3 className="text-white text-[18px] font-sans font-bold mb-3 flex items-center gap-2">
              <FileText size={20} className="text-[#FF7400]" />
              Template Content Preview
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div 
                className="markdown-preview"
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    // 1. 用標準 marked 解析 Markdown → HTML（強制同步）
                    marked.setOptions({ async: false });
                    const html = String(marked.parse(template.content));
                    
                    // 2. 處理 {{參數}} 高亮
                    const processed = html.replace(/{{([^}]+)}}/g, '<span class="bg-[#FF7400]/20 text-[#FF7400] px-1.5 py-0.5 rounded font-semibold not-italic">$1</span>');
                    
                    return processed;
                  })()
                }}
              />
              
              <style>{`
                .markdown-preview {
                  color: rgba(255, 255, 255, 0.8);
                  font-size: 14px;
                  line-height: 1.6;
                }
                .markdown-preview h1 {
                  font-size: 24px;
                  font-weight: bold;
                  margin-top: 1rem;
                  margin-bottom: 0.75rem;
                  color: white;
                }
                .markdown-preview h2 {
                  font-size: 18px;
                  font-weight: 600;
                  margin-bottom: 1rem;
                  color: rgba(255, 255, 255, 0.9);
                }
                .markdown-preview h3 {
                  font-size: 16px;
                  font-weight: bold;
                  margin-top: 1.5rem;
                  margin-bottom: 0.75rem;
                  color: white;
                }
                .markdown-preview p {
                  margin-top: 0.75rem;
                  margin-bottom: 0.75rem;
                }
                .markdown-preview ul {
                  margin-top: 0.75rem;
                  margin-bottom: 0.75rem;
                  padding-left: 1.5rem;
                  list-style-type: disc;
                }
                .markdown-preview li {
                  margin-bottom: 0.375rem;
                  color: rgba(255, 255, 255, 0.7);
                }
                .markdown-preview blockquote {
                  border-left: 4px solid #FF7400;
                  padding-left: 1rem;
                  margin: 1rem 0;
                  font-style: italic;
                  color: rgba(255, 255, 255, 0.85);
                }
                .markdown-preview a {
                  color: #3B82F6;
                  text-decoration: underline;
                }
                .markdown-preview a:hover {
                  color: #60A5FA;
                }
                .markdown-preview img {
                  width: 100%;
                  border-radius: 0.5rem;
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  margin: 1.5rem 0;
                }
                .markdown-preview strong {
                  font-weight: bold;
                  color: white;
                }
                .markdown-preview em {
                  font-style: italic;
                }
                .markdown-preview code {
                  background-color: rgba(255, 255, 255, 0.1);
                  padding: 0.125rem 0.5rem;
                  border-radius: 0.25rem;
                  font-size: 13px;
                }
              `}</style>
            </div>
          </div>

          {/* What's Included */}
          <div>
            <h3 className="text-white text-[18px] font-sans font-bold mb-3">
              📌 What's Included
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {template.includes.map((item: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-white/70 text-[14px] font-sans"
                >
                  <span className="text-[#FF7400] mt-1">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div>
            <h3 className="text-white text-[18px] font-sans font-bold mb-3">
              💼 Use Cases
            </h3>
            <div className="space-y-2">
              {template.use_cases.map((useCase: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-white/70 text-[14px] font-sans"
                >
                  <span className="w-1.5 h-1.5 bg-[#FF7400] rounded-full" />
                  {useCase}
                </div>
              ))}
            </div>
          </div>

          {/* Industry Tags */}
          {template.industry_tags.length > 0 && (
            <div>
              <h3 className="text-white text-[18px] font-sans font-bold mb-3">
                🏢 Industries
              </h3>
              <div className="flex flex-wrap gap-2">
                {template.industry_tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="text-[12px] font-sans text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="bg-gradient-to-r from-[#FF7400]/10 to-[#1D3557]/10 border border-[#FF7400]/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-white/70 text-[14px] font-sans">
                <span className="text-[#FF7400] font-bold">{template.download_count.toLocaleString()}</span> people have used this template
              </div>
              <div className="text-white/60 text-[12px] font-sans">
                🔥 Popular
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-black/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Email to Me Button */}
            <Button
              onClick={handleEmailToMe}
              disabled={isSendingEmail}
              className="bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/30 transition-all h-12 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingEmail ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={18} className="mr-2" />
                  {user ? 'Email to Me' : 'Get Template via Email'}
                </>
              )}
            </Button>

            {/* Use Template Button */}
            <Button
              onClick={() => onDownload(template)}
              className="bg-gradient-to-r from-[#FF7400] to-[#FF7400]/80 text-white border border-[#FF7400] hover:shadow-[0_8px_25px_rgba(255,116,0,0.3)] transition-all h-12"
            >
              <Sparkles size={18} className="mr-2" />
              Use Template
            </Button>
          </div>

          {/* Info Text */}
          <div className="mt-4 text-center">
            <p className="text-white/50 text-[12px] font-sans">
              {user ? (
                <>Will be sent to <span className="text-[#FF7400]">{user.email}</span></>
              ) : (
                <>No account required • Instant delivery</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Email/Login Modal */}
      <EmailLoginModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        templateTitle={template.title}
        onEmailSubmit={handleEmailSubmit}
        onGoogleLogin={handleGoogleLogin}
        onOtherLogin={handleOtherLogin}
      />
    </div>
  );
}

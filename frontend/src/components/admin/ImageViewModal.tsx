import { useState } from 'react';
import { X, Edit2, Check, Copy, ExternalLink, Trash2 } from 'lucide-react';

interface MediaFile {
  id: number;
  filename: string;
  original_filename: string;
  file_key: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  folder: string;
  alt_text: string | null;
  caption: string | null;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  width: number | null;
  height: number | null;
}

interface ImageViewModalProps {
  file: MediaFile | null;
  onClose: () => void;
  onDelete: (file: MediaFile) => void;
  onUpdate: (file: MediaFile, data: { alt_text: string; caption: string }) => void;
  onCopyUrl: (url: string) => void;
}

export default function ImageViewModal({ file, onClose, onDelete, onUpdate, onCopyUrl }: ImageViewModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ alt_text: '', caption: '' });

  if (!file) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      alt_text: file.alt_text || '',
      caption: file.caption || '',
    });
  };

  const handleSave = () => {
    onUpdate(file, editForm);
    setIsEditing(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 左側：圖片預覽 */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-200 dark:bg-gray-900">
          <div className="relative inline-block"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              backgroundColor: '#f3f4f6'
            }}
          >
            <img
              src={file.file_url}
              alt={file.alt_text || file.original_filename}
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>
        </div>

        {/* 右側：資訊和操作 */}
        <div className="w-96 bg-white dark:bg-gray-800 flex flex-col">
          {/* 標題列 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">圖片資訊</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors"
              title="關閉"
            >
              <X size={20} />
            </button>
          </div>

          {/* 資訊區域 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* URL - 最上方最重要 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">圖片 URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={file.file_url}
                  readOnly
                  className="flex-1 text-xs px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg font-mono"
                />
                <button
                  onClick={() => onCopyUrl(file.file_url)}
                  className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                  title="複製 URL"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">檔案名稱</label>
              <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg break-all">
                {file.original_filename}
              </p>
            </div>

            <div>
              <label htmlFor="alt-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alt Text
              </label>
              {isEditing ? (
                <input
                  id="alt-text"
                  type="text"
                  value={editForm.alt_text}
                  onChange={(e) => setEditForm({ ...editForm, alt_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="圖片描述"
                />
              ) : (
                <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg min-h-[38px]">
                  {file.alt_text || <span className="text-gray-400 dark:text-gray-500">（未設定）</span>}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                說明
              </label>
              {isEditing ? (
                <textarea
                  id="caption"
                  value={editForm.caption}
                  onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="圖片說明"
                />
              ) : (
                <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg min-h-[76px]">
                  {file.caption || <span className="text-gray-400 dark:text-gray-500">（未設定）</span>}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">資料夾</label>
                <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg">
                  {file.folder}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">檔案大小</label>
                <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg">
                  {formatFileSize(file.file_size)}
                </p>
              </div>
            </div>

            {file.width && file.height && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">圖片尺寸</label>
                <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg">
                  {file.width} × {file.height} 像素
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">上傳時間</label>
              <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg">
                {new Date(file.created_at).toLocaleString('zh-TW')}
              </p>
            </div>
          </div>

          {/* 操作按鈕區域 */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check size={18} />
                  儲存
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={handleEdit}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Edit2 size={18} />
                編輯資訊
              </button>
            )}

            <button
              onClick={() => window.open(file.file_url, '_blank')}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ExternalLink size={18} />
              在新分頁開啟
            </button>

            <button
              onClick={() => onDelete(file)}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={18} />
              刪除圖片
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


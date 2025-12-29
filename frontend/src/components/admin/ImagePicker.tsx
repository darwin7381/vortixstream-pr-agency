import { useState, useEffect } from 'react';
import { X, Upload, Search, Check, Folder } from 'lucide-react';

interface MediaFile {
  id: number;
  filename: string;
  original_filename: string;
  file_url: string;
  file_size: number;
  folder: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
}

interface ImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentUrl?: string;
  defaultFolder?: string; // 預設資料夾，但可切換
}

import { ADMIN_API } from '../../config/api';

export default function ImagePicker({ isOpen, onClose, onSelect, currentUrl, defaultFolder }: ImagePickerProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrl, setSelectedUrl] = useState(currentUrl || '');
  const [currentFolder, setCurrentFolder] = useState(defaultFolder || 'all');

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, currentFolder]);

  const fetchData = async () => {
    try {
      const [filesData, foldersData] = await Promise.all([
        fetch(`${ADMIN_API}/media/files?${currentFolder !== 'all' ? `folder=${currentFolder}&` : ''}limit=200`).then(r => r.json()),
        fetch(`${ADMIN_API}/media/folders`).then(r => r.json()),
      ]);
      setFiles(filesData.filter((f: MediaFile) => f.filename !== '.keep'));
      setFolders(foldersData);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    setUploading(true);
    
    try {
      const targetFolder = currentFolder !== 'all' ? currentFolder : (defaultFolder || 'uploads');
      
      for (const file of Array.from(selectedFiles)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', targetFolder);
        
        await fetch(`${ADMIN_API}/media/upload`, {
          method: 'POST',
          body: formData,
        });
      }
      
      fetchData();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('上傳失敗');
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  const filteredFiles = files.filter(file => 
    file.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (file.alt_text && file.alt_text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 標題列 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">選擇圖片</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {filteredFiles.length} 個檔案可用
              {currentFolder !== 'all' && ` · 資料夾：${currentFolder}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 工具列 */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            {/* 資料夾選擇 */}
            <div className="flex items-center gap-2">
              <Folder size={18} className="text-gray-600 dark:text-gray-400" />
              <select
                value={currentFolder}
                onChange={(e) => setCurrentFolder(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                aria-label="選擇資料夾"
              >
                <option value="all">所有資料夾</option>
                {folders.map((folder) => (
                  <option key={folder.folder} value={folder.folder}>
                    {folder.folder} ({folder.file_count})
                  </option>
                ))}
              </select>
            </div>

            {/* 搜尋 */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜尋檔案名稱..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
              />
            </div>
            
            {/* 上傳按鈕 */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              id="picker-upload"
            />
            
            <label
              htmlFor="picker-upload"
              className={`flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload size={18} />
              {uploading ? '上傳中...' : '上傳圖片'}
            </label>
          </div>
        </div>

        {/* 圖片網格 */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">載入中...</div>
          ) : filteredFiles.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => setSelectedUrl(file.file_url)}
                  className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedUrl === file.file_url
                      ? 'border-orange-600 ring-2 ring-orange-200 dark:ring-orange-900'
                      : 'border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500'
                  }`}
                >
                  {/* 圖片預覽 - 根據比例調整 */}
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-2"
                    style={{
                      backgroundImage: `
                        linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                        linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                        linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
                      `,
                      backgroundSize: '10px 10px',
                      backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                      backgroundColor: '#f3f4f6'
                    }}
                  >
                    <img
                      src={file.file_url}
                      alt={file.alt_text || file.original_filename}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  
                  {selectedUrl === file.file_url && (
                    <div className="absolute top-2 right-2 bg-orange-600 text-white p-1 rounded-full">
                      <Check size={16} />
                    </div>
                  )}
                  
                  {/* 檔案資訊 */}
                  <div className="bg-white dark:bg-gray-900 p-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate" title={file.original_filename}>
                      {file.original_filename}
                    </p>
                    {file.width && file.height && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {file.width} × {file.height}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                {searchTerm ? '沒有找到符合的圖片' : '此資料夾沒有圖片'}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                請切換資料夾或上傳新圖片
              </p>
            </div>
          )}
        </div>

        {/* 底部操作列 */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedUrl && files.find(f => f.file_url === selectedUrl) && (
              <span className="font-medium">
                已選擇：{files.find(f => f.file_url === selectedUrl)?.original_filename}
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              取消
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedUrl}
              className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={18} />
              選擇圖片
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

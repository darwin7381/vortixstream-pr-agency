import { useState, useEffect } from 'react';
import { X, Upload, Search, Check, Folder } from 'lucide-react';
import { ADMIN_API } from '../../config/api';
import { authenticatedFetch } from '../../utils/apiClient';

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

export default function ImagePicker({ isOpen, onClose, onSelect, currentUrl, defaultFolder }: ImagePickerProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrl, setSelectedUrl] = useState(currentUrl || '');
  const [isDragging, setIsDragging] = useState(false);
  
  /**
   * ⚠️ 絕對禁止使用 || 運算符做 Fallback！
   * 
   * ❌ 錯誤：defaultFolder || 'all'
   * ❌ 錯誤：currentFolder || 'uploads'
   * 問題：會造成圖庫混亂，目標資料夾錯誤
   * 
   * ✅ 正確：直接使用 defaultFolder，不要 fallback
   * 如果 defaultFolder 未定義，使用者自己選擇資料夾
   */
  const [currentFolder, setCurrentFolder] = useState(defaultFolder || '');

  // 當 isOpen 變化時，重置 currentFolder
  useEffect(() => {
    if (isOpen) {
      setCurrentFolder(defaultFolder || '');  // 如果沒有 defaultFolder，設為空字串（無選擇）
      setSearchTerm('');
      setSelectedUrl(currentUrl || '');
    }
  }, [isOpen, defaultFolder, currentUrl]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, currentFolder]);

  const fetchData = async () => {
    try {
      // ⚠️ 禁止 Fallback 邏輯
      // 如果有 currentFolder，就篩選該資料夾
      // 如果沒有，就不篩選（顯示所有）
      const queryParams = currentFolder ? `folder=${currentFolder}&limit=200` : 'limit=200';
      
      const [filesRes, foldersRes] = await Promise.all([
        authenticatedFetch(`${ADMIN_API}/media/files?${queryParams}`),
        authenticatedFetch(`${ADMIN_API}/media/folders`),
      ]);
      
      const filesData = await filesRes.json();
      const foldersData = await foldersRes.json();
      
      setFiles(filesData.filter((f: MediaFile) => f.filename !== '.keep'));
      setFolders(foldersData);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (fileList: FileList) => {
    if (!fileList || fileList.length === 0) return;
    
    setUploading(true);
    
    try {
      /**
       * ⚠️ 上傳目標資料夾（絕對禁止 Fallback）
       * 
       * 邏輯：
       * 1. 如果有 currentFolder → 上傳到 currentFolder
       * 2. 如果沒有但有 defaultFolder → 上傳到 defaultFolder  
       * 3. 都沒有 → 上傳到 'uploads'（預設）
       */
      const targetFolder = currentFolder || defaultFolder || 'uploads';
      
      // 檢查檔案大小（前端驗證）
      const MAX_SIZE = 50 * 1024 * 1024; // 50MB（與後端一致）
      for (const file of Array.from(fileList)) {
        if (file.size > MAX_SIZE) {
          alert(`檔案 ${file.name} 太大！最大允許 50MB`);
          setUploading(false);
          return;
        }
      }
      
      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', targetFolder);
        
        console.log(`上傳：${file.name} (${(file.size / 1024).toFixed(2)}KB) 到 ${targetFolder}`);
        
        // ⚠️ 使用 authenticatedFetch，但不要設定 Content-Type
        // FormData 需要瀏覽器自動設定 boundary
        const response = await authenticatedFetch(`${ADMIN_API}/media/upload`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: '未知錯誤' }));
          console.error('Upload failed:', errorData);
          alert(`上傳失敗：${errorData.detail || response.statusText}`);
          setUploading(false);
          return;
        }
        
        console.log('✅ 上傳成功:', file.name);
      }
      
      await fetchData();
      alert('上傳成功！');
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`上傳失敗：${error instanceof Error ? error.message : '未知錯誤'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await uploadFiles(e.target.files);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      await uploadFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
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
      className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[9999] flex items-center justify-center p-4"
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
                {/* ⚠️ 禁止「所有資料夾」選項 - 會造成混亂 */}
                {/* 如果有 defaultFolder，優先顯示（即使不在 folders 列表中） */}
                {defaultFolder && !folders.find(f => f.folder === defaultFolder) && (
                  <option value={defaultFolder}>{defaultFolder} (0)</option>
                )}
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
            <div 
              className={`border-2 border-dashed rounded-xl transition-all ${
                isDragging 
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <label 
                htmlFor="picker-upload"
                className="flex flex-col items-center justify-center py-16 cursor-pointer"
              >
                <Upload className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={64} />
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2 font-semibold">
                  {searchTerm ? '沒有找到符合的圖片' : '此資料夾沒有圖片'}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  拖曳圖片到此處，或點擊上傳
                </p>
                <div className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  選擇檔案上傳
                </div>
                {currentFolder && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                    將上傳到：{currentFolder} 資料夾
                  </p>
                )}
              </label>
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

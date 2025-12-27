import { useRef } from 'react';
import { Upload, FolderPlus } from 'lucide-react';

interface MediaUploadZoneProps {
  isDragging: boolean;
  uploading: boolean;
  uploadFolder: string;
  folders: any[];
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFolderChange: (folder: string) => void;
  onNewFolder: () => void;
}

export default function MediaUploadZone({
  isDragging,
  uploading,
  uploadFolder,
  folders,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  onFolderChange,
  onNewFolder,
}: MediaUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-dashed p-8 mb-6 transition-all ${
        isDragging
          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      }`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-lg ${isDragging ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
          <Upload size={32} className={isDragging ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isDragging ? '放開以上傳' : '拖曳圖片到這裡'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            支援 JPG, PNG, GIF, WebP, SVG · 最大 10MB · 可多選
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">上傳到：</label>
        
        <select
          value={uploadFolder}
          onChange={(e) => onFolderChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
          aria-label="選擇上傳資料夾"
        >
          <option value="uploads">一般上傳</option>
          <option value="blog">Blog 文章</option>
          <option value="pricing">Pricing 方案</option>
          <option value="pr-packages">PR Packages</option>
          <option value="logos">Logo</option>
          {folders
            .filter(f => !['uploads', 'blog', 'pricing', 'pr-packages', 'logos'].includes(f.folder))
            .map(f => (
              <option key={f.folder} value={f.folder}>
                {f.folder} ({f.file_count})
              </option>
            ))
          }
        </select>
        
        <button
          onClick={onNewFolder}
          className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-700 transition-colors"
        >
          <FolderPlus size={18} />
          新建資料夾
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFileSelect}
          className="hidden"
          id="file-upload"
        />
        
        <label
          htmlFor="file-upload"
          className={`flex items-center gap-2 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Upload size={18} />
          {uploading ? '上傳中...' : '或點擊選擇'}
        </label>
      </div>

    </div>
  );
}


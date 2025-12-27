import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import MediaUploadZone from '../../components/admin/MediaUploadZone';
import ImageViewModal from '../../components/admin/ImageViewModal';
import { 
  Search, Trash2, Grid, List as ListIcon, Copy, ZoomIn, RefreshCw
} from 'lucide-react';

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

const ADMIN_API = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/admin`;

export default function AdminMedia() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // 篩選和搜尋
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // 放大檢視
  const [viewingImage, setViewingImage] = useState<MediaFile | null>(null);
  
  // 上傳設定
  const [uploadFolder, setUploadFolder] = useState('uploads');
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedFolder]);

  const fetchData = async () => {
    try {
      const [filesData, foldersData, statsData] = await Promise.all([
        fetch(`${ADMIN_API}/media/files?folder=${selectedFolder !== 'all' ? selectedFolder : ''}&limit=200`).then(r => r.json()),
        fetch(`${ADMIN_API}/media/folders`).then(r => r.json()),
        fetch(`${ADMIN_API}/media/stats`).then(r => r.json()),
      ]);
      
      setFiles(filesData);
      setFolders(foldersData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  // 拖曳上傳處理
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (droppedFiles.length > 0) {
      await uploadFiles(droppedFiles);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    await uploadFiles(Array.from(selectedFiles));
  };

  const uploadFiles = async (filesToUpload: File[]) => {
    setUploading(true);
    
    try {
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', uploadFolder);
        
        await fetch(`${ADMIN_API}/media/upload`, {
          method: 'POST',
          body: formData,
        });
      }
      
      alert(`成功上傳 ${filesToUpload.length} 個檔案到「${uploadFolder}」資料夾`);
      fetchData();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('上傳失敗');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (confirm(`確定要刪除「${file.original_filename}」嗎？`)) {
      try {
        await fetch(`${ADMIN_API}/media/files/${file.id}`, {
          method: 'DELETE',
        });
        alert('檔案已刪除');
        setViewingImage(null);
        fetchData();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('刪除失敗');
      }
    }
  };

  const handleUpdate = async (file: MediaFile, data: { alt_text: string; caption: string }) => {
    try {
      await fetch(`${ADMIN_API}/media/files/${file.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      alert('資訊已更新');
      fetchData();
      // 更新當前查看的圖片
      if (viewingImage && viewingImage.id === file.id) {
        setViewingImage({
          ...viewingImage,
          alt_text: data.alt_text,
          caption: data.caption,
        });
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('更新失敗');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL 已複製到剪貼板');
  };

  const handleSyncFromR2 = async () => {
    if (!confirm('確定要掃描 R2 並匯入檔案嗎？已存在的檔案會被跳過。')) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`${ADMIN_API}/media/sync-from-r2`, {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(`同步完成！\n已匯入：${result.imported} 個檔案\n已跳過：${result.skipped} 個（已存在）\n總計：${result.total} 個檔案`);
        fetchData();
      } else {
        throw new Error(result.detail || '同步失敗');
      }
    } catch (error: any) {
      console.error('Sync failed:', error);
      alert(`同步失敗：${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    const folderName = newFolderName.trim();
    
    try {
      const formData = new FormData();
      formData.append('folder_name', folderName);
      
      const response = await fetch(`${ADMIN_API}/media/folders`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || '創建失敗');
      }
      
      setUploadFolder(folderName);
      setNewFolderName('');
      setShowNewFolderDialog(false);
      alert(`資料夾「${folderName}」已創建並設為上傳目標！`);
      fetchData(); // 重新載入資料夾列表
    } catch (error: any) {
      console.error('Failed to create folder:', error);
      alert(error.message || '創建資料夾失敗');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const filteredFiles = files.filter(file => {
    // 過濾掉 .keep 檔案
    if (file.filename === '.keep') return false;
    
    if (searchTerm) {
      return file.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
             (file.alt_text && file.alt_text.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return true;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600 dark:text-gray-400">載入中...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* 標題和統計 */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">媒體圖庫</h1>
            <p className="text-gray-600 dark:text-gray-400">
              共 {stats?.total_files || 0} 個檔案 · {formatFileSize(stats?.total_size || 0)} · {folders.length} 個資料夾
            </p>
          </div>
          
          <button
            onClick={handleSyncFromR2}
            disabled={loading || uploading}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={20} />
            掃描 R2 並匯入
          </button>
        </div>

        {/* 拖曳上傳區域 */}
        <MediaUploadZone
          isDragging={isDragging}
          uploading={uploading}
          uploadFolder={uploadFolder}
          folders={folders}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
          onFolderChange={setUploadFolder}
          onNewFolder={() => setShowNewFolderDialog(true)}
        />

        {/* 新建資料夾對話框 */}
        {showNewFolderDialog && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowNewFolderDialog(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">新建資料夾</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                資料夾會立即創建並出現在列表中。建議使用英文小寫和連字號（例如：my-folder）。
              </p>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="資料夾名稱（例如：banners）"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg mb-4 focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                aria-label="新資料夾名稱"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCreateFolder}
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  disabled={!newFolderName.trim()}
                >
                  創建資料夾
                </button>
                <button
                  onClick={() => {
                    setShowNewFolderDialog(false);
                    setNewFolderName('');
                  }}
                  className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                  type="button"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 篩選和搜尋 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedFolder('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedFolder === 'all'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                全部 ({stats?.total_files || 0})
              </button>
              {folders.map((folder) => (
                <button
                  key={folder.folder}
                  onClick={() => setSelectedFolder(folder.folder)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedFolder === folder.folder
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {folder.folder} ({folder.file_count})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜尋檔案名稱..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg w-64"
                />
              </div>
              
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                  title="網格檢視"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                  title="列表檢視"
                >
                  <ListIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 圖片展示 - 網格檢視 */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="aspect-square bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                  <img
                    src={file.file_url}
                    alt={file.alt_text || file.original_filename}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setViewingImage(file)}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                    title="放大查看"
                  >
                    <ZoomIn size={18} />
                  </button>
                  <button
                    onClick={() => handleCopyUrl(file.file_url)}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                    title="複製 URL"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(file)}
                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                    title="刪除"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={file.original_filename}>
                    {file.original_filename}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatFileSize(file.file_size)} · {file.folder}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 列表檢視
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">預覽</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">檔名</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">資料夾</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">大小</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">上傳時間</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <img
                        src={file.file_url}
                        alt={file.alt_text || file.original_filename}
                        className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:ring-2 hover:ring-orange-500"
                        onClick={() => setViewingImage(file)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{file.original_filename}</p>
                      {file.alt_text && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{file.alt_text}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded">
                        {file.folder}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatFileSize(file.file_size)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(file.created_at).toLocaleString('zh-TW')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingImage(file)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg"
                          title="放大查看"
                        >
                          <ZoomIn size={18} />
                        </button>
                        <button
                          onClick={() => handleCopyUrl(file.file_url)}
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg"
                          title="複製 URL"
                        >
                          <Copy size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(file)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                          title="刪除"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredFiles.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Search className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              {searchTerm ? '沒有找到符合的檔案' : '此資料夾還沒有圖片'}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              拖曳圖片到上方區域或點擊按鈕上傳
            </p>
          </div>
        )}

        {/* 圖片放大查看彈窗（使用獨立組件） */}
        <ImageViewModal
          file={viewingImage}
          onClose={() => setViewingImage(null)}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onCopyUrl={handleCopyUrl}
        />
      </div>
    </AdminLayout>
  );
}

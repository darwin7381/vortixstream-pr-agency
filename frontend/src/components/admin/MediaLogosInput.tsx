import { useState } from 'react';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import ImagePicker from './ImagePicker';

interface MediaLogo {
  url: string;
  name: string;
}

interface MediaLogosInputProps {
  logos: MediaLogo[];
  onChange: (logos: MediaLogo[]) => void;
  folder?: string;
}

/**
 * Media Logos 輸入組件（優化版）
 * 
 * - 移除手動輸入 URL（只能從圖庫選擇）
 - 更大的 Logo 預覽（適合橫版 logo）
 * - 簡潔的 UI
 */
export default function MediaLogosInput({ logos, onChange, folder = 'pr-packages' }: MediaLogosInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addLogo = () => {
    onChange([...logos, { url: '', name: '' }]);
  };

  const updateLogo = (index: number, field: 'url' | 'name', value: string) => {
    const newLogos = [...logos];
    newLogos[index][field] = value;
    onChange(newLogos);
  };

  const removeLogo = (index: number) => {
    const newLogos = logos.filter((_, i) => i !== index);
    onChange(newLogos.length > 0 ? newLogos : [{ url: '', name: '' }]);
  };

  const handleSelectImage = (url: string) => {
    if (editingIndex !== null) {
      updateLogo(editingIndex, 'url', url);
      setEditingIndex(null);
    }
  };

  const handleOpenPicker = (index: number) => {
    setEditingIndex(index);
    setShowPicker(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">Media Logos</label>
        <button
          type="button"
          onClick={addLogo}
          className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
        >
          <Plus size={16} />
          新增 Logo
        </button>
      </div>

      <div className="space-y-3">
        {logos.map((logo, index) => (
          <div key={index} className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            {/* Logo 預覽 - 更大更清楚 */}
            <div className="w-32 h-16 flex-shrink-0 bg-white rounded border border-gray-300 flex items-center justify-center overflow-hidden"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #f3f4f6 25%, transparent 25%),
                  linear-gradient(-45deg, #f3f4f6 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #f3f4f6 75%),
                  linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)
                `,
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
              }}
            >
              {logo.url ? (
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="max-w-full max-h-full object-contain p-1"
                />
              ) : (
                <ImageIcon size={24} className="text-gray-300" />
              )}
            </div>

            {/* 名稱輸入 */}
            <div className="flex-1">
              <input
                type="text"
                value={logo.name}
                onChange={(e) => updateLogo(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Logo 名稱（例如：TechCrunch）"
              />
              {logo.url && (
                <p className="text-xs text-gray-500 mt-1 truncate" title={logo.url}>
                  {logo.url}
                </p>
              )}
            </div>

            {/* 選擇圖片按鈕 */}
            <button
              type="button"
              onClick={() => handleOpenPicker(index)}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 whitespace-nowrap"
            >
              <ImageIcon size={18} />
              {logo.url ? '更換圖片' : '選擇圖片'}
            </button>

            {/* 刪除按鈕 */}
            {logos.length > 1 && (
              <button
                type="button"
                onClick={() => removeLogo(index)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                title="刪除"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        💡 提示：點擊「選擇圖片」從圖庫選擇或上傳新 Logo
      </p>

      {/* 圖片選擇器 */}
      <ImagePicker
        isOpen={showPicker}
        onClose={() => {
          setShowPicker(false);
          setEditingIndex(null);
        }}
        onSelect={handleSelectImage}
        currentUrl={editingIndex !== null ? logos[editingIndex]?.url : ''}
        defaultFolder={folder}
      />
    </div>
  );
}

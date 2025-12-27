import { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import ImagePicker from './ImagePicker';

interface ImageInputFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  required?: boolean;
  placeholder?: string;
}

/**
 * 統一的圖片輸入欄位組件
 * 
 * 功能：
 * - 顯示當前圖片預覽
 * - 點擊打開圖片選擇器
 * - 圖片選擇器支援：選擇現有圖片、直接上傳新圖片
 * - 可清除圖片
 * - 可手動輸入 URL
 */
export default function ImageInputField({
  label,
  value,
  onChange,
  folder,
  required = false,
  placeholder = '點擊選擇圖片或輸入 URL'
}: ImageInputFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleClear = () => {
    onChange('');
  };

  const handleSelect = (url: string) => {
    onChange(url);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* 圖片預覽 */}
      {value && (
        <div className="relative inline-block mb-3">
          <img
            src={value}
            alt={label}
            className="h-32 w-auto object-contain rounded-lg border border-gray-300 dark:border-gray-600"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
            }}
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 shadow-lg"
            title="清除圖片"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* URL 輸入和選擇器按鈕 */}
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
        >
          <ImageIcon size={18} />
          選擇圖片
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        可以直接輸入 URL，或點擊「選擇圖片」從圖庫選擇/上傳
      </p>

      {/* 圖片選擇器 Modal */}
      <ImagePicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={handleSelect}
        currentUrl={value}
        folder={folder}
      />
    </div>
  );
}


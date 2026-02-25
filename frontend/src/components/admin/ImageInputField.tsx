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
  /** 緊湊模式：URL 輸入和按鈕垂直排列，適合側欄使用 */
  compact?: boolean;
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
  placeholder = '點擊選擇圖片或輸入 URL',
  compact = false,
}: ImageInputFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* 圖片預覽 */}
      {value && (
        <div className="relative mb-3 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
          <img
            src={value}
            alt={label}
            className="w-full h-32 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 shadow"
            title="清除圖片"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* URL 輸入和選擇器按鈕 */}
      <div className={compact ? 'flex flex-col gap-2' : 'flex gap-2'}>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className={`flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm whitespace-nowrap ${compact ? 'w-full' : ''}`}
        >
          <ImageIcon size={16} />
          選擇圖片
        </button>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
        直接貼 URL，或點擊「選擇圖片」從媒體庫選取/上傳
      </p>

      {/* 圖片選擇器 Modal */}
      <ImagePicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(url) => onChange(url)}
        currentUrl={value}
        folder={folder}
      />
    </div>
  );
}


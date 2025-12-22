import React from 'react';
import { MaterialIcon, MATERIAL_ICONS } from './ui/material-icon';

export default function MaterialIconTest() {
  // 常用的檢查標記類型圖標
  const checkIcons = [
    { name: 'check', label: 'check' },
    { name: 'check_circle', label: 'check_circle' },
    { name: 'check_circle_outline', label: 'check_circle_outline' },
    { name: 'done', label: 'done' },
    { name: 'done_all', label: 'done_all' },
    { name: 'task_alt', label: 'task_alt' },
    { name: 'verified', label: 'verified' },
    { name: 'verified_user', label: 'verified_user' },
  ];

  // 其他常用圖標
  const commonIcons = [
    { name: 'home', label: 'home' },
    { name: 'star', label: 'star' },
    { name: 'favorite', label: 'favorite' },
    { name: 'settings', label: 'settings' },
    { name: 'person', label: 'person' },
    { name: 'email', label: 'email' },
    { name: 'phone', label: 'phone' },
    { name: 'location_on', label: 'location_on' },
  ];

  return (
    <div className="bg-black min-h-screen py-12">
      <div className="container-global">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-white text-3xl font-bold mb-4">Material Icons 測試頁面</h1>
            <p className="text-white/80">檢查 Google Material Icons 是否正常載入和顯示</p>
          </div>

          {/* 檢查類圖標 */}
          <div className="mb-12">
            <h2 className="text-white text-xl font-semibold mb-6">檢查標記類圖標 (適合功能列表)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {checkIcons.map((icon) => (
                <div key={icon.name} className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
                  <MaterialIcon 
                    name={icon.name} 
                    size={32} 
                    className="text-[#FF7400] mb-2" 
                  />
                  <div className="text-white/80 text-sm">{icon.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 常用圖標 */}
          <div className="mb-12">
            <h2 className="text-white text-xl font-semibold mb-6">其他常用圖標</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {commonIcons.map((icon) => (
                <div key={icon.name} className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
                  <MaterialIcon 
                    name={icon.name} 
                    size={32} 
                    className="text-white mb-2" 
                  />
                  <div className="text-white/80 text-sm">{icon.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 圖標變體測試 */}
          <div className="mb-12">
            <h2 className="text-white text-xl font-semibold mb-6">圖標變體測試 (star 圖標)</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {(['filled', 'outlined', 'round', 'sharp', 'two-tone'] as const).map((variant) => (
                <div key={variant} className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
                  <MaterialIcon 
                    name="star" 
                    variant={variant}
                    size={32} 
                    className="text-yellow-400 mb-2" 
                  />
                  <div className="text-white/80 text-sm">{variant}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 實際使用範例 */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-6">PublisherPage 中的實際使用</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="space-y-4">
                {[
                  "Easy-to-use publisher dashboard",
                  "Flexible payment options", 
                  "Custom content filtering",
                  "API integration available"
                ].map((feature, index) => (
                  <div key={feature} className="flex items-center gap-4">
                    <MaterialIcon 
                      name="check_circle" 
                      size={16} 
                      className="text-[#FF7400] flex-shrink-0" 
                    />
                    <p className="text-white text-[16px] leading-[1.5]">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 診斷資訊 */}
          <div className="mt-12 bg-gray-900 rounded-xl p-6 border border-white/20">
            <h2 className="text-white text-xl font-semibold mb-4">診斷資訊</h2>
            <div className="space-y-2 text-sm">
              <p className="text-white/80">
                如果上方圖標無法顯示，可能的原因：
              </p>
              <ul className="text-white/60 space-y-1 ml-4">
                <li>• Google Fonts Material Icons 未正確載入</li>
                <li>• 圖標名稱錯誤 (例如 "ev_shadow" 不存在)</li>
                <li>• CSS 樣式衝突</li>
                <li>• 網路連接問題</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
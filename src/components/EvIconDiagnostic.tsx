import React from 'react';
import { MaterialIcon } from './ui/material-icon';

export default function EvIconDiagnostic() {
  // 電動車相關的 Material Icons
  const evIcons = [
    { name: 'ev_shadow', label: 'ev_shadow' },
    { name: 'electric_car', label: 'electric_car' },
    { name: 'electric_bolt', label: 'electric_bolt' },
    { name: 'battery_charging_full', label: 'battery_charging_full' },
    { name: 'power', label: 'power' },
    { name: 'flash_on', label: 'flash_on' },
    { name: 'electrical_services', label: 'electrical_services' },
    { name: 'energy_savings_leaf', label: 'energy_savings_leaf' },
  ];

  // 常用檢查圖標作為對照組
  const checkIcons = [
    { name: 'check', label: 'check' },
    { name: 'check_circle', label: 'check_circle' },
    { name: 'done', label: 'done' },
    { name: 'task_alt', label: 'task_alt' },
  ];

  return (
    <div className="bg-black min-h-screen py-12">
      <div className="container-global">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-white text-4xl font-bold mb-4">🔋 EV Shadow 圖標診斷</h1>
            <p className="text-white/80 text-lg">
              驗證 Google Material Icons 中的 ev_shadow 圖標是否正常顯示
            </p>
          </div>

          {/* ev_shadow 主要測試 */}
          <div className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <h2 className="text-white text-2xl font-semibold mb-6 text-center">🎯 EV Shadow 主要測試</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 不同尺寸 */}
              {[16, 24, 32].map((size) => (
                <div key={size} className="text-center">
                  <div className="bg-white/10 rounded-xl p-6 mb-4 flex items-center justify-center min-h-[120px]">
                    <MaterialIcon 
                      name="ev_shadow" 
                      size={size} 
                      className="text-[#FF7400]" 
                    />
                  </div>
                  <div className="text-white/80">{size}px</div>
                </div>
              ))}
            </div>
          </div>

          {/* 不同變體測試 */}
          <div className="mb-12">
            <h2 className="text-white text-xl font-semibold mb-6">🎨 EV Shadow - 不同變體</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {(['filled', 'outlined', 'round', 'sharp', 'two-tone'] as const).map((variant) => (
                <div key={variant} className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
                  <MaterialIcon 
                    name="ev_shadow" 
                    variant={variant}
                    size={24} 
                    className="text-[#FF7400] mb-2" 
                  />
                  <div className="text-white/80 text-sm">{variant}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 電動車相關圖標 */}
          <div className="mb-12">
            <h2 className="text-white text-xl font-semibold mb-6">⚡ 電動車相關圖標</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {evIcons.map((icon) => (
                <div key={icon.name} className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
                  <MaterialIcon 
                    name={icon.name} 
                    size={24} 
                    className="text-green-400 mb-2" 
                  />
                  <div className="text-white/80 text-xs">{icon.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 對照組 - 常用檢查圖標 */}
          <div className="mb-12">
            <h2 className="text-white text-xl font-semibold mb-6">✅ 對照組 - 檢查圖標</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {checkIcons.map((icon) => (
                <div key={icon.name} className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
                  <MaterialIcon 
                    name={icon.name} 
                    size={24} 
                    className="text-white mb-2" 
                  />
                  <div className="text-white/80 text-xs">{icon.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PublisherPage 實際使用示例 */}
          <div className="mb-12 bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent border border-white/10 rounded-xl p-8">
            <h2 className="text-white text-xl font-semibold mb-6">📋 PublisherPage 實際使用</h2>
            <div className="space-y-4">
              {[
                "Easy-to-use publisher dashboard",
                "Flexible payment options", 
                "Custom content filtering",
                "API integration available"
              ].map((feature, index) => (
                <div key={feature} className="flex items-center gap-4">
                  <MaterialIcon 
                    name="ev_shadow" 
                    size={16} 
                    className="text-white flex-shrink-0" 
                  />
                  <p className="text-white text-[16px] leading-[1.5]">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 原始 HTML 測試 */}
          <div className="bg-gray-900 rounded-xl p-6 border border-white/20">
            <h2 className="text-white text-xl font-semibold mb-4">🔍 原始 HTML 測試</h2>
            <div className="space-y-4">
              <div className="text-white/80 text-sm mb-4">
                如果上方的 MaterialIcon 組件無法顯示 ev_shadow，這裡是原始 HTML span 元素測試：
              </div>
              
              {/* 原始 span 測試 */}
              <div className="flex items-center gap-4 bg-black/50 rounded-lg p-4">
                <span className="material-icons text-[#FF7400]" style={{ fontSize: '24px' }}>
                  ev_shadow
                </span>
                <span className="text-white">原始 HTML span + material-icons 類</span>
              </div>

              {/* 其他變體測試 */}
              <div className="flex items-center gap-4 bg-black/50 rounded-lg p-4">
                <span className="material-icons-outlined text-[#FF7400]" style={{ fontSize: '24px' }}>
                  ev_shadow
                </span>
                <span className="text-white">原始 HTML span + material-icons-outlined 類</span>
              </div>

              <div className="text-white/60 text-xs mt-4">
                <strong>如果原始 HTML 也無法顯示：</strong>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>檢查網路連接是否正常載入 Google Fonts</li>
                  <li>確認 Material Icons 字體檔案是否成功下載</li>
                  <li>可能是瀏覽器快取問題</li>
                  <li>圖標名稱可能需要確認（雖然您提供的截圖顯示確實存在）</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
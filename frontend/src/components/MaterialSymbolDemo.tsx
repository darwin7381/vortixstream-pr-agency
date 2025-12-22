import React from 'react';
import { MaterialSymbol, MATERIAL_SYMBOLS } from './ui/material-symbol';
import { MaterialIcon } from './ui/material-icon';

export default function MaterialSymbolDemo() {
  // Electric Vehicle 相關圖標（Material Symbols）
  const evSymbols = [
    { name: 'ev_shadow', label: 'ev_shadow' },
    { name: 'electric_car', label: 'electric_car' },
    { name: 'electric_bolt', label: 'electric_bolt' },
    { name: 'battery_charging_full', label: 'battery_charging_full' },
    { name: 'energy_savings_leaf', label: 'energy_savings_leaf' },
    { name: 'power', label: 'power' },
    { name: 'flash_on', label: 'flash_on' },
    { name: 'electrical_services', label: 'electrical_services' },
  ];

  // 常用圖標對照（兩個系統都支援）
  const commonIcons = [
    { name: 'home', label: 'home' },
    { name: 'search', label: 'search' },
    { name: 'check_circle', label: 'check_circle' },
    { name: 'star', label: 'star' },
    { name: 'favorite', label: 'favorite' },
    { name: 'settings', label: 'settings' },
  ];

  return (
    <div className="bg-black min-h-screen py-12">
      <div className="container-global">
        <div className="max-w-6xl mx-auto">
          {/* 標題區域 */}
          <div className="text-center mb-12">
            <h1 className="text-white text-4xl font-bold mb-4">
              🔋 Material Symbols vs Material Icons
            </h1>
            <p className="text-white/80 text-lg">
              比較 Google 兩套圖標系統的差異和使用方式
            </p>
            <div className="mt-4 text-[#FF7400] text-sm">
              ev_shadow 圖標屬於 Material Symbols 系統！
            </div>
          </div>

          {/* EV Shadow 主要展示 */}
          <div className="mb-12 bg-gradient-to-br from-[#FF7400]/10 via-transparent to-[#1D3557]/10 rounded-2xl p-8 border border-[#FF7400]/20">
            <h2 className="text-white text-2xl font-semibold mb-6 text-center">
              🎯 EV Shadow 圖標展示
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 不同尺寸 */}
              {[16, 24, 32].map((size) => (
                <div key={size} className="text-center">
                  <div className="bg-black/30 rounded-xl p-6 mb-4 flex items-center justify-center min-h-[100px]">
                    <MaterialSymbol 
                      name="ev_shadow" 
                      variant="outlined"
                      size={size} 
                      className="text-[#FF7400]" 
                    />
                  </div>
                  <div className="text-white/80">{size}px</div>
                </div>
              ))}
            </div>

            {/* 不同變體 */}
            <div className="mt-8">
              <h3 className="text-white text-lg font-medium mb-4 text-center">變體樣式</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['outlined', 'rounded', 'sharp'] as const).map((variant) => (
                  <div key={variant} className="bg-black/30 rounded-lg p-4 text-center">
                    <MaterialSymbol 
                      name="ev_shadow" 
                      variant={variant}
                      size={28} 
                      className="text-[#FF7400] mb-2" 
                    />
                    <div className="text-white/80 text-sm">{variant}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 系統比較 */}
          <div className="mb-12">
            <h2 className="text-white text-2xl font-semibold mb-6 text-center">
              ⚡ 電動車相關圖標 (Material Symbols Only)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {evSymbols.map((icon) => (
                <div key={icon.name} className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
                  <MaterialSymbol 
                    name={icon.name} 
                    variant="outlined"
                    size={28} 
                    className="text-green-400 mb-2" 
                  />
                  <div className="text-white/80 text-xs">{icon.label}</div>
                </div>
              ))}
            </div>
            <div className="text-center text-white/60 text-sm">
              這些圖標只在 Material Symbols 系統中可用，Material Icons 無法顯示
            </div>
          </div>

          {/* 兩個系統對比 */}
          <div className="mb-12">
            <h2 className="text-white text-2xl font-semibold mb-6 text-center">
              🆚 兩個系統對比展示
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Material Symbols */}
              <div className="bg-green-900/20 rounded-xl p-6 border border-green-500/30">
                <h3 className="text-green-400 text-lg font-semibold mb-4 text-center">
                  Material Symbols (新)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {commonIcons.map((icon) => (
                    <div key={icon.name} className="bg-black/30 rounded-lg p-3 text-center">
                      <MaterialSymbol 
                        name={icon.name} 
                        variant="outlined"
                        size={24} 
                        className="text-green-400 mb-1" 
                      />
                      <div className="text-white/80 text-xs">{icon.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material Icons */}
              <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-500/30">
                <h3 className="text-blue-400 text-lg font-semibold mb-4 text-center">
                  Material Icons (舊)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {commonIcons.map((icon) => (
                    <div key={icon.name} className="bg-black/30 rounded-lg p-3 text-center">
                      <MaterialIcon 
                        name={icon.name} 
                        variant="outlined"
                        size={24} 
                        className="text-blue-400 mb-1" 
                      />
                      <div className="text-white/80 text-xs">{icon.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 使用指南 */}
          <div className="bg-gray-900 rounded-xl p-8 border border-white/20">
            <h2 className="text-white text-xl font-semibold mb-6">📚 使用指南</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-[#FF7400] font-semibold mb-3">✅ Material Symbols (建議)</h3>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="bg-black/50 rounded p-2 font-mono">
                    <span className="text-green-400">import</span> {`{ MaterialSymbol }`} <span className="text-green-400">from</span> <span className="text-yellow-400">'./ui/material-symbol'</span>
                  </div>
                  <div className="bg-black/50 rounded p-2 font-mono">
                    {`<MaterialSymbol name="ev_shadow" variant="outlined" size={16} />`}
                  </div>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-white/60">
                    <li>支援更多新圖標（如 ev_shadow）</li>
                    <li>可調整 fill、weight、optical size</li>
                    <li>更好的視覺一致性</li>
                    <li>Google 推薦的新標準</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-blue-400 font-semibold mb-3">⚠️ Material Icons (舊版)</h3>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="bg-black/50 rounded p-2 font-mono">
                    <span className="text-green-400">import</span> {`{ MaterialIcon }`} <span className="text-green-400">from</span> <span className="text-yellow-400">'./ui/material-icon'</span>
                  </div>
                  <div className="bg-black/50 rounded p-2 font-mono">
                    {`<MaterialIcon name="check_circle" variant="outlined" size={16} />`}
                  </div>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-white/60">
                    <li>較少的圖標選擇</li>
                    <li>不支援新圖標（如 ev_shadow）</li>
                    <li>適用於基本圖標需求</li>
                    <li>保留向後相容性</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#FF7400]/10 rounded-lg border border-[#FF7400]/20">
              <div className="text-[#FF7400] font-semibold mb-2">💡 最佳實踐建議</div>
              <div className="text-white/80 text-sm">
                對於新專案，建議優先使用 <strong>Material Symbols</strong>，只有在需要向後相容或特定圖標不可用時才使用 Material Icons。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { MaterialIcon, MATERIAL_ICONS } from './ui/material-icon';

export default function MaterialIconDemo() {
  return (
    <div className="container-global py-section-medium">
      <div className="container-large">
        <div className="text-center mb-12">
          <h2 className="text-white text-[32px] md:text-[40px] font-medium mb-6 tracking-[-0.32px] md:tracking-[-0.4px]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Google Material Icons Demo
          </h2>
          <p className="text-white/90 text-[14px] md:text-[16px] max-w-content-large mx-auto">
            現在你可以直接使用 Google Material Icons，只需要告訴我 icon 名稱即可！
          </p>
        </div>

        {/* Basic Usage Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-white text-lg font-medium mb-4">基本使用</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MaterialIcon name="home" className="text-white" />
                <span className="text-white/80">home</span>
              </div>
              <div className="flex items-center gap-3">
                <MaterialIcon name="star" className="text-yellow-400" />
                <span className="text-white/80">star</span>
              </div>
              <div className="flex items-center gap-3">
                <MaterialIcon name="favorite" className="text-red-400" />
                <span className="text-white/80">favorite</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-white text-lg font-medium mb-4">不同變體</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MaterialIcon name="star" variant="filled" className="text-[#FF7400]" />
                <span className="text-white/80">filled</span>
              </div>
              <div className="flex items-center gap-3">
                <MaterialIcon name="star" variant="outlined" className="text-[#FF7400]" />
                <span className="text-white/80">outlined</span>
              </div>
              <div className="flex items-center gap-3">
                <MaterialIcon name="star" variant="round" className="text-[#FF7400]" />
                <span className="text-white/80">round</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-white text-lg font-medium mb-4">不同尺寸</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MaterialIcon name="settings" size="sm" className="text-white" />
                <span className="text-white/80">small</span>
              </div>
              <div className="flex items-center gap-3">
                <MaterialIcon name="settings" size="base" className="text-white" />
                <span className="text-white/80">base</span>
              </div>
              <div className="flex items-center gap-3">
                <MaterialIcon name="settings" size="lg" className="text-white" />
                <span className="text-white/80">large</span>
              </div>
              <div className="flex items-center gap-3">
                <MaterialIcon name="settings" size={32} className="text-white" />
                <span className="text-white/80">32px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Common Icons Grid */}
        <div className="mb-12">
          <h3 className="text-white text-xl font-medium mb-6">常用圖標</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
            {Object.entries(MATERIAL_ICONS).slice(0, 24).map(([key, iconName]) => (
              <div key={key} className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all duration-300 text-center">
                <MaterialIcon 
                  name={iconName} 
                  size="2xl" 
                  className="text-white group-hover:text-[#FF7400] transition-colors duration-300 mb-2" 
                />
                <div className="text-xs text-white/60 group-hover:text-white/80 transition-colors duration-300">
                  {iconName}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white/5 rounded-xl p-8 border border-white/10">
          <h3 className="text-white text-xl font-medium mb-6">使用範例</h3>
          <div className="space-y-4 text-sm">
            <div className="bg-black/30 rounded-lg p-4 font-mono text-white/80">
              <div className="text-green-400 mb-2">// 基本使用</div>
              <div>&lt;MaterialIcon name="home" /&gt;</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 font-mono text-white/80">
              <div className="text-green-400 mb-2">// 帶樣式和尺寸</div>
              <div>&lt;MaterialIcon name="star" variant="outlined" size="lg" className="text-yellow-400" /&gt;</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 font-mono text-white/80">
              <div className="text-green-400 mb-2">// 使用常數</div>
              <div>&lt;MaterialIcon name={`{MATERIAL_ICONS.HOME}`} /&gt;</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 font-mono text-white/80">
              <div className="text-green-400 mb-2">// 自定義尺寸</div>
              <div>&lt;MaterialIcon name="settings" size={`{48}`} className="text-blue-400" /&gt;</div>
            </div>
          </div>
        </div>

        {/* Interactive Example */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF7400] to-[#1D3557] rounded-xl px-8 py-4">
            <MaterialIcon name="check_circle" variant="round" size="lg" className="text-white" />
            <span className="text-white font-medium">Google Material Icons 已整合完成！</span>
            <MaterialIcon name="celebration" variant="round" size="lg" className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
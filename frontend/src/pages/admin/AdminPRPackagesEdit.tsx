import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { prPackagesAPI } from '../../api/client';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

// 注意：這裡需要從 API 載入
// TODO: 創建 GET /api/admin/pr-package-categories/ API

const CATEGORIES = [
  { id: 'global-pr', title: 'GLOBAL PR' },
  { id: 'asia-packages', title: 'ASIA PACKAGES' },
  { id: 'founder-pr', title: 'FOUNDER PR' },
];

export default function AdminPRPackagesEdit() {
  const { id } = useParams(); // 這裡的 id 實際上是 slug
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [packageId, setPackageId] = useState<number | null>(null); // 真實的數據庫 ID

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    badge: '',
    guaranteed_publications: 0,
    category_id: 'global-pr',
    media_logos: [{ url: '', name: '' }],
    features: [''],
    detailed_info: {
      sections: [{ title: '', items: [''] }],
      note: '',
      cta_text: '',
    },
    display_order: 0,
    category_order: 1,
    status: 'active',
  });

  useEffect(() => {
    if (id) {
      loadPackage();
    }
  }, [id]);

  const loadPackage = async () => {
    try {
      // 通過 slug 獲取 package（因為路由參數是 slug）
      const pkg = await prPackagesAPI.getPackage(id!);
      setPackageId((pkg as any).id); // 保存真實的數據庫 ID
      
      setFormData({
        name: pkg.name,
        price: pkg.price,
        description: pkg.description,
        badge: pkg.badge || '',
        guaranteed_publications: pkg.guaranteed_publications || 0,
        category_id: pkg.category_id,
        media_logos: pkg.media_logos && pkg.media_logos.length > 0 ? pkg.media_logos : [{ url: '', name: '' }],
        features: pkg.features && pkg.features.length > 0 ? pkg.features : [''],
        detailed_info: pkg.detailed_info || {
          sections: [{ title: '', items: [''] }],
          note: '',
          cta_text: '',
        },
        display_order: pkg.display_order,
        category_order: 1,
        status: pkg.status,
      });
    } catch (error) {
      console.error('Failed to load package:', error);
      alert('載入 Package 失敗');
      navigate('/admin/pr-packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 清理空數據
      const cleanedData = {
        ...formData,
        media_logos: formData.media_logos.filter(logo => logo.url && logo.name),
        features: formData.features.filter(f => f.trim() !== ''),
        detailed_info: {
          sections: formData.detailed_info.sections
            .filter(s => s.title && s.items.some(i => i.trim() !== ''))
            .map(s => ({
              title: s.title,
              items: s.items.filter(i => i.trim() !== ''),
            })),
          note: formData.detailed_info.note || undefined,
          cta_text: formData.detailed_info.cta_text || undefined,
        },
      };

      if (id && packageId) {
        // 使用真實的數據庫 ID 進行更新
        await prPackagesAPI.updatePackage(packageId, cleanedData as any);
        alert('Package 已更新');
      } else {
        await prPackagesAPI.createPackage(cleanedData as any);
        alert('Package 已建立');
      }
      navigate('/admin/pr-packages');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('儲存失敗');
    } finally {
      setSaving(false);
    }
  };

  // Media Logos 管理
  const addMediaLogo = () => {
    setFormData({
      ...formData,
      media_logos: [...formData.media_logos, { url: '', name: '' }],
    });
  };

  const updateMediaLogo = (index: number, field: 'url' | 'name', value: string) => {
    const newLogos = [...formData.media_logos];
    newLogos[index][field] = value;
    setFormData({ ...formData, media_logos: newLogos });
  };

  const removeMediaLogo = (index: number) => {
    const newLogos = formData.media_logos.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      media_logos: newLogos.length > 0 ? newLogos : [{ url: '', name: '' }],
    });
  };

  // Features 管理
  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [''] });
  };

  // Detailed Info Sections 管理
  const addSection = () => {
    setFormData({
      ...formData,
      detailed_info: {
        ...formData.detailed_info,
        sections: [...formData.detailed_info.sections, { title: '', items: [''] }],
      },
    });
  };

  const updateSectionTitle = (sectionIndex: number, title: string) => {
    const newSections = [...formData.detailed_info.sections];
    newSections[sectionIndex].title = title;
    setFormData({
      ...formData,
      detailed_info: { ...formData.detailed_info, sections: newSections },
    });
  };

  const addSectionItem = (sectionIndex: number) => {
    const newSections = [...formData.detailed_info.sections];
    newSections[sectionIndex].items.push('');
    setFormData({
      ...formData,
      detailed_info: { ...formData.detailed_info, sections: newSections },
    });
  };

  const updateSectionItem = (sectionIndex: number, itemIndex: number, value: string) => {
    const newSections = [...formData.detailed_info.sections];
    newSections[sectionIndex].items[itemIndex] = value;
    setFormData({
      ...formData,
      detailed_info: { ...formData.detailed_info, sections: newSections },
    });
  };

  const removeSectionItem = (sectionIndex: number, itemIndex: number) => {
    const newSections = [...formData.detailed_info.sections];
    newSections[sectionIndex].items = newSections[sectionIndex].items.filter((_, i) => i !== itemIndex);
    if (newSections[sectionIndex].items.length === 0) {
      newSections[sectionIndex].items = [''];
    }
    setFormData({
      ...formData,
      detailed_info: { ...formData.detailed_info, sections: newSections },
    });
  };

  const removeSection = (sectionIndex: number) => {
    const newSections = formData.detailed_info.sections.filter((_, i) => i !== sectionIndex);
    setFormData({
      ...formData,
      detailed_info: {
        ...formData.detailed_info,
        sections: newSections.length > 0 ? newSections : [{ title: '', items: [''] }],
      },
    });
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <button
          onClick={() => navigate('/admin/pr-packages')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          返回列表
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {id ? '編輯' : '新增'} PR Package
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-6xl">
          <div className="space-y-8">
            {/* 基本資訊 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package 名稱 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="例如：Global Startup Launch"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">價格 *</label>
                <input
                  type="text"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="例如：$2,999"
                />
              </div>
            </div>

            {/* 描述和分類 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">描述 *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">分類 *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">徽章</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="例如：BEST VALUE"
                  />
                </div>
              </div>
            </div>

            {/* 保證發布數和排序 */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  保證發布數
                </label>
                <input
                  type="number"
                  value={formData.guaranteed_publications}
                  onChange={(e) =>
                    setFormData({ ...formData, guaranteed_publications: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">顯示順序</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">狀態</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="active">啟用</option>
                  <option value="inactive">停用</option>
                </select>
              </div>
            </div>

            {/* Media Logos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Media Logos</label>
                <button
                  type="button"
                  onClick={addMediaLogo}
                  className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
                >
                  <Plus size={16} />
                  新增 Logo
                </button>
              </div>
              <div className="space-y-3">
                {formData.media_logos.map((logo, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={logo.name}
                      onChange={(e) => updateMediaLogo(index, 'name', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Logo 名稱"
                    />
                    <input
                      type="url"
                      value={logo.url}
                      onChange={(e) => updateMediaLogo(index, 'url', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Logo URL"
                    />
                    {formData.media_logos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMediaLogo(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">主要功能 *</label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-1 text-sm text-orange-600"
                >
                  <Plus size={16} />
                  新增功能
                </button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder={`功能 ${index + 1}`}
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Info Sections */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">詳細資訊區塊</label>
                <button
                  type="button"
                  onClick={addSection}
                  className="flex items-center gap-1 text-sm text-orange-600"
                >
                  <Plus size={16} />
                  新增區塊
                </button>
              </div>
              <div className="space-y-4">
                {formData.detailed_info.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="p-4 border-2 border-gray-200 rounded-lg">
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium"
                        placeholder="區塊標題"
                      />
                      {formData.detailed_info.sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSection(sectionIndex)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 ml-4">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateSectionItem(sectionIndex, itemIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            placeholder={`項目 ${itemIndex + 1}`}
                          />
                          {section.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSectionItem(sectionIndex, itemIndex)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSectionItem(sectionIndex)}
                        className="text-sm text-orange-600 hover:text-orange-700"
                      >
                        + 新增項目
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note and CTA */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">備註</label>
                <textarea
                  value={formData.detailed_info.note}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      detailed_info: { ...formData.detailed_info, note: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA 文字</label>
                <input
                  type="text"
                  value={formData.detailed_info.cta_text}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      detailed_info: { ...formData.detailed_info, cta_text: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="例如：立即開始"
                />
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                <Save size={18} />
                {id ? '更新' : '建立'} Package
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/pr-packages')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { pricingAPI, type PricingPackage } from '../../api/client';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

export default function AdminPricingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'USD',
    billing_period: 'monthly',
    features: [''],
    is_popular: false,
    badge_text: '',
    display_order: 0,
    status: 'active',
  });

  useEffect(() => {
    if (id) {
      loadPackage();
    }
  }, [id]);

  const loadPackage = async () => {
    try {
      const pkg = await pricingAPI.getPackageById(Number(id));
      setFormData({
        name: pkg.name,
        description: pkg.description,
        price: pkg.price,
        currency: pkg.currency,
        billing_period: pkg.billing_period,
        features: pkg.features.length > 0 ? pkg.features : [''],
        is_popular: pkg.is_popular,
        badge_text: pkg.badge_text || '',
        display_order: pkg.display_order,
        status: pkg.status,
      });
    } catch (error) {
      console.error('Failed to load package:', error);
      alert('載入方案失敗');
      navigate('/admin/pricing');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 過濾空的 features
      const cleanedFeatures = formData.features.filter(f => f.trim() !== '');
      
      const dataToSubmit = {
        ...formData,
        features: cleanedFeatures,
      };

      if (id) {
        await pricingAPI.updatePackage(Number(id), dataToSubmit);
        alert('方案已更新');
      } else {
        await pricingAPI.createPackage(dataToSubmit as any);
        alert('方案已建立');
      }
      navigate('/admin/pricing');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('儲存失敗');
    } finally {
      setSaving(false);
    }
  };

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

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">載入中...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <button
          onClick={() => navigate('/admin/pricing')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          返回列表
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {id ? '編輯' : '新增'}定價方案
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-4xl">
          <div className="space-y-6">
            {/* 方案名稱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                方案名稱 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="例如：基礎方案"
              />
            </div>

            {/* 描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述 *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="簡短描述此方案..."
              />
            </div>

            {/* 價格和計費週期 */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">價格 *</label>
                <input
                  type="text"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">幣別</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="USD">USD</option>
                  <option value="TWD">TWD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">計費週期</label>
                <select
                  value={formData.billing_period}
                  onChange={(e) => setFormData({ ...formData, billing_period: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="monthly">月付</option>
                  <option value="yearly">年付</option>
                  <option value="one-time">一次性</option>
                </select>
              </div>
            </div>

            {/* 功能列表 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  包含功能 *
                </label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
                >
                  <Plus size={16} />
                  新增功能
                </button>
              </div>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder={`功能 ${index + 1}`}
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 其他設定 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  徽章文字（選填）
                </label>
                <input
                  type="text"
                  value={formData.badge_text}
                  onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="例如：最受歡迎"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">顯示順序</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* 開關設定 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_popular"
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="is_popular" className="text-sm font-medium text-gray-700">
                  標記為熱門方案
                </label>
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

            {/* 操作按鈕 */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                <Save size={18} />
                {id ? '更新' : '建立'}方案
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/pricing')}
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


/**
 * Navigation & Footer 管理
 * 參考 AdminContentServices 的結構和樣式
 */
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { contentAPI } from '../../api/client';
import { Plus, Edit, Trash2, Save, Navigation as NavIcon, Layout } from 'lucide-react';

export default function AdminSiteSettings() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'navigation' | 'footer'>('navigation');
  
  // Navigation
  const [navItems, setNavItems] = useState<any[]>([]);
  const [navCTA, setNavCTA] = useState<any>(null);
  const [editingNav, setEditingNav] = useState<any>(null);
  const [showNavModal, setShowNavModal] = useState(false);
  
  // Footer
  const [footerSections, setFooterSections] = useState<any[]>([]);
  const [footerTextSettings, setFooterTextSettings] = useState<any[]>([]);
  const [editingFooterSection, setEditingFooterSection] = useState<any>(null);
  const [editingFooterLink, setEditingFooterLink] = useState<any>(null);
  const [showFooterSectionModal, setShowFooterSectionModal] = useState(false);
  const [showFooterLinkModal, setShowFooterLinkModal] = useState(false);
  const [showFooterTextModal, setShowFooterTextModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [navItemsData, navCTAData, footerSectionsData, footerTextData] = await Promise.all([
        contentAPI.getAllNavigationItems(),
        contentAPI.getNavigationCTAAdmin(),
        contentAPI.getAllFooterSections(),
        contentAPI.getAllFooterTextSettings(),
      ]);
      
      setNavItems(navItemsData);
      setNavCTA(navCTAData || { text_en: 'Get Started', url: '/contact' });
      setFooterSections(footerSectionsData);
      setFooterTextSettings(footerTextData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Navigation handlers
  const handleDeleteNav = async (item: any) => {
    if (!confirm(`Are you sure you want to delete "${item.label_en}"?`)) return;
    try {
      await contentAPI.deleteNavigationItem(item.id);
      alert('Deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Delete failed');
    }
  };

  const handleSaveNav = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    
    /**
     * ⚠️ 重要：禁止使用 || null 進行 fallback
     * 
     * ❌ 錯誤寫法：mobile_url: formData.get('mobile_url') as string || null
     * 問題：空字串會被轉成 null，而後端的 if data.mobile_url is not None 會忽略 null，
     *      導致資料庫不會被更新，舊值會保留
     * 
     * ✅ 正確寫法：直接送空字串，讓後端正確更新為空值
     */
    const data = {
      label_en: formData.get('label_en') as string,
      desktop_url: formData.get('desktop_url') as string,
      mobile_url: (formData.get('mobile_url') as string) || '',  // 送空字串而非 null
      target: formData.get('target') as string || '_self',
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      if (editingNav) {
        await contentAPI.updateNavigationItem(editingNav.id, data);
        alert('Updated successfully');
      } else {
        await contentAPI.createNavigationItem(data);
        alert('Created successfully');
      }
      setShowNavModal(false);
      setEditingNav(null);
      fetchData();
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Save failed');
    }
  };

  const handleSaveCTA = async () => {
    if (!navCTA) return;
    try {
      await contentAPI.updateNavigationCTA(navCTA);
      alert('CTA updated successfully');
      fetchData();
    } catch (error) {
      console.error('Failed to save CTA:', error);
      alert('Save failed');
    }
  };

  // Footer handlers
  const handleDeleteFooterSection = async (section: any) => {
    if ( !confirm(`確定要刪除區塊「${section.title_en}」？（會連同刪除所有連結）`)) return;
    try {
      await contentAPI.deleteFooterSection(section.id);
      alert('刪除成功');
      fetchData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('刪除失敗');
    }
  };

  const handleSaveFooterSection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      section_key: formData.get('section_key') as string,
      title_en: formData.get('title_en') as string,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      if (editingFooterSection) {
        await contentAPI.updateFooterSection(editingFooterSection.id, data);
        alert('更新成功');
      } else {
        await contentAPI.createFooterSection(data);
        alert('新增成功');
      }
      setShowFooterSectionModal(false);
      setEditingFooterSection(null);
      fetchData();
    } catch (error) {
      console.error('Failed to save:', error);
      alert('儲存失敗');
    }
  };

  const handleSaveFooterLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      section_id: parseInt(formData.get('section_id') as string),
      label_en: formData.get('label_en') as string,
      url: formData.get('url') as string,
      target: formData.get('target') as string || '_self',
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      if (editingFooterLink?.id) {
        await contentAPI.updateFooterLink(editingFooterLink.id, data);
        alert('更新成功');
      } else {
        await contentAPI.createFooterLink(data);
        alert('新增成功');
      }
      setShowFooterLinkModal(false);
      setEditingFooterLink(null);
      fetchData();
    } catch (error) {
      console.error('Failed to save:', error);
      alert('儲存失敗');
    }
  };

  const handleDeleteFooterLink = async (link: any) => {
    if ( !confirm(`確定要刪除「${link.label_en}」？`)) return;
    try {
      await contentAPI.deleteFooterLink(link.id);
      alert('刪除成功');
      fetchData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('刪除失敗');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Navigation & Footer</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage site navigation and footer settings</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('navigation')}
                className={`px-1 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'navigation'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <NavIcon size={18} />
                  Navigation
                </div>
              </button>
              <button
                onClick={() => setActiveTab('footer')}
                className={`px-1 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'footer'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layout size={18} />
                  Footer
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tab */}
        {activeTab === 'navigation' && (
          <div className="space-y-6">
            {/* CTA Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">CTA Button</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Button Text (EN)
                  </label>
                  <input
                    type="text"
                    value={navCTA?.text_en || ''}
                    onChange={(e) => setNavCTA({ ...navCTA, text_en: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    URL
                  </label>
                  <input
                    type="text"
                    value={navCTA?.url || ''}
                    onChange={(e) => setNavCTA({ ...navCTA, url: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSaveCTA}
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            </div>

            {/* Section IDs Reference */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-3">📍 Available Section IDs on Homepage</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <code className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-1 rounded font-mono text-xs">#services-section</code>
                </div>
                <div className="flex items-start gap-2">
                  <code className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-1 rounded font-mono text-xs">#packages-section</code>
                </div>
                <div className="flex items-start gap-2">
                  <code className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-1 rounded font-mono text-xs">#lyro-section</code>
                </div>
                <div className="flex items-start gap-2">
                  <code className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-1 rounded font-mono text-xs">#clients-section</code>
                </div>
                <div className="flex items-start gap-2">
                  <code className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-1 rounded font-mono text-xs">#publisher-section</code>
                </div>
                <div className="flex items-start gap-2">
                  <code className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-1 rounded font-mono text-xs">#contact-section</code>
                </div>
                <div className="flex items-start gap-2">
                  <code className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-1 rounded font-mono text-xs">#about-section</code>
                </div>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-3">💡 Copy any of these IDs above and paste into the Desktop URL or Mobile URL fields.</p>
            </div>

            {/* Navigation Items Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu Items</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total {navItems.length} items</p>
                </div>
                <button
                  onClick={() => {
                    setEditingNav(null);
                    setShowNavModal(true);
                  }}
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus size={18} />
                  Add Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase w-12">Order</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase w-28">Label</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase w-36">Desktop URL</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase w-32">Mobile URL</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase w-20">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {navItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">{item.display_order}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{item.label_en}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.desktop_url}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.mobile_url || '-'}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            item.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                          }`}>
                            {item.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => { setEditingNav(item); setShowNavModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDeleteNav(item)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {navItems.length === 0 && (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No menu items yet. Click "Add Item" to create one.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Tab */}
        {activeTab === 'footer' && (
          <div className="space-y-6">
            {/* Footer Text Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Footer 文字設定</h2>
                <button
                  onClick={async () => {
                    try {
                      for (const setting of footerTextSettings) {
                        await contentAPI.updateFooterTextSetting(setting.setting_key, setting);
                      }
                      alert('儲存成功');
                      fetchData();
                    } catch (error) {
                      console.error('Failed to save:', error);
                      alert('儲存失敗');
                    }
                  }}
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Save size={16} />
                  儲存文字
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {footerTextSettings.map((setting) => (
                  <div key={setting.setting_key}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 capitalize">
                      {setting.setting_key.replace(/_/g, ' ')}
                    </label>
                    <input
                      type="text"
                      value={setting.value_en || ''}
                      onChange={(e) => {
                        const newSettings = footerTextSettings.map(s =>
                          s.setting_key === setting.setting_key ? { ...s, value_en: e.target.value } : s
                        );
                        setFooterTextSettings(newSettings);
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Sections */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Footer 區塊</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">共 {footerSections.length} 個區塊</p>
                </div>
                <button
                  onClick={() => { setEditingFooterSection(null); setShowFooterSectionModal(true); }}
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus size={18} />
                  新增區塊
                </button>
              </div>

              <div className="p-6 space-y-4">
                {footerSections.map((section) => (
                  <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{section.title_en}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">({section.section_key})</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{section.links?.length || 0} links</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingFooterLink({ section_id: section.id }); setShowFooterLinkModal(true); }}
                          className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded text-xs"
                        >
                          <Plus size={14} /> 新增連結
                        </button>
                        <button onClick={() => { setEditingFooterSection(section); setShowFooterSectionModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDeleteFooterSection(section)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      {(section.links || []).map((link: any) => (
                        <div key={link.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                          <div className="flex-1">
                            <span className="text-gray-900 dark:text-white font-medium">{link.label_en}</span>
                            <span className="text-gray-500 dark:text-gray-400 ml-3">{link.url}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setEditingFooterLink(link); setShowFooterLinkModal(true); }} className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                              <Edit size={14} />
                            </button>
                            <button onClick={() => handleDeleteFooterLink(link)} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {(!section.links || section.links.length === 0) && (
                        <div className="text-center text-gray-400 text-xs py-2">尚無連結</div>
                      )}
                    </div>
                  </div>
                ))}
                {footerSections.length === 0 && (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    尚無 Footer 區塊，請點擊「新增區塊」
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Modal */}
        {showNavModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingNav ? 'Edit Menu Item' : 'Add Menu Item'}
                </h2>
              </div>
              
              <form onSubmit={handleSaveNav} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Label (EN) *</label>
                  <input type="text" name="label_en" defaultValue={editingNav?.label_en} required className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white" placeholder="Services" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Desktop URL *</label>
                  <input type="text" name="desktop_url" defaultValue={editingNav?.desktop_url} required className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white" placeholder="#services-section or /services" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Starts with # will scroll to section, otherwise navigate to page</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mobile URL</label>
                  <input type="text" name="mobile_url" defaultValue={editingNav?.mobile_url || ''} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white" placeholder="/services" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mobile-specific URL (leave empty to use Desktop URL)</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Display Order</label>
                    <input type="number" name="display_order" defaultValue={editingNav?.display_order || 0} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <input type="checkbox" name="is_active" defaultChecked={editingNav?.is_active ?? true} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-orange-600 text-white px-6 py-2.5 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                    {editingNav ? '更新' : '新增'}
                  </button>
                  <button type="button" onClick={() => { setShowNavModal(false); setEditingNav(null); }} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer Section Modal */}
        {showFooterSectionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-xl w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingFooterSection ? '編輯區塊' : '新增區塊'}
                </h2>
              </div>
              
              <form onSubmit={handleSaveFooterSection} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Section Key *</label>
                    <input type="text" name="section_key" defaultValue={editingFooterSection?.section_key} required className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white" placeholder="company" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title (EN) *</label>
                    <input type="text" name="title_en" defaultValue={editingFooterSection?.title_en} required className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white" placeholder="Company" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Display Order</label>
                    <input type="number" name="display_order" defaultValue={editingFooterSection?.display_order || 0} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <input type="checkbox" name="is_active" defaultChecked={editingFooterSection?.is_active ?? true} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-orange-600 text-white px-6 py-2.5 rounded-lg hover:bg-orange-700 transition-colors font-medium">{editingFooterSection ? '更新' : '新增'}</button>
                  <button type="button" onClick={() => { setShowFooterSectionModal(false); setEditingFooterSection(null); }} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">取消</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer Link Modal */}
        {showFooterLinkModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-xl w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingFooterLink?.id ? '編輯連結' : '新增連結'}
                </h2>
              </div>
              
              <form onSubmit={handleSaveFooterLink} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">所屬區塊 *</label>
                  <select name="section_id" defaultValue={editingFooterLink?.section_id} required className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white">
                    {footerSections.map(s => (
                      <option key={s.id} value={s.id}>{s.title_en}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Label (EN) *</label>
                    <input type="text" name="label_en" defaultValue={editingFooterLink?.label_en} required className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white" placeholder="About Us" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">URL *</label>
                    <input type="text" name="url" defaultValue={editingFooterLink?.url} required className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white" placeholder="/about" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Display Order</label>
                    <input type="number" name="display_order" defaultValue={editingFooterLink?.display_order || 0} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <input type="checkbox" name="is_active" defaultChecked={editingFooterLink?.is_active ?? true} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-orange-600 text-white px-6 py-2.5 rounded-lg hover:bg-orange-700 transition-colors font-medium">{editingFooterLink?.id ? '更新' : '新增'}</button>
                  <button type="button" onClick={() => { setShowFooterLinkModal(false); setEditingFooterLink(null); }} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">取消</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

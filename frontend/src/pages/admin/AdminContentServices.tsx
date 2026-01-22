import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { ADMIN_API, PUBLIC_API } from '../../config/api';
import { authenticatedGet, authenticatedPut } from '../../utils/apiClient';
import { Save, Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminContentServices() {
  const [sectionData, setSectionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showItemModal, setShowItemModal] = useState(false);

  const fetchData = async () => {
    try {
      const data = await fetch(`${PUBLIC_API}/content/sections/services`).then(r => r.json());
      setSectionData(data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updatedContent = {
      ...sectionData,
      label: formData.get('label') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      cta_primary: {
        text: formData.get('cta_primary_text') as string,
        url: formData.get('cta_primary_url') as string,
      },
      cta_secondary: {
        text: formData.get('cta_secondary_text') as string,
        url: formData.get('cta_secondary_url') as string,
      }
    };
    
    try {
      await authenticatedPut(`${ADMIN_API}/content/sections/services`, { content: updatedContent });
      await fetchData();  // 先重新載入資料
      alert('Section updated successfully');
    } catch (error) {
      console.error('Failed to update:', error);
      alert('Update failed');
    }
  };

  const handleSaveItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newItem = {
      id: editingItem?.id || Date.now(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      icon: formData.get('icon') as string,
      display_order: parseInt(formData.get('display_order') as string) || 0,
    };

    let updatedItems;
    if (editingItem) {
      // 更新現有項目
      updatedItems = sectionData.items.map((item: any) => 
        item.id === editingItem.id ? newItem : item
      );
    } else {
      // 新增項目
      updatedItems = [...(sectionData.items || []), newItem];
    }

    const updatedContent = {
      ...sectionData,
      items: updatedItems
    };

    try {
      await authenticatedPut(`${ADMIN_API}/content/sections/services`, { content: updatedContent });
      setShowItemModal(false);
      setEditingItem(null);
      await fetchData();  // 先重新載入資料
      alert(editingItem ? 'Item updated successfully' : 'Item created successfully');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Save failed');
    }
  };

  const handleDeleteItem = async (item: any) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;

    const updatedItems = sectionData.items.filter((i: any) => i.id !== item.id);
    const updatedContent = {
      ...sectionData,
      items: updatedItems
    };

    try {
      await authenticatedPut(`${ADMIN_API}/content/sections/services`, { content: updatedContent });
      await fetchData();  // 先重新載入資料
      alert('Item deleted successfully');
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Delete failed');
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
      <div className="p-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Services Section</h1>

        {/* Section Content */}
        <form onSubmit={handleSaveSection} className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Section Content</h2>
            <button type="submit" className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
              <Save size={18} />
              Save Section
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Label (小標)</label>
            <input 
              type="text" 
              name="label" 
              key={`label-${sectionData?.label}`}
              defaultValue={sectionData?.label} 
              placeholder="Services"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title (主標題) *</label>
            <input 
              type="text" 
              name="title" 
              key={`title-${sectionData?.title}`}
              defaultValue={sectionData?.title} 
              required
              placeholder="What We Offer"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description (描述)</label>
            <textarea 
              name="description" 
              key={`desc-${sectionData?.description?.substring(0, 20)}`}
              defaultValue={sectionData?.description}
              rows={3}
              placeholder="At VortixPR, we amplify blockchain..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none" 
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Primary CTA Button</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Button Text</label>
                <input 
                  type="text" 
                  name="cta_primary_text" 
                  key={`cta-primary-text-${sectionData?.cta_primary?.text}`}
                  defaultValue={sectionData?.cta_primary?.text}
                  placeholder="Get Started"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Button URL</label>
                <input 
                  type="text" 
                  name="cta_primary_url" 
                  key={`cta-primary-url-${sectionData?.cta_primary?.url}`}
                  defaultValue={sectionData?.cta_primary?.url}
                  placeholder="/contact"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" 
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Secondary CTA Button</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Button Text</label>
                <input 
                  type="text" 
                  name="cta_secondary_text" 
                  key={`cta-secondary-text-${sectionData?.cta_secondary?.text}`}
                  defaultValue={sectionData?.cta_secondary?.text}
                  placeholder="Contact Us"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Button URL</label>
                <input 
                  type="text" 
                  name="cta_secondary_url" 
                  key={`cta-secondary-url-${sectionData?.cta_secondary?.url}`}
                  defaultValue={sectionData?.cta_secondary?.url}
                  placeholder="/contact"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" 
                />
              </div>
            </div>
          </div>
        </form>

        {/* Service Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Service Items</h2>
          <button
            onClick={() => {
              setEditingItem(null);
                setShowItemModal(true);
            }}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
              <Plus size={18} />
              Add Item
          </button>
        </div>

          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Icon</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sectionData?.items?.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">{item.display_order}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{item.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.icon}</td>
                    <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                            setShowItemModal(true);
                        }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                      >
                          <Edit size={16} />
                      </button>
                      <button
                          onClick={() => handleDeleteItem(item)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                          <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

        {/* Item Modal */}
        {showItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingItem ? 'Edit Service Item' : 'Add Service Item'}
              </h2>
            </div>
            
              <form onSubmit={handleSaveItem} className="p-6 space-y-4">
              <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingItem?.title}
                  required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" 
                />
              </div>

              <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                <textarea
                  name="description"
                  defaultValue={editingItem?.description}
                  required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none" 
                />
              </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Icon</label>
                  <input
                    type="text"
                    name="icon"
                    defaultValue={editingItem?.icon}
                    placeholder="globe, language, strategy, user, users"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    defaultValue={editingItem?.display_order || 0}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" 
                  />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                    className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                      setShowItemModal(false);
                    setEditingItem(null);
                  }}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
}


import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { ADMIN_API, PUBLIC_API } from '../../config/api';
import { authenticatedPut } from '../../utils/apiClient';
import { Save, Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminContentPublisher() {
  const [sectionData, setSectionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingStat, setEditingStat] = useState<any>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showStatModal, setShowStatModal] = useState(false);

  const fetchData = async () => {
    try {
      const data = await fetch(`${PUBLIC_API}/content/sections/publisher`).then(r => r.json());
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
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      cta_button: {
        text: formData.get('cta_text') as string,
        action: formData.get('cta_action') as string
      }
    };

    try {
      await authenticatedPut(`${ADMIN_API}/content/sections/publisher`, { content: updatedContent });
      await fetchData();
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
      display_order: parseInt(formData.get('display_order') as string) || 0
    };

    let updatedItems;
    if (editingItem) {
      updatedItems = sectionData.items.map((item: any) => 
        item.id === editingItem.id ? newItem : item
      );
    } else {
      updatedItems = [...(sectionData.items || []), newItem];
    }

    try {
      await authenticatedPut(`${ADMIN_API}/content/sections/publisher`, { 
        content: { ...sectionData, items: updatedItems }
      });
      setShowItemModal(false);
      setEditingItem(null);
      await fetchData();
      alert(editingItem ? 'Feature updated' : 'Feature created');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Save failed');
    }
  };

  const handleDeleteItem = async (item: any) => {
    if (!confirm(`Delete "${item.title}"?`)) return;

    const updatedItems = sectionData.items.filter((i: any) => i.id !== item.id);
    
    try {
      await authenticatedPut(`${ADMIN_API}/content/sections/publisher`, {
        content: { ...sectionData, items: updatedItems }
      });
      await fetchData();
      alert('Feature deleted');
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Delete failed');
    }
  };

  const handleSaveStat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newStat = {
      number: formData.get('number') as string,
      label: formData.get('label') as string
    };

    let updatedStats;
    const statIndex = sectionData.stats.findIndex((s: any) => s.label === editingStat?.label);
    
    if (statIndex >= 0) {
      updatedStats = [...sectionData.stats];
      updatedStats[statIndex] = newStat;
    } else {
      updatedStats = [...(sectionData.stats || []), newStat];
    }

    try {
      await authenticatedPut(`${ADMIN_API}/content/sections/publisher`, {
        content: { ...sectionData, stats: updatedStats }
      });
      setShowStatModal(false);
      setEditingStat(null);
      await fetchData();
      alert('Stat updated');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Save failed');
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Publisher Features Section</h1>

        {/* Section Content */}
        <form onSubmit={handleSaveSection} className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Section Content</h2>
            <button type="submit" className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
              <Save size={18} />Save Section
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title *</label>
            <input type="text" name="title" key={`t-${sectionData?.title}`} defaultValue={sectionData?.title} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea name="description" key={`d-${sectionData?.description?.substring(0,20)}`} defaultValue={sectionData?.description} rows={2} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">CTA Button Text</label>
              <input type="text" name="cta_text" key={`cta-${sectionData?.cta_button?.text}`} defaultValue={sectionData?.cta_button?.text} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">CTA Action</label>
              <input type="text" name="cta_action" key={`act-${sectionData?.cta_button?.action}`} defaultValue={sectionData?.cta_button?.action} placeholder="modal" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
          </div>
        </form>

        {/* Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Stats</h2>
            <button onClick={() => { setEditingStat(null); setShowStatModal(true); }} className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
              <Plus size={18} />Add Stat
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sectionData?.stats?.map((stat: any, idx: number) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.number}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                <button onClick={() => { setEditingStat(stat); setShowStatModal(true); }} className="mt-2 text-sm text-blue-600 hover:underline">Edit</button>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Publisher Features</h2>
            <button onClick={() => { setEditingItem(null); setShowItemModal(true); }} className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
              <Plus size={18} />Add Feature
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Description</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sectionData?.items?.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">{item.display_order}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{item.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => { setEditingItem(item); setShowItemModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteItem(item)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Feature Modal */}
        {showItemModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editingItem ? 'Edit' : 'Add'} Feature</h2>
              </div>
              <form onSubmit={handleSaveItem} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                  <input type="text" name="title" defaultValue={editingItem?.title} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                  <textarea name="description" defaultValue={editingItem?.description} required rows={2} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Display Order</label>
                  <input type="number" name="display_order" defaultValue={editingItem?.display_order || 0} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium">{editingItem ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={() => { setShowItemModal(false); setEditingItem(null); }} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stat Modal */}
        {showStatModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editingStat ? 'Edit' : 'Add'} Stat</h2>
              </div>
              <form onSubmit={handleSaveStat} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Number *</label>
                  <input type="text" name="number" defaultValue={editingStat?.number} required placeholder="500+" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Label *</label>
                  <input type="text" name="label" defaultValue={editingStat?.label} required placeholder="Active Publishers" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium">{editingStat ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={() => { setShowStatModal(false); setEditingStat(null); }} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

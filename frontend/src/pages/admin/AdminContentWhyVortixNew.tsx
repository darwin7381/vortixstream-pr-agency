import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { ADMIN_API, PUBLIC_API } from '../../config/api';
import { authenticatedPut } from '../../utils/apiClient';
import { Save, Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminContentWhyVortix() {
  const [sectionData, setSectionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingStat, setEditingStat] = useState<any>(null);
  const [editingDiff, setEditingDiff] = useState<any>(null);
  const [showStatModal, setShowStatModal] = useState(false);
  const [showDiffModal, setShowDiffModal] = useState(false);

  const fetchData = async () => {
    try {
      const data = await fetch(`${PUBLIC_API}/content/sections/why_vortix`).then(r => r.json());
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
      title: formData.get('title') as string
    };

    try {
      await authenticatedPut(`${ADMIN_API}/content/sections/why_vortix`, { content: updatedContent });
      await fetchData();
      alert('Section updated successfully');
    } catch (error) {
      console.error('Failed to update:', error);
      alert('Update failed');
    }
  };

  const handleSaveStat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newStat = {
      id: editingStat?.id || Date.now(),
      label: formData.get('label') as string,
      value: parseInt(formData.get('value') as string),
      suffix: formData.get('suffix') as string,
      description: formData.get('description') as string,
      display_order: parseInt(formData.get('display_order') as string) || 0
    };

    let updatedStats;
    if (editingStat) {
      updatedStats = sectionData.stats.map((s: any) => 
        s.id === editingStat.id ? newStat : s
      );
    } else {
      updatedStats = [...(sectionData.stats || []), newStat];
    }

    try {
      await authenticatedPut(`${ADMIN_API}/content/sections/why_vortix`, {
        content: { ...sectionData, stats: updatedStats }
      });
      setShowStatModal(false);
      setEditingStat(null);
      await fetchData();
      alert(editingStat ? 'Stat updated' : 'Stat created');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Save failed');
    }
  };

  const handleDeleteStat = async (stat: any) => {
    if (!confirm(`Delete "${stat.label}"?`)) return;

    const updatedStats = sectionData.stats.filter((s: any) => s.id !== stat.id);
    
    try {
      await authenticatedPut(`${ADMIN_API}/content/sections/why_vortix`, {
        content: { ...sectionData, stats: updatedStats }
      });
      await fetchData();
      alert('Stat deleted');
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Delete failed');
    }
  };

  const handleSaveDiff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newDiff = {
      id: editingDiff?.id || Date.now(),
      text: formData.get('text') as string,
      display_order: parseInt(formData.get('display_order') as string) || 0
    };

    let updatedDiffs;
    if (editingDiff) {
      updatedDiffs = sectionData.differentiators.map((d: any) => 
        d.id === editingDiff.id ? newDiff : d
      );
    } else {
      updatedDiffs = [...(sectionData.differentiators || []), newDiff];
    }

    try {
      await authenticatedPut(`${ADMIN_API}/content/sections/why_vortix`, {
        content: { ...sectionData, differentiators: updatedDiffs }
      });
      setShowDiffModal(false);
      setEditingDiff(null);
      await fetchData();
      alert(editingDiff ? 'Differentiator updated' : 'Differentiator created');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Save failed');
    }
  };

  const handleDeleteDiff = async (diff: any) => {
    if (!confirm(`Delete "${diff.text}"?`)) return;

    const updatedDiffs = sectionData.differentiators.filter((d: any) => d.id !== diff.id);
    
    try {
      await authenticatedPut(`${ADMIN_API}/content/sections/why_vortix`, {
        content: { ...sectionData, differentiators: updatedDiffs }
      });
      await fetchData();
      alert('Differentiator deleted');
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Why Vortix Section</h1>

        {/* Section Title */}
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
        </form>

        {/* Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Stats</h2>
            <button onClick={() => { setEditingStat(null); setShowStatModal(true); }} className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
              <Plus size={18} />Add Stat
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Label</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Value</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Description</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sectionData?.stats?.map((stat: any) => (
                <tr key={stat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">{stat.display_order}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{stat.label}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{stat.value}{stat.suffix}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{stat.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => { setEditingStat(stat); setShowStatModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteStat(stat)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Differentiators */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Differentiators</h2>
            <button onClick={() => { setEditingDiff(null); setShowDiffModal(true); }} className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
              <Plus size={18} />Add Differentiator
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Text</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sectionData?.differentiators?.map((diff: any) => (
                <tr key={diff.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">{diff.display_order}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{diff.text}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => { setEditingDiff(diff); setShowDiffModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteDiff(diff)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stat Modal */}
        {showStatModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editingStat ? 'Edit' : 'Add'} Stat</h2>
              </div>
              <form onSubmit={handleSaveStat} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Label *</label>
                  <input type="text" name="label" defaultValue={editingStat?.label} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Value *</label>
                    <input type="number" name="value" defaultValue={editingStat?.value} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Suffix</label>
                    <input type="text" name="suffix" defaultValue={editingStat?.suffix} placeholder="+" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <input type="text" name="description" defaultValue={editingStat?.description} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Display Order</label>
                  <input type="number" name="display_order" defaultValue={editingStat?.display_order || 0} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium">{editingStat ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={() => { setShowStatModal(false); setEditingStat(null); }} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Differentiator Modal */}
        {showDiffModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editingDiff ? 'Edit' : 'Add'} Differentiator</h2>
              </div>
              <form onSubmit={handleSaveDiff} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Text *</label>
                  <input type="text" name="text" defaultValue={editingDiff?.text} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Display Order</label>
                  <input type="number" name="display_order" defaultValue={editingDiff?.display_order || 0} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium">{editingDiff ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={() => { setShowDiffModal(false); setEditingDiff(null); }} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


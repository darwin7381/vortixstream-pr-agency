import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { contentAPI, type Stat, type Differentiator } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { TrendingUp, Sparkles, Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminContentWhyVortix() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [differentiators, setDifferentiators] = useState<Differentiator[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [editingDiff, setEditingDiff] = useState<Differentiator | null>(null);
  const [showStatModal, setShowStatModal] = useState(false);
  const [showDiffModal, setShowDiffModal] = useState(false);

  const fetchData = async () => {
    try {
      const [statsData, diffsData] = await Promise.all([
        contentAPI.getAllStats(),
        contentAPI.getAllDifferentiators()
      ]);
      setStats(statsData);
      setDifferentiators(diffsData);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteStat = async (item: Stat) => {
    if ( !confirm(`Are you sure you want to delete「${item.label}」?`)) return;
    
    try {
      await contentAPI.deleteStat(item.id);
      alert('Deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Delete failed');
    }
  };

  const handleSaveStat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      label: formData.get('label') as string,
      value: parseInt(formData.get('value') as string),
      suffix: formData.get('suffix') as string,
      description: formData.get('description') as string,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      if (editingStat) {
        await contentAPI.updateStat(editingStat.id, data);
        alert('Updated successfully');
      } else {
        await contentAPI.createStat(data);
        alert('Created successfully');
      }
      setShowStatModal(false);
      setEditingStat(null);
      fetchData();
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Save failed');
    }
  };

  const handleDeleteDiff = async (item: Differentiator) => {
    if ( !confirm(`Are you sure you want to delete?`)) return;
    
    try {
      await contentAPI.deleteDifferentiator(item.id);
      alert('Deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Delete failed');
    }
  };

  const handleSaveDiff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      text: formData.get('text') as string,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      if (editingDiff) {
        await contentAPI.updateDifferentiator(editingDiff.id, data);
        alert('Updated successfully');
      } else {
        await contentAPI.createDifferentiator(data);
        alert('Created successfully');
      }
      setShowDiffModal(false);
      setEditingDiff(null);
      fetchData();
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
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Why Vortix Section Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage all content for the "Why Vortix Is Different" section</p>
        </div>

        {/* Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Statistics</h2>
            </div>
            <button
              onClick={() => {
                setEditingStat(null);
                setShowStatModal(true);
              }}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              <Plus size={18} />
              Add Stat
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative">
                <div className="text-center mb-3">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}{stat.suffix}</div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">{stat.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.description}</div>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => { setEditingStat(stat); setShowStatModal(true); }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteStat(stat)}
                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Differentiators Features */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Why Vortix Features</h2>
            </div>
            <button
              onClick={() => {
                setEditingDiff(null);
                setShowDiffModal(true);
              }}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              <Plus size={18} />
              Add Feature
            </button>
          </div>

          <div className="space-y-3">
            {differentiators.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-gray-500 dark:text-gray-400 font-medium w-8 text-center flex-shrink-0">{item.display_order}</span>
                <div className="flex-1 text-gray-900 dark:text-white">{item.text}</div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                  item.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                }`}>
                  {item.is_active ? 'Active' : 'Deactivate'}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setEditingDiff(item); setShowDiffModal(true); }}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteDiff(item)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Modal */}
      {showStatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingStat ? 'Edit Stat' : 'Add Stat'}
              </h2>
            </div>
            
            <form onSubmit={handleSaveStat} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Label *</label>
                  <input
                    type="text"
                    name="label"
                    defaultValue={editingStat?.label}
                    required
                    placeholder="Publications"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Value *</label>
                  <input
                    type="number"
                    name="value"
                    defaultValue={editingStat?.value}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-xl font-bold"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  defaultValue={editingStat?.description || ''}
                  placeholder="Media outlets in our global network"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Suffix</label>
                  <input
                    type="text"
                    name="suffix"
                    defaultValue={editingStat?.suffix || '+'}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    defaultValue={editingStat?.display_order || 0}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <label className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer">
                    <input type="checkbox" name="is_active" defaultChecked={editingStat?.is_active ?? true} className="w-5 h-5 text-orange-600 rounded" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                  {editingStat ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => { setShowStatModal(false); setEditingStat(null); }} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
                  Cancel
                </button>
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingDiff ? 'Edit Feature' : 'Add Feature'}
              </h2>
            </div>
            
            <form onSubmit={handleSaveDiff} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Feature Content *
                </label>
                <textarea
                  name="text"
                  defaultValue={editingDiff?.text}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    defaultValue={editingDiff?.display_order || 0}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <label className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="checkbox"
                      name="is_active"
                      defaultChecked={editingDiff?.is_active ?? true}
                      className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                  {editingDiff ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => { setShowDiffModal(false); setEditingDiff(null); }} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}


import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { ADMIN_API, PUBLIC_API } from '../../config/api';
import { authenticatedGet, authenticatedPost, authenticatedPut, authenticatedPatch, authenticatedDelete } from '../../utils/apiClient';
import { Save, Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import ImagePicker from '../../components/admin/ImagePicker';

export default function AdminLyro() {
  const [lyroData, setLyroData] = useState<any>(null);
  const [features, setFeatures] = useState<any[]>([]);
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const fetchData = async () => {
    try {
      const lyro = await fetch(`${PUBLIC_API}/content/lyro`).then(r => r.json());
      const feats = await fetch(`${PUBLIC_API}/content/lyro/features`).then(r => r.json());
      setLyroData(lyro);
      setFeatures(feats);
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveLyro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      label: formData.get('label') as string,
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      description: formData.get('description') as string,
      background_image_url: formData.get('background_image_url') as string,
    };
    await authenticatedPut(`${ADMIN_API}/content/lyro`, data);
    alert('Saved');
    fetchData();
  };

  const handleSaveFeature = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      text: formData.get('text') as string,
      display_order: parseInt(formData.get('display_order') as string),
      is_active: formData.get('is_active') === 'on',
    };
    
    if (editingFeature) {
      await authenticatedPut(`${ADMIN_API}/content/lyro/features/${editingFeature.id}`, data);
    } else {
      await authenticatedPost(`${ADMIN_API}/content/lyro/features`, data);
    }
    setShowModal(false);
    setEditingFeature(null);
    fetchData();
  };

  const handleDeleteFeature = async (feat: any) => {
    if ( !confirm(`Delete ${feat.text}?`)) return;
    await authenticatedDelete(`${ADMIN_API}/content/lyro/features/${feat.id}`);
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-6xl space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lyro Section</h1>

        <form onSubmit={handleSaveLyro} className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Content</h2>
            <button type="submit" className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
              <Save size={18} />Save
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Label</label>
              <input type="text" name="label" defaultValue={lyroData?.label} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title *</label>
              <input type="text" name="title" defaultValue={lyroData?.title} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subtitle</label>
            <input type="text" name="subtitle" defaultValue={lyroData?.subtitle} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea name="description" defaultValue={lyroData?.description} rows={3} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Background Image</label>
            <div className="flex gap-2 mb-2">
              <input type="url" name="background_image_url" id="background_image_url" defaultValue={lyroData?.background_image_url} className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              <button type="button" onClick={() => setShowImagePicker(true)} className="px-4 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20">
                <ImageIcon size={20} />
              </button>
            </div>
            {lyroData?.background_image_url && <img src={lyroData.background_image_url} alt="Preview" className="h-24 object-contain" />}
          </div>
        </form>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Capabilities</h2>
            <button onClick={() => { setEditingFeature(null); setShowModal(true); }} className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
              <Plus size={18} />Add Feature
            </button>
          </div>
          <div className="space-y-3">
            {features.map(feat => (
              <div key={feat.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <span className="text-gray-500 dark:text-gray-400 font-medium w-8 text-center">{feat.display_order}</span>
                <div className="flex-1 text-gray-900 dark:text-white">{feat.text}</div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingFeature(feat); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDeleteFeature(feat)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editingFeature ? 'Edit' : 'Add'} Feature</h2>
            </div>
            <form onSubmit={handleSaveFeature} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Feature Text *</label>
                <input type="text" name="text" defaultValue={editingFeature?.text} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Order</label>
                  <input type="number" name="display_order" defaultValue={editingFeature?.display_order ?? 0} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <label className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer">
                    <input type="checkbox" name="is_active" defaultChecked={editingFeature?.is_active ?? true} className="w-5 h-5 text-orange-600 rounded" />
                    <span className="text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium">{editingFeature ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setShowModal(false); setEditingFeature(null); }} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ImagePicker isOpen={showImagePicker} onClose={() => setShowImagePicker(false)} onSelect={(url) => { 
        const input = document.getElementById('background_image_url') as HTMLInputElement;
        if (input) input.value = url;
        setShowImagePicker(false); 
      }} currentUrl={lyroData?.background_image_url} defaultFolder="lyro" />
    </AdminLayout>
  );
}




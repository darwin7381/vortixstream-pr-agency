import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ADMIN_API } from '../../config/api';

interface PublisherFeature {
  id: number;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

export default function AdminContentPublisher() {
  const token = localStorage.getItem('access_token');
  const [features, setFeatures] = useState<PublisherFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PublisherFeature | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${ADMIN_API}/content/publisher-features`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setFeatures(data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleDelete = async (item: PublisherFeature) => {
    if (!token || !confirm(`Are you sure you want to delete「${item.title}」?`)) return;
    
    try {
      await fetch(`${ADMIN_API}/content/publisher-features/${item.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Deleted successfully');
      fetchData();
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      if (editing) {
        await fetch(`${ADMIN_API}/content/publisher-features/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(data),
        });
        alert('Updated successfully');
      } else {
        await fetch(`${ADMIN_API}/content/publisher-features`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(data),
        });
        alert('Created successfully');
      }
      setShowModal(false);
      setEditing(null);
      fetchData();
    } catch (error) {
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Publisher Features Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Total {features.length}  features</p>
          </div>
          <button onClick={() => { setEditing(null); setShowModal(true); }} className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm">
            <Plus size={20} />
            Add Feature
          </button>
        </div>

        <div className="space-y-3">
          {features.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4">
              <span className="text-gray-500 dark:text-gray-400 font-medium w-8 text-center flex-shrink-0">{item.display_order}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">{item.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${item.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800'}`}>
                {item.is_active ? 'Active' : 'Deactivate'}
              </span>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(item); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editing ? 'Edit Feature' : 'Add Feature'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                <input type="text" name="title" defaultValue={editing?.title} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                <textarea name="description" defaultValue={editing?.description} required rows={3} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Display Order</label>
                  <input type="number" name="display_order" defaultValue={editing?.display_order || 0} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <label className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer">
                    <input type="checkbox" name="is_active" defaultChecked={editing?.is_active ?? true} className="w-5 h-5 text-orange-600 rounded" />
                    <span className="text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium">{editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}


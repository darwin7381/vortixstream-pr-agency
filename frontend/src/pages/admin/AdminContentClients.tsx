import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../hooks/useAuth';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import ImagePicker from '../../components/admin/ImagePicker';
import { ADMIN_API } from '../../config/api';

interface ClientLogo {
  id: number;
  name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
}

export default function AdminContentClients() {
  const token = localStorage.getItem('access_token');
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ClientLogo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [selectedLogoUrl, setSelectedLogoUrl] = useState('');

  const fetchData = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${ADMIN_API}/content/clients`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleDelete = async (item: ClientLogo) => {
    if (!token || !confirm(`Are you sure you want to delete「${item.name}」?`)) return;
    
    try {
      await fetch(`${ADMIN_API}/content/clients/${item.id}`, {
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
      name: formData.get('name') as string,
      logo_url: selectedLogoUrl || formData.get('logo_url') as string,
      website_url: formData.get('website_url') as string || null,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      if (editing) {
        await fetch(`${ADMIN_API}/content/clients/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(data),
        });
        alert('Updated successfully');
      } else {
        await fetch(`${ADMIN_API}/content/clients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(data),
        });
        alert('Created successfully');
      }
      setShowModal(false);
      setEditing(null);
      setSelectedLogoUrl('');
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Client Logo Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Total {clients.length} clients</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Displayed as "Trusted by industry leaders" on homepage</p>
          </div>
          <button
            onClick={() => { setEditing(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Client
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {clients.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {item.logo_url ? (
                  <img src={item.logo_url} alt={item.name} className="max-w-full max-h-full object-contain p-2" />
                ) : (
                  <div className="text-gray-400 text-sm">No Logo</div>
                )}
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-2">{item.name}</div>
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs px-2 py-1 rounded ${item.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                  {item.is_active ? 'Active' : 'Deactivate'}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(item); setSelectedLogoUrl(item.logo_url); setShowModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(item)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editing ? 'Edit Client' : 'Add Client'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                <input type="text" name="name" defaultValue={editing?.name} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Logo *</label>
                <div className="flex gap-2 mb-2">
                  <input type="url" name="logo_url" value={selectedLogoUrl} onChange={(e) => setSelectedLogoUrl(e.target.value)} required className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  <button type="button" onClick={() => setShowImagePicker(true)} className="px-4 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    <ImageIcon size={20} />
                  </button>
                </div>
                {selectedLogoUrl && <img src={selectedLogoUrl} alt="Preview" className="h-16 object-contain border border-gray-300 dark:border-gray-600 rounded p-2" />}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Website URL</label>
                <input type="url" name="website_url" defaultValue={editing?.website_url || ''} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
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
                <button type="submit" className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                  {editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); setSelectedLogoUrl(''); }} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ImagePicker isOpen={showImagePicker} onClose={() => setShowImagePicker(false)} onSelect={(url) => { setSelectedLogoUrl(url); setShowImagePicker(false); }} currentUrl={selectedLogoUrl} defaultFolder="clients" />
    </AdminLayout>
  );
}



import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { contentAPI, type Service } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminContentServices() {
  const token = localStorage.getItem('access_token');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    if (!token) return;
    try {
      const data = await contentAPI.getAllServices(token);
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleDelete = async (item: Service) => {
    if (!token || !confirm(`Are you sure you want to delete「${item.title}」?`)) return;
    
    try {
      await contentAPI.deleteService(item.id, token);
      alert('ServiceDeleted successfully');
      fetchData();
    } catch (error) {
      console.error('Failed to delete:', error);
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
      icon: formData.get('icon') as string || null,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      if (editingItem) {
        await contentAPI.updateService(editingItem.id, data, token);
        alert('ServiceUpdated successfully');
      } else {
        await contentAPI.createService(data, token);
        alert('ServiceCreated successfully');
      }
      setShowModal(false);
      setEditingItem(null);
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Services Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Total {services.length}  services</p>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Service
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-16">
                  Display Order
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-64">
                  Title
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-24">
                  Icon
                </th>
                <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-24">
                  Status
                </th>
                <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-32 sticky right-0 bg-gray-50 dark:bg-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {services.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">{item.display_order}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 max-w-md truncate">
                      {item.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {item.icon || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      item.is_active 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}>
                      {item.is_active ? 'Active' : 'Deactivate'}
                    </span>
                  </td>
                  <td className="px-4 py-4 sticky right-0 bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setShowModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {services.length === 0 && (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              No services found. Click the "Add Service" button above to create one
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Service' : 'Add Service'}
              </h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingItem?.title}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  defaultValue={editingItem?.description}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    IconName
                  </label>
                  <input
                    type="text"
                    name="icon"
                    defaultValue={editingItem?.icon || ''}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="globe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    defaultValue={editingItem?.display_order || 0}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <label className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="checkbox"
                      name="is_active"
                      defaultChecked={editingItem?.is_active ?? true}
                      className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
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


import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { contentAPI, type Testimonial } from '../../api/client';
import { useAuth } from '../../hooks/useAuth';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import ImagePicker from '../../components/admin/ImagePicker';

export default function AdminContentTestimonials() {
  const { token } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState('');

  const fetchData = async () => {
    if (!token) return;
    try {
      const data = await contentAPI.getAllTestimonials(token);
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleDelete = async (item: Testimonial) => {
    if (!token || !confirm(`Are you sure you want to delete ${item.author_name} ?`)) return;
    
    try {
      await contentAPI.deleteTestimonial(item.id, token);
      alert('testimonialDeleted successfully');
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
      quote: formData.get('quote') as string,
      author_name: formData.get('author_name') as string,
      author_title: formData.get('author_title') as string || null,
      author_company: formData.get('author_company') as string || null,
      author_avatar_url: formData.get('author_avatar_url') as string || null,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      if (editingItem) {
        await contentAPI.updateTestimonial(editingItem.id, data, token);
        alert('testimonialUpdated successfully');
      } else {
        await contentAPI.createTestimonial(data, token);
        alert('testimonialCreated successfully');
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Testimonials Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Total {testimonials.length}  testimonials</p>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Testimonial
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-4">
                {item.author_avatar_url ? (
                  <img
                    src={item.author_avatar_url}
                    alt={item.author_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                    {item.author_name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">{item.author_name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.author_title}
                    {item.author_company && ` at ${item.author_company}`}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                "{item.quote}"
              </p>

              <div className="flex items-center justify-between">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                  item.is_active 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                }`}>
                  {item.is_active ? 'Active' : 'Deactivate'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setShowModal(true);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No testimonials found. Click the "Add Testimonial" button above to create one</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Testimonial Content *
                </label>
                <textarea
                  name="quote"
                  defaultValue={editingItem?.quote}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Enter testimonial"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="author_name"
                    defaultValue={editingItem?.author_name}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="author_title"
                    defaultValue={editingItem?.author_title || ''}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="author_company"
                    defaultValue={editingItem?.author_company || ''}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Avatar
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      name="author_avatar_url"
                      value={selectedAvatarUrl || editingItem?.author_avatar_url || ''}
                      onChange={(e) => setSelectedAvatarUrl(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Image URL"
                    />
                    <button
                      type="button"
                      onClick={() => setShowImagePicker(true)}
                      className="px-4 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                    >
                      <ImageIcon size={20} />
                    </button>
                  </div>
                  {(selectedAvatarUrl || editingItem?.author_avatar_url) && (
                    <img
                      src={selectedAvatarUrl || editingItem?.author_avatar_url || ''}
                      alt="Preview"
                      className="mt-2 w-20 h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

      {/* Image Picker */}
      <ImagePicker
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={(url) => {
          setSelectedAvatarUrl(url);
          setShowImagePicker(false);
        }}
        currentUrl={selectedAvatarUrl || editingItem?.author_avatar_url || ''}
        defaultFolder="avatars"
      />
    </AdminLayout>
  );
}


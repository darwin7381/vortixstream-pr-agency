import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2, Image as ImageIcon, Save } from 'lucide-react';
import ImagePicker from '../../components/admin/ImagePicker';
import { ADMIN_API } from '../../config/api';
import { authenticatedGet, authenticatedPost, authenticatedPut, authenticatedDelete } from '../../utils/apiClient';

interface CarouselLogo {
  id: number;
  name: string;
  logo_url: string;
  alt_text: string | null;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
}

export default function AdminContentCarousel() {
  const [logos, setLogos] = useState<CarouselLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CarouselLogo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [selectedLogoUrl, setSelectedLogoUrl] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [subtitleEnabled, setSubtitleEnabled] = useState(true);
  const [subtitleLoading, setSubtitleLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await authenticatedGet(`${ADMIN_API}/content/carousel-logos`);
      const data = await response.json();
      setLogos(data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubtitle = async () => {
    try {
      const response = await authenticatedGet(`${ADMIN_API}/settings`);
      const data = await response.json();
      const setting = data.find((s: any) => s.setting_key === 'carousel_subtitle');
      if (setting) {
        setSubtitle(setting.setting_value);
        // 如果設定值為空，表示停用
        setSubtitleEnabled(setting.setting_value !== '');
      }
    } catch (error) {
      console.error('Failed to fetch subtitle:', error);
    }
  };

  const handleSubtitleSave = async () => {
    setSubtitleLoading(true);
    try {
      // 如果停用，則儲存空字串；如果啟用，儲存輸入的文字
      const valueToSave = subtitleEnabled ? subtitle : '';
      
      const response = await authenticatedPatch(`${ADMIN_API}/settings/carousel_subtitle`, { setting_value: valueToSave });
      
      if (!response.ok) {
        throw new Error('Failed to update');
      }
      
      alert('Subtitle updated successfully');
    } catch (error) {
      console.error('Failed to update subtitle:', error);
      alert('Failed to update subtitle');
    } finally {
      setSubtitleLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSubtitle();
  }, []);

  const handleDelete = async (item: CarouselLogo) => {
    if ( !confirm(`Are you sure you want to delete「${item.name}」?`)) return;
    
    try {
      await authenticatedDelete(`${ADMIN_API}/content/carousel-logos/${item.id}`);
      alert('Deleted successfully');
      fetchData();
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      logo_url: selectedLogoUrl || formData.get('logo_url') as string,
      alt_text: (formData.get('alt_text') as string) || '',  // ✅ 修復：送空字串而非 null
      website_url: (formData.get('website_url') as string) || '',  // ✅ 修復：送空字串而非 null
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      if (editing) {
        await authenticatedPut(`${ADMIN_API}/content/carousel-logos/${editing.id}`, data);
        alert('Updated successfully');
      } else {
        await authenticatedPost(`${ADMIN_API}/content/carousel-logos`, data);
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Logo Carousel Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Total {logos.length} media logos</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Displayed in the homepage carousel section</p>
          </div>
          <button
            onClick={() => { setEditing(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Logo
          </button>
        </div>

        {/* Subtitle Editor */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Section Subtitle</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This subtitle appears above the logo carousel on the homepage
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {subtitleEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={subtitleEnabled}
                  onChange={(e) => setSubtitleEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
              </div>
            </label>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              disabled={!subtitleEnabled}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={subtitleEnabled ? "Enter carousel subtitle..." : "Disabled - Toggle to enable"}
            />
            <button
              onClick={handleSubtitleSave}
              disabled={subtitleLoading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {subtitleLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
          {!subtitleEnabled && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              ⚠️ Subtitle is currently disabled. The section will be hidden on the homepage.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {logos.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {item.logo_url ? (
                  <img src={item.logo_url} alt={item.alt_text || item.name} className="max-w-full max-h-full object-contain p-2" />
                ) : (
                  <div className="text-gray-400 text-sm">No Logo</div>
                )}
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-2" title={item.name}>
                {item.name}
              </div>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editing ? 'Edit Logo' : 'Add Logo'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Media Name *</label>
                <input type="text" name="name" defaultValue={editing?.name} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="e.g., BlockTempo, Business Insider" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Logo URL *</label>
                <div className="flex gap-2 mb-2">
                  <input type="url" name="logo_url" value={selectedLogoUrl} onChange={(e) => setSelectedLogoUrl(e.target.value)} required className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="https://..." />
                  <button type="button" onClick={() => setShowImagePicker(true)} className="px-4 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    <ImageIcon size={20} />
                  </button>
                </div>
                {selectedLogoUrl && (
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <img src={selectedLogoUrl} alt="Preview" className="h-16 object-contain mx-auto" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Alt Text (SEO)</label>
                <input type="text" name="alt_text" defaultValue={editing?.alt_text || ''} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="e.g., BlockTempo Logo" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">For accessibility and SEO. If empty, media name will be used.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Website URL (Optional)</label>
                <input type="url" name="website_url" defaultValue={editing?.website_url || ''} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="https://..." />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Link to media's website (for future use)</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Display Order</label>
                  <input type="number" name="display_order" defaultValue={editing?.display_order || 0} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lower numbers appear first</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <label className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
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

      <ImagePicker isOpen={showImagePicker} onClose={() => setShowImagePicker(false)} onSelect={(url) => { setSelectedLogoUrl(url); setShowImagePicker(false); }} currentUrl={selectedLogoUrl} defaultFolder="media-logos" />
    </AdminLayout>
  );
}


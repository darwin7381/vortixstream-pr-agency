import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { ADMIN_API } from '../../config/api';
import { authenticatedGet, authenticatedPost, authenticatedPut, authenticatedPatch, authenticatedDelete } from '../../utils/apiClient';
import { Save, Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import ImagePicker from '../../components/admin/ImagePicker';

interface HeroSection {
  page: string;
  title_prefix: string | null;
  title_highlight: string | null;
  title_suffix: string | null;
  subtitle: string | null;
  cta_primary_text: string | null;
  cta_primary_url: string | null;
  cta_secondary_text: string | null;
  cta_secondary_url: string | null;
}

interface MediaLogo {
  id: number;
  name: string;
  logo_url: string;
  opacity: number;
  size: string;
  position_top: string | null;
  position_left: string | null;
  position_right: string | null;
  display_order: number;
  is_active: boolean;
}

export default function AdminHeroManagement() {
  const [currentPage, setCurrentPage] = useState('home');
  const [heroData, setHeroData] = useState<HeroSection | null>(null);
  const [logos, setLogos] = useState<MediaLogo[]>([]);
  const [editingLogo, setEditingLogo] = useState<MediaLogo | null>(null);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [selectedLogoUrl, setSelectedLogoUrl] = useState('');

  const fetchData = async () => {
    try {
      const [hero, logosList] = await Promise.all([
        authenticatedGet(`${ADMIN_API}/content/hero`).then(r => r.json()),
        authenticatedGet(`${ADMIN_API}/content/hero/${currentPage}/logos`).then(r => r.json())
      ]);
      const pageHero = hero.find((h: any) => h.page === currentPage);
      setHeroData(pageHero || null);
      setLogos(logosList);
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, token]);

  const handleSaveHero = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title_prefix: formData.get('title_prefix') as string,
      title_highlight: formData.get('title_highlight') as string,
      title_suffix: formData.get('title_suffix') as string,
      subtitle: formData.get('subtitle') as string,
      cta_primary_text: formData.get('cta_primary_text') as string,
      cta_primary_url: formData.get('cta_primary_url') as string,
      cta_secondary_text: formData.get('cta_secondary_text') as string,
      cta_secondary_url: formData.get('cta_secondary_url') as string,
    };
    await authenticatedPut(`${ADMIN_API}/content/hero/${currentPage}`, data);
    alert('Updated');
    fetchData();
  };

  const handleSaveLogo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      hero_page: currentPage,
      name: formData.get('name') as string,
      logo_url: selectedLogoUrl || formData.get('logo_url') as string,
      opacity: parseFloat(formData.get('opacity') as string),
      size: formData.get('size') as string,
      position_top: formData.get('position_top') as string,
      position_left: formData.get('position_left') as string || null,
      position_right: formData.get('position_right') as string || null,
      display_order: parseInt(formData.get('display_order') as string),
      is_active: formData.get('is_active') === 'on',
    };
    
    if (editingLogo) {
      await authenticatedPut(`${ADMIN_API}/content/hero-logos/${editingLogo.id}`, data);
    } else {
      await authenticatedPost(`${ADMIN_API}/content/hero/${currentPage}/logos`, data);
    }
    setShowLogoModal(false);
    setEditingLogo(null);
    setSelectedLogoUrl('');
    fetchData();
  };

  const handleDeleteLogo = async (logo: MediaLogo) => {
    if ( !confirm(`Delete ${logo.name}?`)) return;
    await authenticatedDelete(`${ADMIN_API}/content/hero-logos/${logo.id}`);
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hero Section Management</h1>
          <div className="flex gap-2 mt-4">
            {['home', 'about', 'services', 'publisher'].map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSaveHero} className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Content</h2>
            <button type="submit" className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
              <Save size={18} />Save
            </button>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title Prefix</label>
            <input type="text" name="title_prefix" defaultValue={heroData?.title_prefix || ''} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title Highlight (Typewriter)</label>
            <input type="text" name="title_highlight" defaultValue={heroData?.title_highlight || ''} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subtitle</label>
            <input type="text" name="subtitle" defaultValue={heroData?.subtitle || ''} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Primary CTA Text</label>
              <input type="text" name="cta_primary_text" defaultValue={heroData?.cta_primary_text || ''} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Primary CTA URL</label>
              <input type="text" name="cta_primary_url" defaultValue={heroData?.cta_primary_url || ''} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Secondary CTA Text</label>
              <input type="text" name="cta_secondary_text" defaultValue={heroData?.cta_secondary_text || ''} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Secondary CTA URL</label>
              <input type="text" name="cta_secondary_url" defaultValue={heroData?.cta_secondary_url || ''} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
          </div>
        </form>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Media Cloud Logos</h2>
            <button onClick={() => { setEditingLogo(null); setShowLogoModal(true); }} className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
              <Plus size={18} />Add Logo
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {logos.map(logo => (
              <div key={logo.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <img src={logo.logo_url} alt={logo.name} className="h-12 object-contain mb-2" />
                <div className="text-sm text-gray-900 dark:text-white font-semibold">{logo.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Top: {logo.position_top}, {logo.position_left ? `Left: ${logo.position_left}` : `Right: ${logo.position_right}`}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Opacity: {logo.opacity}, Size: {logo.size}</div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { setEditingLogo(logo); setSelectedLogoUrl(logo.logo_url); setShowLogoModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDeleteLogo(logo)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showLogoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editingLogo ? 'Edit' : 'Add'} Media Logo</h2>
            </div>
            <form onSubmit={handleSaveLogo} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                <input type="text" name="name" defaultValue={editingLogo?.name} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Logo *</label>
                <div className="flex gap-2 mb-2">
                  <input type="url" name="logo_url" value={selectedLogoUrl} onChange={(e) => setSelectedLogoUrl(e.target.value)} required className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  <button type="button" onClick={() => setShowImagePicker(true)} className="px-4 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    <ImageIcon size={20} />
                  </button>
                </div>
                {selectedLogoUrl && <img src={selectedLogoUrl} alt="Preview" className="h-16 object-contain" />}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Opacity (0-1)</label>
                  <input type="number" step="0.01" min="0" max="1" name="opacity" defaultValue={editingLogo?.opacity || 0.5} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Size</label>
                  <select name="size" defaultValue={editingLogo?.size || 'md'} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Order</label>
                  <input type="number" name="display_order" defaultValue={editingLogo?.display_order || 0} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Position Top (%)</label>
                <input type="text" name="position_top" defaultValue={editingLogo?.position_top || ''} placeholder="20%" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Left (%)</label>
                  <input type="text" name="position_left" defaultValue={editingLogo?.position_left || ''} placeholder="10%" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Right (%)</label>
                  <input type="text" name="position_right" defaultValue={editingLogo?.position_right || ''} placeholder="15%" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="is_active" defaultChecked={editingLogo?.is_active ?? true} className="w-5 h-5 text-orange-600 rounded" />
                  <span className="text-gray-700 dark:text-gray-300">Active</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium">{editingLogo ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setShowLogoModal(false); setEditingLogo(null); setSelectedLogoUrl(''); }} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ImagePicker isOpen={showImagePicker} onClose={() => setShowImagePicker(false)} onSelect={(url) => { setSelectedLogoUrl(url); setShowImagePicker(false); }} currentUrl={selectedLogoUrl} defaultFolder="hero" />
    </AdminLayout>
  );
}


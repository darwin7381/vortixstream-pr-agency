import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { ADMIN_API, PUBLIC_API } from '../../config/api';
import { authenticatedGet, authenticatedPost, authenticatedPut, authenticatedPatch, authenticatedDelete } from '../../utils/apiClient';
import { Save, Plus, Trash2, Image as ImageIcon, Edit } from 'lucide-react';
import ImagePicker from '../../components/admin/ImagePicker';
import SectionIdsHint from '../../components/admin/shared/SectionIdsHint';

export default function AdminHeroHome() {
  const [heroData, setHeroData] = useState<any>(null);
  const [typewriterTexts, setTypewriterTexts] = useState<string[]>(['Web3 & AI']);
  const [logos, setLogos] = useState<any[]>([]);
  const [editingLogo, setEditingLogo] = useState<any>(null);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerField, setImagePickerField] = useState('');
  const [selectedUrl, setSelectedUrl] = useState('');

  const fetchData = async () => {
    try {
      const hero = await fetch(`${PUBLIC_API}/content/hero/home`).then(r => r.json());
      const logosList = await fetch(`${PUBLIC_API}/content/hero/home/logos`).then(r => r.json());
      setHeroData(hero);
      setTypewriterTexts(hero.title_highlights || ['Web3 & AI']);
      setLogos(logosList);
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveHero = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title_prefix: formData.get('title_prefix') as string,
      title_highlights: typewriterTexts,
      subtitle: formData.get('subtitle') as string,
      center_logo_url: formData.get('center_logo_url') as string,
      cta_primary_text: formData.get('cta_primary_text') as string,
      cta_primary_url: formData.get('cta_primary_url') as string,
      cta_primary_url_mobile: formData.get('cta_primary_url_mobile') as string,
      cta_secondary_text: formData.get('cta_secondary_text') as string,
      cta_secondary_url: formData.get('cta_secondary_url') as string,
      cta_secondary_url_mobile: formData.get('cta_secondary_url_mobile') as string,
    };
    await authenticatedPut(`${ADMIN_API}/content/hero/home`, data);
    alert('Saved');
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Hero Section (首頁)</h1>

        <form onSubmit={handleSaveHero} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Content</h2>
              <button type="submit" className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
                <Save size={18} />Save
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title Prefix</label>
              <input type="text" name="title_prefix" defaultValue={heroData?.title_prefix} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title Highlights (Typewriter - 會切換)</label>
              {typewriterTexts.map((text, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input type="text" value={text} onChange={(e) => { const newTexts = [...typewriterTexts]; newTexts[index] = e.target.value; setTypewriterTexts(newTexts); }} className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  {typewriterTexts.length > 1 && (
                    <button type="button" onClick={() => setTypewriterTexts(typewriterTexts.filter((_, i) => i !== index))} className="px-4 py-3 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setTypewriterTexts([...typewriterTexts, ''])} className="flex items-center gap-2 text-orange-600 border-2 border-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20">
                <Plus size={18} />新增打字機文字
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Center Logo</label>
              <div className="flex gap-2 mb-2">
                <input type="url" name="center_logo_url" id="center_logo_url" defaultValue={heroData?.center_logo_url} className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                <button type="button" onClick={() => { setImagePickerField('center_logo'); setSelectedUrl(heroData?.center_logo_url); setShowImagePicker(true); }} className="px-4 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20">
                  <ImageIcon size={20} />
                </button>
              </div>
              {heroData?.center_logo_url && <img src={heroData.center_logo_url} alt="Center Logo Preview" className="h-20 object-contain bg-gray-900 p-2 rounded" />}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subtitle</label>
              <textarea name="subtitle" defaultValue={heroData?.subtitle} rows={2} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none" />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Call-to-Action Buttons</h3>
              
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Primary CTA Text</label>
                  <input type="text" name="cta_primary_text" defaultValue={heroData?.cta_primary_text} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Desktop URL</label>
                  <input type="text" name="cta_primary_url" defaultValue={heroData?.cta_primary_url} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mobile URL</label>
                  <input type="text" name="cta_primary_url_mobile" defaultValue={heroData?.cta_primary_url_mobile} placeholder="同 Desktop" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
              </div>


              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Secondary CTA Text</label>
                  <input type="text" name="cta_secondary_text" defaultValue={heroData?.cta_secondary_text} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Desktop URL</label>
                  <input type="text" name="cta_secondary_url" defaultValue={heroData?.cta_secondary_url} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mobile URL</label>
                  <input type="text" name="cta_secondary_url_mobile" defaultValue={heroData?.cta_secondary_url_mobile} placeholder="同 Desktop" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
            </div>

              {/* Section ID Reference */}
              <SectionIdsHint />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Media Cloud Logos</h2>
              <button type="button" onClick={() => { setEditingLogo(null); setSelectedUrl(''); setShowLogoModal(true); }} className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                <Plus size={18} />Add Logo
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {logos.map(logo => (
                <div key={logo.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <img src={logo.logo_url} alt={logo.name} className="h-12 object-contain mb-2" />
                  <div className="text-sm text-gray-900 dark:text-white font-semibold">{logo.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mt-2">
                    <div>Top: {logo.position_top}</div>
                    <div>{logo.position_left ? `Left: ${logo.position_left}` : `Right: ${logo.position_right}`}</div>
                    <div>Opacity: {logo.opacity}, Size: {logo.size}</div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button type="button" onClick={() => { setEditingLogo(logo); setSelectedUrl(logo.logo_url); setShowLogoModal(true); }} className="flex-1 p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                      <Edit size={16} />
                    </button>
                    <button type="button" onClick={async () => { if (confirm(`Delete ${logo.name}?`)) { await authenticatedDelete(`${ADMIN_API}/content/hero-logos/${logo.id}`); fetchData(); }}} className="flex-1 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        {showLogoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editingLogo ? 'Edit' : 'Add'} Media Logo</h2>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  hero_page: 'home',
                  name: formData.get('name') as string,
                  logo_url: selectedUrl,
                  opacity: parseFloat(formData.get('opacity') as string),
                  size: formData.get('size') as string,
                  position_top: formData.get('position_top') as string,
                  position_left: (formData.get('position_left') as string) || '',  // ✅ 修復：送空字串而非 null
                  position_right: (formData.get('position_right') as string) || '',  // ✅ 修復：送空字串而非 null
                  display_order: parseInt(formData.get('display_order') as string),
                  is_active: true,
                };
                if (editingLogo) {
                  await authenticatedPut(`${ADMIN_API}/content/hero-logos/${editingLogo.id}`, data);
                } else {
                  await authenticatedPost(`${ADMIN_API}/content/hero/home/logos`, data);
                }
                setShowLogoModal(false);
                fetchData();
              }} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                  <input type="text" name="name" defaultValue={editingLogo?.name} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Logo *</label>
                  <div className="flex gap-2 mb-2">
                    <input type="url" value={selectedUrl} onChange={(e) => setSelectedUrl(e.target.value)} required className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                    <button type="button" onClick={() => { setImagePickerField('logo'); setShowImagePicker(true); }} className="px-4 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20">
                      <ImageIcon size={20} />
                    </button>
                  </div>
                  {selectedUrl && <img src={selectedUrl} alt="Preview" className="h-16 object-contain bg-gray-900 p-2 rounded" />}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Opacity (0-1)</label>
                    <input type="number" step="0.01" min="0" max="1" name="opacity" defaultValue={editingLogo?.opacity ?? 0.5} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Size</label>
                    <select name="size" defaultValue={editingLogo?.size ?? 'md'} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Order</label>
                    <input type="number" name="display_order" defaultValue={editingLogo?.display_order ?? 0} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  </div>
                </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Position Top (%)</label>
                    <input type="text" name="position_top" defaultValue={editingLogo?.position_top} placeholder="20%" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Left (%) - 與 Right 擇一</label>
                    <input type="text" name="position_left" defaultValue={editingLogo?.position_left} placeholder="10%" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Right (%)</label>
                    <input type="text" name="position_right" defaultValue={editingLogo?.position_right} placeholder="15%" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium">{editingLogo ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={() => { setShowLogoModal(false); setEditingLogo(null); setSelectedUrl(''); }} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ImagePicker isOpen={showImagePicker} onClose={() => setShowImagePicker(false)} onSelect={(url) => { 
          if (imagePickerField === 'center_logo') {
            const input = document.getElementById('center_logo_url') as HTMLInputElement;
            if (input) input.value = url;
          } else {
            setSelectedUrl(url);
          }
          setShowImagePicker(false); 
        }} currentUrl={selectedUrl} defaultFolder="hero" />
      </div>
    </AdminLayout>
  );
}


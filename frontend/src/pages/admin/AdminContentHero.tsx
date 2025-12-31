import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../hooks/useAuth';
import { Save } from 'lucide-react';
import { ADMIN_API } from '../../config/api';

interface HeroSection {
  id: number;
  page: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cta_primary_text: string | null;
  cta_primary_url: string | null;
  cta_secondary_text: string | null;
  cta_secondary_url: string | null;
  background_image_url: string | null;
  is_active: boolean;
}

export default function AdminContentHero() {
  const token = localStorage.getItem('access_token');
  const [heroes, setHeroes] = useState<HeroSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [currentPage, setCurrentPage] = useState('');

  const fetchData = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${ADMIN_API}/content/hero`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setHeroes(data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>, page: string) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get(`${page}_title`) as string,
      subtitle: formData.get(`${page}_subtitle`) as string || null,
      description: formData.get(`${page}_description`) as string || null,
      cta_primary_text: formData.get(`${page}_cta_primary_text`) as string || null,
      cta_primary_url: formData.get(`${page}_cta_primary_url`) as string || null,
      cta_secondary_text: formData.get(`${page}_cta_secondary_text`) as string || null,
      cta_secondary_url: formData.get(`${page}_cta_secondary_url`) as string || null,
      background_image_url: formData.get(`${page}_background_image_url`) as string || null,
    };

    try {
      await fetch(`${ADMIN_API}/content/hero/${page}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      alert('Updated successfully');
      fetchData();
    } catch (error) {
      alert('Update failed');
    }
  };

  const getHeroForPage = (page: string) => heroes.find(h => h.page === page);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  const pages = ['home', 'about', 'services', 'publisher'];
  const pageLabels: Record<string, string> = {
    home: 'Home',
    about: 'About Us',
    services: 'Services',
    publisher: 'Publisher'
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hero Section Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage Hero sections for all pages</p>
        </div>

        <div className="space-y-6">
          {pages.map(page => {
            const hero = getHeroForPage(page);
            return (
              <div key={page} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{pageLabels[page]}</h2>
                  <button type="submit" form={`form-${page}`} className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm">
                    <Save size={16} />
                    Save
                  </button>
                </div>
                <form id={`form-${page}`} onSubmit={(e) => handleSave(e, page)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Main Title *</label>
                    <input type="text" name={`${page}_title`} defaultValue={hero?.title || ''} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subtitle</label>
                      <input type="text" name={`${page}_subtitle`} defaultValue={hero?.subtitle || ''} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                      <input type="text" name={`${page}_description`} defaultValue={hero?.description || ''} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Primary CTA Text</label>
                      <input type="text" name={`${page}_cta_primary_text`} defaultValue={hero?.cta_primary_text || ''} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Secondary CTA Text</label>
                      <input type="text" name={`${page}_cta_secondary_text`} defaultValue={hero?.cta_secondary_text || ''} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                    </div>
                  </div>
                </form>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}


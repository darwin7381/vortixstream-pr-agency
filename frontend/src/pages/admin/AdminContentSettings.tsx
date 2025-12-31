import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { contentAPI } from '../../api/client';
import { useAuth } from '../../hooks/useAuth';
import { Save, Image, Mail, Share2 } from 'lucide-react';
import ImagePicker from '../../components/admin/ImagePicker';

interface Setting {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description: string;
  updated_at: string;
}

export default function AdminContentSettings() {
  const token = localStorage.getItem('access_token');
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [currentLogoField, setCurrentLogoField] = useState<string>('');

  const fetchSettings = async () => {
    if (!token) return;
    try {
      const data = await contentAPI.getAllSettings(token);
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const handleUpdate = async (key: string, value: string) => {
    if (!token) return;
    setSaving(key);
    
    try {
      await contentAPI.updateSiteSetting(key, value, token);
      fetchSettings();
    } catch (error) {
      console.error('Failed to update:', error);
      alert('Update failed');
    } finally {
      setSaving(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData(e.currentTarget);
    const updates: Promise<any>[] = [];

    settings.forEach(setting => {
      const value = formData.get(setting.setting_key) as string;
      if (value !== setting.setting_value) {
        updates.push(contentAPI.updateSiteSetting(setting.setting_key, value, token));
      }
    });

    if (updates.length === 0) {
      alert('No changes');
      return;
    }

    try {
      await Promise.all(updates);
      alert(`Successfully updated ${updates.length} settings`);
      fetchSettings();
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Update failed');
    }
  };

  const getSettingsByCategory = (prefix: string) => {
    return settings.filter(s => s.setting_key.startsWith(prefix));
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage basic site settings and social links</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Image className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Basic Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getSettingsByCategory('site_').map(setting => {
                const isLogoField = setting.setting_key.startsWith('site_logo');
                const logoValue = settings.find(s => s.setting_key === setting.setting_key)?.setting_value || setting.setting_value;
                
                return (
                  <div key={setting.id}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {setting.description}
                    </label>
                    {isLogoField ? (
                      <div>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            name={setting.setting_key}
                            id={setting.setting_key}
                            defaultValue={setting.setting_value}
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="Logo URL"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentLogoField(setting.setting_key);
                              setShowImagePicker(true);
                            }}
                            className="px-4 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                          >
                            <Image size={20} />
                          </button>
                        </div>
                        {logoValue && (
                          <img
                            src={logoValue}
                            alt="Logo Preview"
                            className="mt-2 h-12 object-contain"
                          />
                        )}
                      </div>
                    ) : (
                      <input
                        type={setting.setting_type === 'url' ? 'url' : 'text'}
                        name={setting.setting_key}
                        defaultValue={setting.setting_value}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder={setting.description}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getSettingsByCategory('contact_').map(setting => (
                <div key={setting.id}>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {setting.description}
                  </label>
                  <input
                    type={setting.setting_type === 'email' ? 'email' : 'text'}
                    name={setting.setting_key}
                    defaultValue={setting.setting_value}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Share2 className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Social Media Links</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getSettingsByCategory('social_').map(setting => (
                <div key={setting.id}>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {setting.description}
                  </label>
                  <input
                    type="url"
                    name={setting.setting_key}
                    defaultValue={setting.setting_value}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="https://..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm font-medium"
            >
              <Save size={20} />
              Save All Settings
            </button>
          </div>
        </form>
      </div>

      {/* Image Picker */}
      <ImagePicker
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={(url) => {
          const input = document.getElementById(currentLogoField) as HTMLInputElement;
          if (input) {
            input.value = url;
          }
          setShowImagePicker(false);
        }}
        currentUrl={settings.find(s => s.setting_key === currentLogoField)?.setting_value || ''}
        defaultFolder="logos"
      />
    </AdminLayout>
  );
}


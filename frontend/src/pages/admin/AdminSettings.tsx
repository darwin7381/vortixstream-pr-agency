import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Settings as SettingsIcon, Save, Info } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { authenticatedGet, authenticatedPatch } from '../../utils/apiClient';

interface Setting {
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description: string;
  updated_at: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [autoDelete, setAutoDelete] = useState(false);
  const [deleteDays, setDeleteDays] = useState('30');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await authenticatedGet(`${API_BASE_URL}/admin/settings`);
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        
        // Loading現有設定值
        const autoDeleteSetting = data.find((s: Setting) => s.setting_key === 'auto_delete_deactivated_users');
        const daysSetting = data.find((s: Setting) => s.setting_key === 'auto_delete_days');
        
        if (autoDeleteSetting) setAutoDelete(autoDeleteSetting.setting_value === 'true');
        if (daysSetting) setDeleteDays(daysSetting.setting_value);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update auto-delete settings
      await authenticatedPatch(
        `${API_BASE_URL}/admin/settings/auto_delete_deactivated_users`,
        { setting_value: String(autoDelete) }
      );

      // Update days setting
      await authenticatedPatch(
        `${API_BASE_URL}/admin/settings/auto_delete_days`,
        { setting_value: deleteDays }
      );

      alert('Settings saved successfully');
      loadSettings();
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Save failed');
    }
    setIsSaving(false);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage system behavior and parameters</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading...</div>
        ) : (
          <div className="max-w-2xl space-y-6">
            {/* User Auto-delete Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <SettingsIcon className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    自動DeleteDeactivate帳號
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    自動DeleteDeactivate超過指定days數的帳號（不包含被Ban的帳號）
                  </p>
                </div>
              </div>

              <div className="space-y-4 ml-8">
                {/* 開關 */}
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Auto-delete
                  </label>
                  <button
                    onClick={() => setAutoDelete(!autoDelete)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoDelete ? 'bg-orange-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoDelete ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* days數設定 */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Days Before Auto-delete
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={deleteDays}
                      onChange={(e) => setDeleteDays(e.target.value)}
                      disabled={!autoDelete}
                      className="w-20 px-3 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">days</span>
                  </div>
                </div>

                {/* 說明 */}
                {autoDelete && (
                  <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Deactivate超過 {deleteDays} days的帳號將會被自動permanently delete。被Ban的帳號不會被自動Delete。
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


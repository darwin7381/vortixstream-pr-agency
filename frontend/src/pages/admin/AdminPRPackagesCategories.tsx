import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { prCategoryAdminAPI, prPackagesAPI, type PRCategoryWithPackages, type PRPackage } from '../../api/client';
import { ArrowLeft, Edit, Plus, X, Save, Trash2, Package, MoveUp, MoveDown, ArrowRight } from 'lucide-react';

export default function AdminPRPackagesCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<PRCategoryWithPackages[]>([]);
  const [allPackages, setAllPackages] = useState<PRPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editForm, setEditForm] = useState({
    category_id: '',
    title: '',
    badges: [''],
    display_order: 0,
  });
  const [showPackageManager, setShowPackageManager] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesData, packagesData] = await Promise.all([
        prCategoryAdminAPI.getCategories(),
        prPackagesAPI.getAllPackages('all'),
      ]);
      setCategories(categoriesData);
      setAllPackages(packagesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: PRCategoryWithPackages) => {
    setEditingId(category.category_id);
    setEditForm({
      category_id: category.category_id,
      title: category.title,
      badges: category.badges.length > 0 ? category.badges : [''],
      display_order: category.display_order,
    });
  };

  const handleSave = async () => {
    try {
      const cleanedBadges = editForm.badges.filter((b) => b.trim() !== '');
      
      await prCategoryAdminAPI.updateCategory(editingId!, {
        title: editForm.title,
        badges: cleanedBadges,
        display_order: editForm.display_order,
      });
      
      alert('CategoryUpdated successfully');
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('Update failed');
    }
  };

  const handleCreate = async () => {
    try {
      const cleanedBadges = editForm.badges.filter((b) => b.trim() !== '');
      
      await prCategoryAdminAPI.createCategory({
        category_id: editForm.category_id,
        title: editForm.title,
        badges: cleanedBadges,
        display_order: editForm.display_order,
      });
      
      alert('CategoryCreated successfully');
      setShowNewForm(false);
      setEditForm({ category_id: '', title: '', badges: [''], display_order: 0 });
      fetchData();
    } catch (error: any) {
      console.error('Failed to create category:', error);
      alert(error.message || 'Creation failed');
    }
  };

  const handleDelete = async (categoryId: string, categoryTitle: string) => {
    if (confirm(`Are you sure you want to deleteCategory「${categoryTitle}」?`)) {
      try {
        await prCategoryAdminAPI.deleteCategory(categoryId);
        alert('CategoryDeleted successfully');
        fetchData();
      } catch (error: any) {
        console.error('Failed to delete category:', error);
        alert(error.message || 'Delete failed');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowNewForm(false);
  };

  // Badge Management
  const addBadge = () => {
    setEditForm({ ...editForm, badges: [...editForm.badges, ''] });
  };

  const updateBadge = (index: number, value: string) => {
    const newBadges = [...editForm.badges];
    newBadges[index] = value;
    setEditForm({ ...editForm, badges: newBadges });
  };

  const removeBadge = (index: number) => {
    const newBadges = editForm.badges.filter((_, i) => i !== index);
    setEditForm({ ...editForm, badges: newBadges.length > 0 ? newBadges : [''] });
  };

  // Package Management Functions
  const movePackageToCategory = async (packageId: number, targetCategoryId: string, displayOrder: number) => {
    try {
      await prPackagesAPI.updatePackageCategory(packageId, targetCategoryId, displayOrder);
      alert('Package moved successfully');
      fetchData();
    } catch (error) {
      console.error('Failed to move package:', error);
      alert('Move failed');
    }
  };

  const movePackageUp = async (categoryId: string, packageIndex: number) => {
    if (packageIndex === 0) return;
    
    const category = categories.find(c => c.category_id === categoryId);
    if (!category) return;
    
    const pkg1 = category.packages[packageIndex];
    const pkg2 = category.packages[packageIndex - 1];
    
    // Swap order
    await Promise.all([
      prPackagesAPI.updatePackageCategory(pkg1.id, categoryId, packageIndex - 1),
      prPackagesAPI.updatePackageCategory(pkg2.id, categoryId, packageIndex),
    ]);
    
    fetchData();
  };

  const movePackageDown = async (categoryId: string, packageIndex: number) => {
    const category = categories.find(c => c.category_id === categoryId);
    if (!category || packageIndex === category.packages.length - 1) return;
    
    const pkg1 = category.packages[packageIndex];
    const pkg2 = category.packages[packageIndex + 1];
    
    // Swap order
    await Promise.all([
      prPackagesAPI.updatePackageCategory(pkg1.id, categoryId, packageIndex + 1),
      prPackagesAPI.updatePackageCategory(pkg2.id, categoryId, packageIndex),
    ]);
    
    fetchData();
  };


  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <button
          onClick={() => navigate('/admin/pr-packages')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          返回 PR Packages
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PR Package Category管理</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage Categories、Badge和 Packages 分配</p>
          </div>
          <button
            onClick={() => setShowNewForm(true)}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus size={20} />
            AddCategory
          </button>
        </div>

        {/* AddCategory表單 */}
        {showNewForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-orange-500 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AddCategory</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category ID *
                  </label>
                  <input
                    type="text"
                    value={editForm.category_id}
                    onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                    placeholder="e.g.: startup-pr"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">只能使用小寫字母、數字和連字號</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CategoryTitle *
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                    placeholder="e.g.: STARTUP PR"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Badge</label>
                  <button
                    type="button"
                    onClick={addBadge}
                    className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-500"
                  >
                    + AddBadge
                  </button>
                </div>
                <div className="space-y-2">
                  {editForm.badges.map((badge, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={badge}
                        onChange={(e) => updateBadge(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                        placeholder="e.g.: 🚀 Launches"
                        aria-label={`Badge ${index + 1}`}
                      />
                      {editForm.badges.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBadge(index)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                          title="Delete此Badge"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="display-order-new" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Order</label>
                <input
                  id="display-order-new"
                  type="number"
                  value={editForm.display_order}
                  onChange={(e) => setEditForm({ ...editForm, display_order: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <Save size={16} />
                  Create
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category列表 */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div
              key={category.category_id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              {editingId === category.category_id ? (
                // Edit模式
                <div className="space-y-6">
                  {/* Basic InformationEdit */}
                  <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">EditCategoryBasic Information</h3>
                    
                    <div>
                      <label htmlFor="category-title-edit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CategoryTitle *
                      </label>
                      <input
                        id="category-title-edit"
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Badge</label>
                        <button
                          type="button"
                          onClick={addBadge}
                          className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-500"
                        >
                          + AddBadge
                        </button>
                      </div>
                      <div className="space-y-2">
                        {editForm.badges.map((badge, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={badge}
                              onChange={(e) => updateBadge(index, e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                              placeholder="e.g.: 🚀 Launches"
                              aria-label={`Badge ${index + 1}`}
                            />
                            {editForm.badges.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeBadge(index)}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                                title="Delete此Badge"
                              >
                                <X size={20} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="display-order-edit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Order</label>
                      <input
                        id="display-order-edit"
                        type="number"
                        value={editForm.display_order}
                        onChange={(e) => setEditForm({ ...editForm, display_order: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Package 管理 */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">管理 Packages</h3>
                      <button
                        onClick={() => setShowPackageManager(showPackageManager === category.category_id ? null : category.category_id)}
                        className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Plus size={18} />
                        從其他Category添加 Package
                      </button>
                    </div>

                    {/* 當前Category的 Packages */}
                    <div className="space-y-3 mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        當前Category的 Packages（{category.packages.length} items）
                      </p>
                      {category.packages.length > 0 ? (
                        <div className="space-y-2">
                          {category.packages.map((pkg, index) => (
                            <div
                              key={pkg.id}
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900 dark:text-white">{pkg.name}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{pkg.price}</p>
                                  {pkg.badge && (
                                    <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                                      {pkg.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {/* Display Order按鈕 */}
                                <button
                                  onClick={() => movePackageUp(category.category_id, index)}
                                  disabled={index === 0}
                                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-30"
                                  title="上移"
                                >
                                  <MoveUp size={18} />
                                </button>
                                <button
                                  onClick={() => movePackageDown(category.category_id, index)}
                                  disabled={index === category.packages.length - 1}
                                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-30"
                                  title="下移"
                                >
                                  <MoveDown size={18} />
                                </button>
                                
                                {/* Edit和移除按鈕 */}
                                <button
                                  onClick={() => navigate(`/admin/pr-packages/edit/${pkg.slug}`)}
                                  className="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to 將「${pkg.name}」從此Category移除?（將移至未Category）`)) {
                                      // 移到一items臨時Category或設為 null
                                      alert('移除功能需要設定目標Category');
                                    }
                                  }}
                                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                  title="從此Category移除"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm py-4">此CategoryNo Packages</p>
                      )}
                    </div>

                    {/* 可添加的 Packages */}
                    {showPackageManager === category.category_id && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-3">
                          從其他Category選擇 Package 添加到「{category.title}」
                        </p>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {allPackages
                            .filter(pkg => pkg.category_id !== category.category_id)
                            .map((pkg) => (
                              <div
                                key={pkg.id}
                                className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900 dark:text-white">{pkg.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    當前Category：{categories.find(c => c.category_id === pkg.category_id)?.title || pkg.category_id}
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to 將「${pkg.name}」移動到「${category.title}」?`)) {
                                      movePackageToCategory(pkg.id, category.category_id, category.packages.length);
                                    }
                                  }}
                                  className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 px-4 py-2 rounded-lg transition-colors"
                                >
                                  <ArrowRight size={18} />
                                  添加到此Category
                                </button>
                              </div>
                            ))}
                          {allPackages.filter(pkg => pkg.category_id !== category.category_id).length === 0 && (
                            <p className="text-gray-500 dark:text-gray-400 text-sm py-4 text-center">
                              沒有可添加的 Packages
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      <Save size={16} />
                      SaveCategory資訊
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // 查看模式
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{category.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ID: {category.category_id}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        包含 {category.packages_count}  packages
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.category_id, category.title)}
                        className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    </div>
                  </div>

                  {category.badges.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Badge：</p>
                      <div className="flex flex-wrap gap-2">
                        {category.badges.map((badge, idx) => (
                          <span
                            key={idx}
                            className="inline-flex px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Showing該Category下的 Packages */}
                  {category.packages_count > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <Package size={16} />
                        包含的 Packages：
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {category.packages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white text-sm">{pkg.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{pkg.price}</p>
                              {pkg.badge && (
                                <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                                  {pkg.badge}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => navigate(`/admin/pr-packages/edit/${pkg.slug}`)}
                              className="p-1 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded"
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Display Order: {category.display_order}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

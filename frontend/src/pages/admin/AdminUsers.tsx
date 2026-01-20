import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { User, Shield, Mail, Calendar, Search, UserCheck, UserX, Trash2, XCircle, RefreshCw, Ban } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { authenticatedGet, authenticatedPatch, authenticatedPost, authenticatedDelete } from '../../utils/apiClient';

type UserRole = 'user' | 'publisher' | 'admin' | 'super_admin';

interface UserData {
  id: number;
  email: string;
  name: string;
  avatar_url: string | null;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  account_status: 'active' | 'user_deactivated' | 'admin_suspended' | 'banned';
  created_at: string;
}

interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  admin_count: number;
  user_count: number;
  google_users: number;
  email_users: number;
  verified_users: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('user');

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [roleFilter, statusFilter]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (searchTerm) params.append('search', searchTerm);
      params.append('status', statusFilter);

      const response = await authenticatedGet(`${API_BASE_URL}/admin/users?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('===User列表 API 返回===', data);
        if (data && data.length > 0) {
          console.log('第一itemsUser:', data[0]);
          console.log('  account_status:', data[0].account_status);
          console.log('  is_active:', data[0].is_active);
        }
        setUsers(data);
      } else {
        console.error('API 錯誤:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
    setIsLoading(false);
  };

  const handleReactivateUser = async (userId: number, email: string) => {
    if (!confirm(`Are you sure you want to ReactivateUser ${email}？`)) {
      return;
    }

    try {
      const response = await authenticatedPatch(`${API_BASE_URL}/admin/users/${userId}/activate`);

      if (response.ok) {
        alert('User已Reactivate');
        loadUsers();
        loadStats();
      } else {
        const error = await response.json();
        alert(error.detail || 'Reactivate失敗');
      }
    } catch (error) {
      console.error('Failed to reactivate user:', error);
      alert('Reactivate失敗');
    }
  };

  const loadStats = async () => {
    try {
      const response = await authenticatedGet(`${API_BASE_URL}/admin/users/stats`);
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSearch = () => {
    loadUsers();
  };

  const getRoleLabel = (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
      'user': 'Users',
      'publisher': 'Publishers',
      'admin': 'Admins',
      'super_admin': 'Super Admins'
    };
    return labels[role];
  };

  const getRoleColor = (role: UserRole): string => {
    const colors: Record<UserRole, string> = {
      'user': 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
      'publisher': 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20',
      'admin': 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
      'super_admin': 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20'
    };
    return colors[role];
  };

  const handleUpdateRole = async (userId: number, newRole: UserRole) => {
    if (!confirm(`Are you sure you want to 將此User設為 ${getRoleLabel(newRole)}？`)) {
      return;
    }

    try {
      const response = await authenticatedPatch(`${API_BASE_URL}/admin/users/${userId}/role?role=${newRole}`);

      if (response.ok) {
        alert('RoleUpdated successfully');
        loadUsers();
        loadStats();
      } else {
        const error = await response.json();
        alert(error.detail || 'Update failed');
      }
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Update failed');
    }
  };

  const handleDeleteUser = async (userId: number, email: string) => {
    const confirmMsg = `Are you sure you want to DeactivateUser ${email}？\n\nUser將無法登入，但資料會保留。`;
    
    if (!confirm(confirmMsg)) {
      return;
    }

    try {
      // 軟Delete（Deactivate帳號）
      const response = await authenticatedDelete(`${API_BASE_URL}/admin/users/${userId}`);

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        loadUsers();
        loadStats();
      } else {
        const error = await response.json();
        alert(error.detail || 'Operation failed');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Operation failed');
    }
  };

  const handleBanUser = async (userId: number, email: string) => {
    const reason = prompt(`BanUser ${email}\n\nEnterBan原因：`, '違反服務條款');
    
    if (!reason) return;

    try {
      const response = await authenticatedPost(`${API_BASE_URL}/admin/users/${userId}/ban?reason=${encodeURIComponent(reason)}`);

      if (response.ok) {
        alert('UserBanned');
        loadUsers();
        loadStats();
      } else {
        const error = await response.json();
        alert(error.detail || 'Ban失敗');
      }
    } catch (error) {
      console.error('Failed to ban user:', error);
      alert('Ban失敗');
    }
  };

  const handleUnbanUser = async (userId: number, email: string) => {
    if (!confirm(`Are you sure you want to 解除對 ${email} 的Ban？`)) return;

    try {
      const response = await authenticatedDelete(`${API_BASE_URL}/admin/users/${userId}/unban`);

      if (response.ok) {
        alert('已解除Ban');
        loadUsers();
        loadStats();
      } else {
        const error = await response.json();
        alert(error.detail || '解除Ban失敗');
      }
    } catch (error) {
      console.error('Failed to unban user:', error);
      alert('解除Ban失敗');
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      alert('Enter Email');
      return;
    }

    try {
      const response = await authenticatedPost(`${API_BASE_URL}/admin/invitations/`, {
        email: inviteEmail,
        role: inviteRole
      });

      if (response.ok) {
        alert(`邀請郵件已發送至 ${inviteEmail}`);
        setShowInviteModal(false);
        setInviteEmail('');
        setInviteRole('user');
      } else {
        const error = await response.json();
        alert(error.detail || '邀請失敗');
      }
    } catch (error) {
      console.error('Failed to send invitation:', error);
      alert('邀請失敗');
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Title與邀請按鈕 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage all註冊User</p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
          >
            <Mail className="w-5 h-5" />
            Invite User
          </button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Users</p>
                  <p className="text-gray-900 dark:text-white text-2xl font-bold">{stats.total_users}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Admins</p>
                  <p className="text-gray-900 dark:text-white text-2xl font-bold">{stats.admin_count}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Google Sign-ins</p>
                  <p className="text-gray-900 dark:text-white text-2xl font-bold">{stats.google_users}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Verified</p>
                  <p className="text-gray-900 dark:text-white text-2xl font-bold">{stats.verified_users}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Role Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-1.5 mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                roleFilter === 'all'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All Users {stats && `(${stats.total_users})`}
            </button>
            <button
              onClick={() => setRoleFilter('user')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                roleFilter === 'user'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Users {stats && `(${stats.user_count})`}
            </button>
            <button
              onClick={() => setRoleFilter('publisher')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                roleFilter === 'publisher'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Publishers
            </button>
            <button
              onClick={() => setRoleFilter('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                roleFilter === 'admin'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Admins {stats && `(${stats.admin_count})`}
            </button>
            <button
              onClick={() => setRoleFilter('super_admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                roleFilter === 'super_admin'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Super Admins
            </button>
          </div>
        </div>

        {/* Search和篩選列 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex gap-3">
            {/* Search框 + 按鈕組合 */}
            <div className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search Email 或Name..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-orange-500 dark:focus:border-orange-500/50 transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all shadow-sm whitespace-nowrap"
              >
                Search
              </button>
            </div>

            {/* Status篩選 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:border-orange-500 transition-all min-w-[140px]"
            >
              <option value="active">✅ Active中</option>
              <option value="admin_suspended">🟡 已Deactivate</option>
              <option value="banned">🔴 Banned</option>
            </select>
          </div>
        </div>

        {/* User列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-600 dark:text-gray-400">Loading...</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-600 dark:text-gray-400">沒有找到User</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Registered At</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      user.account_status === 'banned' ? 'opacity-40 bg-red-900/5' :
                      user.account_status === 'admin_suspended' ? 'opacity-60' : ''
                    }`}>
                      {/* User資訊 */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">{user.name}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                          <Shield className="w-3.5 h-3.5" />
                          {getRoleLabel(user.role)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          {user.account_status === 'banned' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                              <Ban className="w-3.5 h-3.5" />
                              Banned
                            </span>
                          ) : user.account_status === 'admin_suspended' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
                              <XCircle className="w-3.5 h-3.5" />
                              已Deactivate
                            </span>
                          ) : user.is_verified ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                              <UserCheck className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                              <UserX className="w-3.5 h-3.5" />
                              Unverified
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Registered At */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          {new Date(user.created_at).toLocaleDateString('en-US')}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {(user.account_status === 'active' || !user.account_status || user.is_active !== false) ? (
                            <>
                              {/* Role選擇器（僅ActiveUser） */}
                              <select
                                value={user.role}
                                onChange={(e) => handleUpdateRole(user.id, e.target.value as UserRole)}
                                className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white focus:border-orange-500 transition-all"
                              >
                                <option value="user">Users</option>
                                <option value="publisher">Publishers</option>
                                <option value="admin">Admins</option>
                                <option value="super_admin">Super Admins</option>
                              </select>

                              {/* Deactivate */}
                              <button
                                onClick={() => handleDeleteUser(user.id, user.email)}
                                className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-500/20 border border-yellow-200 dark:border-yellow-500/20 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                                title="DeactivateUser"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Deactivate
                              </button>

                              {/* Ban */}
                              <button
                                onClick={() => handleBanUser(user.id, user.email)}
                                className="px-3 py-1.5 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                                title="BanUser"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                Ban
                              </button>
                            </>
                          ) : user.account_status === 'banned' ? (
                            <>
                              {/* 解除Ban（僅 super_admin） */}
                              <button
                                onClick={() => handleUnbanUser(user.id, user.email)}
                                className="px-3 py-1.5 bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-500/20 border border-purple-200 dark:border-purple-500/20 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                                title="解除Ban（需 Super Admin）"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                解除Ban
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Reactivate（DeactivateStatus） */}
                              <button
                                onClick={() => handleReactivateUser(user.id, user.email)}
                                className="px-3 py-1.5 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/20 border border-green-200 dark:border-green-500/20 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                                title="ReactivateUser"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Reactivate
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Total Count */}
        {!isLoading && users.length > 0 && (
          <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            Showing {users.length}  users
          </div>
        )}

        {/* 邀請 Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">邀請新User</h2>
              
              <div className="space-y-4">
                {/* Email 輸入 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-orange-500 transition-all"
                  />
                </div>

                {/* Role選擇 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    指定Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as UserRole)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-orange-500 transition-all"
                  >
                    <option value="user">Users</option>
                    <option value="publisher">Publishers</option>
                    <option value="admin">Admins</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                    Note: Invitation expires in 7 days
                  </p>
                </div>
              </div>

              {/* 按鈕 */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                    setInviteRole('user');
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteUser}
                  className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


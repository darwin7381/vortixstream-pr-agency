import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { User, Shield, Mail, Calendar, Search, UserCheck, UserX, Trash2, XCircle, RefreshCw, Ban } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

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

  const token = localStorage.getItem('access_token');

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

      const response = await fetch(`${API_BASE_URL}/admin/users/?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('===用戶列表 API 返回===', data);
        if (data && data.length > 0) {
          console.log('第一個用戶:', data[0]);
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
    if (!confirm(`確定要重新啟用用戶 ${email}？`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/activate`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('用戶已重新啟用');
        loadUsers();
        loadStats();
      } else {
        const error = await response.json();
        alert(error.detail || '重新啟用失敗');
      }
    } catch (error) {
      console.error('Failed to reactivate user:', error);
      alert('重新啟用失敗');
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
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
      'user': '一般用戶',
      'publisher': '出版商',
      'admin': '管理員',
      'super_admin': '超級管理員'
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
    if (!confirm(`確定要將此用戶設為 ${getRoleLabel(newRole)}？`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role?role=${newRole}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('角色已更新');
        loadUsers();
        loadStats();
      } else {
        const error = await response.json();
        alert(error.detail || '更新失敗');
      }
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('更新失敗');
    }
  };

  const handleDeleteUser = async (userId: number, email: string) => {
    const confirmMsg = `確定要停用用戶 ${email}？\n\n用戶將無法登入，但資料會保留。`;
    
    if (!confirm(confirmMsg)) {
      return;
    }

    try {
      // 軟刪除（停用帳號）
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        loadUsers();
        loadStats();
      } else {
        const error = await response.json();
        alert(error.detail || '操作失敗');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('操作失敗');
    }
  };

  const handleBanUser = async (userId: number, email: string) => {
    const reason = prompt(`封禁用戶 ${email}\n\n請輸入封禁原因：`, '違反服務條款');
    
    if (!reason) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/ban?reason=${encodeURIComponent(reason)}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('用戶已封禁');
        loadUsers();
        loadStats();
      } else {
        const error = await response.json();
        alert(error.detail || '封禁失敗');
      }
    } catch (error) {
      console.error('Failed to ban user:', error);
      alert('封禁失敗');
    }
  };

  const handleUnbanUser = async (userId: number, email: string) => {
    if (!confirm(`確定要解除對 ${email} 的封禁？`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/unban`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('已解除封禁');
        loadUsers();
        loadStats();
      } else {
        const error = await response.json();
        alert(error.detail || '解除封禁失敗');
      }
    } catch (error) {
      console.error('Failed to unban user:', error);
      alert('解除封禁失敗');
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      alert('請輸入 Email');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/invitations/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole
        })
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
        {/* 標題與邀請按鈕 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">用戶管理</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">管理所有註冊用戶</p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
          >
            <Mail className="w-5 h-5" />
            邀請用戶
          </button>
        </div>

        {/* 統計卡片 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">總用戶數</p>
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
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">管理員</p>
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
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Google 登入</p>
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
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">已驗證</p>
                  <p className="text-gray-900 dark:text-white text-2xl font-bold">{stats.verified_users}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 角色 Tabs */}
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
              所有用戶 {stats && `(${stats.total_users})`}
            </button>
            <button
              onClick={() => setRoleFilter('user')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                roleFilter === 'user'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              一般用戶 {stats && `(${stats.user_count})`}
            </button>
            <button
              onClick={() => setRoleFilter('publisher')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                roleFilter === 'publisher'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              出版商
            </button>
            <button
              onClick={() => setRoleFilter('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                roleFilter === 'admin'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              管理員 {stats && `(${stats.admin_count})`}
            </button>
            <button
              onClick={() => setRoleFilter('super_admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                roleFilter === 'super_admin'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              超級管理員
            </button>
          </div>
        </div>

        {/* 搜尋和篩選列 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex gap-3">
            {/* 搜尋框 + 按鈕組合 */}
            <div className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="搜尋 Email 或姓名..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-orange-500 dark:focus:border-orange-500/50 transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all shadow-sm whitespace-nowrap"
              >
                搜尋
              </button>
            </div>

            {/* 狀態篩選 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:border-orange-500 transition-all min-w-[140px]"
            >
              <option value="active">✅ 啟用中</option>
              <option value="admin_suspended">🟡 已停用</option>
              <option value="banned">🔴 已封禁</option>
            </select>
          </div>
        </div>

        {/* 用戶列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-600 dark:text-gray-400">載入中...</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-600 dark:text-gray-400">沒有找到用戶</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">用戶</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">角色</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">狀態</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">註冊時間</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      user.account_status === 'banned' ? 'opacity-40 bg-red-900/5' :
                      user.account_status === 'admin_suspended' ? 'opacity-60' : ''
                    }`}>
                      {/* 用戶資訊 */}
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

                      {/* 角色 */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                          <Shield className="w-3.5 h-3.5" />
                          {getRoleLabel(user.role)}
                        </span>
                      </td>

                      {/* 狀態 */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          {user.account_status === 'banned' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                              <Ban className="w-3.5 h-3.5" />
                              已封禁
                            </span>
                          ) : user.account_status === 'admin_suspended' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
                              <XCircle className="w-3.5 h-3.5" />
                              已停用
                            </span>
                          ) : user.is_verified ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                              <UserCheck className="w-3.5 h-3.5" />
                              已驗證
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                              <UserX className="w-3.5 h-3.5" />
                              未驗證
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 註冊時間 */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          {new Date(user.created_at).toLocaleDateString('zh-TW')}
                        </div>
                      </td>

                      {/* 操作 */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {(user.account_status === 'active' || !user.account_status || user.is_active !== false) ? (
                            <>
                              {/* 角色選擇器（僅啟用用戶） */}
                              <select
                                value={user.role}
                                onChange={(e) => handleUpdateRole(user.id, e.target.value as UserRole)}
                                className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white focus:border-orange-500 transition-all"
                              >
                                <option value="user">一般用戶</option>
                                <option value="publisher">出版商</option>
                                <option value="admin">管理員</option>
                                <option value="super_admin">超級管理員</option>
                              </select>

                              {/* 停用 */}
                              <button
                                onClick={() => handleDeleteUser(user.id, user.email)}
                                className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-500/20 border border-yellow-200 dark:border-yellow-500/20 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                                title="停用用戶"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                停用
                              </button>

                              {/* 封禁 */}
                              <button
                                onClick={() => handleBanUser(user.id, user.email)}
                                className="px-3 py-1.5 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                                title="封禁用戶"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                封禁
                              </button>
                            </>
                          ) : user.account_status === 'banned' ? (
                            <>
                              {/* 解除封禁（僅 super_admin） */}
                              <button
                                onClick={() => handleUnbanUser(user.id, user.email)}
                                className="px-3 py-1.5 bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-500/20 border border-purple-200 dark:border-purple-500/20 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                                title="解除封禁（需 Super Admin）"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                解除封禁
                              </button>
                            </>
                          ) : (
                            <>
                              {/* 重新啟用（停用狀態） */}
                              <button
                                onClick={() => handleReactivateUser(user.id, user.email)}
                                className="px-3 py-1.5 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/20 border border-green-200 dark:border-green-500/20 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                                title="重新啟用用戶"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                重新啟用
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

        {/* 總數 */}
        {!isLoading && users.length > 0 && (
          <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            顯示 {users.length} 位用戶
          </div>
        )}

        {/* 邀請 Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">邀請新用戶</h2>
              
              <div className="space-y-4">
                {/* Email 輸入 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email 地址
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-orange-500 transition-all"
                  />
                </div>

                {/* 角色選擇 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    指定角色
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as UserRole)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-orange-500 transition-all"
                  >
                    <option value="user">一般用戶</option>
                    <option value="publisher">出版商</option>
                    <option value="admin">管理員</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                    註：邀請郵件將在 7 天後過期
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
                  取消
                </button>
                <button
                  onClick={handleInviteUser}
                  className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  發送邀請
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Mail, Calendar, Clock, CheckCircle, XCircle, RotateCcw, Trash2, Shield } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { authenticatedGet, authenticatedPost, authenticatedDelete } from '../../utils/apiClient';

interface Invitation {
  id: number;
  email: string;
  role: string;
  token: string;
  invited_by: number;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  expires_at: string;
  created_at: string;
  accepted_at: string | null;
}

export default function AdminInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('pending');

  useEffect(() => {
    loadInvitations();
  }, [statusFilter]);

  const loadInvitations = async () => {
    setIsLoading(true);
    try {
      const response = await authenticatedGet(`${API_BASE_URL}/admin/invitations?status=${statusFilter}`);
      
      if (response.ok) {
        const data = await response.json();
        setInvitations(data);
      }
    } catch (error) {
      console.error('Failed to load invitations:', error);
    }
    setIsLoading(false);
  };

  const handleResend = async (invitationId: number) => {
    if (!confirm('Are you sure you want to resend invitation email？')) return;

    try {
      const response = await authenticatedPost(`${API_BASE_URL}/admin/invitations/${invitationId}/resend`);

      if (response.ok) {
        alert('Invitation email resent successfully');
      } else {
        const error = await response.json();
        alert(error.detail || 'Resend failed');
      }
    } catch (error) {
      console.error('Failed to resend invitation:', error);
      alert('Resend failed');
    }
  };

  const handleCancel = async (invitationId: number, email: string) => {
    if (!confirm(`Are you sure you want to cancel invitation for ${email} ?`)) return;

    try {
      const response = await authenticatedDelete(`${API_BASE_URL}/admin/invitations/${invitationId}`);

      if (response.ok) {
        alert('Invitation cancelled successfully');
        loadInvitations();
      } else {
        const error = await response.json();
        alert(error.detail || 'Cancellation failed');
      }
    } catch (error) {
      console.error('Failed to cancel invitation:', error);
      alert('Cancellation failed');
    }
  };

  const getRoleLabel = (role: string): string => {
    const labels: Record<string, string> = {
      'user': 'Users',
      'publisher': 'Publishers',
      'admin': 'Admins',
      'super_admin': 'Super Admins'
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      'user': 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
      'publisher': 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20',
      'admin': 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
      'super_admin': 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20'
    };
    return colors[role] || colors['user'];
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date();
    
    if (status === 'accepted') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20">
          <CheckCircle className="w-3.5 h-3.5" />
          Accepted
        </span>
      );
    } else if (status === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-500/20">
          <XCircle className="w-3.5 h-3.5" />
          Cancelled successfully
        </span>
      );
    } else if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20">
          <Clock className="w-3.5 h-3.5" />
          Expired
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20">
          <Clock className="w-3.5 h-3.5" />
          Pending
        </span>
      );
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invitation Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage all user invitations</p>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-1.5 mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex gap-1">
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === 'pending'
                  ? 'bg-yellow-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('accepted')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === 'accepted'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === 'cancelled'
                  ? 'bg-gray-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Cancelled successfully
            </button>
          </div>
        </div>

        {/* Invitation List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-600 dark:text-gray-400">Loading...</div>
          ) : invitations.length === 0 ? (
            <div className="p-12 text-center text-gray-600 dark:text-gray-400">No invitations found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Expires At</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {invitations.map((invitation) => {
                    const isExpired = new Date(invitation.expires_at) < new Date();
                    
                    return (
                      <tr key={invitation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        {/* Email */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {invitation.email}
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(invitation.role)}`}>
                            <Shield className="w-3.5 h-3.5" />
                            {getRoleLabel(invitation.role)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {getStatusBadge(invitation.status, invitation.expires_at)}
                        </td>

                        {/* Created At */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(invitation.created_at).toLocaleDateString('en-US')}
                          </div>
                        </td>

                        {/* Expires At */}
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-1.5 text-sm ${
                            isExpired ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            <Clock className="w-4 h-4" />
                            {new Date(invitation.expires_at).toLocaleDateString('en-US')}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {/* Resend (Pending only) */}
                            {invitation.status === 'pending' && !isExpired && (
                              <button
                                onClick={() => handleResend(invitation.id)}
                                className="px-3 py-1.5 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                                title="Resend Invitation"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Resend
                              </button>
                            )}

                            {/* Cancel (Pending only) */}
                            {invitation.status === 'pending' && (
                              <button
                                onClick={() => handleCancel(invitation.id, invitation.email)}
                                className="px-3 py-1.5 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                                title="Cancel Invitation"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Total Count */}
        {!isLoading && invitations.length > 0 && (
          <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            Showing {invitations.length}  invitations
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


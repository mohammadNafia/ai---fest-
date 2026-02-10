/**
 * User Management Component
 * 
 * Allows admin to view all users and change their roles
 */

import React, { useState, useEffect } from 'react';
import { Users, Shield, UserCheck, UserX, Search, RefreshCw, Loader2, UserPlus, Mail, Mic, Handshake, Briefcase, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUsers, getUsersByRole, updateUserRole, promoteUser, deleteUser } from '@/api/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
}

const UserManagement: React.FC = () => {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promoteEmail, setPromoteEmail] = useState('');
  const [promoteType, setPromoteType] = useState<'speaker' | 'partner' | 'staff'>('staff');
  const [promoteOrganization, setPromoteOrganization] = useState('');
  const [promoteCategory, setPromoteCategory] = useState('');
  const [promoteOccupation, setPromoteOccupation] = useState('');
  const [promoteInstitution, setPromoteInstitution] = useState('');
  const [isPromoting, setIsPromoting] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.name.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            (u.phone && u.phone.includes(query))
        )
      );
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (!currentUser?.id) {
        setError(lang === 'ar' ? 'يجب تسجيل الدخول كمدير' : 'You must be logged in as admin');
        setIsLoading(false);
        return;
      }

      const result = await getAllUsers();
      console.log('[UserManagement] getAllUsers result:', result);
      
      if (result.success && result.data) {
        // Map backend role enum to frontend role string (capitalize first letter to match enum)
        const mappedUsers = result.data.map((user: any) => {
          const roleValue = user.role || user.Role || 'User';
          // Normalize role: capitalize first letter (e.g., "user" -> "User", "admin" -> "Admin")
          const normalizedRole = typeof roleValue === 'string' 
            ? roleValue.charAt(0).toUpperCase() + roleValue.slice(1).toLowerCase()
            : roleValue;
          
          return {
            ...user,
            role: normalizedRole,
            id: user.id || user.Id,
            email: user.email || user.Email,
            name: user.name || user.Name,
            phone: user.phone || user.Phone || '',
            isActive: user.isActive !== undefined ? user.isActive : user.IsActive !== undefined ? user.IsActive : true,
            emailVerified: user.emailVerified !== undefined ? user.emailVerified : user.EmailVerified !== undefined ? user.EmailVerified : false,
          };
        });
        
        setUsers(mappedUsers);
        setFilteredUsers(mappedUsers);
      } else {
        console.error('[UserManagement] Error loading users:', result.error);
        setError(result.error || (lang === 'ar' ? 'فشل تحميل المستخدمين' : 'Failed to load users'));
      }
    } catch (err: any) {
      console.error('[UserManagement] Exception loading users:', err);
      setError(lang === 'ar' ? 'حدث خطأ أثناء تحميل المستخدمين' : 'An error occurred while loading users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId === currentUser?.id) {
      alert(lang === 'ar' ? 'لا يمكنك تغيير دورك الخاص' : 'You cannot change your own role');
      return;
    }

    if (!currentUser?.id) {
      setError(lang === 'ar' ? 'يجب تسجيل الدخول كمدير' : 'You must be logged in as admin');
      return;
    }

    setUpdatingRole(userId);
    setError('');
    try {
      console.log('[UserManagement] Updating role:', { userId, newRole, adminUserId: currentUser.id });
      const result = await updateUserRole(userId, newRole, currentUser.id);
      console.log('[UserManagement] Update role result:', result);
      
      if (result.success) {
        // Update local state - normalize role to match backend response
        const normalizedRole = newRole.charAt(0).toUpperCase() + newRole.slice(1).toLowerCase();
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: normalizedRole } : u))
        );
        setFilteredUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: normalizedRole } : u))
        );
        alert(lang === 'ar' ? 'تم تحديث الدور بنجاح' : 'Role updated successfully');
      } else {
        console.error('[UserManagement] Update role failed:', result.error);
        setError(result.error || (lang === 'ar' ? 'فشل تحديث الدور' : 'Failed to update role'));
      }
    } catch (err: any) {
      console.error('[UserManagement] Exception updating role:', err);
      setError(lang === 'ar' ? 'حدث خطأ أثناء تحديث الدور' : 'An error occurred while updating role');
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!currentUser?.id) {
      setError(lang === 'ar' ? 'يجب تسجيل الدخول كمدير' : 'You must be logged in as admin');
      return;
    }

    if (userId === currentUser.id) {
      alert(lang === 'ar' ? 'لا يمكنك حذف حسابك الخاص' : 'You cannot delete your own account');
      return;
    }

    if (!confirm(lang === 'ar' 
      ? 'هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.'
      : 'Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setDeletingUserId(userId);
    setError('');

    try {
      const adminUserId = typeof currentUser.id === 'string' ? currentUser.id : String(currentUser.id);
      const result = await deleteUser(userId, adminUserId);
      
      if (result.success) {
        alert(lang === 'ar' ? 'تم حذف المستخدم بنجاح' : 'User deleted successfully');
        await loadUsers();
      } else {
        setError(result.error || (lang === 'ar' ? 'فشل حذف المستخدم' : 'Failed to delete user'));
      }
    } catch (err: any) {
      setError(err?.message || (lang === 'ar' ? 'حدث خطأ أثناء حذف المستخدم' : 'An error occurred while deleting user'));
    } finally {
      setDeletingUserId(null);
    }
  };

  const handlePromote = async () => {
    if (!promoteEmail.trim()) {
      setError(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter email address');
      return;
    }

    if (!currentUser?.id) {
      setError(lang === 'ar' ? 'يجب تسجيل الدخول كمدير' : 'You must be logged in as admin');
      return;
    }

    setIsPromoting(true);
    setError('');

    try {
      console.log('[UserManagement] Starting promotion:', {
        email: promoteEmail.trim(),
        type: promoteType,
        adminId: currentUser.id
      });

      const additionalData: any = {};
      if (promoteType === 'partner' && promoteOrganization) {
        additionalData.organization = promoteOrganization;
      }
      if (promoteType === 'partner' && promoteCategory) {
        additionalData.category = promoteCategory;
      }
      if (promoteType === 'speaker' && promoteOccupation) {
        additionalData.occupation = promoteOccupation;
      }
      if (promoteType === 'speaker' && promoteInstitution) {
        additionalData.institution = promoteInstitution;
      }

      console.log('[UserManagement] Additional data:', additionalData);

      // Ensure user ID is a string (GUID format)
      const adminUserId = typeof currentUser.id === 'string' ? currentUser.id : String(currentUser.id);
      console.log('[UserManagement] Admin User ID:', adminUserId);
      
      const result = await promoteUser(promoteEmail.trim(), promoteType, adminUserId, additionalData);
      
      console.log('[UserManagement] Promotion result:', result);

      if (result.success) {
        alert(lang === 'ar' 
          ? `تم ترقية المستخدم إلى ${promoteType === 'speaker' ? 'متحدث' : promoteType === 'partner' ? 'شريك' : 'موظف'} بنجاح`
          : `User promoted to ${promoteType} successfully`);
        
        // Reset form
        setPromoteEmail('');
        setPromoteOrganization('');
        setPromoteCategory('');
        setPromoteOccupation('');
        setPromoteInstitution('');
        setShowPromoteModal(false);
        
        // Reload users to see updated roles
        await loadUsers();
      } else {
        const errorMsg = result.error || result.message || (lang === 'ar' ? 'فشل ترقية المستخدم' : 'Failed to promote user');
        setError(errorMsg);
        console.error('Promotion failed:', result);
      }
    } catch (err: any) {
      const errorMsg = err?.message || err?.error || (lang === 'ar' ? 'حدث خطأ أثناء ترقية المستخدم' : 'An error occurred while promoting user');
      setError(errorMsg);
      console.error('Promotion error:', err);
    } finally {
      setIsPromoting(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return theme === 'light' ? 'bg-red-100 text-red-700' : 'bg-red-500/20 text-red-400';
      case 'staff':
        return theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-400';
      case 'user':
        return theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-green-400';
      default:
        return theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <Shield size={16} />;
      case 'staff':
        return <UserCheck size={16} />;
      case 'user':
        return <Users size={16} />;
      default:
        return <UserX size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {lang === 'ar' ? 'إدارة المستخدمين' : 'User Management'}
          </h2>
          <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {lang === 'ar'
              ? 'عرض جميع المستخدمين (الحضور) وتغيير أدوارهم أو ترقيتهم'
              : 'View all users (attendees) and change their roles or promote them'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPromoteModal(true)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              theme === 'light'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-green-600 text-white hover:bg-green-500'
            }`}
          >
            <UserPlus size={18} />
            {lang === 'ar' ? 'ترقية مستخدم' : 'Promote User'}
          </button>
          <button
            onClick={loadUsers}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              theme === 'light'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            <RefreshCw size={18} />
            {lang === 'ar' ? 'تحديث' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-red-50 text-red-700' : 'bg-red-500/20 text-red-400'}`}>
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search
          size={20}
          className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${
            theme === 'light' ? 'text-gray-400' : 'text-gray-500'
          }`}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === 'ar' ? 'ابحث عن مستخدم...' : 'Search users...'}
          className={`w-full ${lang === 'ar' ? 'pr-10' : 'pl-10'} py-3 rounded-lg border transition-colors ${
            theme === 'light'
              ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
          } outline-none`}
        />
      </div>

      {/* Users Table */}
      <div className={`rounded-lg border overflow-hidden ${
        theme === 'light' ? 'bg-white border-gray-200' : 'bg-black/50 border-white/10'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${
                theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'
              }`}>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {lang === 'ar' ? 'الاسم' : 'Name'}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {lang === 'ar' ? 'الهاتف' : 'Phone'}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {lang === 'ar' ? 'الدور' : 'Role'}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {lang === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {lang === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`px-6 py-8 text-center ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {lang === 'ar' ? 'لا يوجد مستخدمون' : 'No users found'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-b transition-colors ${
                      theme === 'light'
                        ? 'border-gray-100 hover:bg-gray-50'
                        : 'border-white/5 hover:bg-white/5'
                    }`}
                  >
                    <td className={`px-6 py-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {user.name || '-'}
                    </td>
                    <td className={`px-6 py-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      {user.email}
                    </td>
                    <td className={`px-6 py-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      {user.phone || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {getRoleIcon(user.role)}
                        {user.role || 'Guest'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? theme === 'light'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-green-500/20 text-green-400'
                            : theme === 'light'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {user.isActive
                          ? lang === 'ar'
                            ? 'نشط'
                            : 'Active'
                          : lang === 'ar'
                          ? 'غير نشط'
                          : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                      <select
                        value={user.role || 'User'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updatingRole === user.id || user.id === currentUser?.id}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                          updatingRole === user.id
                            ? 'opacity-50 cursor-not-allowed'
                            : theme === 'light'
                            ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                        } outline-none`}
                      >
                        <option value="User">{lang === 'ar' ? 'مستخدم (Attendance)' : 'User (Attendance)'}</option>
                        <option value="Staff">{lang === 'ar' ? 'موظف' : 'Staff'}</option>
                        <option value="Admin">{lang === 'ar' ? 'مدير' : 'Admin'}</option>
                        <option value="Speaker">{lang === 'ar' ? 'متحدث' : 'Speaker'}</option>
                        <option value="Partner">{lang === 'ar' ? 'شريك' : 'Partner'}</option>
                        <option value="Reviewer">{lang === 'ar' ? 'مراجع' : 'Reviewer'}</option>
                        <option value="Guest">{lang === 'ar' ? 'ضيف' : 'Guest'}</option>
                      </select>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deletingUserId === user.id || user.id === currentUser?.id}
                          className={`p-2 rounded-lg transition-colors ${
                            deletingUserId === user.id || user.id === currentUser?.id
                              ? 'opacity-50 cursor-not-allowed'
                              : theme === 'light'
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-red-400 hover:bg-red-500/20'
                          }`}
                          title={lang === 'ar' ? 'حذف المستخدم' : 'Delete user'}
                        >
                          {deletingUserId === user.id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg border ${
          theme === 'light' ? 'bg-white border-gray-200' : 'bg-black/50 border-white/10'
        }`}>
          <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {lang === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}
          </div>
          <div className={`text-2xl font-bold mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {users.length}
          </div>
        </div>
        <div className={`p-4 rounded-lg border ${
          theme === 'light' ? 'bg-white border-gray-200' : 'bg-black/50 border-white/10'
        }`}>
          <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {lang === 'ar' ? 'المديرون' : 'Admins'}
          </div>
          <div className={`text-2xl font-bold mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {users.filter((u) => u.role?.toLowerCase() === 'admin').length}
          </div>
        </div>
        <div className={`p-4 rounded-lg border ${
          theme === 'light' ? 'bg-white border-gray-200' : 'bg-black/50 border-white/10'
        }`}>
          <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {lang === 'ar' ? 'الموظفون' : 'Staff'}
          </div>
          <div className={`text-2xl font-bold mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {users.filter((u) => u.role?.toLowerCase() === 'staff').length}
          </div>
        </div>
      </div>

      {/* Promote User Modal */}
      {showPromoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-lg border ${
            theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#0a0a1a] border-white/10'
          }`}>
            <div className={`p-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {lang === 'ar' ? 'ترقية مستخدم' : 'Promote User'}
                </h3>
                <button
                  onClick={() => {
                    setShowPromoteModal(false);
                    setPromoteEmail('');
                    setPromoteOrganization('');
                    setPromoteCategory('');
                    setPromoteOccupation('');
                    setPromoteInstitution('');
                    setError('');
                  }}
                  className={`${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  <UserX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
                  </label>
                  <div className="relative">
                    <Mail size={18} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${
                      theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type="email"
                      value={promoteEmail}
                      onChange={(e) => setPromoteEmail(e.target.value)}
                      className={`w-full ${lang === 'ar' ? 'pr-10' : 'pl-10'} py-3 rounded-lg border transition-colors ${
                        theme === 'light'
                          ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                          : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                      } outline-none`}
                      placeholder={lang === 'ar' ? 'أدخل البريد الإلكتروني للمستخدم' : 'Enter user email address'}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {lang === 'ar' 
                      ? 'ملاحظة: جميع المستخدمين هم حضور افتراضياً. يمكنك ترقيتهم إلى متحدث أو شريك أو موظف' 
                      : 'Note: All users are attendees by default. You can promote them to Speaker, Partner, or Staff'}
                  </p>
                </div>

                {/* Promotion Type */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {lang === 'ar' ? 'نوع الترقية' : 'Promotion Type'} *
                  </label>
                  <select
                    value={promoteType}
                    onChange={(e) => setPromoteType(e.target.value as 'speaker' | 'partner' | 'staff')}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === 'light'
                        ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                        : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                    } outline-none`}
                  >
                    <option value="staff">
                      {lang === 'ar' ? 'موظف (Staff)' : 'Staff'}
                    </option>
                    <option value="speaker">
                      {lang === 'ar' ? 'متحدث (Speaker)' : 'Speaker'}
                    </option>
                    <option value="partner">
                      {lang === 'ar' ? 'شريك (Partner)' : 'Partner'}
                    </option>
                  </select>
                </div>

                {/* Conditional Fields */}
                {promoteType === 'partner' && (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {lang === 'ar' ? 'المنظمة' : 'Organization'} *
                      </label>
                      <div className="relative">
                        <Briefcase size={18} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${
                          theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <input
                          type="text"
                          value={promoteOrganization}
                          onChange={(e) => setPromoteOrganization(e.target.value)}
                          className={`w-full ${lang === 'ar' ? 'pr-10' : 'pl-10'} py-3 rounded-lg border transition-colors ${
                            theme === 'light'
                              ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                              : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                          } outline-none`}
                          placeholder={lang === 'ar' ? 'أدخل اسم المنظمة' : 'Enter organization name'}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {lang === 'ar' ? 'الفئة' : 'Category'} (اختياري / Optional)
                      </label>
                      <input
                        type="text"
                        value={promoteCategory}
                        onChange={(e) => setPromoteCategory(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          theme === 'light'
                            ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                            : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                        } outline-none`}
                        placeholder={lang === 'ar' ? 'مثال: تكنولوجيا، تعليم، إلخ' : 'e.g., Technology, Education, etc.'}
                      />
                    </div>
                  </>
                )}

                {promoteType === 'speaker' && (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {lang === 'ar' ? 'المهنة' : 'Occupation'} *
                      </label>
                      <input
                        type="text"
                        value={promoteOccupation}
                        onChange={(e) => setPromoteOccupation(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          theme === 'light'
                            ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                            : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                        } outline-none`}
                        placeholder={lang === 'ar' ? 'أدخل المهنة' : 'Enter occupation'}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {lang === 'ar' ? 'المؤسسة' : 'Institution'} *
                      </label>
                      <input
                        type="text"
                        value={promoteInstitution}
                        onChange={(e) => setPromoteInstitution(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          theme === 'light'
                            ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                            : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                        } outline-none`}
                        placeholder={lang === 'ar' ? 'أدخل اسم المؤسسة' : 'Enter institution name'}
                      />
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handlePromote}
                    disabled={isPromoting || !promoteEmail.trim()}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      isPromoting || !promoteEmail.trim()
                        ? 'bg-gray-500 cursor-not-allowed text-white'
                        : theme === 'light'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-green-600 text-white hover:bg-green-500'
                    }`}
                  >
                    {isPromoting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        {lang === 'ar' ? 'جاري الترقية...' : 'Promoting...'}
                      </>
                    ) : (
                      <>
                        {promoteType === 'speaker' && <Mic size={18} />}
                        {promoteType === 'partner' && <Handshake size={18} />}
                        {promoteType === 'staff' && <Briefcase size={18} />}
                        {lang === 'ar' ? 'ترقية' : 'Promote'}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowPromoteModal(false);
                      setPromoteEmail('');
                      setPromoteOrganization('');
                      setPromoteCategory('');
                      setPromoteOccupation('');
                      setPromoteInstitution('');
                      setError('');
                    }}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      theme === 'light'
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

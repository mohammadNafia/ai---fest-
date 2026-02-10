import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit, Trash2, X, Copy, Check, RefreshCw, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import type { StaffMember, CreateStaffInput, StaffPermissions } from '@/types/staffTypes';
import { DEFAULT_STAFF_PERMISSIONS, getPermissionSummary } from '@/types/staffTypes';
import { getStaffMembers } from '@/api/auth';

const StaffManagement: React.FC = () => {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    permissions: { ...DEFAULT_STAFF_PERMISSIONS }
  });

  // Load staff members on mount
  useEffect(() => {
    loadStaffMembers();
  }, []);

  // Map backend permissions to frontend permissions format
  const mapBackendPermissionsToFrontend = (backendPerms: any): StaffPermissions => {
    if (!backendPerms) {
      return { ...DEFAULT_STAFF_PERMISSIONS };
    }
    
    return {
      viewAttendees: backendPerms.canViewAttendees || backendPerms.CanViewAttendees || false,
      viewSpeakers: backendPerms.canViewSpeakers || backendPerms.CanViewSpeakers || false,
      viewPartners: backendPerms.canViewPartners || backendPerms.CanViewPartners || false,
      viewAnalytics: backendPerms.canViewAnalytics || backendPerms.CanViewAnalytics || false,
      editAttendees: backendPerms.canManageAttendees || backendPerms.CanManageAttendees || false,
      editSpeakers: backendPerms.canManageSpeakers || backendPerms.CanManageSpeakers || false,
      editPartners: backendPerms.canManagePartners || backendPerms.CanManagePartners || false,
      exportData: backendPerms.canExportData || backendPerms.CanExportData || false,
    };
  };

  // Map backend staff member to frontend StaffMember format
  const mapBackendStaffToFrontend = (backendStaff: any): StaffMember => {
    return {
      id: backendStaff.id || backendStaff.Id || '',
      email: backendStaff.email || backendStaff.Email || '',
      name: backendStaff.name || backendStaff.Name || '',
      password: '', // Not returned from backend for security
      permissions: mapBackendPermissionsToFrontend(backendStaff.permissions || backendStaff.Permissions),
      createdAt: backendStaff.createdAt || backendStaff.CreatedAt || new Date().toISOString(),
      createdBy: user?.email || 'admin', // Use current admin email
      lastLogin: backendStaff.lastLoginAt || backendStaff.LastLoginAt,
      isActive: backendStaff.isActive !== undefined ? backendStaff.isActive : (backendStaff.IsActive !== undefined ? backendStaff.IsActive : true),
    };
  };

  const loadStaffMembers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await getStaffMembers();
      
      if (result.success && result.data) {
        // Map backend staff members to frontend format
        const mappedStaff = Array.isArray(result.data) 
          ? result.data.map(mapBackendStaffToFrontend)
          : [];
        setStaffMembers(mappedStaff);
      } else {
        setError(result.error || (lang === 'ar' ? 'فشل تحميل الموظفين' : 'Failed to load staff members'));
        setStaffMembers([]);
      }
    } catch (err: any) {
      console.error('Error loading staff members:', err);
      setError(err?.message || (lang === 'ar' ? 'حدث خطأ أثناء تحميل الموظفين' : 'An error occurred while loading staff members'));
      setStaffMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (staff?: StaffMember) => {
    if (staff) {
      setEditingStaff(staff);
      setFormData({
        name: staff.name,
        email: staff.email,
        permissions: { ...staff.permissions }
      });
    } else {
      setEditingStaff(null);
      setFormData({
        name: '',
        email: '',
        permissions: { ...DEFAULT_STAFF_PERMISSIONS }
      });
    }
    setGeneratedPassword(null);
    setCopiedPassword(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
    setGeneratedPassword(null);
    setCopiedPassword(false);
  };

  const handleSaveStaff = () => {
    // Note: Staff members are now managed through User Management
    // This function is kept for UI compatibility but should redirect to user management
    alert(lang === 'ar' 
      ? 'يرجى استخدام إدارة المستخدمين لتعديل الموظفين. يمكنك تغيير دور المستخدم إلى Staff لإضافته إلى قائمة الموظفين.'
      : 'Please use User Management to edit staff members. You can change a user\'s role to Staff to add them to the staff list.');
    handleCloseModal();
  };

  const handleDeleteStaff = (id: string, name: string) => {
    // Note: Staff members are now managed through User Management
    // This function is kept for UI compatibility but should redirect to user management
    alert(lang === 'ar'
      ? 'يرجى استخدام إدارة المستخدمين لحذف الموظفين. يمكنك تغيير دور المستخدم من Staff إلى User لإزالته من قائمة الموظفين.'
      : 'Please use User Management to delete staff members. You can change a user\'s role from Staff to User to remove them from the staff list.');
  };

  const handlePermissionChange = (permission: keyof StaffPermissions) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  const copyPassword = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {lang === 'ar' ? 'إدارة الموظفين' : 'Staff Management'}
          </h2>
          <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
            {lang === 'ar' 
              ? 'عرض جميع الموظفين. لتغيير أدوار المستخدمين، استخدم تبويب "إدارة المستخدمين"' 
              : 'View all staff members. To change user roles, use the "User Management" tab'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadStaffMembers}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : theme === 'light'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <RefreshCw size={20} />
            )}
            {lang === 'ar' ? 'تحديث' : 'Refresh'}
          </button>
          <button
            onClick={() => handleOpenModal()}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === 'light'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-green-600 text-white hover:bg-green-500'
            }`}
          >
            <UserPlus size={20} />
            {lang === 'ar' ? 'إضافة موظف' : 'Add Staff'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-red-50 text-red-700' : 'bg-red-500/20 text-red-400'}`}>
          {error}
        </div>
      )}

      {/* Staff List */}
      <div className={`rounded-xl border overflow-hidden ${
        theme === 'light' ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
      }`}>
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 size={48} className={`mx-auto mb-4 animate-spin ${
              theme === 'light' ? 'text-blue-500' : 'text-blue-400'
            }`} />
            <p className={`text-lg ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {lang === 'ar' ? 'جاري تحميل الموظفين...' : 'Loading staff members...'}
            </p>
          </div>
        ) : staffMembers.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={48} className={`mx-auto mb-4 ${
              theme === 'light' ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <p className={`text-lg ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {lang === 'ar' ? 'لا يوجد موظفين بعد. انقر على "إضافة موظف" للبدء.' : 'No staff members yet. Click "Add Staff" to get started.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {lang === 'ar' ? 'الاسم' : 'Name'}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {lang === 'ar' ? 'الصلاحيات' : 'Permissions'}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {lang === 'ar' ? 'الحالة' : 'Status'}
                  </th>
                  <th className={`px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {lang === 'ar' ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-white/10'}`}>
                {staffMembers.map((staff) => (
                  <tr key={staff.id} className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-white/5'}>
                    <td className={`px-6 py-4 whitespace-nowrap ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {staff.name}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {staff.email}
                    </td>
                    <td className={`px-6 py-4 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      <span className="text-xs">
                        {getPermissionSummary(staff.permissions)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        staff.isActive
                          ? theme === 'light'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-green-500/20 text-green-400'
                          : theme === 'light'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {staff.isActive 
                          ? (lang === 'ar' ? 'نشط' : 'Active')
                          : (lang === 'ar' ? 'غير نشط' : 'Inactive')
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(staff)}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'light'
                              ? 'text-blue-600 hover:bg-blue-50'
                              : 'text-blue-400 hover:bg-blue-500/20'
                          }`}
                          title={lang === 'ar' ? 'تعديل' : 'Edit'}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staff.id, staff.name)}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'light'
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-red-400 hover:bg-red-500/20'
                          }`}
                          title={lang === 'ar' ? 'حذف' : 'Delete'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className={`w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
            theme === 'light' ? 'bg-white' : 'bg-[#0a0a1a]'
          }`}>
            {/* Modal Header */}
            <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#0a0a1a] border-white/10'
            }`}>
              <h3 className={`text-xl font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {editingStaff 
                  ? (lang === 'ar' ? 'تعديل الموظف' : 'Edit Staff Member')
                  : (lang === 'ar' ? 'إضافة موظف جديد' : 'Add New Staff Member')
                }
              </h3>
              <button
                onClick={handleCloseModal}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'light'
                    ? 'hover:bg-gray-100 text-gray-600'
                    : 'hover:bg-white/10 text-gray-400'
                }`}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {generatedPassword ? (
                // Show generated password
                <div className={`p-6 rounded-lg border-2 ${
                  theme === 'light'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-green-500/10 border-green-500/30'
                }`}>
                  <div className="flex items-start gap-3 mb-4">
                    <Check size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className={`font-bold text-lg mb-1 ${
                        theme === 'light' ? 'text-green-900' : 'text-green-400'
                      }`}>
                        {lang === 'ar' ? 'تم إنشاء الموظف بنجاح!' : 'Staff Member Created Successfully!'}
                      </h4>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-green-700' : 'text-green-300'
                      }`}>
                        {lang === 'ar' ? 'يرجى حفظ كلمة المرور هذه ومشاركتها مع الموظف. لن تتمكن من رؤيتها مرة أخرى.' : 'Please save this password and share it with the staff member. You won\'t be able to see it again.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'light' ? 'text-green-900' : 'text-green-400'
                      }`}>
                        {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <div className={`px-4 py-3 rounded-lg font-mono ${
                        theme === 'light' ? 'bg-white' : 'bg-black/30'
                      }`}>
                        {formData.email}
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'light' ? 'text-green-900' : 'text-green-400'
                      }`}>
                        {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                      </label>
                      <div className="flex gap-2">
                        <div className={`flex-1 px-4 py-3 rounded-lg font-mono text-lg ${
                          theme === 'light' ? 'bg-white' : 'bg-black/30'
                        }`}>
                          {generatedPassword}
                        </div>
                        <button
                          onClick={copyPassword}
                          className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                            copiedPassword
                              ? theme === 'light'
                                ? 'bg-green-600 text-white'
                                : 'bg-green-600 text-white'
                              : theme === 'light'
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {copiedPassword ? <Check size={20} /> : <Copy size={20} />}
                          {copiedPassword 
                            ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!')
                            : (lang === 'ar' ? 'نسخ' : 'Copy')
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCloseModal}
                    className={`w-full mt-4 px-4 py-3 rounded-lg font-medium transition-colors ${
                      theme === 'light'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-green-600 text-white hover:bg-green-500'
                    }`}
                  >
                    {lang === 'ar' ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              ) : (
                <>
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {lang === 'ar' ? 'الاسم' : 'Name'}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          theme === 'light'
                            ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                            : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                        } outline-none`}
                        placeholder={lang === 'ar' ? 'أدخل الاسم' : 'Enter name'}
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!!editingStaff}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          editingStaff
                            ? theme === 'light'
                              ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-black/30 border-white/10 text-gray-500 cursor-not-allowed'
                            : theme === 'light'
                            ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                            : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                        } outline-none`}
                        placeholder={lang === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter email'}
                        required
                      />
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <h4 className={`text-lg font-bold mb-4 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {lang === 'ar' ? 'الصلاحيات' : 'Permissions'}
                    </h4>
                    
                    <div className="space-y-4">
                      {/* View Permissions */}
                      <div>
                        <h5 className={`text-sm font-semibold mb-2 ${
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          {lang === 'ar' ? 'صلاحيات العرض' : 'View Permissions'}
                        </h5>
                        <div className="grid grid-cols-2 gap-3">
                          {(['viewAttendees', 'viewSpeakers', 'viewPartners', 'viewAnalytics'] as const).map((perm) => (
                            <label
                              key={perm}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                formData.permissions[perm]
                                  ? theme === 'light'
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'bg-blue-500/10 border-blue-500/30'
                                  : theme === 'light'
                                  ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.permissions[perm]}
                                onChange={() => handlePermissionChange(perm)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className={`text-sm ${
                                theme === 'light' ? 'text-gray-900' : 'text-white'
                              }`}>
                                {perm.replace('view', '').replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Edit Permissions */}
                      <div>
                        <h5 className={`text-sm font-semibold mb-2 ${
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          {lang === 'ar' ? 'صلاحيات التعديل' : 'Edit Permissions'}
                        </h5>
                        <div className="grid grid-cols-2 gap-3">
                          {(['editAttendees', 'editSpeakers', 'editPartners'] as const).map((perm) => (
                            <label
                              key={perm}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                formData.permissions[perm]
                                  ? theme === 'light'
                                    ? 'bg-purple-50 border-purple-200'
                                    : 'bg-purple-500/10 border-purple-500/30'
                                  : theme === 'light'
                                  ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.permissions[perm]}
                                onChange={() => handlePermissionChange(perm)}
                                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <span className={`text-sm ${
                                theme === 'light' ? 'text-gray-900' : 'text-white'
                              }`}>
                                {perm.replace('edit', '').replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Export Permission */}
                      <div>
                        <h5 className={`text-sm font-semibold mb-2 ${
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          {lang === 'ar' ? 'صلاحيات أخرى' : 'Other Permissions'}
                        </h5>
                        <label
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            formData.permissions.exportData
                              ? theme === 'light'
                                ? 'bg-cyan-50 border-cyan-200'
                                : 'bg-cyan-500/10 border-cyan-500/30'
                              : theme === 'light'
                              ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.permissions.exportData}
                            onChange={() => handlePermissionChange('exportData')}
                            className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                          />
                          <span className={`text-sm ${
                            theme === 'light' ? 'text-gray-900' : 'text-white'
                          }`}>
                            {lang === 'ar' ? 'تصدير البيانات' : 'Export Data'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleCloseModal}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                        theme === 'light'
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      onClick={handleSaveStaff}
                      disabled={!formData.name || !formData.email}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                        !formData.name || !formData.email
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : theme === 'light'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-blue-600 text-white hover:bg-blue-500'
                      }`}
                    >
                      {editingStaff
                        ? (lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes')
                        : (lang === 'ar' ? 'إنشاء الموظف' : 'Create Staff')
                      }
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;

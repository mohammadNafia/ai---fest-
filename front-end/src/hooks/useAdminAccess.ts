/**
 * useAdminAccess - Simple hook for admin access checks
 * 
 * SIMPLIFIED: If user is admin (role === 'admin'), they have FULL access.
 * No granular permission checks for admin users.
 * 
 * This is the "all-or-nothing" approach.
 */

import { useAuth } from '@/contexts/AuthContext';

interface AdminAccess {
  /** True if user is admin */
  isAdmin: boolean;
  /** True if user has full access (same as isAdmin for simplified model) */
  hasFullAccess: boolean;
  /** Admin can view all data */
  canViewAll: boolean;
  /** Admin can edit all data */
  canEditAll: boolean;
  /** Admin can export data */
  canExport: boolean;
  /** Admin can manage staff */
  canManageStaff: boolean;
  /** Admin can manage site content */
  canManageContent: boolean;
}

/**
 * Hook that returns admin access status
 * 
 * For admin users, ALL permissions are true.
 * This is the "all-or-nothing" approach.
 * 
 * @example
 * const { isAdmin, canExport } = useAdminAccess();
 * if (canExport) {
 *   // Show export button
 * }
 */
export const useAdminAccess = (): AdminAccess => {
  const { isAdmin, userRole } = useAuth();
  
  // If admin, everything is true - FULL ACCESS
  if (isAdmin || userRole === 'admin') {
    return {
      isAdmin: true,
      hasFullAccess: true,
      canViewAll: true,
      canEditAll: true,
      canExport: true,
      canManageStaff: true,
      canManageContent: true,
    };
  }
  
  // Non-admin users have no admin access
  return {
    isAdmin: false,
    hasFullAccess: false,
    canViewAll: false,
    canEditAll: false,
    canExport: false,
    canManageStaff: false,
    canManageContent: false,
  };
};

/**
 * Simple function to check if user is admin
 * Can be used outside of React components
 * 
 * @example
 * if (checkIsAdmin()) {
 *   // User is admin
 * }
 */
export const checkIsAdmin = (): boolean => {
  return localStorage.getItem('adminSession') === 'true' || 
         localStorage.getItem('userRole') === 'admin';
};

export default useAdminAccess;

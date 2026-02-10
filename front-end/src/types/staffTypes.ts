/**
 * Staff Management Types
 * Defines staff permissions and staff member structure
 */

/**
 * Staff permissions - Granular access control
 * Admins can enable/disable each permission for staff members
 */
export interface StaffPermissions {
  // View permissions
  viewAttendees: boolean;
  viewSpeakers: boolean;
  viewPartners: boolean;
  viewAnalytics: boolean;
  
  // Edit permissions
  editAttendees: boolean;
  editSpeakers: boolean;
  editPartners: boolean;
  
  // Export permission
  exportData: boolean;
}

/**
 * Default permissions for new staff (all disabled)
 */
export const DEFAULT_STAFF_PERMISSIONS: StaffPermissions = {
  viewAttendees: false,
  viewSpeakers: false,
  viewPartners: false,
  viewAnalytics: false,
  editAttendees: false,
  editSpeakers: false,
  editPartners: false,
  exportData: false,
};

/**
 * Staff member with credentials and permissions
 */
export interface StaffMember {
  id: string;
  email: string;
  name: string;
  password: string; // Hashed in production, plain for demo
  permissions: StaffPermissions;
  createdAt: string;
  createdBy: string; // Admin email who created this staff
  lastLogin?: string;
  isActive: boolean;
}

/**
 * Staff creation input (without ID and auto-generated fields)
 */
export interface CreateStaffInput {
  email: string;
  name: string;
  permissions: StaffPermissions;
}

/**
 * Staff update input (partial permissions update)
 */
export interface UpdateStaffInput {
  name?: string;
  permissions?: Partial<StaffPermissions>;
  isActive?: boolean;
}

/**
 * Helper function to check if staff has any view permission
 */
export function hasAnyViewPermission(permissions: StaffPermissions): boolean {
  return permissions.viewAttendees || 
         permissions.viewSpeakers || 
         permissions.viewPartners || 
         permissions.viewAnalytics;
}

/**
 * Helper function to check if staff has any edit permission
 */
export function hasAnyEditPermission(permissions: StaffPermissions): boolean {
  return permissions.editAttendees || 
         permissions.editSpeakers || 
         permissions.editPartners;
}

/**
 * Helper function to get permission summary string
 */
export function getPermissionSummary(permissions: StaffPermissions): string {
  const perms: string[] = [];
  
  if (permissions.viewAttendees) perms.push('View Attendees');
  if (permissions.editAttendees) perms.push('Edit Attendees');
  if (permissions.viewSpeakers) perms.push('View Speakers');
  if (permissions.editSpeakers) perms.push('Edit Speakers');
  if (permissions.viewPartners) perms.push('View Partners');
  if (permissions.editPartners) perms.push('Edit Partners');
  if (permissions.viewAnalytics) perms.push('View Analytics');
  if (permissions.exportData) perms.push('Export Data');
  
  return perms.length > 0 ? perms.join(', ') : 'No permissions';
}

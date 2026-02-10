/**
 * Staff Management Service
 * Handles CRUD operations for staff members with localStorage
 */

import type { 
  StaffMember, 
  CreateStaffInput, 
  UpdateStaffInput
} from '@/types/staffTypes';

const STORAGE_KEY = 'baghdadai_staff_members';

/**
 * Generate a random password for staff members
 */
function generatePassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

/**
 * Get all staff members from localStorage
 */
export function getAllStaff(): StaffMember[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading staff members:', error);
    return [];
  }
}

/**
 * Get staff member by email
 */
export function getStaffByEmail(email: string): StaffMember | null {
  const allStaff = getAllStaff();
  return allStaff.find(staff => staff.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Get staff member by ID
 */
export function getStaffById(id: string): StaffMember | null {
  const allStaff = getAllStaff();
  return allStaff.find(staff => staff.id === id) || null;
}

/**
 * Create a new staff member
 * Returns the created staff with generated password
 */
export function createStaff(
  input: CreateStaffInput, 
  createdBy: string
): { success: boolean; staff?: StaffMember; password?: string; error?: string } {
  try {
    const allStaff = getAllStaff();
    
    // Check if email already exists
    if (allStaff.some(staff => staff.email.toLowerCase() === input.email.toLowerCase())) {
      return { success: false, error: 'Email already exists' };
    }
    
    // Generate password
    const password = generatePassword();
    
    // Create new staff member
    const newStaff: StaffMember = {
      id: `staff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: input.email,
      name: input.name,
      password: password, // In production, this should be hashed
      permissions: input.permissions,
      createdAt: new Date().toISOString(),
      createdBy: createdBy,
      isActive: true,
    };
    
    // Save to localStorage
    allStaff.push(newStaff);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allStaff));
    
    return { success: true, staff: newStaff, password };
  } catch (error) {
    console.error('Error creating staff member:', error);
    return { success: false, error: 'Failed to create staff member' };
  }
}

/**
 * Update staff member
 */
export function updateStaff(
  id: string, 
  updates: UpdateStaffInput
): { success: boolean; staff?: StaffMember; error?: string } {
  try {
    const allStaff = getAllStaff();
    const index = allStaff.findIndex(staff => staff.id === id);
    
    if (index === -1) {
      return { success: false, error: 'Staff member not found' };
    }
    
    // Update staff member
    const updatedStaff = {
      ...allStaff[index],
      ...(updates.name && { name: updates.name }),
      ...(updates.permissions && { 
        permissions: { ...allStaff[index].permissions, ...updates.permissions }
      }),
      ...(updates.isActive !== undefined && { isActive: updates.isActive }),
    };
    
    allStaff[index] = updatedStaff;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allStaff));
    
    return { success: true, staff: updatedStaff };
  } catch (error) {
    console.error('Error updating staff member:', error);
    return { success: false, error: 'Failed to update staff member' };
  }
}

/**
 * Delete staff member
 */
export function deleteStaff(id: string): { success: boolean; error?: string } {
  try {
    const allStaff = getAllStaff();
    const filtered = allStaff.filter(staff => staff.id !== id);
    
    if (filtered.length === allStaff.length) {
      return { success: false, error: 'Staff member not found' };
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    console.error('Error deleting staff member:', error);
    return { success: false, error: 'Failed to delete staff member' };
  }
}

/**
 * Validate staff credentials for login
 */
export function validateStaffCredentials(
  email: string, 
  password: string
): { success: boolean; staff?: StaffMember; error?: string } {
  try {
    const staff = getStaffByEmail(email);
    
    if (!staff) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    if (!staff.isActive) {
      return { success: false, error: 'Account is inactive' };
    }
    
    if (staff.password !== password) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Update last login
    const allStaff = getAllStaff();
    const index = allStaff.findIndex(s => s.id === staff.id);
    if (index !== -1) {
      allStaff[index].lastLogin = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allStaff));
    }
    
    return { success: true, staff };
  } catch (error) {
    console.error('Error validating credentials:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

/**
 * Deactivate staff member (soft delete)
 */
export function deactivateStaff(id: string): { success: boolean; error?: string } {
  return updateStaff(id, { isActive: false });
}

/**
 * Activate staff member
 */
export function activateStaff(id: string): { success: boolean; error?: string } {
  return updateStaff(id, { isActive: true });
}

/**
 * Get active staff count
 */
export function getActiveStaffCount(): number {
  return getAllStaff().filter(staff => staff.isActive).length;
}

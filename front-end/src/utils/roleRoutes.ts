/**
 * Role-based Routing Utilities - SIMPLIFIED
 * 
 * Admin routes to /admin/dashboard with FULL access
 * Staff routes to /staff/dashboard with limited access
 * 
 * Admin = Super Admin (all-or-nothing access)
 */

import type { UserRole } from '@/types';

/**
 * Role to route mapping
 */
export const ROLE_ROUTES: Record<UserRole, string> = {
  guest: '/',
  user: '/',
  reviewer: '/', // Reviewers go to home (not admin)
  staff: '/staff/dashboard',
  admin: '/admin/dashboard', // Admin goes to admin dashboard with FULL access
};

/**
 * Gets the default route for a user role
 */
export function getRoleRoute(role: UserRole): string {
  return ROLE_ROUTES[role] || ROLE_ROUTES.guest;
}

/**
 * Checks if a route requires authentication
 */
export function requiresAuth(path: string): boolean {
  return path.startsWith('/admin') || 
         path.startsWith('/staff') || 
         path.startsWith('/profile');
}

/**
 * SIMPLIFIED: Checks if a route is accessible by role
 * 
 * Admin can access EVERYTHING
 * Staff can access staff routes
 * Others can only access public routes
 */
export function canAccessRoute(path: string, role: UserRole): boolean {
  // Admin has access to EVERYTHING
  if (role === 'admin') {
    return true;
  }
  
  // Admin routes - only admin
  if (path.startsWith('/admin')) {
    return false; // Only admin can access (handled above)
  }
  
  // Staff routes - staff only (admin already returned true above)
  if (path.startsWith('/staff')) {
    return role === 'staff';
  }
  
  // Public routes - everyone
  return true;
}

/**
 * Check if user is admin based on role
 */
export function isAdminRole(role: UserRole): boolean {
  return role === 'admin';
}


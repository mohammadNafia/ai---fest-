/**
 * ProtectedRoute - SIMPLIFIED Role-based route protection
 * 
 * Admin routes: Only check if role === 'admin' (full access)
 * Staff routes: Check if role === 'staff' or 'admin'
 * 
 * NO granular permission checks for admin users.
 * Admin = Super Admin with full access to everything.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleRoute } from '@/utils/roleRoutes';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
}

/**
 * ProtectedRoute component - SIMPLIFIED
 * 
 * For admin routes: Only checks if user is admin (role === 'admin')
 * Admin has full access to everything - no granular checks needed.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  allowedRoles 
}) => {
  const { userRole, isAdmin, hydrated } = useAuth();
  const location = useLocation();

  // Wait for hydration
  if (!hydrated) {
    return null;
  }

  // SIMPLIFIED: Admin routes - just check if admin
  if (location.pathname.startsWith('/admin')) {
    // Check localStorage as fallback for race conditions
    const isAdminSession = 
      isAdmin || 
      localStorage.getItem('adminSession') === 'true' ||
      localStorage.getItem('userRole') === 'admin';
    
    if (!isAdminSession) {
      return <Navigate to="/signin" state={{ from: location }} replace />;
    }
    
    // Admin is logged in - FULL ACCESS, no further checks needed
    return <>{children}</>;
  }

  // Staff routes - staff or admin can access
  if (location.pathname.startsWith('/staff')) {
    if (userRole === 'staff' || isAdmin) {
      return <>{children}</>;
    }
    return <Navigate to="/staff/login" state={{ from: location }} replace />;
  }

  // For other protected routes, use standard role checks
  if (requiredRole && userRole !== requiredRole && !isAdmin) {
    return <Navigate to={getRoleRoute(userRole)} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole) && !isAdmin) {
    return <Navigate to={getRoleRoute(userRole)} replace />;
  }

  return <>{children}</>;
};

/**
 * AdminRoute - SIMPLIFIED
 * Only allows users with role === 'admin'
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, hydrated } = useAuth();
  const location = useLocation();

  // Wait for hydration before checking access
  if (!hydrated) {
    return null;
  }

  // SIMPLIFIED: Only admin role has access
  // Check both context and localStorage for reliability
  const hasAccess = 
    isAdmin || 
    localStorage.getItem('adminSession') === 'true' ||
    localStorage.getItem('userRole') === 'admin';

  if (!hasAccess) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * StaffRoute - For staff dashboard
 * Allows staff OR admin (admin has access to everything)
 */
export const StaffRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userRole, isAdmin, hydrated } = useAuth();
  const location = useLocation();

  if (!hydrated) {
    return null;
  }

  // Staff or admin can access staff routes
  if (userRole === 'staff' || isAdmin) {
    return <>{children}</>;
  }

  return <Navigate to="/staff/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;


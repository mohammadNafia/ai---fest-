/**
 * AuthContext - Authentication context with flexible role handling
 * Uses roleUtils for normalization and validation
 * 
 * FIXED: Added hydration guard and proper async adminLogin
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { normalizeRole } from '@/utils/roleUtils';
import type { User, UserRole } from '@/types';
import { validateStaffCredentials } from '@/services/staffService';
import * as authAPI from '@/api/auth';

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  /** @deprecated Use isAdmin instead */
  adminLoggedIn: boolean;
  /** SIMPLIFIED: True if role === 'admin' - grants full access */
  isAdmin: boolean;
  /** Check if user has admin privileges */
  hasAdminAccess: () => boolean;
  token: string | null;
  sessionExpiry: number | null;
  hydrated: boolean;
  login: (userData: Partial<User> & { email: string; name: string }, token?: string, expiresIn?: number) => void;
  logout: () => void;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  staffLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  oauthSignIn: (provider: 'google' | 'github') => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  checkSession: () => boolean;
  refreshToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Hydration state - prevents rendering before localStorage is read
  const [hydrated, setHydrated] = useState<boolean>(false);

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>('guest');

  /**
   * SIMPLIFIED: Admin check is now just role === 'admin'
   * Admin has FULL access to everything - no granular permissions
   */
  const isAdmin = userRole === 'admin' || adminLoggedIn;

  /**
   * Simple function to check admin access
   * Returns true if user is admin (all-or-nothing)
   */
  const hasAdminAccess = (): boolean => {
    return userRole === 'admin' || adminLoggedIn;
  };

  // Hydrate state from localStorage on mount
  useEffect(() => {
    try {
      // Read all localStorage values first
      const adminSession = localStorage.getItem('adminSession') === 'true';
      const userSession = localStorage.getItem('userSession');
      const authToken = localStorage.getItem('authToken');
      const expiry = localStorage.getItem('sessionExpiry');
      const storedUserRole = localStorage.getItem('userRole');

      // Determine initial state
      if (adminSession) {
        // Admin session takes precedence
        setAdminLoggedIn(true);
        setUserRole('admin');
        setUser(null); // Clear any user session
        if (authToken) setToken(authToken);
        if (expiry) setSessionExpiry(parseInt(expiry, 10));
      } else if (userSession) {
        // Regular user session
        try {
          const parsed = JSON.parse(userSession);
          const normalizedRole = normalizeRole(parsed.role || storedUserRole, 'user');
          
          setUser({
            ...parsed,
            role: normalizedRole,
          });
          setUserRole(normalizedRole);
          if (authToken) setToken(authToken);
          if (expiry) setSessionExpiry(parseInt(expiry, 10));
        } catch (error) {
          console.error('Error parsing user session:', error);
          setUser(null);
          setUserRole('guest');
        }
      } else {
        // No session - check if there's a stored role (shouldn't happen, but handle it)
        if (storedUserRole) {
          const normalizedRole = normalizeRole(storedUserRole, 'guest');
          setUserRole(normalizedRole);
        } else {
          setUserRole('guest');
        }
        setUser(null);
      }
    } catch (error) {
      console.error('Error hydrating auth state:', error);
      setUser(null);
      setAdminLoggedIn(false);
      setUserRole('guest');
    } finally {
      // Mark as hydrated after reading localStorage
      setHydrated(true);
    }
  }, []); // Only run once on mount

  // Session expiry check
  useEffect(() => {
    const checkExpiry = () => {
      if (sessionExpiry && Date.now() >= sessionExpiry) {
        logout();
      }
    };

    const interval = setInterval(checkExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [sessionExpiry]);

  // Auto-logout on idle
  useEffect(() => {
    if (!user && !adminLoggedIn) return;

    let idleTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        logout();
      }, IDLE_TIMEOUT);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetIdleTimer, { passive: true });
    });

    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      events.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [user, adminLoggedIn]);

  /**
   * Login function with flexible role handling
   * Automatically normalizes role if provided (handles typos like "rolo")
   * FIXED: Clears admin session and sets userRole in localStorage
   */
  const login = (
    userData: Partial<User> & { email: string; name: string },
    authToken?: string,
    expiresIn: number = SESSION_DURATION
  ) => {
    // Normalize role if provided, default to 'user'
    const normalizedRole = userData.role 
      ? normalizeRole(userData.role, 'user')
      : 'user';

    const userWithRole: User = {
      id: userData.id || Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: normalizedRole, // Always use normalized role
      avatar: userData.avatar,
    };

    const authTokenValue = authToken || `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiry = Date.now() + expiresIn;

    // STEP 1: Clear any admin session first (user and admin cannot be logged in simultaneously)
    localStorage.removeItem('adminSession');
    setAdminLoggedIn(false);

    // STEP 2: Set localStorage FIRST (synchronous, immediate)
    localStorage.setItem('userSession', JSON.stringify(userWithRole));
    localStorage.setItem('authToken', authTokenValue);
    localStorage.setItem('userRole', normalizedRole);
    localStorage.setItem('userId', userWithRole.id);
    localStorage.setItem('sessionExpiry', expiry.toString());

    // STEP 3: Update React state synchronously
    setUser(userWithRole);
    setUserRole(normalizedRole);
    setToken(authTokenValue);
    setSessionExpiry(expiry);
  };

  const logout = () => {
    // Remove all session keys from localStorage
    localStorage.removeItem('userSession');
    localStorage.removeItem('adminSession');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionExpiry');
    
    // Reset React state
    setUser(null);
    setAdminLoggedIn(false);
    setUserRole('guest');
    setToken(null);
    setSessionExpiry(null);
  };

  /**
   * Admin login - Returns Promise that resolves after all state is updated
   * Now connects to backend API: POST /api/Auth/login
   */
  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Call backend API
      const result = await authAPI.login(email, password);
      
      if (result.success && result.data) {
        const authData = result.data;
        const authToken = authData.token;
        const user = authData.user;
        const expiry = new Date(authData.expiresAt).getTime();
      
      // STEP 1: Set localStorage FIRST (synchronous, immediate)
      localStorage.setItem('adminSession', 'true');
      localStorage.setItem('authToken', authToken);
        localStorage.setItem('userRole', user.role || 'admin');
      localStorage.setItem('sessionExpiry', expiry.toString());
        localStorage.setItem('userSession', JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'admin',
          avatar: user.avatarUrl,
        }));
      
        // STEP 2: Update React state synchronously
        setUser({
          id: user.id,
          email: user.email,
          name: user.name,
          role: (user.role || 'admin') as UserRole,
          avatar: user.avatarUrl,
        });
      setAdminLoggedIn(true);
        setUserRole((user.role || 'admin') as UserRole);
      setToken(authToken);
      setSessionExpiry(expiry);
      
        return { success: true };
    } else {
        return { success: false, error: result.error || 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  /**
   * Staff login
   * Uses staffService to validate credentials
   */
  const staffLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const result = validateStaffCredentials(email, password);
    
    if (result.success && result.staff) {
      // Create user object from staff member
      const staffUser = {
        email: result.staff.email,
        name: result.staff.name,
        role: 'staff' as UserRole,
        id: result.staff.id,
        permissions: result.staff.permissions
      };
      
      // Use standard login function to set session
      login(staffUser);
      
      return Promise.resolve({ success: true });
    } else {
      return Promise.resolve({ success: false, error: result.error || 'Invalid credentials' });
    }
  };

  /**
   * OAuth Sign-In
   * OAuth providers (Google, GitHub) → User role (default)
   * Auto-registers user if first time sign-in
   * Connects to backend API: POST /api/Auth/oauth/signin
   */
  const oauthSignIn = async (provider: 'google' | 'github'): Promise<{ success: boolean; error?: string }> => {
    try {
      // TODO: Implement actual OAuth flow
      // For now, simulate OAuth data (in production, get from OAuth provider)
      // In production, this would:
      // 1. Redirect to OAuth provider
      // 2. Get OAuth callback with access token
      // 3. Get user info from OAuth provider
      // 4. Send to backend API

      // Simulate OAuth user data (replace with actual OAuth flow)
      const oauthAccessToken = `oauth_token_${provider}_${Date.now()}`;
      const oauthEmail = `user@${provider}.com`; // Get from OAuth provider
      const oauthName = `${provider} User`; // Get from OAuth provider
      const oauthAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`; // Get from OAuth provider

      // Call backend API
      const result = await authAPI.oauthSignIn(
        provider,
        oauthAccessToken,
        oauthEmail,
        oauthName,
        oauthAvatar
      );

      if (result.success && result.data) {
        const authData = result.data;
        const authToken = authData.token;
        const user = authData.user;
        const expiry = new Date(authData.expiresAt).getTime();

        // Set session
        localStorage.setItem('userSession', JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'user',
          avatar: user.avatarUrl,
        }));
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userRole', user.role || 'user');
        localStorage.setItem('sessionExpiry', expiry.toString());
        localStorage.removeItem('adminSession');

        // Update React state
        setUser({
          id: user.id,
          email: user.email,
          name: user.name,
          role: (user.role || 'user') as UserRole,
          avatar: user.avatarUrl,
        });
        setUserRole((user.role || 'user') as UserRole);
        setToken(authToken);
        setSessionExpiry(expiry);
        setAdminLoggedIn(false);

        return { success: true };
      } else {
        return { success: false, error: result.error || 'OAuth sign-in failed' };
      }
    } catch (error) {
      console.error('OAuth sign-in error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'OAuth sign-in failed' 
      };
    }
  };

  const adminLogout = () => {
    // Remove all session keys
    localStorage.removeItem('adminSession');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('sessionExpiry');
    
    // Reset React state
    setAdminLoggedIn(false);
    setUserRole('guest');
    setToken(null);
    setSessionExpiry(null);
    setUser(null);
  };

  const checkSession = (): boolean => {
    if (!sessionExpiry) return false;
    const isValid = Date.now() < sessionExpiry;
    if (!isValid) {
      logout();
    }
    return isValid;
  };

  const refreshToken = () => {
    if (sessionExpiry && Date.now() < sessionExpiry) {
      const newExpiry = Date.now() + SESSION_DURATION;
      setSessionExpiry(newExpiry);
      localStorage.setItem('sessionExpiry', newExpiry.toString());
    }
  };

  // Don't render children until hydration is complete
  // This prevents race conditions with ProtectedRoute
  if (!hydrated) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        adminLoggedIn,
        isAdmin,
        hasAdminAccess,
        token,
        sessionExpiry,
        hydrated,
        login,
        logout,
        adminLogin,
        staffLogin,
        oauthSignIn,
        adminLogout,
        checkSession,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a safe default instead of throwing to prevent errors during hydration
    // This allows components to render safely while providers are initializing
    console.warn('useAuth called outside AuthProvider, returning default values');
    return {
      user: null,
      userRole: 'guest',
      adminLoggedIn: false,
      isAdmin: false,
      hasAdminAccess: () => false,
      token: null,
      sessionExpiry: null,
      hydrated: false,
      login: () => {},
      logout: () => {},
      adminLogin: async () => ({ success: false, error: 'AuthProvider not available' }),
      staffLogin: async () => ({ success: false, error: 'AuthProvider not available' }),
      oauthSignIn: async () => ({ success: false, error: 'AuthProvider not available' }),
      adminLogout: () => {},
      checkSession: () => false,
      refreshToken: () => {},
    };
  }
  return context;
};


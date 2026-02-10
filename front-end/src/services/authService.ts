/**
 * Authentication Service - Simplified for ASP.NET Backend
 * 
 * Note: Full JWT authentication will be implemented when backend auth is ready
 * For now, provides basic local authentication for admin access
 */

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'user' | 'reviewer';
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResult {
  success: boolean;
  user?: any;
  profile?: UserProfile;
  error?: string;
}

// Local admin credentials (for development)
const ADMIN_EMAIL = 'admin@baghdad-ai-summit.com';
const ADMIN_PASSWORD = 'admin123';

class AuthService {
  private currentUser: UserProfile | null = null;

  /**
   * Sign in with email and password
   * TODO: Implement JWT authentication with backend
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      // For now, use local admin authentication
      // TODO: Replace with backend JWT authentication
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const profile: UserProfile = {
          id: 'local-admin',
          email: ADMIN_EMAIL,
          name: 'Admin User',
          role: 'admin',
        };

        this.currentUser = profile;
        
        // Store in localStorage for session persistence
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(profile));
        }

        return {
          success: true,
          user: { id: profile.id, email: profile.email },
          profile,
        };
      }

      return {
        success: false,
        error: 'Invalid email or password',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    this.currentUser = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth_user');
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to restore from localStorage
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        try {
          this.currentUser = JSON.parse(stored);
          return this.currentUser;
        } catch {
          // Invalid stored data
        }
      }
    }

    return null;
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  /**
   * Check if user has admin role
   */
  async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === 'admin';
  }
}

export const authService = new AuthService();

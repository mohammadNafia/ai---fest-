import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'speaker' | 'partner';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  sessionExpiry: number | null;
  login: (user: User, token: string, expiresIn?: number) => void;
  logout: () => void;
  checkSession: () => boolean;
  refreshToken: () => void;
}

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      sessionExpiry: null,

      login: (user: User, token: string, expiresIn: number = SESSION_DURATION) => {
        const expiry = Date.now() + expiresIn;
        set({
          user,
          token,
          isAuthenticated: true,
          sessionExpiry: expiry,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          sessionExpiry: null,
        });
      },

      checkSession: () => {
        const { sessionExpiry } = get();
        if (!sessionExpiry) return false;
        
        const isValid = Date.now() < sessionExpiry;
        if (!isValid) {
          get().logout();
        }
        return isValid;
      },

      refreshToken: () => {
        const { sessionExpiry } = get();
        if (sessionExpiry && Date.now() < sessionExpiry) {
          set({ sessionExpiry: Date.now() + SESSION_DURATION });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);


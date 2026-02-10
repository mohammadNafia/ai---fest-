import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  searchOpen: boolean;
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    timestamp: number;
  }>;
  toggleSidebar: () => void;
  setSearchOpen: (open: boolean) => void;
  addNotification: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  searchOpen: false,
  notifications: [],

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSearchOpen: (open: boolean) => set({ searchOpen: open }),

  addNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const notification = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type,
      timestamp: Date.now(),
    };
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    // Auto-remove after 5 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== notification.id),
      }));
    }, 5000);
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => set({ notifications: [] }),
}));


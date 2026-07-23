import { create } from 'zustand';

export interface User {
  id: string;
  username: string;
  email?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: typeof window !== 'undefined' && localStorage.getItem('parsify_user')
    ? JSON.parse(localStorage.getItem('parsify_user')!)
    : { id: 'demo-user', username: 'Demo User', email: 'demo@parsify.com' },
  isAuthenticated: true,
  isLoading: false,
  signIn: () => {
    const user = { id: 'demo-user', username: 'Demo User', email: 'demo@parsify.com' };
    if (typeof window !== 'undefined') {
      localStorage.setItem('parsify_user', JSON.stringify(user));
    }
    set({ user, isAuthenticated: true });
  },
  signOut: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('parsify_user');
    }
    set({ user: null, isAuthenticated: false });
  },
}));

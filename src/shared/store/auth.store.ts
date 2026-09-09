import { create } from 'zustand';

import { refreshSession } from '@/api/refresh';

let authCheck: Promise<boolean> | undefined;

type AuthState = {
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setAccessToken: (token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,
  setAccessToken: (token) => set({ accessToken: token, isAuthenticated: true }),
  logout: () => set({ accessToken: null, isAuthenticated: false }),

  checkAuth: async () => {
    if (get().isInitialized) {
      return get().isAuthenticated;
    }

    if (!authCheck) {
      authCheck = (async () => {
        try {
          const { accessToken } = await refreshSession();

          set({ isInitialized: true, isAuthenticated: true, accessToken });

          return true;
        } catch {
          set({
            accessToken: null,
            isAuthenticated: false,
            isInitialized: true,
          });

          return false;
        }
      })();
    }

    return authCheck;
  },
}));

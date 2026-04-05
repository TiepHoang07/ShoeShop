import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Matches the exact AuthResponse DTO from our Java backend
export interface UserInfo {
  id: number;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'SELLER';
}

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  setAuth: (user: UserInfo, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      
      // Called when the user successfully logs in
      setAuth: (user, token) => {
        localStorage.setItem('token', token); // Save exact token string for Axios
        set({ user, token });
      },
      
      // Called when clicking exactly "Log Out"
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
        window.location.href = '/login'; // Bounce them back to login page
      },
      
      // Helper function to check if a user is currently logged in
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'shoe-store-auth', // the key it saves under in standard LocalStorage
    }
  )
);

import { create } from 'zustand';

type Mode = "DSA" | "DEV" | "AI";

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface AppState {
  mode: Mode;
  setMode: (mode: Mode) => void;
  
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: "DSA",
  setMode: (mode) => set({ mode }),
  
  user: null,
  setUser: (user) => {
    set({ user });
    if (user?.token) {
      localStorage.setItem('token', user.token);
    }
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem('token');
  },
  
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 
         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },
}));

import { create } from 'zustand';

export type Mode = "DSA" | "DEV" | "AI" | "DB" | "SYSTEMDESIGN";

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  createdAt?: string;
  _count?: {
    problems: number;
  };
}

interface AppState {
  mode: Mode;
  setMode: (mode: Mode) => void;
  
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
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
}));

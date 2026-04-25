import { create } from 'zustand';

import type { ThemeStore } from '@/types/common.types';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme');
  return stored === 'dark' ? 'dark' : 'light';
};

export const useTheme = create<ThemeStore>((set) => ({
  theme: getInitialTheme(),
  toggle: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return { theme: newTheme };
    }),
}));

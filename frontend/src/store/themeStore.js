// src/store/themeStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const applyThemeToDOM = (theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.colorScheme = 'light';
  }
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark', // 'dark' | 'light'

      toggleTheme: () => {
        const current = get().theme;
        const nextTheme = current === 'dark' ? 'light' : 'dark';
        applyThemeToDOM(nextTheme);
        set({ theme: nextTheme });
      },

      setTheme: (theme) => {
        applyThemeToDOM(theme);
        set({ theme });
      },

      initTheme: () => {
        const currentTheme = get().theme || 'dark';
        applyThemeToDOM(currentTheme);
      },
    }),
    {
      name: 'smashmatch-theme',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyThemeToDOM(state.theme);
        }
      },
    }
  )
);

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check localStorage key 'theme' (exact REA key)
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--paper', '#0A0A0A');
      root.style.setProperty('--paper-card', '#141414');
      root.style.setProperty('--ink', '#F8FAFC');
      root.style.setProperty('--muted', '#94A3B8');
      root.style.setProperty('--line', 'rgba(255, 255, 255, 0.12)');
      root.style.setProperty('--brand-header', '#0F172A');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--paper', '#F5F1E8');
      root.style.setProperty('--paper-card', '#FFFDF7');
      root.style.setProperty('--ink', '#211D18');
      root.style.setProperty('--muted', '#6F675C');
      root.style.setProperty('--line', 'rgba(33, 29, 24, 0.1)');
      root.style.setProperty('--brand-header', '#1C3D5A');
    }
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    applyTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

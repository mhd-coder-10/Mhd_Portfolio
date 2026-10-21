import { useState, useEffect } from 'react';

const STORAGE_KEY = 'portfolio_theme';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Default is dark mode per requirement
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme, isDark: theme === 'dark' };
};

export default useTheme;

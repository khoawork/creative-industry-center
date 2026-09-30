import { useCallback, useEffect, useState } from 'react';

const themeStorageKey = 'creative-industry-center:admin-theme';

export default function useAdminTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(themeStorageKey, theme);
    } catch {
      // Theme switching still works when browser storage is unavailable.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');
  }, []);

  return { theme, toggleTheme };
}

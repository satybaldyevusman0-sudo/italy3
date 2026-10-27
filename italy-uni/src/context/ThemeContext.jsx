import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage('si_theme', prefersDark ? 'dark' : 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

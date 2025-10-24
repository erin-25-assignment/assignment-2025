import { useEffect } from 'react';
import { Theme } from '../types';

export const useTheme = (theme: Theme) => {
  useEffect(() => {
    const root = window.document.documentElement;
    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const applyTheme = (themeToApply: Theme) => {
      root.classList.remove('light', 'dark');
      if (themeToApply === 'dark' || (themeToApply === 'system' && systemIsDark)) {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
    };

    applyTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
};

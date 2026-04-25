import { useEffect } from 'react';

import { useTheme } from '@/store/ui.store';

export function useThemeSync() {
  const theme = useTheme((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
}

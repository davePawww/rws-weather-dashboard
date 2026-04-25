import { act, render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useThemeSync } from '@/hooks/use-theme-sync';
import { useTheme } from '@/store/ui.store';

function TestComponent() {
  useThemeSync();
  return null;
}

describe('useThemeSync', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    useTheme.setState({ theme: 'light' });
  });

  it('keeps document theme class in sync with the store', () => {
    render(<TestComponent />);

    expect(document.documentElement).not.toHaveClass('dark');

    act(() => {
      useTheme.setState({ theme: 'dark' });
    });

    expect(document.documentElement).toHaveClass('dark');

    act(() => {
      useTheme.setState({ theme: 'light' });
    });

    expect(document.documentElement).not.toHaveClass('dark');
  });
});

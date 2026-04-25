import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useTheme store', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('defaults to light when no theme is stored', async () => {
    const { useTheme } = await import('@/store/ui.store');

    expect(useTheme.getState().theme).toBe('light');
  });

  it('hydrates dark theme from localStorage', async () => {
    localStorage.setItem('theme', 'dark');

    const { useTheme } = await import('@/store/ui.store');

    expect(useTheme.getState().theme).toBe('dark');
  });

  it('toggles the theme and persists the new value', async () => {
    const { useTheme } = await import('@/store/ui.store');

    useTheme.getState().toggle();
    expect(useTheme.getState().theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    useTheme.getState().toggle();
    expect(useTheme.getState().theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });
});

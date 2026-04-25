import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import Header from '@/components/layout/components/header';
import { useTheme } from '@/store/ui.store';

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
    useTheme.setState({ theme: 'light' });
  });

  it('renders the title and project link', () => {
    render(<Header title="Test Project" projectLink="https://github.com/example/repo" />);

    expect(screen.getByRole('heading', { name: 'Test Project' })).toBeInTheDocument();

    const codeLink = screen.getByRole('link', { name: /code/i });
    expect(codeLink).toHaveAttribute('href', 'https://github.com/example/repo');
    expect(codeLink).toHaveAttribute('target', '_blank');
    expect(codeLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('toggles theme and persists the new value', () => {
    render(<Header title="Test Project" projectLink="https://github.com/example/repo" />);

    const toggleButton = screen.getAllByRole('button', { name: /toggle theme/i })[0];

    fireEvent.click(toggleButton);
    expect(useTheme.getState().theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    fireEvent.click(toggleButton);
    expect(useTheme.getState().theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });
});

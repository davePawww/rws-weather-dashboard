import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import Layout from '@/components/layout/components/layout';
import { useTheme } from '@/store/ui.store';

describe('Layout', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    localStorage.clear();
    useTheme.setState({ theme: 'light' });
  });

  it('renders the application shell around its children', () => {
    render(
      <Layout>
        <div>Child content</div>
      </Layout>,
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});

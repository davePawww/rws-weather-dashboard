import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Footer from '@/components/layout/components/footer';

describe('Footer', () => {
  it('renders the credit text and avatar image', () => {
    render(<Footer />);

    expect(screen.getByText(/Dave Paurillo/i)).toBeInTheDocument();
    expect(screen.getByText('DP')).toBeInTheDocument();
  });

  it('renders the expected external links', () => {
    render(<Footer />);

    const links = screen.getAllByRole('link');
    const hrefs = links.map((link) => link.getAttribute('href'));

    expect(hrefs).toEqual(
      expect.arrayContaining([
        'https://x.com/davePawww',
        'https://www.linkedin.com/in/davepaurillo/',
        'https://github.com/davePawww',
        'https://paurillo-dave.vercel.app/',
      ]),
    );

    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });
});

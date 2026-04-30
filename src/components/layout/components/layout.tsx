import { motion } from 'motion/react';

import Footer from '@/components/layout/components/footer';
import Header from '@/components/layout/components/header';
import { useThemeSync } from '@/hooks/use-theme-sync';
import type { LayoutProps } from '@/types/common.types';

export default function Layout({ children }: LayoutProps) {
  useThemeSync();

  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col overflow-hidden p-4">
      <Header title="02-weather-dashboard" projectLink="https://github.com/davePawww/rws-weather-dashboard" />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'backIn' }}
        className="full-shadow my-4 flex-1 rounded-md p-4"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}

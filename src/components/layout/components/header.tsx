import { SunIcon, MoonIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { FaGithub } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/store/ui.store';
import type { HeaderProps } from '@/types/common.types';

export default function Header({ title, projectLink }: HeaderProps) {
  const theme = useTheme((state) => state.theme);
  const toggleTheme = useTheme((state) => state.toggle);

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: 'easeIn' }}
      className="flex flex-col items-center justify-between gap-1.5 md:flex-row md:gap-0"
    >
      <h1 className="font-semibold">{title}</h1>
      <div className="flex items-center gap-1">
        {theme === 'light' ? (
          <Button variant={'secondary'} onClick={toggleTheme} aria-label="Toggle theme">
            <SunIcon />
          </Button>
        ) : (
          <Button variant={'secondary'} onClick={toggleTheme} aria-label="Toggle theme">
            <MoonIcon />
          </Button>
        )}
        <Separator orientation="vertical" />
        <Button variant={'outline'} asChild>
          <a href={projectLink} target="_blank" rel="noopener noreferrer">
            <FaGithub /> Code
          </a>
        </Button>
      </div>
    </motion.header>
  );
}

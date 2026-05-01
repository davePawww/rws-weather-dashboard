import { motion } from 'motion/react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

import avatarImg from '@/assets/dave.jpeg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { AvatarIconProps } from '@/types/common.types';

const socials = [
  { link: 'https://x.com/davePawww', icon: <FaTwitter size={22} /> },
  { link: 'https://www.linkedin.com/in/davepaurillo/', icon: <FaLinkedin size={22} /> },
  { link: 'https://github.com/davePawww', icon: <FaGithub size={22} /> },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeIn' }}
      className="flex items-center justify-between"
    >
      <p className="text-xs opacity-60">© 2026 | Dave Paurillo</p>
      <div className="flex gap-1">
        {socials.map((s) => (
          <SocialsIcon key={s.link} link={s.link} icon={s.icon} />
        ))}
        <a href="https://paurillo-dave.vercel.app/" target="_blank" rel="noopener noreferrer">
          <Avatar className="full-shadow">
            <AvatarImage src={avatarImg} alt="@davePawww" />
            <AvatarFallback>DP</AvatarFallback>
          </Avatar>
        </a>
      </div>
    </motion.footer>
  );
}

function SocialsIcon({ link, icon }: AvatarIconProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="full-shadow flex size-8 items-center justify-center rounded-full"
      aria-label={`Link to ${link}`}
    >
      {icon}
    </a>
  );
}

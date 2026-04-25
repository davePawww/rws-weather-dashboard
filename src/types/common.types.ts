import type { JSX, ReactNode } from 'react';

export type LayoutProps = {
  children: ReactNode;
};

export type HeaderProps = {
  title: string;
  projectLink: string;
};

export type ThemeStore = {
  theme: 'light' | 'dark';
  toggle: () => void;
};

export type AvatarIconProps = {
  link: string;
  icon: JSX.Element;
};

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

export type GeolocationState = {
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  error: GeolocationPositionError | null;
};

export type NominatimReverseResponse = {
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country_code?: string;
  };
};

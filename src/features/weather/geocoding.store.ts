import { create } from 'zustand';

import type { GeoCodingStore } from '@/features/weather/weather.types';

export const useGeoCodingStore = create<GeoCodingStore>((set) => ({
  selectedCity: null,
  setSelectedCity: (city) => set({ selectedCity: city }),
}));

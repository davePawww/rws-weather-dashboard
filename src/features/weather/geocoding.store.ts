import { create } from 'zustand';

import type { GeoCodingStore } from '@/features/weather/weather.types';

export const useGeoCodingStore = create<GeoCodingStore>((set) => ({
  selectedCity: null,
  selectedUnit: 'celsius',
  setSelectedCity: (city) => set({ selectedCity: city }),
  setSelectedUnit: (unit) => set({ selectedUnit: unit }),
}));

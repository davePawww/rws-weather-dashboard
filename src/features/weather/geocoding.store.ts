import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { GeoCodingStore } from '@/features/weather/weather.types';

const MAX_RECENT_SEARCHES = 5;

export const useGeocodingStore = create<GeoCodingStore>()(
  persist(
    (set, get) => ({
      selectedCity: null,
      selectedUnit: 'celsius',
      recentSearches: [],
      setSelectedCity: (city) => set({ selectedCity: city }),
      setSelectedUnit: (unit) => set({ selectedUnit: unit }),
      addRecentSearch: (city) => {
        const prev = get().recentSearches.filter((c) => c.id !== city.id);
        set({ recentSearches: [city, ...prev].slice(0, MAX_RECENT_SEARCHES) });
      },
    }),
    {
      name: 'geocoding-store',
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        selectedUnit: state.selectedUnit,
      }),
    },
  ),
);

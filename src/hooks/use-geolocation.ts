import { useEffect, useState } from 'react';

import type { GeolocationState } from '@/types/common.types';

export const useGeolocation = (): GeolocationState => {
  const [state, setState] = useState<GeolocationState>(() => ({
    latitude: null,
    longitude: null,
    isLoading: typeof navigator !== 'undefined' && !!navigator.geolocation,
    error: null,
  }));

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setState({
          latitude: coords.latitude,
          longitude: coords.longitude,
          isLoading: false,
          error: null,
        }),
      (error) => setState((prev) => ({ ...prev, isLoading: false, error })),
    );
  }, []);

  return state;
};

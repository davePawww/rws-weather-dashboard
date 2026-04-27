import type { City, GeocodingResponse } from '@/features/weather/weather.types';

export const fetchCities = async (query: string): Promise<City[]> => {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch cities');
  }

  const data = (await response.json()) as GeocodingResponse;
  return data.results ?? [];
};

import type {
  City,
  GeocodingResponse,
  WeatherDataResponse,
} from '@/features/weather/weather.types';

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

export const fetchCurrentWeather = async (
  latitude: number,
  longitude: number,
): Promise<WeatherDataResponse> => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&past_days=0&forecast_days=7`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch current weather');
  }

  const data = (await response.json()) as WeatherDataResponse;
  return data;
};

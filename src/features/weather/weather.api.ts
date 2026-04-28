import type {
  City,
  GeocodingResponse,
  HourlyForecastResponse,
  SevenDayForecastResponse,
  WeatherDataResponse,
  WeatherUnit,
} from '@/features/weather/weather.types';
import type { NominatimReverseResponse } from '@/types/common.types';

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
  selectedUnit: WeatherUnit,
): Promise<WeatherDataResponse> => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&past_days=0&forecast_days=7&temperature_unit=${selectedUnit}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch current weather');
  }

  const data = (await response.json()) as WeatherDataResponse;
  return data;
};

export const fetchSevenDayForecast = async (
  latitude: number,
  longitude: number,
  selectedUnit: WeatherUnit,
): Promise<SevenDayForecastResponse> => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=7&temperature_unit=${selectedUnit}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch seven day forecast');
  }

  const data = (await response.json()) as SevenDayForecastResponse;
  return data;
};

export const fetchCityByCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<City> => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
  );

  if (!response.ok) throw new Error('Failed to reverse geocode coordinates');

  const data = (await response.json()) as NominatimReverseResponse;
  return {
    id: Date.now(),
    name: data.address.city ?? data.address.town ?? data.address.village ?? 'My Location',
    latitude,
    longitude,
    timezone: '',
    country: data.address.country_code?.toUpperCase() ?? '',
    admin1: data.address.state,
  };
};

export const fetchHourlyForecast = async (
  latitude: number,
  longitude: number,
  selectedUnit: WeatherUnit,
): Promise<HourlyForecastResponse> => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code&timezone=auto&past_days=0&forecast_days=1&temperature_unit=${selectedUnit}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch hourly forecast');
  }

  const data = (await response.json()) as HourlyForecastResponse;
  return data;
};

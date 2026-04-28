import type { LucideIcon } from 'lucide-react';

export type City = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
};

export type GeocodingResponse = {
  results: City[];
};

export type GeoCodingStore = {
  selectedCity: City | null;
  setSelectedCity: (city: City) => void;
};

export type WeatherDataResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  current_units: {
    temperature_2m: string;
    weather_code: string;
    relative_humidity_2m: string;
    wind_speed_10m: string;
  };
  current: {
    temperature_2m: number;
    weather_code: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
  };
};

export type WeatherInfo = {
  label: string;
  icon: LucideIcon;
};

export type SevenDayForecastResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  daily_units: {
    temperature_2m_max: string;
    temperature_2m_min: string;
    weather_code: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
};

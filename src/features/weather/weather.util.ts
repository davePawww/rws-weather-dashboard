import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudMoonRain,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  Snowflake,
  Sun,
} from 'lucide-react';

import type { WeatherInfo } from '@/features/weather/weather.types';

export const getWeatherInfo = (code: number): WeatherInfo => {
  if (code === 0) return { label: 'Clear sky', icon: Sun };
  if (code === 1) return { label: 'Mainly clear', icon: CloudSun };
  if (code === 2) return { label: 'Partly cloudy', icon: CloudSun };
  if (code === 3) return { label: 'Overcast', icon: Cloudy };
  if (code === 45) return { label: 'Fog', icon: CloudFog };
  if (code === 48) return { label: 'Rime fog', icon: CloudFog };
  if (code === 51) return { label: 'Light drizzle', icon: CloudDrizzle };
  if (code === 53) return { label: 'Moderate drizzle', icon: CloudDrizzle };
  if (code === 55) return { label: 'Dense drizzle', icon: CloudDrizzle };
  if (code === 56) return { label: 'Light freezing drizzle', icon: CloudDrizzle };
  if (code === 57) return { label: 'Dense freezing drizzle', icon: CloudDrizzle };
  if (code === 61) return { label: 'Slight rain', icon: CloudRain };
  if (code === 63) return { label: 'Moderate rain', icon: CloudRain };
  if (code === 65) return { label: 'Heavy rain', icon: CloudRain };
  if (code === 66) return { label: 'Light freezing rain', icon: CloudMoonRain };
  if (code === 67) return { label: 'Heavy freezing rain', icon: CloudMoonRain };
  if (code === 71) return { label: 'Slight snowfall', icon: CloudSnow };
  if (code === 73) return { label: 'Moderate snowfall', icon: CloudSnow };
  if (code === 75) return { label: 'Heavy snowfall', icon: CloudSnow };
  if (code === 77) return { label: 'Snow grains', icon: Snowflake };
  if (code === 80) return { label: 'Slight rain showers', icon: CloudRain };
  if (code === 81) return { label: 'Moderate rain showers', icon: CloudRain };
  if (code === 82) return { label: 'Violent rain showers', icon: CloudRain };
  if (code === 85) return { label: 'Slight snow showers', icon: CloudSnow };
  if (code === 86) return { label: 'Heavy snow showers', icon: CloudSnow };
  if (code === 95) return { label: 'Thunderstorm', icon: CloudLightning };
  if (code === 96) return { label: 'Thunderstorm with slight hail', icon: CloudHail };
  if (code === 99) return { label: 'Thunderstorm with heavy hail', icon: CloudHail };

  return { label: 'Unknown', icon: Cloud };
};

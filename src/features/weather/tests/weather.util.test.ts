import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  Sun,
} from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { getWeatherInfo } from '@/features/weather/weather.util';

describe('WeatherUtil', () => {
  it('returns clear sky for code 0', () => {
    const result = getWeatherInfo(0);
    expect(result.label).toBe('Clear sky');
    expect(result.icon).toBe(Sun);
  });

  it('returns partly cloudy for code 2', () => {
    const result = getWeatherInfo(2);
    expect(result.label).toBe('Partly cloudy');
    expect(result.icon).toBe(CloudSun);
  });

  it('returns overcast for code 3', () => {
    const result = getWeatherInfo(3);
    expect(result.label).toBe('Overcast');
    expect(result.icon).toBe(Cloudy);
  });

  it('returns light drizzle for code 51', () => {
    const result = getWeatherInfo(51);
    expect(result.label).toBe('Light drizzle');
    expect(result.icon).toBe(CloudDrizzle);
  });

  it('returns heavy rain for code 65', () => {
    const result = getWeatherInfo(65);
    expect(result.label).toBe('Heavy rain');
    expect(result.icon).toBe(CloudRain);
  });

  it('returns heavy snowfall for code 75', () => {
    const result = getWeatherInfo(75);
    expect(result.label).toBe('Heavy snowfall');
    expect(result.icon).toBe(CloudSnow);
  });

  it('returns thunderstorm for code 95', () => {
    const result = getWeatherInfo(95);
    expect(result.label).toBe('Thunderstorm');
    expect(result.icon).toBe(CloudLightning);
  });

  it('returns unknown for unrecognized code', () => {
    const result = getWeatherInfo(999);
    expect(result.label).toBe('Unknown');
    expect(result.icon).toBe(Cloud);
  });
});

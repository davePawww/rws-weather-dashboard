import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CurrentWeather } from '@/features/weather/components/current-weather';
import { useGeocodingStore } from '@/features/weather/geocoding.store';
import type { City, WeatherDataResponse } from '@/features/weather/weather.types';

const mockCity: City = {
  id: 2643743,
  name: 'London',
  latitude: 51.5085,
  longitude: -0.1257,
  timezone: 'Europe/London',
  country: 'United Kingdom',
  admin1: 'England',
};

const mockWeatherData: WeatherDataResponse = {
  latitude: 51.5085,
  longitude: -0.1257,
  timezone: 'Europe/London',
  current_units: {
    temperature_2m: '°C',
    weather_code: 'wmo code',
    relative_humidity_2m: '%',
    wind_speed_10m: 'km/h',
  },
  current: {
    temperature_2m: 18,
    weather_code: 1,
    relative_humidity_2m: 65,
    wind_speed_10m: 14,
  },
};

const meta = {
  title: 'Weather/Current Weather',
  component: CurrentWeather,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: [
    (Story) => {
      useGeocodingStore.setState({ selectedCity: mockCity });

      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
      queryClient.setQueryData(
        ['currentWeather', mockCity.id, mockCity.latitude, mockCity.longitude],
        mockWeatherData,
      );

      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
} satisfies Meta<typeof CurrentWeather>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { HourlyForecast } from '@/features/weather/components/hourly-forecast';
import { useGeocodingStore } from '@/features/weather/geocoding.store';
import type { City, HourlyForecastResponse } from '@/features/weather/weather.types';

const mockCity: City = {
  id: 2643743,
  name: 'London',
  latitude: 51.5085,
  longitude: -0.1257,
  timezone: 'Europe/London',
  country: 'United Kingdom',
  admin1: 'England',
};

const mockHourlyForecast: HourlyForecastResponse = {
  latitude: 51.5085,
  longitude: -0.1257,
  timezone: 'Europe/London',
  timezone_abbreviation: 'BST',
  hourly_units: {
    temperature_2m: '°C',
  },
  hourly: {
    time: [
      '2026-04-28T00:00',
      '2026-04-28T01:00',
      '2026-04-28T02:00',
      '2026-04-28T03:00',
      '2026-04-28T04:00',
      '2026-04-28T05:00',
      '2026-04-28T06:00',
      '2026-04-28T07:00',
      '2026-04-28T08:00',
      '2026-04-28T09:00',
      '2026-04-28T10:00',
      '2026-04-28T11:00',
      '2026-04-28T12:00',
      '2026-04-28T13:00',
      '2026-04-28T14:00',
      '2026-04-28T15:00',
      '2026-04-28T16:00',
      '2026-04-28T17:00',
      '2026-04-28T18:00',
      '2026-04-28T19:00',
      '2026-04-28T20:00',
      '2026-04-28T21:00',
      '2026-04-28T22:00',
      '2026-04-28T23:00',
    ],
    temperature_2m: [
      47.8, 46.6, 45.1, 44.1, 43, 41.9, 40.9, 40.3, 42.4, 44.8, 47.7, 51, 53.8, 55.8, 57.1, 58,
      58.3, 58.3, 58.3, 56.9, 55.7, 54, 50.3, 47.7,
    ],
    weather_code: [3, 3, 3, 2, 2, 1, 3, 3, 0, 0, 0, 0, 0, 0, 2, 3, 3, 0, 1, 0, 0, 0, 0, 0],
  },
};

const meta = {
  title: 'Weather/Hourly Forecast',
  component: HourlyForecast,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: [
    (Story) => {
      useGeocodingStore.setState({ selectedCity: mockCity });

      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
      queryClient.setQueryData(
        ['hourlyForecast', mockCity.id, mockCity.latitude, mockCity.longitude],
        mockHourlyForecast,
      );

      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
} satisfies Meta<typeof HourlyForecast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

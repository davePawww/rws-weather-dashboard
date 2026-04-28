import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SevenDayForecast } from '@/features/weather/components/seven-day-forecast';
import { useGeoCodingStore } from '@/features/weather/geocoding.store';
import type { City, SevenDayForecastResponse } from '@/features/weather/weather.types';

const mockCity: City = {
  id: 2643743,
  name: 'London',
  latitude: 51.5085,
  longitude: -0.1257,
  timezone: 'Europe/London',
  country: 'United Kingdom',
  admin1: 'England',
};

const mockSevenDayForecastData: SevenDayForecastResponse = {
  latitude: 51.5085,
  longitude: -0.1257,
  timezone: 'Europe/London',
  timezone_abbreviation: 'BST',
  daily_units: {
    temperature_2m_max: '°C',
    temperature_2m_min: '°C',
    weather_code: '',
  },
  daily: {
    time: [
      '2099-09-01',
      '2099-09-02',
      '2099-09-03',
      '2099-09-04',
      '2099-09-05',
      '2099-09-06',
      '2099-09-07',
    ],
    temperature_2m_max: [12, 22, 20, 18, 21, 19, 17],
    temperature_2m_min: [15, 12, 10, 8, 11, 9, 7],
    weather_code: [1, 2, 3, 4, 5, 6, 7],
  },
};

const meta = {
  title: 'Weather/7-Day Forecast',
  component: SevenDayForecast,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: [
    (Story) => {
      useGeoCodingStore.setState({ selectedCity: mockCity });

      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
      queryClient.setQueryData(
        ['sevenDayForecast', mockCity.id, mockCity.latitude, mockCity.longitude],
        mockSevenDayForecastData,
      );

      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
} satisfies Meta<typeof SevenDayForecast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

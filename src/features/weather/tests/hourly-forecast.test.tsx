import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { HourlyForecast } from '@/features/weather/components/hourly-forecast';
import { useGeocodingStore } from '@/features/weather/geocoding.store';
import { fetchHourlyForecast } from '@/features/weather/weather.api';
import type { City, HourlyForecastResponse, WeatherUnit } from '@/features/weather/weather.types';

// Mock the weather API fetchHourlyForecast function
vi.mock('@/features/weather/weather.api');

// Mock the Zustand store hook for geocoding
vi.mock('@/features/weather/geocoding.store');

// Test fixtures (Sample data)
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

// Provider wrapper to include QueryClientProvider for components using useQuery
function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      // Disables retries so our tests fail fast and become more deterministic
      queries: { retry: false },
    },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

// Store mock helper
function mockStore(selectedCity: City | null, selectedUnit: WeatherUnit = 'celsius') {
  vi.mocked(useGeocodingStore).mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
    (selector: any) => selector({ selectedCity, setSelectedCity: vi.fn(), selectedUnit }),
  );
}

// Test cases
describe('HourlyForecast', () => {
  afterEach(() => {
    // used to clear any mounted components from the DOM
    cleanup();
    // resets all mocks after each tests
    vi.clearAllMocks();
  });

  it('renders nothing when no city is selected', () => {
    mockStore(null);
    const { container } = renderWithProviders(<HourlyForecast />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when city is selected but data is still loading', () => {
    mockStore(mockCity);
    vi.mocked(fetchHourlyForecast).mockReturnValue(new Promise(() => {}));
    const { container } = renderWithProviders(<HourlyForecast />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders hourly forecast cards when city is selected and data is loaded', async () => {
    mockStore(mockCity);
    vi.mocked(fetchHourlyForecast).mockResolvedValue(mockHourlyForecast);
    renderWithProviders(<HourlyForecast />);

    await waitFor(() => {
      expect(screen.getAllByRole('listitem').length).toBe(mockHourlyForecast.hourly.time.length);
    });
  });

  it('calls fetchHourlyForecast with correct coordinates and unit', async () => {
    mockStore(mockCity, 'fahrenheit');
    vi.mocked(fetchHourlyForecast).mockResolvedValue(mockHourlyForecast);
    renderWithProviders(<HourlyForecast />);

    await waitFor(() => {
      expect(fetchHourlyForecast).toHaveBeenCalledWith(
        mockCity.latitude,
        mockCity.longitude,
        'fahrenheit',
      );
    });
  });
});

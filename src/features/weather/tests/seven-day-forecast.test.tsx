import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SevenDayForecast } from '@/features/weather/components/seven-day-forecast';
import { useGeocodingStore } from '@/features/weather/geocoding.store';
import { fetchSevenDayForecast } from '@/features/weather/weather.api';
import type { City, SevenDayForecastResponse, WeatherUnit } from '@/features/weather/weather.types';

// Replaces fetchSevenDayForecast with a spy function that we can control per tests
vi.mock('@/features/weather/weather.api');

// Replaces Zustand store hook so we can set the selected city without actually touching
// the global state in our tests
vi.mock('@/features/weather/geocoding.store');

const mockCity: City = {
  id: 1,
  name: 'New York City',
  latitude: 40.71,
  longitude: -74.01,
  timezone: 'America/New_York',
  country: 'United States',
  admin1: 'New York',
};

const mockForecastData: SevenDayForecastResponse = {
  latitude: 40.71,
  longitude: -74.01,
  timezone: 'America/New_York',
  timezone_abbreviation: 'EDT',
  daily_units: {
    temperature_2m_max: '°C',
    temperature_2m_min: '°C',
    weather_code: 'wmo code',
  },
  daily: {
    time: ['2026-04-28', '2026-04-29'], // 2 days is enough to prove the map works
    temperature_2m_max: [22, 19],
    temperature_2m_min: [14, 11],
    weather_code: [0, 3], // 0 = Clear sky, 3 = Overcast
  },
};

function renderWithProviders(ui: React.ReactElement) {
  // mock the query client
  const queryClient = new QueryClient({
    defaultOptions: {
      // we need to set this to false to avoid retries during tests.
      // By default, it retries 3 times before throwing an error which makes tests slower.
      // By setting this to false, it makes failed queries fail immediately which makes our tests
      // faster and more deterministic.
      queries: { retry: false },
    },
  });

  // Wrap the component with QueryClientProvider, same on how we set it up in our app.
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

function mockStore(selectedCity: City | null, selectedUnit: WeatherUnit = 'celsius') {
  // This intercepts calls to useGeocodingStore and runs the selector against our fake state
  // object, returning whatever selectedCity we want for our tests.
  vi.mocked(useGeocodingStore).mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
    (selector: any) => selector({ selectedCity, setSelectedCity: vi.fn(), selectedUnit }),
  );
}

describe('SevenDayForecast', () => {
  afterEach(() => {
    // removes the rendered DOM after each test so nodes from one test will not leak into another
    cleanup();
    // resets call counts and return values on all mocked function so each test starts clean
    vi.clearAllMocks();
  });

  it('renders nothing when no city is selected', () => {
    // means no city is selected
    mockStore(null);
    const { container } = renderWithProviders(<SevenDayForecast />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when city is selected but data is still loading', () => {
    mockStore(mockCity);
    // never resolves so we stay in the loading state
    vi.mocked(fetchSevenDayForecast).mockReturnValue(new Promise(() => {}));
    const { container } = renderWithProviders(<SevenDayForecast />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the forecast data when city is selected and data is loaded', async () => {
    mockStore(mockCity);
    vi.mocked(fetchSevenDayForecast).mockResolvedValue(mockForecastData);
    renderWithProviders(<SevenDayForecast />);

    await waitFor(() => {
      expect(screen.getByText('7-Day Forecast')).toBeInTheDocument();
      expect(screen.getByText('Tuesday')).toBeInTheDocument();
      expect(screen.getByText('2026-04-28')).toBeInTheDocument();
      expect(screen.getByText('Max Temp: 22°C')).toBeInTheDocument();
      expect(screen.getByText('Min Temp: 14°C')).toBeInTheDocument();
      expect(screen.getByText('Wednesday')).toBeInTheDocument();
      expect(screen.getByText('2026-04-29')).toBeInTheDocument();
      expect(screen.getByText('Max Temp: 19°C')).toBeInTheDocument();
      expect(screen.getByText('Min Temp: 11°C')).toBeInTheDocument();
    });
  });

  it('calls fetchSevenDayForecast with the selected city coordinates', async () => {
    mockStore(mockCity);
    vi.mocked(fetchSevenDayForecast).mockResolvedValue(mockForecastData);
    renderWithProviders(<SevenDayForecast />);

    await waitFor(() => {
      expect(fetchSevenDayForecast).toHaveBeenCalledWith(
        mockCity.latitude,
        mockCity.longitude,
        'celsius',
      );
    });
  });
});

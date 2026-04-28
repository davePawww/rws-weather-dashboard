import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CurrentWeather } from '@/features/weather/components/current-weather';
import { useGeoCodingStore } from '@/features/weather/geocoding.store';
import { fetchCurrentWeather } from '@/features/weather/weather.api';
import type { City, WeatherDataResponse, WeatherUnit } from '@/features/weather/weather.types';

// Replaces fetchCurrentWeather with a spy function that we can control per tests
vi.mock('@/features/weather/weather.api');

// Replaces Zustand store hook so we can set the selected city
// without actually touching the global state in tests
vi.mock('@/features/weather/geocoding.store');

// ------------------------------------------------------------------
// TEST FIXTURES
// We define realistic data shapes once and then reuse them.
// Using constant keeps tests readable and avoids copy paste mistakes
// ------------------------------------------------------------------

const mockCity: City = {
  id: 1,
  name: 'New York City',
  latitude: 40.71,
  longitude: -74.01,
  timezone: 'America/New_York',
  country: 'United States',
  admin1: 'New York',
};

const mockWeatherData: WeatherDataResponse = {
  latitude: 40.71,
  longitude: -74.01,
  timezone: 'America/New_York',
  current_units: {
    temperature_2m: '°C',
    weather_code: 'wmo code',
    relative_humidity_2m: '%',
    wind_speed_10m: 'km/h',
  },
  current: {
    temperature_2m: 22,
    weather_code: 0, // Code 0 = "Clear sky" per getWeatherInfo
    relative_humidity_2m: 55,
    wind_speed_10m: 10,
  },
};

// ------------------------------------------------------------------
// PROVIDER WRAPPER
// CurrentWeather uses useQuery internally, which requires a
// QueryClientProvider ancestor in the React tree. Without this,
// the hook will throw an error during tests.
//
// retry: false makes failed queries fail immediately instead of
// retrying 3 times by default = keeps tests faster and more deterministic
// ------------------------------------------------------------------

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

// ------------------------------------------------------------------
// STORE MOCK HELPER
// The component calls: useGeoCodingStore((state) => state.selectedCity)
// Zustand passes a "selector" function into the hook. We intercept
// that call and run the selector against our fake state object,
// returning whatever selectedCity we want for a given test.
// ------------------------------------------------------------------

function mockStore(selectedCity: City | null, selectedUnit: WeatherUnit = 'celsius') {
  vi.mocked(useGeoCodingStore).mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
    (selector: any) => selector({ selectedCity, setSelectedCity: vi.fn(), selectedUnit }),
  );
}

// ------------------------------------------------------------------
// TESTS
// ------------------------------------------------------------------

describe('CurrentWeather', () => {
  afterEach(() => {
    // removes the rendered DOM after each test so nodes from one test don't leak into the next
    cleanup();
    // clearAllMocks() resets call counts and return values on all mocked functions so each test
    // starts with a clean slate.
    vi.clearAllMocks();
  });

  it('renders nothing when no city is selected', () => {
    mockStore(null);
    const { container } = renderWithProviders(<CurrentWeather />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows a loading message while fetching weather data', () => {
    mockStore(mockCity);
    vi.mocked(fetchCurrentWeather).mockReturnValue(new Promise(() => {}));
    renderWithProviders(<CurrentWeather />);
    expect(screen.getByText('Loading current weather...')).toBeInTheDocument();
  });

  it('displays the city name with admin1 and country in the title', async () => {
    mockStore(mockCity);
    // mockResolvedValue wraps the value ina resolved Promise, simulating a successful async fetch
    vi.mocked(fetchCurrentWeather).mockResolvedValue(mockWeatherData);
    renderWithProviders(<CurrentWeather />);

    // waitFor() keeps retrying the assertion until it passes or times out.
    // This is necessary because useQuery is async - the DOM updates after the promise resolves.
    // Not sychronously on render.
    await waitFor(() => {
      expect(screen.getByText('New York City, New York, United States')).toBeInTheDocument();
    });
  });

  it('displays only the city name when admin1 and country are missing', async () => {
    const cityMinimal: City = {
      id: 2,
      name: 'Somewhere',
      latitude: 10,
      longitude: 20,
      timezone: 'UTC',
      country: '', // falsy — omitted from the title
      admin1: undefined, // optional field not set
    };

    mockStore(cityMinimal);
    vi.mocked(fetchCurrentWeather).mockResolvedValue(mockWeatherData);

    renderWithProviders(<CurrentWeather />);

    await waitFor(() => {
      expect(screen.getByText('Somewhere')).toBeInTheDocument();
    });
  });

  it('shows latitude and longiture in the card description', async () => {
    mockStore(mockCity);
    vi.mocked(fetchCurrentWeather).mockResolvedValue(mockWeatherData);

    renderWithProviders(<CurrentWeather />);

    await waitFor(() => {
      expect(screen.getByText('Lat: 40.71, Lon: -74.01')).toBeInTheDocument();
    });
  });

  it('renders temperature, humidity, and wind speed from the API response', async () => {
    mockStore(mockCity);
    vi.mocked(fetchCurrentWeather).mockResolvedValue(mockWeatherData);

    renderWithProviders(<CurrentWeather />);

    await waitFor(() => {
      expect(screen.getByText('Temperature: 22°C')).toBeInTheDocument();
      expect(screen.getByText('Humidity: 55%')).toBeInTheDocument();
      expect(screen.getByText('Wind Speed: 10km/h')).toBeInTheDocument();
    });
  });

  it('renders the correct weather condition label for the weather code', async () => {
    mockStore(mockCity);
    vi.mocked(fetchCurrentWeather).mockResolvedValue(mockWeatherData);

    renderWithProviders(<CurrentWeather />);

    await waitFor(() => {
      expect(screen.getByText('Clear sky')).toBeInTheDocument();
    });
  });

  it('calls fetchCurrentWeather with the selected city coordinates', async () => {
    mockStore(mockCity);
    vi.mocked(fetchCurrentWeather).mockResolvedValue(mockWeatherData);

    renderWithProviders(<CurrentWeather />);

    await waitFor(() => {
      expect(fetchCurrentWeather).toHaveBeenCalledWith(
        mockCity.latitude,
        mockCity.longitude,
        'celsius',
      );
    });
  });
});

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CitySearch } from '@/features/weather/components/city-search';
import { useGeocodingStore } from '@/features/weather/geocoding.store';
import { fetchCities } from '@/features/weather/weather.api';

vi.mock('@/features/weather/weather.api');

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('CitySearch', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // resets zustand store and localStorage before each test to avoid state leaking between tests.
    useGeocodingStore.setState({ recentSearches: [], selectedCity: null, selectedUnit: 'celsius' });
    localStorage.clear();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
    cleanup();
  });

  it('renders the label and search input', () => {
    const { container } = renderWithProviders(<CitySearch />);
    expect(within(container).getByText('Search for a City:')).toBeInTheDocument();
    expect(within(container).getByRole('combobox')).toBeInTheDocument();
  });

  it('calls fetchCities after the user types and the debouunce delay passes', async () => {
    vi.mocked(fetchCities).mockResolvedValue([]);
    const { container } = renderWithProviders(<CitySearch />);

    const input = within(container).getByRole('combobox');
    fireEvent.change(input, { target: { value: 'New York' } });
    expect(fetchCities).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(fetchCities).toHaveBeenCalledWith('New York');
    });
  });

  it('displays city results returned from the API', async () => {
    vi.mocked(fetchCities).mockResolvedValue([
      {
        id: 1,
        name: 'Berlin',
        country: 'Germany',
        admin1: 'State of Berlin',
        latitude: 52.52,
        longitude: 13.41,
        timezone: 'Europe/Berlin',
      },
    ]);

    const { container } = renderWithProviders(<CitySearch />);

    fireEvent.input(within(container).getByRole('combobox'), {
      target: { value: 'Berlin' },
      inputType: 'insertText',
    });
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByText('Berlin, State of Berlin, Germany')).toBeInTheDocument();
    });
  });

  it('shows "No cities found." when the API returns an empty list', async () => {
    vi.mocked(fetchCities).mockResolvedValue([]);

    const { container } = renderWithProviders(<CitySearch />);

    fireEvent.input(within(container).getByRole('combobox'), {
      target: { value: 'xyzzy' },
      inputType: 'insertText',
    });
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByText('No cities found.')).toBeInTheDocument();
    });
  });

  it('toggles temperature unit when buttons are clicked', () => {
    renderWithProviders(<CitySearch />);

    const celsiusButton = screen.getByRole('button', { name: 'Celsius' });
    const fahrenheitButton = screen.getByRole('button', { name: 'Fahrenheit' });

    // Default should be Celsius
    expect(celsiusButton).toHaveAttribute('data-variant', 'default');
    expect(fahrenheitButton).toHaveAttribute('data-variant', 'secondary');

    fireEvent.click(fahrenheitButton);
    expect(celsiusButton).toHaveAttribute('data-variant', 'secondary');
    expect(fahrenheitButton).toHaveAttribute('data-variant', 'default');

    fireEvent.click(celsiusButton);
    expect(celsiusButton).toHaveAttribute('data-variant', 'default');
    expect(fahrenheitButton).toHaveAttribute('data-variant', 'secondary');
  });

  it('shows "No recent searches." when input is empty and there are no recent searches', async () => {
    const { container } = renderWithProviders(<CitySearch />);

    fireEvent.click(within(container).getByRole('button', { name: 'Toggle Suggestions' }));

    await waitFor(() => {
      expect(screen.getByText('No recent searches.')).toBeInTheDocument();
    });
  });

  it('shows recent searches when input is empty', async () => {
    useGeocodingStore.setState({
      recentSearches: [
        {
          id: 1,
          name: 'Berlin',
          country: 'Germany',
          admin1: 'State of Berlin',
          latitude: 52.52,
          longitude: 13.41,
          timezone: 'Europe/Berlin',
        },
        {
          id: 2,
          name: 'Paris',
          country: 'France',
          admin1: 'Île-de-France',
          latitude: 48.85,
          longitude: 2.35,
          timezone: 'Europe/Paris',
        },
      ],
    });

    const { container } = renderWithProviders(<CitySearch />);
    fireEvent.click(within(container).getByRole('button', { name: 'Toggle Suggestions' }));

    await waitFor(() => {
      expect(screen.getByText('Berlin, State of Berlin, Germany')).toBeInTheDocument();
      expect(screen.getByText('Paris, Île-de-France, France')).toBeInTheDocument();
    });
  });

  it('adds a selected city to recent searches', async () => {
    vi.mocked(fetchCities).mockResolvedValue([
      {
        id: 1,
        name: 'Berlin',
        country: 'Germany',
        admin1: 'State of Berlin',
        latitude: 52.52,
        longitude: 13.41,
        timezone: 'Europe/Berlin',
      },
    ]);

    const { container } = renderWithProviders(<CitySearch />);

    fireEvent.input(within(container).getByRole('combobox'), {
      target: { value: 'Berlin' },
      inputType: 'insertText',
    });
    vi.advanceTimersByTime(500);

    await waitFor(() => screen.getByText('Berlin, State of Berlin, Germany'));
    fireEvent.click(screen.getByText('Berlin, State of Berlin, Germany'));

    expect(useGeocodingStore.getState().recentSearches[0].name).toBe('Berlin');
  });

  it('shows API results when typing, not recent searches', async () => {
    useGeocodingStore.setState({
      recentSearches: [
        {
          id: 99,
          name: 'Tokyo',
          country: 'Japan',
          admin1: '',
          latitude: 35.68,
          longitude: 139.69,
          timezone: 'Asia/Tokyo',
        },
      ],
    });

    vi.mocked(fetchCities).mockResolvedValue([
      {
        id: 1,
        name: 'Berlin',
        country: 'Germany',
        admin1: 'State of Berlin',
        latitude: 52.52,
        longitude: 13.41,
        timezone: 'Europe/Berlin',
      },
    ]);

    const { container } = renderWithProviders(<CitySearch />);

    fireEvent.input(within(container).getByRole('combobox'), {
      target: { value: 'Berlin' },
      inputType: 'insertText',
    });
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByText('Berlin, State of Berlin, Germany')).toBeInTheDocument();
      expect(screen.queryByText('Tokyo, Japan')).not.toBeInTheDocument();
    });
  });
});

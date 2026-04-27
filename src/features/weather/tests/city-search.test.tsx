import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CitySearch } from '@/features/weather/components/city-search';
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
        elevation: 74,
        feature_code: 'PPLC',
        country_code: 'DE',
        admin1_id: 1,
        admin3_id: 2,
        admin4_id: 3,
        timezone: 'Europe/Berlin',
        population: 3426354,
        postcodes: [],
        country_id: 4,
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
});

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { CitySearch, CurrentWeather, SevenDayForecast } from '@/features/weather';
import { useGeocodingStore } from '@/features/weather/geocoding.store';
import { fetchCityByCoordinates } from '@/features/weather/weather.api';
import { useGeolocation } from '@/hooks/use-geolocation';

export default function WeatherDashboardPage() {
  const selectedCity = useGeocodingStore((state) => state.selectedCity);
  const setSelectedCity = useGeocodingStore((state) => state.setSelectedCity);
  const { latitude, longitude } = useGeolocation();

  const { data: geoCity } = useQuery({
    queryKey: ['reverseGeocode', latitude, longitude],
    queryFn: () => fetchCityByCoordinates(latitude!, longitude!),
    enabled: !selectedCity && !!latitude && !!longitude,
  });

  useEffect(() => {
    if (!selectedCity && geoCity) setSelectedCity(geoCity);
  }, [geoCity, selectedCity, setSelectedCity]);

  return (
    <>
      <CitySearch />
      <CurrentWeather />
      <SevenDayForecast />
    </>
  );
}

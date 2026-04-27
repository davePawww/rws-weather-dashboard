import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGeoCodingStore } from '@/features/weather/geocoding.store';
import { fetchCurrentWeather } from '@/features/weather/weather.api';
import { getWeatherInfo } from '@/features/weather/weather.util';

export function CurrentWeather() {
  const selectedCity = useGeoCodingStore((state) => state.selectedCity);

  const { data, isLoading } = useQuery({
    queryKey: ['currentWeather', selectedCity?.id, selectedCity?.latitude, selectedCity?.longitude],
    queryFn: () => fetchCurrentWeather(selectedCity!.latitude, selectedCity!.longitude),
    enabled: !!selectedCity,
  });

  if (!selectedCity) return null;

  return (
    <Card className="mt-4 w-full">
      <CardHeader>
        <CardTitle>
          {selectedCity?.name +
            (selectedCity?.admin1 ? `, ${selectedCity.admin1}` : '') +
            (selectedCity?.country ? `, ${selectedCity.country}` : '')}
        </CardTitle>
        <CardDescription>
          Lat: {selectedCity?.latitude}, Lon: {selectedCity?.longitude}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading current weather...</p>
        ) : (
          <div className="md:grid md:grid-cols-4">
            <p>
              Temperature: {data?.current.temperature_2m}
              {data?.current_units.temperature_2m}
            </p>
            {data?.current.weather_code !== undefined &&
              (() => {
                const { label, icon: Icon } = getWeatherInfo(data.current.weather_code);
                return (
                  <p className="flex items-center gap-1">
                    <Icon className="size-4" />
                    {label}
                  </p>
                );
              })()}
            <p>
              Humidity: {data?.current.relative_humidity_2m}
              {data?.current_units.relative_humidity_2m}
            </p>
            <p>
              Wind Speed: {data?.current.wind_speed_10m}
              {data?.current_units.wind_speed_10m}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

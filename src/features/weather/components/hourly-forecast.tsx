import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';

import { Card, CardContent } from '@/components/ui/card';
import { useGeocodingStore } from '@/features/weather/geocoding.store';
import { fetchHourlyForecast } from '@/features/weather/weather.api';
import { getWeatherInfo } from '@/features/weather/weather.util';

export function HourlyForecast() {
  const selectedCity = useGeocodingStore((state) => state.selectedCity);
  const selectedUnit = useGeocodingStore((state) => state.selectedUnit);

  const { data, isLoading } = useQuery({
    queryKey: [
      'hourlyForecast',
      selectedCity?.id,
      selectedCity?.latitude,
      selectedCity?.longitude,
      selectedUnit,
    ],
    queryFn: () =>
      fetchHourlyForecast(selectedCity!.latitude, selectedCity!.longitude, selectedUnit),
    enabled: !!selectedCity,
  });

  return (
    <AnimatePresence mode="wait">
      {selectedCity && !isLoading && (
        <motion.div
          key={selectedCity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mt-4"
        >
          <h4 className="font-semibold">Hourly Forecast</h4>
          <Card className="mt-2">
            <CardContent className="no-scrollbar overflow-x-auto">
              <div className="flex w-max gap-2 py-px">
                {data?.hourly.time.map((time: string, index: number) => {
                  const { icon: WeatherIcon, label } = getWeatherInfo(
                    data.hourly.weather_code[index],
                  );
                  const hour = new Date(time).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    hour12: true,
                  });
                  const temp = data.hourly.temperature_2m[index];
                  const unit = data.hourly_units.temperature_2m;

                  return (
                    <Card key={index} className="w-20 shrink-0">
                      <CardContent className="flex flex-col items-center justify-center gap-1 p-3 text-center">
                        <span className="text-muted-foreground text-xs">{hour}</span>
                        <WeatherIcon className="h-6 w-6" aria-label={label} />
                        <span className="text-sm font-semibold">
                          {temp}
                          {unit}
                        </span>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

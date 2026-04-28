import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';

import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { useGeoCodingStore } from '@/features/weather/geocoding.store';
import { fetchSevenDayForecast } from '@/features/weather/weather.api';
import { getWeatherInfo, transformDateStringToDay } from '@/features/weather/weather.util';

export function SevenDayForecast() {
  const selectedCity = useGeoCodingStore((state) => state.selectedCity);

  const { data, isLoading } = useQuery({
    queryKey: [
      'sevenDayForecast',
      selectedCity?.id,
      selectedCity?.latitude,
      selectedCity?.longitude,
    ],
    queryFn: () => fetchSevenDayForecast(selectedCity!.latitude, selectedCity!.longitude),
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
          <h4 className="font-semibold">7-Day Forecast</h4>
          <div className="mt-2 grid grid-cols-2 gap-4">
            {data?.daily.time.map((d: string, index: number) => (
              <ForecastItemCard
                key={index}
                date={d}
                tempMax={data.daily.temperature_2m_max[index]}
                tempMaxUnit={data.daily_units.temperature_2m_max}
                tempMin={data.daily.temperature_2m_min[index]}
                tempMinUnit={data.daily_units.temperature_2m_min}
                weatherCode={data.daily.weather_code[index]}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ForecastItemCard({
  date,
  tempMax,
  tempMaxUnit,
  tempMin,
  tempMinUnit,
  weatherCode,
}: {
  date: string;
  tempMax: number;
  tempMaxUnit: string;
  tempMin: number;
  tempMinUnit: string;
  weatherCode: number;
}) {
  const { icon: Icon } = getWeatherInfo(weatherCode);

  return (
    <Card>
      <CardContent className="md:flex md:items-start md:justify-between">
        <div>
          <div className="flex gap-2">
            <h4 className="text-base font-semibold">{transformDateStringToDay(date)}</h4>
            <Icon />
          </div>
          <CardDescription>{date}</CardDescription>
        </div>
        <div className="mt-2 md:mt-0">
          <p>
            Max Temp: {tempMax}
            {tempMaxUnit}
          </p>
          <p>
            Min Temp: {tempMin}
            {tempMinUnit}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

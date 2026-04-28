import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGeocodingStore } from '@/features/weather/geocoding.store';
import { fetchCurrentWeather } from '@/features/weather/weather.api';
import { getWeatherInfo } from '@/features/weather/weather.util';

const weatherItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function CurrentWeather() {
  const selectedCity = useGeocodingStore((state) => state.selectedCity);
  const selectedUnit = useGeocodingStore((state) => state.selectedUnit);

  const { data, isLoading } = useQuery({
    queryKey: [
      'currentWeather',
      selectedCity?.id,
      selectedCity?.latitude,
      selectedCity?.longitude,
      selectedUnit,
    ],
    queryFn: () =>
      fetchCurrentWeather(selectedCity!.latitude, selectedCity!.longitude, selectedUnit),
    enabled: !!selectedCity,
  });

  return (
    <AnimatePresence mode="wait">
      {selectedCity && (
        <motion.div
          key={selectedCity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mt-4"
        >
          <h4 className="font-semibold">Current Weather</h4>
          <Card className="mt-2 w-full">
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
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Loading current weather...
                </motion.p>
              ) : (
                <motion.div
                  className="md:grid md:grid-cols-4"
                  initial="hidden"
                  animate="visible"
                  transition={{ staggerChildren: 0.1 }}
                >
                  <motion.p variants={weatherItemVariants} transition={{ duration: 0.3 }}>
                    Temperature: {data?.current.temperature_2m}
                    {data?.current_units.temperature_2m}
                  </motion.p>
                  {data?.current.weather_code !== undefined &&
                    (() => {
                      const { label, icon: Icon } = getWeatherInfo(data.current.weather_code);
                      return (
                        <motion.p
                          variants={weatherItemVariants}
                          transition={{ duration: 0.3 }}
                          className="flex items-center gap-1"
                        >
                          <Icon className="size-4" />
                          {label}
                        </motion.p>
                      );
                    })()}
                  <motion.p variants={weatherItemVariants} transition={{ duration: 0.3 }}>
                    Humidity: {data?.current.relative_humidity_2m}
                    {data?.current_units.relative_humidity_2m}
                  </motion.p>
                  <motion.p variants={weatherItemVariants} transition={{ duration: 0.3 }}>
                    Wind Speed: {data?.current.wind_speed_10m}
                    {data?.current_units.wind_speed_10m}
                  </motion.p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

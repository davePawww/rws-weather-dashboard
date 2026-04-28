import { CitySearch, CurrentWeather, SevenDayForecast } from '@/features/weather';

export default function WeatherDashboardPage() {
  return (
    <>
      <CitySearch />
      <CurrentWeather />
      <SevenDayForecast />
    </>
  );
}

import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { useGeocodingStore } from '@/features/weather/geocoding.store';
import { fetchCities } from '@/features/weather/weather.api';
import type { City } from '@/features/weather/weather.types';
import { useDebounce } from '@/hooks/use-debounce';

export function CitySearch() {
  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 500);
  const setSelectedCity = useGeocodingStore((state) => state.setSelectedCity);
  const selectedUnit = useGeocodingStore((state) => state.selectedUnit);
  const setSelectedUnit = useGeocodingStore((state) => state.setSelectedUnit);
  const recentSearches = useGeocodingStore((state) => state.recentSearches);
  const addRecentSearch = useGeocodingStore((state) => state.addRecentSearch);

  const { data } = useQuery({
    queryKey: ['cities', debouncedInputValue],
    queryFn: () => fetchCities(debouncedInputValue),
    enabled: !!debouncedInputValue,
  });

  const cachedCities = inputValue ? data || [] : recentSearches;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center gap-4 md:flex-row"
    >
      <div className="flex w-full items-center gap-2 md:justify-center">
        <Label htmlFor="city-search">Search for a City:</Label>
        <Combobox
          items={cachedCities}
          inputValue={inputValue}
          onInputValueChange={setInputValue}
          filter={() => true}
        >
          <ComboboxInput
            id="city-search"
            aria-label="Search for a city"
            className="flex-1"
            showClear
          />
          <ComboboxContent>
            <ComboboxEmpty>{inputValue ? 'No cities found.' : 'No recent searches.'}</ComboboxEmpty>
            <ComboboxList>
              {(item: City) => (
                <ComboboxItem
                  onClick={() => {
                    setSelectedCity(item);
                    addRecentSearch(item);
                  }}
                  key={item.id}
                  value={
                    item.name +
                    (item.admin1 ? `, ${item.admin1}` : '') +
                    (item.country ? `, ${item.country}` : '')
                  }
                >
                  {item.name +
                    (item.admin1 ? `, ${item.admin1}` : '') +
                    (item.country ? `, ${item.country}` : '')}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      <ButtonGroup>
        <Button
          variant={selectedUnit === 'celsius' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => setSelectedUnit('celsius')}
        >
          Celsius
        </Button>
        <ButtonGroupSeparator />
        <Button
          variant={selectedUnit === 'fahrenheit' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => setSelectedUnit('fahrenheit')}
        >
          Fahrenheit
        </Button>
      </ButtonGroup>
    </motion.div>
  );
}

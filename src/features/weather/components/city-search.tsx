import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { fetchCities } from '@/features/weather/weather.api';
import type { City } from '@/features/weather/weather.types';
import { useDebounce } from '@/hooks/use-debounce';

export function CitySearch() {
  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 500);

  const { data } = useQuery({
    queryKey: ['cities', debouncedInputValue],
    queryFn: () => fetchCities(debouncedInputValue),
    enabled: !!debouncedInputValue,
  });

  return (
    <div className="flex items-center gap-2 md:justify-center">
      <Label htmlFor="city-search">Search for a City:</Label>
      <Combobox
        items={data || []}
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
          <ComboboxEmpty>No cities found.</ComboboxEmpty>
          <ComboboxList>
            {(item: City) => (
              <ComboboxItem key={item.id} value={item.id}>
                {item.name +
                  (item.admin1 ? `, ${item.admin1}` : '') +
                  (item.country ? `, ${item.country}` : '')}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

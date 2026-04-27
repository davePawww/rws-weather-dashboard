import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CitySearch } from '@/features/weather/components/city-search';

const meta = {
  title: 'Weather/City Search',
  component: CitySearch,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: [
    (Story) => {
      const queryClient = new QueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
} satisfies Meta<typeof CitySearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

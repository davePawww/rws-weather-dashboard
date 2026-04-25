import type { Meta, StoryObj } from '@storybook/react-vite';

import Layout from '@/components/layout/components/layout';

const meta = {
  title: 'Main Layout/Layout',
  component: Layout,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Main Content',
  },
};

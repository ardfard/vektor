import type { Meta, StoryObj } from '@storybook/react';
import ResultDisplay from './ResultDisplay';

const meta = {
  title: 'Components/ResultDisplay',
  component: ResultDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ResultDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Processing: Story = {
  args: {
    result: null,
    isProcessing: true,
    onReset: () => {},
  },
};

export const Success: Story = {
  args: {
    result: {
      success: true,
      data: {
        date: "2024-03-15",
        total: 123.45,
        vendor: "Example Corp",
        items: [
          { description: "Item 1", amount: 50.00 },
          { description: "Item 2", amount: 73.45 }
        ]
      }
    },
    isProcessing: false,
    onReset: () => {},
  },
};

export const Error: Story = {
  args: {
    result: {
      success: false,
      error: "Failed to process document. Please try again."
    },
    isProcessing: false,
    onReset: () => {},
  },
};
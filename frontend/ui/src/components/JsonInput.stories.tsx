import type { Meta, StoryObj } from '@storybook/react';
import JsonInput from './JsonInput';

const meta = {
  title: 'Components/JsonInput',
  component: JsonInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof JsonInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    jsonState: {
      spec: '',
      isValid: false
    },
    setJsonState: () => {},
  },
};

export const ValidJson: Story = {
  args: {
    jsonState: {
      spec: JSON.stringify({
        extractFields: ["date", "total", "vendor"],
        outputFormat: "compact",
        language: "en"
      }, null, 2),
      isValid: true
    },
    setJsonState: () => {},
  },
};

export const InvalidJson: Story = {
  args: {
    jsonState: {
      spec: '{ "incomplete": "json"',
      isValid: false,
      error: 'Invalid JSON: Unexpected end of JSON input'
    },
    setJsonState: () => {},
  },
};
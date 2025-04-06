import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from './theme-provider';

const meta = {
  title: 'Components/ThemeProvider',
  component: ThemeProvider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const DemoContent = () => (
  <div className="p-4 border rounded">
    <h1 className="text-2xl font-bold">Theme Provider Demo</h1>
    <p>This component demonstrates the theme provider functionality.</p>
  </div>
);

export const Default: Story = {
  args: {
    defaultTheme: 'system',
    storageKey: 'vite-ui-theme',
    children: <DemoContent />
  }
};

export const LightTheme: Story = {
  args: {
    defaultTheme: 'light',
    storageKey: 'vite-ui-theme',
    children: <DemoContent />
  }
};

export const DarkTheme: Story = {
  args: {
    defaultTheme: 'dark',
    storageKey: 'vite-ui-theme',
    children: <DemoContent />
  }
}; 
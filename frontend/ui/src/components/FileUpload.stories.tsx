import type { Meta, StoryObj } from '@storybook/react';
import FileUpload from './FileUpload';
import { FileUploadState } from '../types';

const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    fileState: {
      file: null,
      preview: null,
      type: null,
      status: 'idle'
    },
    setFileState: () => {},
  },
};

export const WithImage: Story = {
  args: {
    fileState: {
      file: new File([""], "test-image.jpg", { type: "image/jpeg" }),
      preview: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
      type: "image",
      status: 'ready'
    },
    setFileState: () => {},
  },
};

export const WithPDF: Story = {
  args: {
    fileState: {
      file: new File([""], "test-document.pdf", { type: "application/pdf" }),
      preview: "/pdf-icon.png",
      type: "pdf",
      status: 'ready'
    },
    setFileState: () => {},
  },
};

export const Uploading: Story = {
  args: {
    fileState: {
      file: null,
      preview: null,
      type: null,
      status: 'uploading'
    },
    setFileState: () => {},
  },
};

export const Error: Story = {
  args: {
    fileState: {
      file: null,
      preview: null,
      type: null,
      status: 'error',
      error: 'Invalid file type. Please upload a PDF or image file.'
    },
    setFileState: () => {},
  },
};
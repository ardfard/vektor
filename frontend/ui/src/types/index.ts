export interface FileUploadState {
  file: File | null;
  preview: string | null;
  type: 'pdf' | 'image' | null;
  status: 'idle' | 'ready' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface JsonSpecState {
  spec: string;
  isValid: boolean;
  error?: string;
}

export interface ProcessingResult {
  success: boolean;
  data?: Record<string, any>;
  error?: string;
}
/**
 * Utility functions for handling file operations
 */

/**
 * Creates a preview URL for the uploaded file
 */
export function createFilePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      // For PDFs, we just return a generic PDF icon/preview
      // In a production app, you might generate a thumbnail of the first page
      resolve('/pdf-icon.png');
    } else {
      reject(new Error('Unsupported file type'));
    }
  });
}

/**
 * Validates if the provided file is an accepted type
 */
export function validateFileType(file: File): { valid: boolean; type?: 'pdf' | 'image'; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.type.startsWith('image/')) {
    return { valid: true, type: 'image' };
  } else if (file.type === 'application/pdf') {
    return { valid: true, type: 'pdf' };
  }

  return { valid: false, error: 'File must be an image or PDF' };
}

/**
 * Validates JSON string
 */
export function validateJson(jsonString: string): { valid: boolean; error?: string } {
  if (!jsonString.trim()) {
    return { valid: false, error: 'JSON specification is required' };
  }

  try {
    JSON.parse(jsonString);
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? `Invalid JSON: ${error.message}` : 'Invalid JSON'
    };
  }
}

/**
 * Formats file size in a human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
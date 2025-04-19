/**
 * API service for communicating with the document processing server
 */

import { FileUploadState, JsonSpecState, ProcessingResult } from '../types';

// Read the endpoint from environment variables provided by Vite
// VITE_ variables are exposed on the special import.meta.env object.
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

// Optional: Add a check or fallback if the variable isn't set
if (!API_ENDPOINT) {
  console.error("Error: VITE_API_ENDPOINT environment variable is not set!");
  // You might want to throw an error or provide a default/mock endpoint here
}

export async function processDocument(
  fileState: FileUploadState,
  jsonState: JsonSpecState
): Promise<ProcessingResult> {
  try {
    if (!fileState.file || !jsonState.spec || !jsonState.isValid) {
      return {
        success: false,
        error: 'Invalid input: Please provide both a valid file and JSON specification',
      };
    }

    const formData = new FormData();
    formData.append('file', fileState.file);
    formData.append('spec', jsonState.spec);

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
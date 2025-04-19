import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, AlertCircle, Check } from 'lucide-react';
import { FileUploadState } from '../types';
import { createFilePreview, validateFileType, formatFileSize } from '../utils/fileHelpers';

interface FileUploadProps {
  fileState: FileUploadState;
  setFileState: React.Dispatch<React.SetStateAction<FileUploadState>>;
}

const FileUpload: React.FC<FileUploadProps> = ({ fileState, setFileState }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    const validation = validateFileType(file);
    
    if (!validation.valid) {
      setFileState({
        file: null,
        preview: null,
        type: null,
        status: 'error',
        error: validation.error
      });
      return;
    }

    try {
      setFileState({
        file: null,
        preview: null,
        type: null,
        status: 'uploading'
      });

      const previewUrl = await createFilePreview(file);
      
      setFileState({
        file,
        preview: previewUrl,
        type: validation.type || null,
        status: 'ready'
      });
    } catch (error) {
      setFileState({
        file: null,
        preview: null,
        type: null,
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to process file'
      });
    }
  }, [setFileState]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData && e.clipboardData.files.length > 0) {
      e.preventDefault();
      handleFile(e.clipboardData.files[0]);
    }
  }, [handleFile]);

  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleClearFile = useCallback(() => {
    setFileState({
      file: null,
      preview: null,
      type: null,
      status: 'idle'
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [setFileState]);

  const getStatusIcon = () => {
    switch (fileState.status) {
      case 'uploading':
        return <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500 border-r-2" />;
      case 'ready':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const renderFilePreview = () => {
    if (!fileState.file || !fileState.preview) return null;

    return (
      <div className="relative mt-4 border rounded-lg overflow-hidden p-3 bg-gray-50">
        <div className="flex items-start">
          <div className="mr-3">
            {fileState.type === 'image' ? (
              <div className="w-16 h-16 rounded overflow-hidden bg-gray-100">
                <img 
                  src={fileState.preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center">
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="font-medium text-gray-900 truncate">{fileState.file.name}</p>
              <button 
                type="button"
                onClick={handleClearFile}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Remove file"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500">
              {formatFileSize(fileState.file.size)} • {fileState.type === 'image' ? 'Image' : 'PDF'}
            </p>
            <div className="flex items-center mt-1">
              {getStatusIcon()}
              <span className={`ml-2 text-sm ${
                fileState.status === 'error' ? 'text-red-500' :
                fileState.status === 'ready' ? 'text-green-500' : 'text-gray-500'
              }`}>
                {fileState.status === 'error' ? fileState.error :
                 fileState.status === 'ready' ? 'Ready to process' : 
                 fileState.status === 'uploading' ? 'Preparing file...' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Document Upload
      </label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ease-in-out ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${fileState.file ? 'bg-gray-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onPaste={handlePaste}
        tabIndex={0}
        role="button"
        aria-label="Upload document area"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          accept="image/*,application/pdf"
          onChange={handleFileInputChange}
          aria-hidden="true"
          tabIndex={-1}
        />
        
        {!fileState.file && (
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-50 mb-3">
              <Upload className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 mb-3">
              PDF or Image files (PNG, JPG, etc.)
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleButtonClick}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Upload className="h-4 w-4 mr-2" />
                Select file
              </button>
            </div>
          </div>
        )}
        
        {renderFilePreview()}
        
      </div>
      {fileState.status === 'error' && !fileState.file && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {fileState.error || 'There was an error with your file'}
        </p>
      )}
      {!fileState.error && (
        <p className="mt-2 text-xs text-gray-500">
          You can also paste an image from your clipboard directly into this area
        </p>
      )}
    </div>
  );
};

export default FileUpload;
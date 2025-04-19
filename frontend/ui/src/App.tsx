import React, { useState } from 'react';
import Layout from './components/Layout';
import FileUpload from './components/FileUpload';
import JsonInput from './components/JsonInput';
import ResultDisplay from './components/ResultDisplay';
import { FileUploadState, JsonSpecState, ProcessingResult } from './types';
import { processDocument } from './services/api';
import { AlertCircle } from 'lucide-react';

function App() {
  const [fileState, setFileState] = useState<FileUploadState>({
    file: null,
    preview: null,
    type: null,
    status: 'idle'
  });

  const [jsonState, setJsonState] = useState<JsonSpecState>({
    spec: '',
    isValid: false
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canProcess = fileState.file && fileState.status === 'ready' && jsonState.isValid;

  const handleReset = () => {
    setFileState({
      file: null,
      preview: null,
      type: null,
      status: 'idle'
    });
    setJsonState({
      spec: '',
      isValid: false
    });
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canProcess) {
      setError('Please provide both a valid document and JSON specification');
      return;
    }

    setIsProcessing(true);
    
    try {
      const processingResult = await processDocument(fileState, jsonState);
      setResult(processingResult);
      
      if (!processingResult.success) {
        setError(processingResult.error || 'An error occurred during processing');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setResult({
        success: false,
        error: err instanceof Error ? err.message : 'An unexpected error occurred'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Document Processing</h1>
          <p className="text-sm text-gray-500 mb-6">
            Upload a document (PDF or image) and specify processing instructions to extract structured data
          </p>
          
          {error && !result && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}
          
          {result ? (
            <ResultDisplay 
              result={result} 
              isProcessing={isProcessing} 
              onReset={handleReset} 
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
              <FileUpload fileState={fileState} setFileState={setFileState} />
              
              <div className="pt-4 border-t border-gray-200">
                <JsonInput jsonState={jsonState} setJsonState={setJsonState} />
              </div>
              
              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  disabled={!canProcess || isProcessing}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    canProcess && !isProcessing
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Process Document'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default App;
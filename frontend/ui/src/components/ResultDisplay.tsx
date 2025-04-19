import React from 'react';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { ProcessingResult } from '../types';

interface ResultDisplayProps {
  result: ProcessingResult | null;
  isProcessing: boolean;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  result, 
  isProcessing,
  onReset
}) => {
  if (isProcessing) {
    return (
      <div className="w-full mt-6 p-6 border rounded-lg shadow-sm bg-gray-50 flex justify-center">
        <div className="flex flex-col items-center text-center">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Processing your document</h3>
          <p className="text-sm text-gray-500">This may take a few moments...</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  if (!result.success) {
    return (
      <div className="w-full mt-6 p-6 border border-red-100 rounded-lg shadow-sm bg-red-50">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Processing Failed</h3>
            <p className="mt-2 text-sm text-red-700">
              {result.error || 'An unknown error occurred while processing your document'}
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-6 p-6 border border-green-100 rounded-lg shadow-sm bg-green-50">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <CheckCircle className="h-6 w-6 text-green-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-green-800">Processing Complete</h3>
          <p className="mt-1 text-sm text-green-600 mb-4">
            Your document has been successfully processed
          </p>
          
          <div className="mt-4 overflow-hidden rounded-lg border border-green-200 bg-white">
            <div className="p-3 bg-green-100">
              <h4 className="text-sm font-medium text-green-800">Result JSON</h4>
            </div>
            <div className="p-4 overflow-auto" style={{ maxHeight: '300px' }}>
              <pre className="text-xs font-mono text-gray-800 whitespace-pre overflow-x-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Process Another Document
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                if (result.data) {
                  const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'document-results.json';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
              }}
            >
              Download Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
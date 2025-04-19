import React, { useEffect, useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { JsonSpecState } from '../types';
import { validateJson } from '../utils/fileHelpers';

interface JsonInputProps {
  jsonState: JsonSpecState;
  setJsonState: React.Dispatch<React.SetStateAction<JsonSpecState>>;
}

const JsonInput: React.FC<JsonInputProps> = ({ jsonState, setJsonState }) => {
  const [debouncedValue, setDebouncedValue] = useState(jsonState.spec);

  // Example JSON to show in the placeholder
  const placeholderJson = `{
  "extractFields": ["date", "total", "vendor"],
  "outputFormat": "compact",
  "language": "en"
}`;

  // Update the debounced value after 500ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => {
      const validation = validateJson(debouncedValue);
      setJsonState(prevState => ({
        ...prevState,
        isValid: validation.valid,
        error: validation.error
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedValue, setJsonState]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDebouncedValue(value);
    setJsonState(prevState => ({
      ...prevState,
      spec: value
    }));
  };

  const handleFormatClick = () => {
    try {
      if (!jsonState.spec.trim()) return;
      
      const formatted = JSON.stringify(JSON.parse(jsonState.spec), null, 2);
      setDebouncedValue(formatted);
      setJsonState({
        spec: formatted,
        isValid: true
      });
    } catch (error) {
      // If JSON is invalid, don't attempt to format
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="json-spec" className="block text-sm font-medium text-gray-700">
          JSON Specification
        </label>
        {jsonState.spec.trim() && (
          <button
            type="button"
            onClick={handleFormatClick}
            className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            Format JSON
          </button>
        )}
      </div>
      <div className="relative">
        <textarea
          id="json-spec"
          rows={6}
          className={`block w-full px-3 py-2 resize-y border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${
            jsonState.error ? 'border-red-300' : 
            jsonState.isValid && jsonState.spec.trim() ? 'border-green-300' : 'border-gray-300'
          }`}
          placeholder={placeholderJson}
          value={jsonState.spec}
          onChange={handleChange}
          spellCheck="false"
        />
        {jsonState.spec.trim() && (
          <div className="absolute right-3 top-3">
            {jsonState.isValid ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        )}
      </div>
      {jsonState.error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          {jsonState.error}
        </p>
      )}
      {!jsonState.error && (
        <p className="mt-2 text-xs text-gray-500">
          Define how the document should be processed using JSON format
        </p>
      )}
    </div>
  );
};

export default JsonInput;
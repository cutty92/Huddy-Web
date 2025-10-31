import React from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

export function ValidationPanel() {
  const { validationResult } = useEditor();

  if (!validationResult) {
    return (
      <div className="bg-gray-800 border-l border-gray-700 border-t border-gray-700">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Validation</h3>
          <div className="text-center text-gray-400 py-4">
            <p>No validation results</p>
          </div>
        </div>
      </div>
    );
  }

  const { isValid, errors, warnings } = validationResult;

  return (
    <div className="bg-gray-800 border-l border-gray-700 border-t border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          {isValid ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
          <h3 className="text-lg font-semibold text-white">Validation</h3>
        </div>
        <p className="text-sm text-gray-400">
          {isValid ? 'Layout is valid' : `${errors.length} error${errors.length !== 1 ? 's' : ''}, ${warnings.length} warning${warnings.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Validation Results */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {errors.length === 0 && warnings.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <p className="text-sm">No issues found</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {/* Errors */}
            {errors.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <h4 className="text-sm font-medium text-red-400">Errors ({errors.length})</h4>
                </div>
                <div className="space-y-2">
                  {errors.map((error, index) => (
                    <div
                      key={index}
                      className="p-2 bg-red-900 bg-opacity-20 border border-red-800 rounded text-xs"
                    >
                      <div className="font-medium text-red-300">
                        {error.path === 'root' ? 'Layout' : error.path}
                      </div>
                      <div className="text-red-200 mt-1">{error.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <h4 className="text-sm font-medium text-yellow-400">Warnings ({warnings.length})</h4>
                </div>
                <div className="space-y-2">
                  {warnings.map((warning, index) => (
                    <div
                      key={index}
                      className="p-2 bg-yellow-900 bg-opacity-20 border border-yellow-800 rounded text-xs"
                    >
                      <div className="font-medium text-yellow-300">
                        {warning.path === 'root' ? 'Layout' : warning.path}
                      </div>
                      <div className="text-yellow-200 mt-1">{warning.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 bg-gray-750">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Valid</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Warning</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Error</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Info className="w-3 h-3" />
            <span>Real-time</span>
          </div>
        </div>
      </div>
    </div>
  );
}

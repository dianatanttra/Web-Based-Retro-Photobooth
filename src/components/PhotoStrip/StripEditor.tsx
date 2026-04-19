import React from 'react';
import { FilterType } from '../../types';
import { MAX_CUSTOM_TEXT_LENGTH } from '../../utils/constants';

interface StripEditorProps {
  filter: FilterType;
  customText: string;
  onFilterChange: (filter: FilterType) => void;
  onTextChange: (text: string) => void;
  showRetake?: boolean;
  onRetake?: () => void;
}

export const StripEditor: React.FC<StripEditorProps> = ({
  filter,
  customText,
  onFilterChange,
  onTextChange,
  showRetake = false,
  onRetake,
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CUSTOM_TEXT_LENGTH) {
      onTextChange(value);
    }
  };

  const remainingChars = MAX_CUSTOM_TEXT_LENGTH - customText.length;
  const isNearLimit = remainingChars <= 10;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h3 className="text-xl font-bold text-gray-800">Customize Your Strip</h3>

      {/* Filter Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Filter Style
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onFilterChange('color')}
            className={`px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
              filter === 'color'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="block text-2xl mb-1">🎨</span>
            <span className="block text-sm font-semibold">Color</span>
            <span className="block text-xs opacity-75 mt-1">Vintage feel</span>
          </button>
          
          <button
            onClick={() => onFilterChange('bw')}
            className={`px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
              filter === 'bw'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="block text-2xl mb-1">⚫</span>
            <span className="block text-sm font-semibold">B&W</span>
            <span className="block text-xs opacity-75 mt-1">Classic</span>
          </button>
        </div>
      </div>

      {/* Text Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Add a Message
        </label>
        <input
          type="text"
          value={customText}
          onChange={handleTextChange}
          placeholder="e.g., Summer 2026, Best Friends Forever..."
          maxLength={MAX_CUSTOM_TEXT_LENGTH}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-photobooth text-sm"
        />
        <div className="flex justify-between items-center mt-2">
          <p className={`text-xs ${isNearLimit ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>
            {customText.length} / {MAX_CUSTOM_TEXT_LENGTH}
            {isNearLimit && ' (almost full!)'}
          </p>
          {customText && (
            <button
              onClick={() => onTextChange('')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Retake Button */}
      {showRetake && onRetake && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onRetake}
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium flex items-center justify-center space-x-2"
          >
            <span>🔄</span>
            <span>Retake Photos</span>
          </button>
        </div>
      )}
    </div>
  );
};
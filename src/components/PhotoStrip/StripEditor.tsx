import React from 'react';
import { FilterType, CaptionFont } from '../../types';
import { MAX_CUSTOM_TEXT_LENGTH } from '../../utils/constants';

interface StripEditorProps {
  filter: FilterType;
  captionFont: CaptionFont;
  customText: string;
  onFilterChange: (filter: FilterType) => void;
  onFontChange: (font: CaptionFont) => void;
  onTextChange: (text: string) => void;
  showRetake?: boolean;
  onRetake?: () => void;
  onContinue?: () => void;
  isGenerating?: boolean;
}

export const StripEditor: React.FC<StripEditorProps> = ({
  filter,
  captionFont,
  customText,
  onFilterChange,
  onFontChange,
  onTextChange,
  showRetake = false,
  onRetake,
  onContinue,
  isGenerating = false,
}) => {
  const handleTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (value.length <= MAX_CUSTOM_TEXT_LENGTH) {
      onTextChange(value);
    }
  };

  const remainingChars = MAX_CUSTOM_TEXT_LENGTH - customText.length;
  const isNearLimit = remainingChars <= 15;

  const fontButtonClass = (font: CaptionFont) =>
    `px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
      captionFont === font
        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
    }`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h3 className="text-xl font-bold text-gray-800">Customize Your Strip</h3>

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
            <span className="block text-sm font-semibold">Color</span>
          </button>

          <button
            onClick={() => onFilterChange('bw')}
            className={`px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
              filter === 'bw'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="block text-sm font-semibold">B&W</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Caption Font
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onFontChange('handwritten')}
            className={fontButtonClass('handwritten')}
            style={{ fontFamily: '"Brush Script MT", "Comic Sans MS", cursive' }}
          >
            Handwritten
          </button>

          <button
            onClick={() => onFontChange('print')}
            className={fontButtonClass('print')}
            style={{ fontFamily: '"Courier New", Courier, monospace' }}
          >
            Print
          </button>

          <button
            onClick={() => onFontChange('clean')}
            className={fontButtonClass('clean')}
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            Clean
          </button>

          <button
            onClick={() => onFontChange('calligraphy')}
            className={fontButtonClass('calligraphy')}
            style={{ fontFamily: '"Lucida Handwriting", "Times New Roman", cursive' }}
          >
            Calligraphy
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Add a Message
        </label>
        <textarea
          value={customText}
          onChange={handleTextChange}
          placeholder="e.g., summer night, besties forever..."
          maxLength={MAX_CUSTOM_TEXT_LENGTH}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <div className="flex justify-between items-center mt-2">
          <p
            className={`text-xs ${
              isNearLimit ? 'text-orange-600 font-semibold' : 'text-gray-500'
            }`}
          >
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

      {showRetake && onRetake && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onRetake}
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium flex items-center justify-center space-x-2"
          >
            <span>Retake Photos</span>
          </button>
        </div>
      )}

      {onContinue && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onContinue}
            disabled={isGenerating}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Continue to Export
          </button>
        </div>
      )}
    </div>
  );
};
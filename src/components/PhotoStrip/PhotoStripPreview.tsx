import React, { useState, useEffect } from 'react';
import { PhotoData, FilterType } from '../../types';
import { composePhotoStrip } from '../../utils/imageProcessing';
import { MAX_CUSTOM_TEXT_LENGTH } from '../../utils/constants';

interface PhotoStripPreviewProps {
  photos: PhotoData[];
  filter: FilterType;
  customText: string;
  onFilterChange: (filter: FilterType) => void;
  onTextChange: (text: string) => void;
  onRetake: () => void;
  onContinue: () => void;
}

export const PhotoStripPreview: React.FC<PhotoStripPreviewProps> = ({
  photos,
  filter,
  customText,
  onFilterChange,
  onTextChange,
  onRetake,
  onContinue,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const generatePreview = async () => {
      setIsGenerating(true);
      const date = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const url = await composePhotoStrip(photos, customText, date, filter);
      setPreviewUrl(url);
      setIsGenerating(false);
    };

    generatePreview();
  }, [photos, customText, filter]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CUSTOM_TEXT_LENGTH) {
      onTextChange(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Preview Your Photo Strip
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Preview Image */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                  <p className="text-gray-600">Generating preview...</p>
                </div>
              )}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Photo strip preview"
                  className="max-w-full h-auto shadow-2xl rounded-lg"
                  style={{ maxHeight: '80vh' }}
                />
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="w-full lg:w-96 bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Filter Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Filter
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => onFilterChange('color')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                    filter === 'color'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Color
                </button>
                <button
                  onClick={() => onFilterChange('bw')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                    filter === 'bw'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Black & White
                </button>
              </div>
            </div>

            {/* Custom Text Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Custom Message
              </label>
              <input
                type="text"
                value={customText}
                onChange={handleTextChange}
                placeholder="Add a message (optional)"
                maxLength={MAX_CUSTOM_TEXT_LENGTH}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-photobooth"
              />
              <p className="text-xs text-gray-500 mt-1">
                {customText.length} / {MAX_CUSTOM_TEXT_LENGTH} characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={onContinue}
                disabled={isGenerating}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Continue to Export
              </button>
              
              <button
                onClick={onRetake}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Retake Photos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
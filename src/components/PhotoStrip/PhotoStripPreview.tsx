import React, { useState, useEffect } from 'react';
import { PhotoData, FilterType, CaptionFont } from '../../types';
import { composePhotoStrip } from '../../utils/imageProcessing';
import { StripEditor } from './StripEditor';

interface PhotoStripPreviewProps {
  photos: PhotoData[];
  filter: FilterType;
  captionFont: CaptionFont;
  customText: string;
  onFilterChange: (filter: FilterType) => void;
  onFontChange: (font: CaptionFont) => void;
  onTextChange: (text: string) => void;
  onRetake: () => void;
  onContinue: () => void;
}

export const PhotoStripPreview: React.FC<PhotoStripPreviewProps> = ({
  photos,
  filter,
  captionFont,
  customText,
  onFilterChange,
  onFontChange,
  onTextChange,
  onRetake,
  onContinue,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const timer = window.setTimeout(async () => {
      try {
        setIsGenerating(true);

        const url = await composePhotoStrip(
          photos,
          customText,
          '',
          filter,
          captionFont
        );

        if (!isCancelled) {
          setPreviewUrl(url);
        }
      } catch (error) {
        console.error('Failed to generate preview:', error);
      } finally {
        if (!isCancelled) {
          setIsGenerating(false);
        }
      }
    }, 250);

    return () => {
      isCancelled = true;
      window.clearTimeout(timer);
    };
  }, [photos, customText, filter, captionFont]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Preview Your Photo Strip
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 flex justify-center">
            <div className="relative">
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg z-10">
                  <p className="text-gray-600 font-medium">Updating preview...</p>
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

          <div className="w-full lg:w-96">
            <StripEditor
              filter={filter}
              captionFont={captionFont}
              customText={customText}
              onFilterChange={onFilterChange}
              onFontChange={onFontChange}
              onTextChange={onTextChange}
              showRetake={true}
              onRetake={onRetake}
              onContinue={onContinue}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
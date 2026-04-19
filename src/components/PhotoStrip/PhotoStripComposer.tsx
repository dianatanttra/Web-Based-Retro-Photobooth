import React, { useEffect, useState } from 'react';
import { PhotoData, FilterType } from '../../types';
import { composePhotoStrip } from '../../utils/imageProcessing';

interface PhotoStripComposerProps {
  photos: PhotoData[];
  customText: string;
  date: string;
  filter: FilterType;
  onComposed: (composedUrl: string) => void;
  onError?: () => void;
}

export const PhotoStripComposer: React.FC<PhotoStripComposerProps> = ({
  photos,
  customText,
  date,
  filter,
  onComposed,
  onError,
}) => {
  const [isComposing, setIsComposing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const compose = async () => {
      setIsComposing(true);
      setError(null);
      setProgress(0);

      try {
        setProgress(30);
        console.log('Starting photo strip composition...');
        
        const composedUrl = await composePhotoStrip(
          photos,
          customText,
          date,
          filter
        );
        
        setProgress(70);
        console.log('Photo strip composed successfully, size:', composedUrl.length);
        
        // Simulate slight delay for smooth UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setProgress(100);
        onComposed(composedUrl);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to compose photo strip';
        setError(errorMessage);
        console.error('Composition error:', err);
        
        if (onError) {
          onError();
        }
      } finally {
        setIsComposing(false);
      }
    };

    if (photos.length > 0) {
      compose();
    }
  }, [photos, customText, date, filter, onComposed, onError]);

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          <p className="text-red-700 font-semibold text-center mb-2">
            Composition Failed
          </p>
          <p className="text-sm text-red-600 text-center mb-4">{error}</p>
          <p className="text-xs text-gray-600 text-center">
            Please try taking new photos or adjust your settings
          </p>
        </div>
      </div>
    );
  }

  if (isComposing) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          {/* Spinner */}
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-600">{progress}%</span>
            </div>
          </div>
          
          {/* Message */}
          <p className="text-gray-700 font-medium mb-2">
            Composing your photo strip...
          </p>
          <p className="text-sm text-gray-500">
            Applying {filter === 'bw' ? 'black & white' : 'color'} filter
          </p>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
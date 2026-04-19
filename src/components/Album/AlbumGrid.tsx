import React from 'react';
import { PhotoStrip } from '../../types';
import { AlbumItem } from './AlbumItem';

interface AlbumGridProps {
  strips: PhotoStrip[];
  onSelectStrip: (strip: PhotoStrip) => void;
  onBack: () => void;
}

export const AlbumGrid: React.FC<AlbumGridProps> = ({
  strips,
  onSelectStrip,
  onBack,
}) => {
  if (strips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Album</h2>
          <p className="text-gray-600 mb-8">No photo strips yet. Take your first one!</p>
          <button
            onClick={onBack}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Start Photobooth
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Your Album</h2>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Back to Home
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strips.map((strip) => (
            <AlbumItem
              key={strip.id}
              strip={strip}
              onClick={() => onSelectStrip(strip)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
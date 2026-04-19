import React from 'react';
import { PhotoStrip } from '../../types';

interface AlbumItemProps {
  strip: PhotoStrip;
  onClick: () => void;
}

export const AlbumItem: React.FC<AlbumItemProps> = ({ strip, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-xl"
    >
      <div className="aspect-[1/3] relative">
        <img
          src={strip.composedImageUrl}
          alt={`Photo strip from ${strip.date}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <p className="text-sm font-semibold text-gray-800 mb-1">{strip.date}</p>
        {strip.customText && (
          <p className="text-xs text-gray-600 truncate font-photobooth">
            "{strip.customText}"
          </p>
        )}
        <p className="text-xs text-gray-500 mt-2 capitalize">
          {strip.filter === 'bw' ? 'Black & White' : 'Color'}
        </p>
      </div>
    </div>
  );
};
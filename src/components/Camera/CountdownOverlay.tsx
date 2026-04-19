import React from 'react';

interface CountdownOverlayProps {
  countdown: number;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ countdown }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
      <div className="text-white text-9xl font-bold animate-pulse">
        {countdown}
      </div>
    </div>
  );
};


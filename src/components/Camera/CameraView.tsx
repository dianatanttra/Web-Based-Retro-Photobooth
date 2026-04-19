import React, { useEffect } from 'react';
import { PhotoData } from '../../types';
import { useCamera } from '../../hooks/useCamera';
import { usePhotoCapture } from '../../hooks/usePhotoCapture';
import { CountdownOverlay } from './CountdownOverlay';
import { FlashEffect } from './FlashEffect';

interface CameraViewProps {
  onCaptureComplete: (photos: PhotoData[]) => void;
  onCancel: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({
  onCaptureComplete,
  onCancel,
}) => {
  const { videoRef, error, isLoading, stopCamera } = useCamera();
  const {
    photos,
    isCapturing,
    countdown,
    showFlash,
    currentPhotoIndex,
    startCapture,
  } = usePhotoCapture(videoRef);

  useEffect(() => {
    if (photos.length === 4) {
      stopCamera();
      onCaptureComplete(photos);
    }
  }, [photos, onCaptureComplete, stopCamera]);

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-xl mb-4">{error}</p>
          <button onClick={handleCancel} className="px-6 py-2 bg-red-600 rounded">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p className="text-xl">Initializing camera...</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
      />

      {countdown !== null && <CountdownOverlay countdown={countdown} />}
      {showFlash && <FlashEffect />}

      {!isCapturing && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-4">
          <button
            onClick={startCapture}
            className="px-12 py-4 bg-red-600 text-white text-xl font-bold rounded-full hover:bg-red-700 transition"
          >
            Start
          </button>
        </div>
      )}

      {isCapturing && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 px-6 py-3 rounded-lg">
          <p className="text-white text-lg">
            Photo {currentPhotoIndex} of 4
          </p>
        </div>
      )}

      <button
        onClick={handleCancel}
        className="absolute top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        Cancel
      </button>

      {/* TEST BUTTON - ADD THIS */}
      <button
        onClick={() => {
          const video = videoRef.current;
          console.log('Video element:', video);
          console.log('Video dimensions:', video?.videoWidth, video?.videoHeight);
          console.log('Ready state:', video?.readyState);
          console.log('Has stream:', video?.srcObject);
        }}
        className="absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Video
      </button>
      {/* END TEST BUTTON */}
    </div>
  );
};
import { useState, useCallback } from 'react';
import { PhotoData } from '../types';
import { PHOTOS_PER_STRIP, COUNTDOWN_SECONDS, PHOTO_INTERVAL_MS, FLASH_DURATION_MS } from '../utils/constants';

export const usePhotoCapture = (videoRef: React.RefObject<HTMLVideoElement | null>) => {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const capturePhoto = useCallback((): string | null => {
    const video = videoRef.current;
    
    console.log('Attempting capture...', { video, readyState: video?.readyState });
    
    if (!video) {
      console.error('Video element not found');
      return null;
    }
    
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      console.error('Video not ready', video.readyState);
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    
    console.log('Canvas dimensions:', canvas.width, canvas.height);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return null;
    }

    // Mirror the image (flip horizontally for selfie effect)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
    console.log('Captured photo, data URL length:', dataUrl.length);
    
    return dataUrl;
  }, [videoRef]);

  const startCapture = useCallback(async () => {
    console.log('Starting capture sequence...');
    setIsCapturing(true);
    setPhotos([]);
    setCurrentPhotoIndex(0);

    for (let i = 0; i < PHOTOS_PER_STRIP; i++) {
      setCurrentPhotoIndex(i + 1);
      console.log(`Capturing photo ${i + 1} of ${PHOTOS_PER_STRIP}`);

      // Countdown
      for (let count = COUNTDOWN_SECONDS; count > 0; count--) {
        setCountdown(count);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setCountdown(null);

      // Capture
      const photoDataUrl = capturePhoto();
      if (photoDataUrl) {
        const photoData: PhotoData = {
          id: `photo-${Date.now()}-${i}`,
          dataUrl: photoDataUrl,
          timestamp: Date.now(),
        };
        
        console.log('Photo captured successfully:', photoData.id);
        setPhotos(prev => [...prev, photoData]);
      } else {
        console.error('Failed to capture photo', i + 1);
      }

      // Flash effect
      setShowFlash(true);
      await new Promise(resolve => setTimeout(resolve, FLASH_DURATION_MS));
      setShowFlash(false);

      // Wait before next photo (except after last photo)
      if (i < PHOTOS_PER_STRIP - 1) {
        await new Promise(resolve => setTimeout(resolve, PHOTO_INTERVAL_MS - COUNTDOWN_SECONDS * 1000));
      }
    }

    console.log('Capture sequence complete');
    setIsCapturing(false);
  }, [capturePhoto]);

  const reset = () => {
    setPhotos([]);
    setIsCapturing(false);
    setCountdown(null);
    setShowFlash(false);
    setCurrentPhotoIndex(0);
  };

  return {
    photos,
    isCapturing,
    countdown,
    showFlash,
    currentPhotoIndex,
    startCapture,
    reset,
  };
};
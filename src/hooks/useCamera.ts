import { useState, useEffect, useRef, useCallback } from 'react';
import { CAMERA_CONSTRAINTS } from '../utils/constants';

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let mounted = true;
    let currentStream: MediaStream | null = null;
    
    const initCamera = async () => {
      try {
        console.log('Requesting camera access...');
        const mediaStream = await navigator.mediaDevices.getUserMedia(
          CAMERA_CONSTRAINTS
        );
        
        console.log('Camera access granted', mediaStream);
        
        if (!mounted) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }
        
        currentStream = mediaStream;
        setStream(mediaStream);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Camera error:', err);
        if (mounted) {
          setError('Camera access denied or unavailable');
          setIsLoading(false);
        }
      }
    };

    initCamera();

    return () => {
      mounted = false;
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // NEW: Separate effect to attach stream to video element
  useEffect(() => {
    if (stream && videoRef.current) {
      console.log('Attaching stream to video element');
      videoRef.current.srcObject = stream;
      
      videoRef.current.onloadedmetadata = () => {
        console.log('Video metadata loaded');
        videoRef.current?.play().catch(err => {
          console.error('Error playing video:', err);
        });
      };
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
    }
  }, [stream]);

  return { videoRef, stream, error, isLoading, stopCamera };
};
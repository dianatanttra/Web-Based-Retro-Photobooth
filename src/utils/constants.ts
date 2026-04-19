// Photo strip dimensions (mimics real 2x6" strip)
export const STRIP_WIDTH = 800;  // pixels
export const STRIP_HEIGHT = 2400; // 3:1 aspect ratio

// Individual photo dimensions
export const PHOTO_WIDTH = 760;
export const PHOTO_HEIGHT = 570;
export const PHOTOS_PER_STRIP = 4;

//Reduce image dimentions
export const CAPTURE_WIDTH = 640;  // Reduce from default camera resolution
export const CAPTURE_HEIGHT = 480;

// Spacing and layout
export const STRIP_PADDING = 20;
export const PHOTO_SPACING = 15;
export const TEXT_AREA_HEIGHT = 120;

// Timing
export const COUNTDOWN_SECONDS = 3;
export const FLASH_DURATION_MS = 200;
export const PHOTO_INTERVAL_MS = 4000; // 4 seconds between captures

// Text constraints
export const MAX_CUSTOM_TEXT_LENGTH = 40;

// IndexedDB
export const DB_NAME = 'PhotoboothDB';
export const DB_VERSION = 1;
export const STORE_NAME = 'photoStrips';

// Camera
export const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user',
  },
  audio: false,
};

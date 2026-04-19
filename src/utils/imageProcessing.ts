import { PhotoData, FilterType } from '../types';
import {
  STRIP_WIDTH,
  STRIP_HEIGHT,
  PHOTO_WIDTH,
  PHOTO_HEIGHT,
  STRIP_PADDING,
  PHOTO_SPACING,
  TEXT_AREA_HEIGHT,
  MAX_CUSTOM_TEXT_LENGTH,
} from './constants';
import { applyBlackAndWhiteFilter, applyColorFilter } from './filters';

export const composePhotoStrip = async (
  photos: PhotoData[],
  customText: string,
  date: string,
  filter: FilterType
): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = STRIP_WIDTH;
  canvas.height = STRIP_HEIGHT;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  // Background (off-white for photobooth feel)
  ctx.fillStyle = '#f8f8f6';
  ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

  // Draw border
  ctx.strokeStyle = '#e0e0de';
  ctx.lineWidth = 2;
  ctx.strokeRect(5, 5, STRIP_WIDTH - 10, STRIP_HEIGHT - 10);

  // Calculate positions
  const photoStartY = STRIP_PADDING;
  const photoX = (STRIP_WIDTH - PHOTO_WIDTH) / 2;

  // Draw each photo
  for (let i = 0; i < photos.length; i++) {
    const photoY = photoStartY + i * (PHOTO_HEIGHT + PHOTO_SPACING);
    
    const img = await loadImage(photos[i].dataUrl);
    
    // Apply filter
    const filteredCanvas = document.createElement('canvas');
    filteredCanvas.width = PHOTO_WIDTH;
    filteredCanvas.height = PHOTO_HEIGHT;
    const fCtx = filteredCanvas.getContext('2d');
    
    if (fCtx) {
      // ===== ASPECT RATIO COVER CROP CODE STARTS HERE =====
      const imgAspect = img.width / img.height;
      const frameAspect = PHOTO_WIDTH / PHOTO_HEIGHT;

      let drawWidth, drawHeight, drawX, drawY;

      if (imgAspect > frameAspect) {
        // Image wider than frame: crop sides
        drawHeight = PHOTO_HEIGHT;
        drawWidth = img.width * (PHOTO_HEIGHT / img.height);
        drawX = (PHOTO_WIDTH - drawWidth) / 2;
        drawY = 0;
      } else {
        // Image taller than frame: crop top/bottom
        drawWidth = PHOTO_WIDTH;
        drawHeight = img.height * (PHOTO_WIDTH / img.width);
        drawX = 0;
        drawY = (PHOTO_HEIGHT - drawHeight) / 2;
      }

      fCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      // ===== ASPECT RATIO COVER CROP CODE ENDS HERE =====
      
      if (filter === 'bw') {
        applyBlackAndWhiteFilter(fCtx, PHOTO_WIDTH, PHOTO_HEIGHT);
      } else {
        applyColorFilter(fCtx, PHOTO_WIDTH, PHOTO_HEIGHT);
      }
      
      ctx.drawImage(filteredCanvas, photoX, photoY);
    }
  }

  // Text area
  const textY = photoStartY + photos.length * (PHOTO_HEIGHT + PHOTO_SPACING) + PHOTO_SPACING;
  
  ctx.fillStyle = '#2a2a2a';
  ctx.font = '18px "Courier New", Courier, monospace';
  ctx.textAlign = 'center';
  
  // Date
  ctx.fillText(date, STRIP_WIDTH / 2, textY + 30);
  
  // Custom text (truncated)
  const truncated = customText.slice(0, MAX_CUSTOM_TEXT_LENGTH);
  ctx.fillText(truncated, STRIP_WIDTH / 2, textY + 60);

  return canvas.toDataURL('image/jpeg', 0.75);
};

const loadImage = (dataUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
};
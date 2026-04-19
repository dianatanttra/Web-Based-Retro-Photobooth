import { PhotoData, FilterType, CaptionFont } from '../types';
import {
  STRIP_WIDTH,
  PHOTO_WIDTH,
  PHOTO_HEIGHT,
  STRIP_PADDING,
  PHOTO_SPACING,
} from './constants';
import { applyBlackAndWhiteFilter, applyColorFilter } from './filters';

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const words = trimmed.split(/\s+/);
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const testLine = `${currentLine} ${words[i]}`;
    const width = ctx.measureText(testLine).width;

    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function getCaptionFontFamily(captionFont: CaptionFont): string {
  switch (captionFont) {
    case 'handwritten':
      return '"Brush Script MT", "Comic Sans MS", cursive';
    case 'print':
      return '"Courier New", Courier, monospace';
    case 'clean':
      return 'Arial, Helvetica, sans-serif';
    case 'calligraphy':
      return '"Lucida Handwriting", "Times New Roman", cursive';
    default:
      return '"Courier New", Courier, monospace';
  }
}

const loadImage = (dataUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
};

export const composePhotoStrip = async (
  photos: PhotoData[],
  customText: string,
  date: string,
  filter: FilterType,
  captionFont: CaptionFont = 'print'
): Promise<string> => {
  if (!photos.length) {
    throw new Error('No photos provided');
  }

  const canvas = document.createElement('canvas');

  const photoStartY = STRIP_PADDING;
  const photoX = (STRIP_WIDTH - PHOTO_WIDTH) / 2;

  const photosBlockHeight =
    photos.length * PHOTO_HEIGHT + (photos.length - 1) * PHOTO_SPACING;

  const captionFontSize = 22;
  const captionTopGap = 26;
  const captionSidePadding = 26;
  const captionLineHeight = 30;
  const bottomPadding = 40;
  const maxCaptionLines = 4;
  const maxCaptionLength = 160;

  const safeText = customText.trim().slice(0, maxCaptionLength);
  const fontFamily = getCaptionFontFamily(captionFont);

  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) throw new Error('Canvas context unavailable');

  tempCtx.font = `${captionFontSize}px ${fontFamily}`;
  const textMaxWidth = STRIP_WIDTH - captionSidePadding * 2;

  const wrappedLines = wrapText(tempCtx, safeText, textMaxWidth).slice(
    0,
    maxCaptionLines
  );

  const captionHeight =
    wrappedLines.length > 0 ? wrappedLines.length * captionLineHeight : 0;

  canvas.width = STRIP_WIDTH;
  canvas.height =
    photoStartY +
    photosBlockHeight +
    (wrappedLines.length > 0 ? captionTopGap + captionHeight : 0) +
    bottomPadding;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  ctx.fillStyle = '#f8f8f6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#e0e0de';
  ctx.lineWidth = 2;
  ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

  for (let i = 0; i < photos.length; i++) {
    const photoY = photoStartY + i * (PHOTO_HEIGHT + PHOTO_SPACING);
    const img = await loadImage(photos[i].dataUrl);

    const filteredCanvas = document.createElement('canvas');
    filteredCanvas.width = PHOTO_WIDTH;
    filteredCanvas.height = PHOTO_HEIGHT;
    const fCtx = filteredCanvas.getContext('2d');

    if (fCtx) {
      const imgAspect = img.width / img.height;
      const frameAspect = PHOTO_WIDTH / PHOTO_HEIGHT;

      let drawWidth: number;
      let drawHeight: number;
      let drawX: number;
      let drawY: number;

      if (imgAspect > frameAspect) {
        drawHeight = PHOTO_HEIGHT;
        drawWidth = img.width * (PHOTO_HEIGHT / img.height);
        drawX = (PHOTO_WIDTH - drawWidth) / 2;
        drawY = 0;
      } else {
        drawWidth = PHOTO_WIDTH;
        drawHeight = img.height * (PHOTO_WIDTH / img.width);
        drawX = 0;
        drawY = (PHOTO_HEIGHT - drawHeight) / 2;
      }

      fCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      if (filter === 'bw') {
        applyBlackAndWhiteFilter(fCtx, PHOTO_WIDTH, PHOTO_HEIGHT);
      } else {
        applyColorFilter(fCtx, PHOTO_WIDTH, PHOTO_HEIGHT);
      }

      ctx.drawImage(filteredCanvas, photoX, photoY);
    }
  }

  if (wrappedLines.length > 0) {
    const textY = photoStartY + photosBlockHeight + captionTopGap;

    ctx.fillStyle = '#222';
    ctx.font = `${captionFontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    let lineY = textY;

    for (const line of wrappedLines) {
      ctx.fillText(line, STRIP_WIDTH / 2, lineY);
      lineY += captionLineHeight;
    }
  }

  return canvas.toDataURL('image/jpeg', 0.92);
};
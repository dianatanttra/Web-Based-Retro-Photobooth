export interface PhotoData {
  id: string;
  dataUrl: string;
  timestamp: number;
}

export type FilterType = 'bw' | 'color';

export type CaptionFont = 'handwritten' | 'print' | 'clean' | 'calligraphy';

export interface PhotoStrip {
  id: string;
  photos: PhotoData[];
  customText: string;
  date: string;
  filter: FilterType;
  captionFont: CaptionFont;
  composedImageUrl: string;
  createdAt: number;
}

export interface CameraConstraints {
  video: {
    width: { ideal: number };
    height: { ideal: number };
    facingMode: string;
  };
}
export interface PhotoData {
  id: string;
  dataUrl: string;
  timestamp: number;
}

export interface PhotoStrip {
  id: string;
  photos: PhotoData[];
  customText: string;
  date: string;
  filter: FilterType;
  composedImageUrl: string;
  createdAt: number;
}

export type FilterType = 'bw' | 'color';

export interface CameraConstraints {
  video: {
    width: { ideal: number };
    height: { ideal: number };
    facingMode: string;
  };
}
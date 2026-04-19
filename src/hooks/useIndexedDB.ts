import { useState, useEffect } from 'react';
import { PhotoStrip } from '../types';
import { getAllPhotoStrips, savePhotoStrip, deletePhotoStrip } from '../utils/storage';

export const useIndexedDB = () => {
  const [strips, setStrips] = useState<PhotoStrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadStrips = async () => {
    setIsLoading(true);
    const allStrips = await getAllPhotoStrips();
    setStrips(allStrips);
    setIsLoading(false);
  };

  useEffect(() => {
    loadStrips();
  }, []);

  const saveStrip = async (strip: PhotoStrip) => {
    await savePhotoStrip(strip);
    await loadStrips(); // Refresh
  };

  const deleteStrip = async (id: string) => {
    await deletePhotoStrip(id);
    await loadStrips(); // Refresh
  };

  return {
    strips,
    isLoading,
    saveStrip,
    deleteStrip,
    refreshStrips: loadStrips,
  };
};
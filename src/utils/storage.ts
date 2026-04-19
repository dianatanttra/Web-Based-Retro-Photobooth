import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { PhotoStrip } from '../types';
import { DB_NAME, DB_VERSION, STORE_NAME } from './constants';

interface PhotoboothDB extends DBSchema {
  photoStrips: {
    key: string;
    value: PhotoStrip;
    indexes: { 'by-date': number };
  };
}

let dbInstance: IDBPDatabase<PhotoboothDB> | null = null;

export const getDB = async (): Promise<IDBPDatabase<PhotoboothDB>> => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<PhotoboothDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('by-date', 'createdAt');
      }
    },
  });

  return dbInstance;
};

export const savePhotoStrip = async (strip: PhotoStrip): Promise<void> => {
  const db = await getDB();
  await db.put(STORE_NAME, strip);
};

export const getAllPhotoStrips = async (): Promise<PhotoStrip[]> => {
  const db = await getDB();
  const strips = await db.getAllFromIndex(STORE_NAME, 'by-date');
  return strips.reverse(); // Most recent first
};

export const getPhotoStripById = async (id: string): Promise<PhotoStrip | undefined> => {
  const db = await getDB();
  return await db.get(STORE_NAME, id);
};

export const deletePhotoStrip = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
};
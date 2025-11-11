import { openDB } from 'idb';

const DB_NAME = 'GiftMakerDB';
const STORE_NAME = 'giftState';

let dbPromise;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 2, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

export async function get(key) {
  const db = await getDb();
  return await db.get(STORE_NAME, key);
}

export async function set(key, val) {
  const db = await getDb();
  return await db.put(STORE_NAME, val, key);
}

export async function del(key) {
    const db = await getDb();
    return await db.delete(STORE_NAME, key);
}

export async function clear() {
    const db = await getDb();
    return await db.clear(STORE_NAME);
}
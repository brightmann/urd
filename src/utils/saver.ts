import { openDB } from "idb";

// export type Data = {
//   text?: string;
//   files?: Record<string, File>;
// };
export type Data = unknown;

const DB_NAME = "editor-saver";
const STORE_NAME = "history";
const EMPTY_KEY = "new";

// Autosave is a convenience, not a requirement: the editor must still
// load when browser storage is unavailable. Firefox throws
// QuotaExceededError ("The current transaction exceeded its quota
// limitations") from openDB when the disk is nearly full — even just
// creating the empty database — and an uncaught throw there used to
// kill the whole editor mount. A failed init degrades to no-op
// autosave instead: the editor opens, and Publish / Save as draft
// (which go to GitHub, not IndexedDB) keep working.
export const createSaver = () => {
  const init = async () => {
    try {
      const db = await openDB(DB_NAME, 1, {
        upgrade(database) {
          if (!database.objectStoreNames.contains(STORE_NAME)) {
            database.createObjectStore(STORE_NAME);
          }
        },
      });
      return {
        db,
      };
    } catch (err) {
      console.warn("[editor-saver] IndexedDB unavailable, autosave disabled:", err);
      return null;
    }
  };
  const initd = init();

  const save = async (data: Data, key: string = EMPTY_KEY) => {
    const inited = await initd;
    if (!inited) return;
    try {
      const { db } = inited;
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      await store.put(data, key);
      await transaction.done;
    } catch (err) {
      console.warn("[editor-saver] autosave failed:", err);
    }
  };

  const read = async (key: string = EMPTY_KEY) => {
    const inited = await initd;
    if (!inited) return undefined;
    try {
      const { db } = inited;
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const data = await store.get(key);
      return data as Data;
    } catch (err) {
      console.warn("[editor-saver] autosave read failed:", err);
      return undefined;
    }
  };

  const clean = async (key: string = EMPTY_KEY) => {
    const inited = await initd;
    if (!inited) return;
    try {
      const { db } = inited;
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      await store.delete(key);
      await transaction.done;
    } catch (err) {
      console.warn("[editor-saver] autosave clear failed:", err);
    }
  };

  return {
    save,
    read,
    clean,
  };
};

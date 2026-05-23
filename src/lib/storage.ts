import type { Format3Data } from "#/types/resume/resumeTypes";

export interface StoredResume {
  resume_id: string;
  resume_data: Format3Data; // Clean final data
  last_modified: Date;
  version: number;
}

// Open IndexedDB
const DB_NAME = "ResumeBuilderDB";
const DB_VERSION = 1;
const STORE_NAME = "resumes";

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "resume_id",
        });
        store.createIndex("last_modified", "last_modified");
      }
    };
  });
};

// Save resume to IndexedDB
export const saveResumeToDB = async (
  resume_id: string,
  resume_data: Format3Data,
): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  const stored: StoredResume = {
    resume_id,
    resume_data,
    last_modified: new Date(),
    version: 1,
  };

  return new Promise((resolve, reject) => {
    const request = store.put(stored);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Load resume from IndexedDB
export const loadResumeFromDB = async (
  resume_id: string,
): Promise<Format3Data | null> => {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], "readonly");
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.get(resume_id);
    request.onsuccess = () => {
      const result = request.result as StoredResume | undefined;
      resolve(result?.resume_data || null);
    };
    request.onerror = () => reject(request.error);
  });
};

// Get all resumes
export const getAllResumes = async (): Promise<StoredResume[]> => {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], "readonly");
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Delete resume from IndexedDB
export const deleteResumeFromDB = async (resume_id: string): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.delete(resume_id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

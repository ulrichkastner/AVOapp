// Dateiname: js/utils/db.js
// Zweck: Gemeinsame IndexedDB-Funktionen für die gesamte App

const DB_NAME = 'avo-db';
const DB_VERSION = 1;
const STORE_NAME = 'safety';

// Initialisiert die Datenbank (wird beim ersten Zugriff aufgerufen)
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Speichert einen Eintrag unter dem gegebenen Schlüssel
export async function setItem(key, value) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.put(value, key);
  return tx.complete;
}

// Holt einen Eintrag anhand des Schlüssels
export async function getItem(key) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Löscht einen Eintrag
export async function deleteItem(key) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.delete(key);
  return tx.complete;
}

// Gibt alle gespeicherten Schlüssel zurück (optional für Debug)
export async function getAllKeys() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return store.getAllKeys ? store.getAllKeys() : [];
}

// Leert die gesamte Datenbank (optional für "Verlauf zurücksetzen"-Button)
export async function clearStore() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.clear();
  return tx.complete;
}
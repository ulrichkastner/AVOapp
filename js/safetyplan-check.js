// js/safetyplan-check.js
import { openDB } from '../utils/db.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const db = await openDB();
    const tx = db.transaction('coping', 'readonly');
    const store = tx.objectStore('coping');
    const request = store.get('reasons');

    request.onsuccess = () => {
      const saved = request.result;
      console.log("✅ Gelesene Daten aus coping:", saved);

      // Wenn gültige Daten vorhanden sind: Kachel aktivieren
      if (saved && (saved.reason1 || saved.reason2)) {
        const tile = document.getElementById('tile-coping');
        if (tile) {
          tile.classList.remove('disabled');
          console.log("🎉 Kachel 'coping' aktiviert");
        }
      } else {
        console.log("⚠️ Kein gültiger Inhalt gefunden");
      }
    };

    request.onerror = (e) => {
      console.error("❌ Fehler beim Lesen aus IndexedDB:", e);
    };
  } catch (e) {
    console.error("❌ openDB() fehlgeschlagen:", e);
  }
});
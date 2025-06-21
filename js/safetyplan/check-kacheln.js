// Dateiname: js/safetyplan/check-kacheln.js
// js/check-kacheln.js
import { openDatabase } from '../js/utils/db.js';

window.addEventListener('DOMContentLoaded', async () => {
  const debugBox = document.createElement('div');
  debugBox.id = 'debug-box';
  debugBox.style.padding = '1rem';
  debugBox.style.background = '#ffe';
  debugBox.style.borderTop = '1px solid #ccc';
  debugBox.style.fontSize = '0.9rem';
  debugBox.style.fontFamily = 'monospace';
  document.body.appendChild(debugBox);

  function debug(msg) {
    console.log(msg);
    debugBox.innerHTML += `<div>${msg}</div>`;
  }

  debug("🔍 Lade Safety-Plan-Kachelstatus...");

  try {
    const db = await openDatabase();
    const tx = db.transaction('safety', 'readonly');
    const store = tx.objectStore('safety');
    const request = store.getAll();

    request.onsuccess = () => {
      const allItems = request.result;
      debug(`📦 Gefundene Einträge: ${allItems.length}`);

      allItems.forEach(item => {
        debug(`✅ ${item.id}: ${item.content || '[leer]'}`);
        const tile = document.getElementById(item.id);
        if (tile) tile.classList.remove('disabled');
      });
    };

    request.onerror = (e) => {
      debug("❌ Fehler beim Lesen aus Store: " + e.target.error);
    };

  } catch (err) {
    debug("❌ Fehler in IndexedDB: " + err.message);
  }
});
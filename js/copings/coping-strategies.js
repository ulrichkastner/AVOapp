import { openDB } from '../utils/db.js';

document.addEventListener('DOMContentLoaded', async () => {
  const db = await openDB();
  const form = document.getElementById('copingForm');
  const reasonsList = document.getElementById('reasonsList');
  const debug = document.getElementById('debugOutput');

  // Daten beim Start laden
  try {
    const tx = db.transaction('coping', 'readonly');
    const store = tx.objectStore('coping');
    const request = store.get('reasons');

    request.onsuccess = () => {
      const saved = request.result;
      if (saved) {
        reasonsList.innerHTML = `
          <li>${saved.reason1}</li>
          <li>${saved.reason2}</li>
        `;
        debug.textContent = '✅ Daten erfolgreich geladen.';
      } else {
        debug.textContent = 'ℹ️ Keine gespeicherten Daten gefunden.';
      }
    };

    request.onerror = (e) => {
      debug.textContent = '❌ Fehler beim Laden der Daten.';
      console.error('Ladefehler:', e);
    };
  } catch (e) {
    console.error('Fehler beim Initialisieren:', e);
  }

  // Beim Absenden speichern
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const reason1 = form.reason1.value.trim();
    const reason2 = form.reason2.value.trim();

    if (reason1 && reason2) {
      const tx = db.transaction('coping', 'readwrite');
      const store = tx.objectStore('coping');
      const request = store.put({ reason1, reason2 }, 'reasons');

      request.onsuccess = () => {
        reasonsList.innerHTML = `<li>${reason1}</li><li>${reason2}</li>`;
        debug.textContent = `✅ Gespeichert: ${reason1}, ${reason2}`;
        form.reset();
      };

      request.onerror = (e) => {
        debug.textContent = '❌ Fehler beim Speichern.';
        console.error('Speicherfehler:', e);
      };
    } else {
      debug.textContent = '⚠️ Bitte beide Felder ausfüllen.';
    }
  });
});
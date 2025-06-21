// Datei: js/copings/warning-signs.js
import { saveToStore, loadFromStore } from '../utils/db.js';

document.addEventListener('DOMContentLoaded', async () => {
  const sign1 = document.getElementById('sign1');
  const sign2 = document.getElementById('sign2');

  // Vorherige Daten laden
  const stored = await loadFromStore('safetyplan', 'warningSigns') || {};
  sign1.value = stored.sign1 || '';
  sign2.value = stored.sign2 || '';

  // Formular speichern
  const form = document.getElementById('warning-signs-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveToStore('safetyplan', 'warningSigns', {
      sign1: sign1.value,
      sign2: sign2.value
    });
    alert('Dein Eintrag wurde gespeichert.');
  });
});
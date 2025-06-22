let db;
const dbName = "DistressDB";
const storeName = "entries";

// Datenbank öffnen
function openDB() {
  const request = indexedDB.open(dbName, 1);

  request.onsuccess = function (e) {
    db = e.target.result;
    console.log("✅ DB geöffnet");
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("tableDate").value = today;
    loadAndRenderEntries(today);
  };

  request.onerror = function (e) {
    console.error("❌ Fehler beim Öffnen der DB", e);
  };
}

// Einträge für ein bestimmtes Datum laden
function loadAndRenderEntries(date) {
  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);
  const req = store.openCursor();
  const entries = [];

  req.onsuccess = function (e) {
    const cursor = e.target.result;
    if (cursor) {
      const entry = cursor.value;
      if (entry.dateTime.startsWith(date)) {
        entries.push(entry);
      }
      cursor.continue();
    } else {
      renderTable(entries, date);
    }
  };
}

// Tabelle rendern
function renderTable(entries, date) {
  const tbody = document.getElementById("entryTableBody");
  tbody.innerHTML = "";

  if (entries.length === 0) {
    tbody.innerHTML = "<tr><td colspan='5'>Keine Einträge gefunden</td></tr>";
    return;
  }

  entries.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  entries.forEach(entry => {
    const tr = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.textContent = entry.dateTime.split("T")[0];
    tr.appendChild(dateCell);

    const timeCell = document.createElement("td");
    timeCell.textContent = entry.dateTime.split("T")[1].substring(0, 5);
    tr.appendChild(timeCell);

    const valueCell = document.createElement("td");
    valueCell.textContent = `${entry.value}%`;
    tr.appendChild(valueCell);

    const noteCell = document.createElement("td");
    noteCell.textContent = entry.note || "";
    tr.appendChild(noteCell);

    const actionCell = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.title = "Bearbeiten";
    editBtn.onclick = () => editEntry(entry);
    actionCell.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.title = "Löschen";
    deleteBtn.onclick = () => deleteEntry(entry.id, date);
    actionCell.appendChild(deleteBtn);

    tr.appendChild(actionCell);
    tbody.appendChild(tr);
  });
}

// Löschen eines Eintrags
function deleteEntry(id, currentDate) {
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);
  store.delete(id);
  tx.oncomplete = () => {
    console.log("🗑️ Eintrag gelöscht:", id);
    loadAndRenderEntries(currentDate);
  };
}

// Bearbeiten (Daten an distresscurve.html übergeben)
function editEntry(entry) {
  localStorage.setItem("editEntry", JSON.stringify(entry));
  window.location.href = "distresscurve.html";
}

// Initialisierung
document.addEventListener("DOMContentLoaded", () => {
  openDB();

  document.getElementById("tableDate").addEventListener("change", (e) => {
    loadAndRenderEntries(e.target.value);
  });
});


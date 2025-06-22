let db;
let currentDate = new Date().toISOString().split("T")[0];
const dbName = "DistressDB";
const storeName = "entries";
let editEntryId = null; // ⬅️ Für Bearbeiten

function openDB() {
  const request = indexedDB.open(dbName, 1);

  request.onupgradeneeded = function (e) {
    const db = e.target.result;
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
    }
  };

  request.onsuccess = function (e) {
    db = e.target.result;
    console.log("✅ DB geöffnet");
    drawChart(currentDate);
  };

  request.onerror = function (e) {
    console.error("❌ DB-Fehler", e);
  };
}

function saveEntry(value, dateTime, note = "") {
  if (!db) return;
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);

  const entry = { value, dateTime, note };

  if (typeof editEntryId === "number") {
    entry.id = editEntryId;
    store.put(entry); // ⬅️ Bestehenden Eintrag überschreiben
    console.log("✏️ Bearbeiteter Eintrag gespeichert:", entry);
    editEntryId = null;
  } else {
    store.add(entry);
    console.log("➕ Neuer Eintrag gespeichert:", entry);
  }

  tx.oncomplete = () => {
    drawChart(currentDate);
  };
}

function loadEntriesForDate(date, callback) {
  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);
  const entries = [];
  const req = store.openCursor();
  req.onsuccess = function (e) {
    const cursor = e.target.result;
    if (cursor) {
      const entry = cursor.value;
      if (entry.dateTime.startsWith(date)) {
        entries.push(entry);
      }
      cursor.continue();
    } else {
      callback(entries);
    }
  };
}

function drawChart(date) {
  loadEntriesForDate(date, (entries) => {
    const ctx = document.getElementById("distressChart").getContext("2d");

    entries.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    const chartData = entries.map(e => ({
      x: new Date(e.dateTime),
      y: e.value,
      note: e.note || ""
    }));

    if (window.distressChart instanceof Chart) {
      window.distressChart.destroy();
    }

    window.distressChart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [{
          label: "Spannung",
          data: chartData,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        scales: {
          x: {
            type: "time",
            time: { unit: "hour" }
          },
          y: { min: 0, max: 100 }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const note = context.raw.note;
                return `Anspannung: ${context.raw.y}%` + (note ? `\n📝 ${note}` : "");
              }
            }
          }
        }
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  openDB();

  const valueInput = document.getElementById("valueInput");
  const dateInput = document.getElementById("dateInput");
  const timeInput = document.getElementById("timeInput");
  const noteInput = document.getElementById("noteInput");

  // ⬅️ Eintrag aus entries.html übernehmen
  const editData = localStorage.getItem("editEntry");
  if (editData) {
    const entry = JSON.parse(editData);
    dateInput.value = entry.dateTime.split("T")[0];
    timeInput.value = entry.dateTime.split("T")[1].substring(0,5);
    valueInput.value = entry.value;
    noteInput.value = entry.note || "";
    document.getElementById("valueDisplay").textContent = `${entry.value}%`;
    editEntryId = entry.id;
    localStorage.removeItem("editEntry");
  } else {
    const now = new Date();
    dateInput.value = now.toISOString().split("T")[0];
    timeInput.value = now.toTimeString().substring(0, 5);
    valueInput.value = 50;
    document.getElementById("valueDisplay").textContent = "50%";
  }

  valueInput.addEventListener("input", () => {
    document.getElementById("valueDisplay").textContent = `${valueInput.value}%`;
  });

  document.getElementById("entryForm").addEventListener("submit", e => {
    e.preventDefault();
    const dateTime = `${dateInput.value}T${timeInput.value}:00`;
    saveEntry(parseInt(valueInput.value), dateTime, noteInput.value.trim());
  });

  // Tagesnavigation
  document.getElementById("prevDay").addEventListener("click", () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    currentDate = date.toISOString().split("T")[0];
    document.getElementById("dateDisplay").textContent = currentDate;
    drawChart(currentDate);
  });

  document.getElementById("nextDay").addEventListener("click", () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    currentDate = date.toISOString().split("T")[0];
    document.getElementById("dateDisplay").textContent = currentDate;
    drawChart(currentDate);
  });

  // 🧪 Optional: Testdaten
  const testBtn = document.getElementById("insertTest");
  if (testBtn) {
    testBtn.addEventListener("click", () => {
      const baseDate = currentDate;
      for (let h = 8; h <= 20; h += 3) {
        const dt = `${baseDate}T${h.toString().padStart(2, "0")}:00:00`;
        const value = Math.floor(Math.random() * 101);
        saveEntry(value, dt, `AutoTest ${h} Uhr`);
      }
    });
  }
});



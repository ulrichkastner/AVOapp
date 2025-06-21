# AVOapp

Die AVOapp ist eine offlinefähige Webanwendung zur Unterstützung bei psychischen Krisen.

## Features
- Safety-Plan mit Warnzeichen, Skills und Notfallkontakten
- Spannungsverlauf (Distresskurve)
- Tipps & Tools für den Alltag
- Offlinefähig dank moderner Browser-Technologien (IndexedDB)

## Entwickelt von
Dr. Ulrich W. Kastner  
https://borderline-akut.de

# 🥑 AVOapp – Lokale Entwicklungsanleitung

Willkommen im AVOapp-Projekt!  
Diese Anleitung beschreibt, wie du lokal arbeitest, Änderungen sicher mit GitHub synchronisierst und den lokalen Server startest.

---

## 🚀 Projekt lokal starten (localhost)

### Voraussetzungen
- Projekt liegt unter `~/Projekte/AVOapp`
- Python 3 ist installiert

### Startbefehl
```bash
cd ~/Projekte/AVOapp
python3 -m http.server 8000
```

### Zugriff im Browser
- [http://localhost:8000/app.html](http://localhost:8000/app.html)
- oder [http://localhost:8000/index.html](http://localhost:8000/index.html)

---

## 🔧 Änderungen lokal machen & in GitHub sichern

### Schritt-für-Schritt
```bash
# 1. In Projektordner wechseln
cd ~/Projekte/AVOapp

# 2. Änderungen zum Commit vormerken
git add .

# 3. Commit mit kurzer Beschreibung erstellen
git commit -m "Änderung an app.html und style.css"

# 4. Änderungen zu GitHub hochladen
git push
```

---

## 🔄 Änderungen von GitHub lokal übernehmen

Wenn du online im GitHub-Repo Änderungen gemacht hast:

```bash
cd ~/Projekte/AVOapp
git pull
```

Dann wie gewohnt starten:
```bash
python3 -m http.server 8000
```

---

## 🛡️ Backup vor größeren Änderungen

Optional kannst du eine Sicherung anlegen:
```bash
cp -r ~/Projekte/AVOapp ~/Projekte/AVOapp_backup_$(date +%Y%m%d)
```

---

## 🧪 Nützliche Git-Befehle

```bash
git status         # zeigt geänderte Dateien
git add <datei>    # nur eine Datei hinzufügen
git diff           # zeigt konkrete Änderungen
```

---

## 💡 Bonus: Automatisches Update & Start (Shell-Skript)

Erstelle ein Skript `start-avo.sh`:
```bash
#!/bin/bash
cd ~/Projekte/AVOapp
git pull
python3 -m http.server 8000
```

Ausführbar machen:
```bash
chmod +x start-avo.sh
./start-avo.sh
```

---

## ✅ Merksatz

> GitHub ist deine Quelle der Wahrheit.  
> `git pull` holt dir den aktuellen Stand.  
> `python3 -m http.server` zeigt dir lokal die App.

---

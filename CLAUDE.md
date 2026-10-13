# CLAUDE.md

Statische Vereinswebsite "Ruderclub Eckernförde": reines HTML/CSS/JS, kein Build, kein Framework.

- Seiten: `*.html` im Hauptverzeichnis; Header/Footer sind pro Seite dupliziert (bei Änderungen in allen Seiten anpassen).
- `css/style.css`: Farben/Schriften als Variablen in `:root`.
- `js/main.js`: Menü, Rendering der Neuigkeiten; `js/news-data.js`: Beiträge für "Aktuelles".
- Fehlende Inhalte sind als `[PLATZHALTER: ...]` bzw. `[MUSTERTEXT]` markiert; keine Fakten erfinden.
- Sprache: Deutsch. Lokal testen: `python3 -m http.server`.

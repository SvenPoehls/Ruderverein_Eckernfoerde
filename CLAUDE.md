# CLAUDE.md

Statische Vereinswebsite "Ruderclub Eckernförde": reines HTML/CSS/JS, kein Build, kein Framework, keine Abhängigkeiten.

- Seiten: `*.html` im Hauptverzeichnis. Header/Footer sind in jeder Seite dupliziert – Änderungen an Navigation/Footer in allen Seiten nachziehen.
- `css/style.css`: Design-Tokens (Farben, Schriften, Abstände) in `:root`; mobile first.
- `js/main.js`: Menü, Rendering von Neuigkeiten (`[data-news]`) und Galerie (`[data-gallery]`), Filter, Formular-Platzhalter.
- `inhalte/aktuelles.js` (`window.AKTUELLES`) und `inhalte/galerie.js` (`window.GALERIE`): vom Verein gepflegte Inhalte. Als JS statt JSON, damit die Seite auch per `file://` funktioniert.
- Schriften lokal in `assets/fonts/` (kein Google-CDN, DSGVO).
- Fehlende Inhalte als `[PLATZHALTER: …]` bzw. `[MUSTERTEXT]` kennzeichnen (im HTML mit `<span class="todo">`); keine Fakten erfinden.
- Sprache Deutsch. Lokal testen: `python3 -m http.server`.

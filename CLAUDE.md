# CLAUDE.md

Vereinswebsite "Ruderclub Eckernförde": rein statische Seite (HTML/CSS/JS, kein Build, kein Framework, kein Server, keine Abhängigkeiten). Hosting ausschließlich über **GitHub Pages** aus `docs/` – kein Netlify, keine serverseitigen Funktionen.

- Seiten: `docs/*.html`; Header/Footer sind in jeder Seite dupliziert – Änderungen an Navigation/Footer in allen Seiten nachziehen. `docs/.nojekyll` verhindert Jekyll-Verarbeitung.
- **Gestaltung: `DESIGN.md` ist verbindlich** („Regattaplakat trifft Logbuch“: Big Shoulders Display + Atkinson Hyperlegible Next, Navy/Gelb/Papier, Bojenkette, Bootsklassen-Kürzel, Startliste, Chronik, Ruderkommandos; keine Icon-Karten, kein Glas, kein pauschales Fade-up).
- `docs/css/style.css`: Tokens in `:root`; mobile first.
- `docs/js/main.js`: Menü, Neuigkeiten (`[data-news]`, Layout `feature`/`log`) und Galerie (`[data-gallery]`) aus `docs/inhalte/aktuelles.js` (`window.AKTUELLES`) und `docs/inhalte/galerie.js` (`window.GALERIE`) – als JS statt JSON, damit es auch per `file://` funktioniert. Pflege direkt im Repo (github.com).
- Bewegung (`main.js` Abschnitt 7, CSS 11): `data-parallax="0.18"` lässt ein Element langsamer scrollen; Einblenden nur per `data-reveal="wipe|rise"` (Positionsprüfung beim Scrollen, kein IntersectionObserver wegen clip-path). Alles respektiert `prefers-reduced-motion`.
- Nur relative Pfade verwenden (die Seite läuft unter `/Ruderverein_Eckernfoerde/`).
- Schriften lokal in `docs/assets/fonts/` (woff2 + OFL-Lizenzen, kein Google-CDN, DSGVO).
- Fehlende Inhalte als `[PLATZHALTER: …]` bzw. `[MUSTERTEXT]` kennzeichnen (im HTML mit `<span class="todo">`); keine Fakten erfinden. Gründungsjahr: 1924.
- Lokal ansehen: `cd docs && python3 -m http.server`.
- Sprache Deutsch.

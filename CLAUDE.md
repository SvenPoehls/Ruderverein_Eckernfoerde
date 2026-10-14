# CLAUDE.md

Vereinswebsite "Ruderclub Eckernförde": statische Seite (reines HTML/CSS/JS, kein Build, kein Framework) plus kleiner Admin-Bereich über eine Netlify Function.

- `site/` wird ausgeliefert (`netlify.toml`: publish = "site"). Seiten `site/*.html`; Header/Footer sind in jeder Seite dupliziert – Änderungen an Navigation/Footer in allen Seiten nachziehen.
- **Gestaltung: `DESIGN.md` ist verbindlich** („Regattaplakat trifft Logbuch“: Big Shoulders Display + Atkinson Hyperlegible Next, Navy/Gelb/Papier, Bojenkette, Bootsklassen-Kürzel, Startliste, Chronik, Ruderkommandos; keine Icon-Karten, kein Glas, kein pauschales Fade-up).
- `site/css/style.css`: Tokens in `:root`; mobile first.
- `site/js/main.js`: Menü, Neuigkeiten (`[data-news]`) und Galerie (`[data-gallery]`) – geladen von `/api/news` bzw. `/api/gallery`; liefert die API `items: null` (nie gespeichert) oder ist nicht erreichbar (`file://`), gelten `site/inhalte/*.js` als Rückfall.
- Bewegung (`main.js` Abschnitt 7, CSS 11): `data-parallax="0.18"` lässt ein Element langsamer scrollen; Einblenden nur per `data-reveal="wipe|rise"` (Positionsprüfung beim Scrollen, kein IntersectionObserver wegen clip-path). Alles respektiert `prefers-reduced-motion`.
- Admin-Bereich: `site/admin/` (UI) + `netlify/functions/api.mjs` (Routen `/api/*`) + `netlify/lib/auth.mjs` (scrypt, HMAC-Sitzungscookie, Login-Sperre) + `netlify/lib/store.mjs` (Netlify Blobs; lokal Dateien via `LOCAL_STORE_DIR`). Schreibende Requests brauchen Header `X-Requested-With: rce-admin`. Ohne Benutzer wird `test`/`test` angelegt.
- Lokal testen: `npm install && npm start` → http://localhost:8888 (`tools/dev-server.mjs`, Daten in `.data/`).
- Schriften lokal in `site/assets/fonts/` (woff2 + OFL-Lizenzen, kein Google-CDN, DSGVO).
- Fehlende Inhalte als `[PLATZHALTER: …]` bzw. `[MUSTERTEXT]` kennzeichnen (im HTML mit `<span class="todo">`); keine Fakten erfinden. Gründungsjahr: 1924.
- Sprache Deutsch.

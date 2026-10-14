# Ruderclub Eckernförde – Webseite

Statische Vereinswebsite aus reinem HTML, CSS und etwas JavaScript – kein Build, keine Installation, kein Server.
Veröffentlicht wird sie über **GitHub Pages** aus dem Ordner `docs/`.

## Aufbau
```
docs/                     die Webseite (wird von GitHub Pages ausgeliefert)
  index.html …            Seiten
  css/style.css           Design – Farben & Schriften oben in :root
  js/main.js              Menü, Animationen, Neuigkeiten & Galerie
  inhalte/aktuelles.js    ← Neuigkeiten pflegen
  inhalte/galerie.js      ← Galerie pflegen
  assets/img/             Bilder (news/, galerie/, Startbild)
  assets/fonts/           Schriften (lokal, mit Lizenzen)
DESIGN.md                 Gestaltungsregeln
```

## Veröffentlichen mit GitHub Pages
1. Im Repository auf **Settings → Pages** gehen.
2. Bei *Source* „Deploy from a branch“ wählen, Branch **`main`**, Ordner **`/docs`** – speichern.
3. Nach ca. 1 Minute ist die Seite unter `https://svenpoehls.github.io/Ruderverein_Eckernfoerde/` erreichbar.
   Eine eigene Domain lässt sich später unter *Custom domain* eintragen.

## Inhalte pflegen (für den Verein)
Alles geht direkt im Browser auf github.com – nach dem Speichern („Commit changes“) ist die Seite nach ca. 1 Minute aktualisiert.

- **Neuer Beitrag:** `docs/inhalte/aktuelles.js` öffnen → Stift-Symbol → einen Block `{ … },` kopieren, oben einfügen, Text und Datum ändern. Die Anleitung steht oben in der Datei.
- **Foto hochladen:** in `docs/assets/img/news/` bzw. `docs/assets/img/galerie/` → *Add file → Upload files*. Den Pfad dann im Beitrag bzw. in `docs/inhalte/galerie.js` eintragen.
- **Weitere Personen dürfen pflegen:** unter *Settings → Collaborators* einladen (benötigt ein kostenloses GitHub-Konto).

## Lokal ansehen
`docs/index.html` im Browser öffnen – oder im Ordner `docs` `python3 -m http.server` starten und http://localhost:8000 aufrufen.

## Gestaltung & Schriften
Die Gestaltungsregeln stehen in `DESIGN.md`. Schriften (Big Shoulders Display, Atkinson Hyperlegible Next) liegen als woff2 in `docs/assets/fonts/` (SIL Open Font License) – keine Verbindung zu Google.

## Offene Punkte
- Alle Stellen mit `[PLATZHALTER: …]` und `[MUSTERTEXT]` ersetzen (auf der Seite gelb markiert).
- Kontaktformular: Versandweg festlegen (GitHub Pages kann keine Formulare verschicken – z. B. mailto oder ein Formulardienst).
- Impressum und Datenschutz rechtlich prüfen bzw. generieren lassen (inkl. Hinweis auf GitHub Pages).
- Domain in Canonical/Open-Graph-Tags eintragen.

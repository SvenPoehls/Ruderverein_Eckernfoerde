# Ruderclub Eckernförde – Webseite (Entwurf)

Statische Webseite aus reinem HTML, CSS und etwas JavaScript – **kein Build, keine Installation**.

## Ansehen
- Einfach `index.html` im Browser öffnen, **oder**
- im Ordner `python3 -m http.server` ausführen und http://localhost:8000 aufrufen.

## Ordnerstruktur
```
index.html              Startseite
verein.html             Über uns, Werte, Bootshaus, Vorstand
rudern.html             Angebote, Trainingszeiten, FAQ
aktuelles.html          Neuigkeiten (aus inhalte/aktuelles.js)
galerie.html            Fotos (aus inhalte/galerie.js)
mitglied-werden.html    Vorteile, Ablauf, Beiträge
kontakt.html            Kontaktdaten, Anfahrt, Formular
impressum.html / datenschutz.html / 404.html
css/style.css           gesamtes Design – Farben & Schriften oben in :root
js/main.js              Menü, Neuigkeiten, Galerie, Filter
inhalte/aktuelles.js    ← hier pflegt der Verein die Beiträge
inhalte/galerie.js      ← hier pflegt der Verein die Galerie
assets/img/news/        Fotos für Beiträge
assets/img/galerie/     Fotos für die Galerie
assets/fonts/           Schriftdateien (lokal, siehe unten)
```

## Inhalte pflegen (für den Verein)
**Neuer Beitrag:** `inhalte/aktuelles.js` öffnen, einen Block `{ … },` kopieren, oben einfügen, Text und Datum ändern. Foto in `assets/img/news/` hochladen und den Pfad eintragen. Die Anleitung steht auch oben in der Datei.

**Neues Galeriebild:** Foto in `assets/img/galerie/` hochladen und in `inhalte/galerie.js` einen Eintrag ergänzen.

Wird die Seite über GitHub + Netlify veröffentlicht, lassen sich beide Dateien und die Fotos direkt im Browser auf github.com bearbeiten bzw. hochladen – nach dem Speichern ist die Seite in ca. 1 Minute aktualisiert.
*Ausbaustufe für später:* ein Redaktionssystem wie Decap CMS oder Pages CMS, damit Beiträge über ein Formular mit Bild-Upload angelegt werden.

## Schriften (DSGVO)
Schriften werden bewusst nicht von Google geladen. Zum Aktivieren `plus-jakarta-sans-variable.woff2` und `inter-variable.woff2` (z. B. via google-webfonts-helper) in `assets/fonts/` legen. Bis dahin wird eine System-Schrift genutzt.

## Offene Punkte
- Alle Stellen mit `[PLATZHALTER: …]` und `[MUSTERTEXT]` ersetzen (auf der Seite gelb markiert; im Editor danach suchen).
- Kontaktformular: Versandweg festlegen (z. B. Netlify Forms). Aktuell wird nur ein Hinweis angezeigt.
- Impressum und Datenschutz rechtlich prüfen bzw. generieren lassen.
- Domain in Canonical/Open-Graph-Tags eintragen, Vorschaubild `assets/img/og-bild.jpg` (1200 × 630 px) anlegen.

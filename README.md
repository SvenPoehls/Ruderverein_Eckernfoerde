# Ruderclub Eckernförde – Webseite

Öffentliche Webseite (reines HTML/CSS/JS) plus kleiner **Admin-Bereich**, in dem Vereinsmitglieder Neuigkeiten und Galeriebilder pflegen und weitere Admins anlegen können.

## Aufbau
```
site/                     öffentliche Webseite (wird so ausgeliefert)
  index.html …            Seiten
  css/style.css           Design – Farben & Schriften oben in :root
  js/main.js              Menü, Animationen, lädt Neuigkeiten & Galerie
  inhalte/*.js            Beispielinhalte (Rückfall, solange im Admin-Bereich nichts gespeichert ist)
  admin/                  Admin-Bereich (Login, Neuigkeiten, Galerie, Admins, Passwort)
  assets/                 Bilder, Schriften
netlify/functions/api.mjs API unter /api/… (Login, Inhalte, Bild-Upload)
netlify/lib/              Anmeldung & Datenspeicher (Netlify Blobs)
tools/dev-server.mjs      lokaler Testserver
netlify.toml, package.json
```

## Lokal testen
```
npm install
npm start
```
Webseite: http://localhost:8888 · Admin-Bereich: http://localhost:8888/admin/ (oder Link „Login“ im Footer).
Lokale Testdaten liegen in `.data/` (nicht im Git; zum Zurücksetzen einfach löschen).

Ohne Server (Datei direkt im Browser öffnen) funktioniert die Webseite weiterhin, zeigt dann aber die Beispielinhalte und der Login ist nicht verfügbar.

## Admin-Bereich
- **Erster Zugang:** Benutzername `test`, Passwort `test`. Er wird automatisch angelegt, solange es keinen anderen Admin gibt.
- **⚠️ Vor dem Livegang:** Unter „Admins“ ein eigenes Konto anlegen, damit anmelden und den Testzugang `test` löschen. Solange er existiert, zeigt der Admin-Bereich eine Warnung.
- Neuigkeiten und Galeriebilder anlegen, bearbeiten, löschen – inkl. Bild-Upload (wird automatisch verkleinert). Änderungen sind sofort auf der Webseite sichtbar.
- Weitere Admins anlegen/löschen; jeder kann sein Passwort unter „Mein Konto“ ändern.
- Sicherheit: Passwörter nur als scrypt-Hash gespeichert, Sitzungs-Cookie (HttpOnly, SameSite=Strict, 8 h), Sperre nach 5 Fehlversuchen für 15 Minuten.

## Veröffentlichen (Netlify)
1. Repository bei Netlify verbinden – `netlify.toml` erledigt den Rest (veröffentlicht `site/`, richtet die API ein).
2. Daten werden in **Netlify Blobs** gespeichert (Region Frankfurt, `eu-central-1`; änderbar über die Umgebungsvariable `BLOBS_REGION` – nur vor dem ersten Speichern).
3. Empfohlen: Umgebungsvariable `SESSION_SECRET` (langer Zufallswert) setzen. Ohne sie wird automatisch ein Schlüssel erzeugt und gespeichert.

## Hero-Bild austauschen
Das Startbild liegt in `site/assets/img/hero-gig.webp` (groß) und `hero-gig-800.webp` (Handy). Neues Foto unter gleichem Namen ablegen – oder die Pfade in `site/css/style.css` (Abschnitt 6, `--hero-img`) ändern.

## Schriften (DSGVO)
Schriften werden bewusst nicht von Google geladen. Zum Aktivieren `plus-jakarta-sans-variable.woff2` und `inter-variable.woff2` (z. B. via google-webfonts-helper) in `site/assets/fonts/` legen. Bis dahin wird eine System-Schrift genutzt.

## Offene Punkte
- Alle Stellen mit `[PLATZHALTER: …]` und `[MUSTERTEXT]` ersetzen (auf der Seite gelb markiert).
- Kontaktformular: Versandweg festlegen (z. B. Netlify Forms).
- Impressum und Datenschutz rechtlich prüfen bzw. generieren lassen (inkl. Hinweis auf Netlify/Netlify Blobs).
- Domain in Canonical/Open-Graph-Tags eintragen.

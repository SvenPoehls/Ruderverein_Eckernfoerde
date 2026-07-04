# Website: Angelsee Heiligenstedten

Diese Anleitung ist bewusst einfach geschrieben - du brauchst **keine Programmierkenntnisse**, um Texte, Bilder oder Preise zu ändern.

---

## 1. Wie ist die Seite aufgebaut?

Die Webseite besteht aus einfachen Textdateien. Alles, was du als Betreiber änderst, liegt in diesen Ordnern:

```
src/
  _data/
    betrieb.js      <- Adresse, Telefon, Öffnungszeiten, Kurzinfos (WICHTIGSTE Datei)
    galerie.js       <- Liste der Fangbilder für die Galerie-Seite
  ueber-uns.md        <- Text für "Über uns"
  fischbestand.md     <- Text für "Fischbestand"
  regeln.md           <- Text für "Regeln & Angelordnung"
  preise.md           <- Text für "Preise & Angelkarten"
  index.njk           <- Startseite (Willkommenstext etc.)
  anfahrt-kontakt.njk <- Adresse, Karte, Kontaktformular
  assets/img/         <- alle Bilder der Webseite
```

Dateien mit der Endung **`.md`** ("Markdown") enthalten normalen Fließtext, den du wie in einem Textprogramm bearbeiten kannst. Du brauchst dort kein HTML zu verstehen.

Du musst diese Struktur nicht auswendig kennen - im Zweifel einfach in diesem README nachschauen, welche Datei du für was brauchst (siehe Abschnitt 3).

---

## 2. Was du zum Bearbeiten brauchst

- Einen einfachen Text-Editor. Am einfachsten geht es direkt auf github.com:
  1. Gehe zur Datei, die du ändern willst (z. B. `src/preise.md`).
  2. Klicke auf das Stift-Symbol ("Edit this file") oben rechts.
  3. Ändere den Text.
  4. Scrolle nach unten, schreibe einen kurzen Kommentar (z. B. "Preise aktualisiert") und klicke auf "Commit changes".
  5. Fertig! Wenn die Seite mit Netlify verbunden ist (siehe Abschnitt 5), wird sie automatisch neu veröffentlicht.

Alternativ kannst du die Dateien auch mit einem Programm wie VS Code auf deinem Computer bearbeiten.

---

## 3. Wo ändere ich was?

### Adresse, Telefon, Öffnungszeiten, Facebook-Link
→ Datei `src/_data/betrieb.js`
Das ist die zentrale Datei. Eine Änderung hier wirkt sich automatisch auf **alle** Seiten aus (Startseite, Footer/Fußzeile, Kontaktseite).

Öffne die Datei und ändere nur den Text zwischen den Anführungszeichen `" "`, zum Beispiel:
```
oeffnungszeiten: "Täglich 6:00 - 20:00 Uhr",
```

### Startseite (Willkommenstext, Kästchen "Auf einen Blick")
→ Datei `src/index.njk`
Suche nach `[WILLKOMMENSTEXT: ...]` und ersetze den kompletten Text in eckigen Klammern durch deinen eigenen Text.

### "Über uns" (Vorstellung des Inhabers, Geschichte des Sees)
→ Datei `src/ueber-uns.md`

### "Fischbestand" (Fischarten, Besonderheiten)
→ Datei `src/fischbestand.md`
Füge pro Fischart eine Zeile mit einem Bindestrich `-` hinzu, z. B. `- Karpfen`.

### "Regeln & Angelordnung" (Methoden, Schonzeiten, Verhaltensregeln)
→ Datei `src/regeln.md`

### "Preise & Angelkarten" (Preistabelle)
→ Datei `src/preise.md`
Die Preistabelle ist wie folgt aufgebaut:
```
| Tageskarte (Erwachsene) | 12,00 € |
```
Ändere einfach die Zahlen. Eine neue Zeile fügst du nach demselben Muster hinzu, eine nicht benötigte Zeile kannst du löschen.

### "Anfahrt & Kontakt" (Wegbeschreibung)
→ Datei `src/anfahrt-kontakt.njk`
Suche nach `[ANFAHRT: ...]` und ersetze den Text. Adresse, Telefon und die Karte werden automatisch aus `betrieb.js` befüllt.

### Alle Texte in eckigen Klammern [SO]
Diese Platzhalter markieren Stellen, an denen noch echter Inhalt fehlt. Ersetze einfach den kompletten Text inklusive der eckigen Klammern durch deinen eigenen Text.

---

## 4. Bilder ändern

Alle Bilder liegen im Ordner `src/assets/img/`. Aktuell sind dort nur **Platzhalterbilder** (farbige Kästen mit Beschriftung) hinterlegt.

So tauschst du ein Bild aus:
1. Lade dein eigenes Foto z. B. bei GitHub in den Ordner `src/assets/img/` hoch.
2. Gib der Datei am besten denselben Namen wie das Platzhalterbild, das sie ersetzt (z. B. `hero-see.jpg` statt `hero-see.svg`).
3. Falls sich der Dateiname ändert, musst du den neuen Namen zusätzlich in der Seite eintragen, auf der das Bild verwendet wird (suche dort nach `/assets/img/...`).
4. Achte darauf, den `alt="..."`-Text (die Bildbeschreibung für sehbehinderte Besucher) bei der Gelegenheit anzupassen.

**Bildergalerie (Fangbilder):** Für die Galerie-Seite trägst du Bilder zusätzlich in `src/_data/galerie.js` ein. Diese Datei ist ausführlich kommentiert - du kannst Bilder dort einfach hinzufügen oder entfernen, indem du einen ganzen Textblock kopierst, einfügst und anpasst (bzw. löschst).

Tipp: Fotos vor dem Hochladen verkleinern (z. B. max. 1600 Pixel breit), damit die Seite schnell lädt.

---

## 5. Seite lokal ansehen (optional, für technisch Interessierte)

Falls du die Seite vor der Veröffentlichung auf deinem Computer testen möchtest:

1. [Node.js](https://nodejs.org) installieren (einmalig).
2. Im Projektordner ein Terminal öffnen und einmalig ausführen:
   ```
   npm install
   ```
3. Vorschau starten:
   ```
   npm start
   ```
4. Im Browser `http://localhost:8080` öffnen.

Das ist **kein Pflichtschritt** - du kannst Änderungen auch direkt auf GitHub vornehmen, ohne irgendetwas auf deinem Computer zu installieren (siehe Abschnitt 6).

---

## 6. Seite veröffentlichen (Hosting mit Netlify)

Die Seite braucht keinen eigenen Server und keine Datenbank. Wir empfehlen **[Netlify](https://www.netlify.com)** zum kostenlosen Veröffentlichen, weil:

- Netlify baut die Seite bei jeder Änderung **automatisch** neu - du musst nie selbst ein Kommando ausführen.
- Es ist kostenlos für eine Seite wie diese.
- Es gibt kein kompliziertes Server- oder Datenbank-Setup.

### Einmalige Einrichtung
1. Bei [netlify.com](https://www.netlify.com) mit deinem GitHub-Konto anmelden.
2. "Add new site" → "Import an existing project" wählen.
3. Das GitHub-Repository `AngelseeHeiligenstedt` auswählen.
4. Die Build-Einstellungen sind bereits in der Datei `netlify.toml` hinterlegt (Build-Befehl: `npm run build`, Ausgabe-Ordner: `_site`) - Netlify erkennt sie automatisch, du musst nichts eintragen.
5. Auf "Deploy" klicken.

Nach ein bis zwei Minuten ist die Seite unter einer Adresse wie `https://dein-name.netlify.app` erreichbar. Eine eigene Domain (z. B. `www.angelsee-heiligenstedten.de`) kannst du später in den Netlify-Einstellungen unter "Domain settings" hinterlegen.

**Ab jetzt:** Jede Änderung, die du wie in Abschnitt 2 beschrieben auf GitHub speicherst, erscheint automatisch (nach ca. 1 Minute) auf der veröffentlichten Seite - ganz ohne weiteres Zutun.

---

## 7. Kontaktformular

Das Formular auf der Seite "Anfahrt & Kontakt" öffnet beim Absenden das E-Mail-Programm des Besuchers mit einer vorausgefüllten Nachricht an `olaf.brorsen@gmx.de`. Es wird **keine Datenbank und kein Server** benötigt - die Nachricht wird ganz normal per E-Mail verschickt.

---

## 8. Kurze Begründung der Technik-Wahl

Die Seite ist mit **Eleventy** gebaut, einem sehr einfachen Werkzeug, das aus den Textdateien in `src/` fertige Webseiten erzeugt. Vorteile für die Pflege durch eine einzelne, nicht-technische Person:

- Inhalte (Texte, Daten) sind strikt vom Layout getrennt - du bearbeitest nur Text, nie Design-Code.
- Adresse, Telefon & Co. stehen genau **einmal** zentral in `betrieb.js` und werden überall automatisch übernommen.
- Kein Backend, keine Datenbank, kein Login-System, keine laufenden Kosten oder Sicherheitsupdates, um die sich jemand kümmern müsste.
- Veröffentlichung läuft nach der Einrichtung vollautomatisch über Netlify.

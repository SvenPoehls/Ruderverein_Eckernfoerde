# DESIGN.md – Ruderclub Eckernförde

Leitidee: **„Regattaplakat trifft Logbuch“.** Alles wird aus dem Rudersport und dem Verein abgeleitet –
nicht aus einer Liste gängiger Web-Stile. Jede Gestaltungsentscheidung muss die Frage bestehen:
*Würde man das für jede beliebige andere Webseite genauso machen?* Wenn ja → ändern.

## Farben (Clubfarben + Papier)
| Rolle | Token | Wert | Einsatz |
|---|---|---|---|
| Grund | `--navy` | `#0b1b31` | Seitenhintergrund (dunkle Abschnitte) |
| Tiefe | `--navy-deep` | `#07121f` | Header, Footer |
| Fläche | `--navy-2` | `#11284a` | Formulare, Zeilen-Hover |
| Clubgelb | `--gelb` | `#f5c400` | Hauptaktionen, Bojen, CTA-Band (vollflächig) |
| Flaggenblau | `--blau` | `#2a6acd` | Bojen, Links auf Papier |
| Papier | `--sand` | `#efe9dc` | helle „Logbuch“-Abschnitte |
| Text hell | `--text` | `#ece6d9` | warmes Off-White statt reinem Weiß |
Keine Verläufe als Dekoration, kein Glas-Effekt, kein Neon. Gelb wird mutig **flächig** eingesetzt (CTA-Band), nicht als Glow.

## Schrift
- **Big Shoulders Display** (Display, 800–900, meist Versalien, enge Laufweite) – wirkt wie Regatta- und Startnummern-Typografie.
- **Atkinson Hyperlegible Next** (Fließtext) – entwickelt für maximale Lesbarkeit; passt zu einem Verein mit Mitgliedern jeden Alters.
- Zahlen tabellarisch (`font-variant-numeric: tabular-nums`) – wie auf Ergebnislisten.
- Keine Inter/Roboto/Space Grotesk, kein Monospace-Deko, kein einzelnes eingefärbtes Wort in Überschriften.

## Layout
- Linksbündig und asymmetrisch statt zentriert. Große Typografie trägt die Seite, nicht Kartenraster.
- Keine „drei Icon-Karten“. Stattdessen:
  - **Bootsklassen-Kürzel** (`1x`, `4x+`, `8+`) als Gliederungszeichen statt Icons oder 01/02/03.
  - **Startliste** (Bahn 1–3) für Angebote statt Karten.
  - **Chronik** ab 1924 statt Kennzahlen-Kacheln.
  - **Ruderkommandos** („Fertigmachen!“ – „Alles vorwärts –“ – „Los!“) als Schritte zur Mitgliedschaft.
  - **Logbuch**-Liste für Neuigkeiten (Datum groß links), auf der Startseite ein großer Aufmacher.
- Hell/Dunkel-Wechsel zwischen Navy und Papier gibt Rhythmus.
- Ein Radius (`--radius: 1.25rem`) plus Pillenform für Buttons/Tags – modern-rund, aber konsequent.

## Signatur-Details
1. **Bojenkette** – Trennlinie aus abwechselnd gelben/blauen Bojen an einer Leine (Regattabahn-Markierung).
2. **Stempel „Seit 1924“** – runder, langsam drehender Schriftzug im Hero.
3. **Koordinaten** der Eckernförder Bucht als kleine Ortsmarke.
4. Feines Papierkorn (Grain) über der ganzen Seite gegen „sterile“ Flächen.

## Bewegung
Nur mit Zweck: Parallax (Bilder bei „Rudern & Training“, Hero-Foto), Bild-„Wischen“ beim Einblenden (wie Wasser über die Fläche),
Bojenkette spannt sich auf, Stempel dreht langsam. **Kein** pauschales Fade-up auf jedem Abschnitt, keine hochzählenden Zahlen.
Alles aus bei `prefers-reduced-motion`.

## Texte
Konkret und im Vereinston („Komm ins Boot“, „Trainingszeiten ansehen“) statt Marketing-Floskeln („Mehr erfahren“, „Entdecke …“).
Fakten nie erfinden: `[PLATZHALTER: …]`, Mustertexte mit `[MUSTERTEXT]` markieren.

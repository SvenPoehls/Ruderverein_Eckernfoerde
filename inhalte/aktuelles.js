/* ==========================================================================
   AKTUELLES / NEUIGKEITEN
   --------------------------------------------------------------------------
   So fügst du einen neuen Beitrag hinzu:
     1. Einen kompletten Block { … }, kopieren und ganz oben in die Liste einfügen.
     2. Felder ausfüllen (Text immer in "Anführungszeichen").
     3. Optional: Foto in den Ordner assets/img/news/ hochladen und den
        Dateinamen bei "bild" eintragen, z. B. "assets/img/news/regatta.jpg".
        Ohne Foto: bild: "" lassen – dann erscheint ein Platzhalter.
     4. Datei speichern und hochladen. Die Reihenfolge auf der Webseite
        ergibt sich automatisch aus dem Datum (neueste zuerst).

   Felder:
     datum     – Format JJJJ-MM-TT, z. B. "2026-10-01"
     titel     – Überschrift des Beitrags
     kategorie – z. B. "Verein", "Regatta", "Jugend", "Termine"
                 (daraus entstehen automatisch die Filter-Buttons)
     teaser    – 1–2 Sätze, die immer sichtbar sind
     text      – längerer Text (optional), erscheint bei „Weiterlesen“.
                 Neuer Absatz: \n\n in den Text schreiben.
     bild      – Pfad zum Foto (optional)
     bildAlt   – kurze Bildbeschreibung für Screenreader (wichtig!)
   ========================================================================== */
window.AKTUELLES = [
  {
    datum: "2026-10-01",
    titel: "[MUSTERTEXT] Abrudern zum Saisonende",
    kategorie: "Verein",
    teaser: "[MUSTERTEXT] Zum Abschluss der Saison laden wir alle Mitglieder und Familien zum gemeinsamen Abrudern ein.",
    text: "[MUSTERTEXT] Längerer Beitragstext mit allen Details zur Veranstaltung.\n\n[PLATZHALTER: Datum, Uhrzeit, Treffpunkt, Programm]",
    bild: "",
    bildAlt: ""
  },
  {
    datum: "2026-09-14",
    titel: "[MUSTERTEXT] Schnuppertraining für Einsteigerinnen und Einsteiger",
    kategorie: "Termine",
    teaser: "[MUSTERTEXT] Du wolltest schon immer mal ins Ruderboot steigen? Bei unserem Schnuppertraining kannst du es unverbindlich ausprobieren.",
    text: "[PLATZHALTER: Termine, Anmeldung, was mitzubringen ist]",
    bild: "",
    bildAlt: ""
  },
  {
    datum: "2026-08-23",
    titel: "[MUSTERTEXT] Rückblick auf die Regatta",
    kategorie: "Regatta",
    teaser: "[MUSTERTEXT] Unsere Mannschaften waren bei der Regatta am Start – ein kurzer Bericht mit Ergebnissen.",
    text: "[PLATZHALTER: Name der Regatta, Ort, Ergebnisse, Fotos]",
    bild: "",
    bildAlt: ""
  },
  {
    datum: "2026-07-05",
    titel: "[MUSTERTEXT] Neues aus der Jugendabteilung",
    kategorie: "Jugend",
    teaser: "[MUSTERTEXT] Die Jugendgruppe war auf Wanderfahrt – hier ein paar Eindrücke.",
    text: "",
    bild: "",
    bildAlt: ""
  }
];

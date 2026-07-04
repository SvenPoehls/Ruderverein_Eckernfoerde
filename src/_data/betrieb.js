// ============================================================================
// ZENTRALE BETRIEBSDATEN
// ============================================================================
// Diese Datei ist die WICHTIGSTE Datei für die Pflege der Webseite.
// Alles, was hier geändert wird, erscheint automatisch an allen Stellen der
// Webseite (Startseite, Footer, Kontaktseite, ...) - du musst NICHTS an
// anderer Stelle im Code suchen.
//
// So änderst du einen Wert:
//   1. Diese Datei mit einem einfachen Texteditor öffnen
//      (z. B. im Editor auf github.com oder mit VS Code/Notepad).
//   2. Nur den Text HINTER dem Doppelpunkt, zwischen den Anführungszeichen
//      " " ändern. Die Anführungszeichen selbst nicht löschen!
//   3. Datei speichern und hochladen (siehe README.md, Abschnitt
//      "Inhalte ändern").
//
// Keine Angst etwas kaputt zu machen: Achte nur darauf, dass nach jeder
// Zeile weiterhin ein Komma "," steht (außer bei der allerletzten Zeile
// eines Blocks) und dass die Anführungszeichen " " erhalten bleiben.
// ============================================================================

module.exports = {
  // Name des Angelsees, wie er im Titel und Header angezeigt wird
  name: "Angelsee Heiligenstedten",

  // Name des Inhabers / der Inhaberin
  inhaber: "Olaf Brorsen",

  // Adresse - erscheint im Footer und auf der Anfahrt-Seite
  adresse: {
    strasse: "Waldweg 1",
    ort: "Heiligenstedten",
    plz: "25524",
    // Ganze Adresse in einer Zeile (wird für die Google-Maps-Karte benutzt)
    ganzeAdresse: "Waldweg 1, 25524 Heiligenstedten",
  },

  // Kontaktdaten
  kontakt: {
    telefon: "+49 173 2035514",
    // Telefonnummer im Format fuer Klick-zum-Anrufen-Links (nur Ziffern, mit Laendervorwahl, ohne Leerzeichen)
    telefonLink: "+491732035514",
    email: "olaf.brorsen@gmx.de",
  },

  // Öffnungszeiten - Platzhalter, bitte durch echte Zeiten ersetzen
  // Beispiel: "Täglich 6:00 - 20:00 Uhr" oder mit mehreren Zeilen wie unten
  oeffnungszeiten: "[ÖFFNUNGSZEITEN]",

  // Link zur Facebook-Seite
  facebook: "https://www.facebook.com/people/Angelsee-Heiligenstedten/100068608867324/",

  // Größe der Wasserfläche - wird auf Startseite und Fischbestand-Seite verwendet
  seeGroesse: "3,4 Hektar",

  // Anzahl der Angelplätze - wird auf Startseite und Fischbestand-Seite verwendet
  angelplaetze: "ca. 40",

  // Kurzinfos, die auf der Startseite als "Auf einen Blick"-Kästchen erscheinen
  get kurzinfos() {
    return [
      { titel: "Wasserfläche", text: this.seeGroesse + " großer Angelsee" },
      { titel: "Angelplätze", text: this.angelplaetze + " Angelplätze rund um den See" },
      { titel: "Kiosk", text: "Speisen, Getränke, Angelzubehör und Köder" },
      { titel: "Fischverkauf", text: "Frischer und geräucherter Fisch direkt vom See" },
    ];
  },

  // Jahreszahl für die Copyright-Zeile im Footer (wird automatisch aktuell gehalten,
  // hier musst du nichts von Hand nachtragen)
  get jahr() {
    return new Date().getFullYear();
  },
};

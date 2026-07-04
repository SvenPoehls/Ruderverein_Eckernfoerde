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
  // Web-Adresse der veröffentlichten Seite OHNE abschließenden Schrägstrich.
  // Wird für Suchmaschinen (Canonical-Links, Sitemap, robots.txt) sowie für
  // die Vorschau beim Teilen auf Facebook/WhatsApp/Twitter benötigt.
  // WICHTIG: Sobald die Seite auf Netlify veröffentlicht ist (siehe README,
  // Abschnitt "Seite veröffentlichen"), hier die echte Adresse eintragen -
  // z. B. "https://angelsee-heiligenstedten.netlify.app" oder eine eigene Domain.
  url: "https://www.angelsee-heiligenstedten.de",

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

  // Öffnungszeiten nach Saison. Jede Zeile ist ein Zeitraum + die dazugehörige Zeit.
  // Eine Zeile ändern: nur den Text zwischen den Anführungszeichen " " anpassen.
  // Eine Zeile hinzufügen/entfernen: einen kompletten { zeitraum: ..., zeiten: ... }-Block
  // kopieren/löschen (mit Komma).
  oeffnungszeiten: [
    { zeitraum: "April bis August", zeiten: "6:00 - 22:00 Uhr" },
    { zeitraum: "März, September und Oktober", zeiten: "7:00 - 18:00 Uhr" },
    { zeitraum: "November bis Februar", zeiten: "Nur Freitag, Samstag und Sonntag" },
  ],

  // Link zur Facebook-Seite
  facebook: "https://www.facebook.com/people/Angelsee-Heiligenstedten/100068608867324/",

  // Instagram-Nutzername und Link zum Profil
  instagram: {
    name: "@angelsee_heiligenstedten",
    link: "https://www.instagram.com/angelsee_heiligenstedten/",
  },

  // Link zu den Google-Bewertungen. Öffnet die Google-Maps-Suche zum Angelsee,
  // wo Besucher bestehende Bewertungen lesen und über "Rezension schreiben"
  // selbst eine Bewertung abgeben können.
  googleBewertungenLink: "https://www.google.com/maps/search/?api=1&query=Angelsee+Heiligenstedten+Waldweg+1+25524+Heiligenstedten",

  // Größe der Wasserfläche - wird auf der Fischbestand-Seite verwendet
  seeGroesse: "3,4 Hektar",

  // Anzahl der Angelplätze - wird auf der Fischbestand-Seite verwendet
  angelplaetze: "ca. 40",

  // Jahreszahl für die Copyright-Zeile im Footer (wird automatisch aktuell gehalten,
  // hier musst du nichts von Hand nachtragen)
  get jahr() {
    return new Date().getFullYear();
  },
};

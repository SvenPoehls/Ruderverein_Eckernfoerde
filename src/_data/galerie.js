// ============================================================================
// GALERIE-BILDER
// ============================================================================
// Hier trägst du die Fotos für die Galerie-Seite (und die Vorschau auf der
// Startseite, die zeigt die ersten 4 Bilder von hier) ein.
//
// Ein Bild hinzufügen:
//   1. Bilddatei in den Ordner "src/assets/img/" legen (z. B. "fang-01.jpg").
//   2. Unten einen neuen Block { datei: ..., alt: ..., bildtext: ... }
//      hinzufügen (nach dem Muster der vorhandenen Einträge, mit Komma
//      dazwischen).
//
// Ein Bild entfernen:
//   Den passenden Block { ... } löschen (samt Komma).
//
// "alt" = kurze Beschreibung für sehbehinderte Nutzer (Bildschirmleseprogramme).
// "bildtext" = sichtbarer Text unter dem Bild.
// ============================================================================

module.exports = [
  {
    datei: "/assets/img/Boot.jpg",
    alt: "Ruderboot am Ufer des Angelsees Heiligenstedten an einem sonnigen Tag",
    bildtext: "Bootssteg im Sommer",
  },
  {
    datei: "/assets/img/Nebel.jpg",
    alt: "Angelruten am Ufer im Morgennebel über dem Angelsee Heiligenstedten",
    bildtext: "Morgenstimmung im Nebel",
  },
  {
    datei: "/assets/img/Sonnenuntergang.jpg",
    alt: "Sitzplatz am Ufer bei Sonnenaufgang über dem Angelsee Heiligenstedten",
    bildtext: "Sonnenaufgang am Angelplatz",
  },
  {
    datei: "/assets/img/winter.jpg",
    alt: "Zugefrorener Angelsee Heiligenstedten mit Schnee bei Sonnenuntergang im Winter",
    bildtext: "Winterstimmung am See",
  },
  {
    datei: "/assets/img/1.jpg",
    alt: "Blick über den Angelsee Heiligenstedten im Sommer mit Schilf und Angelhütte",
    bildtext: "Sommerabend am See",
  },
  {
    datei: "/assets/img/2.jpg",
    alt: "Sonnenuntergang über dem Angelsee Heiligenstedten, Blick durchs Schilf",
    bildtext: "Abendlicht im Schilf",
  },
];

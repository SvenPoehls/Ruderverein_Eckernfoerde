// Lädt die Google-Maps-Karte erst nach einem Klick, damit keine Verbindung
// zu Google-Servern aufgebaut wird, bevor die Besucherin/der Besucher zugestimmt hat.
document.addEventListener("DOMContentLoaded", function () {
  var button = document.getElementById("karte-laden-knopf");
  var container = document.getElementById("karte-einbettung");

  if (!button || !container) return;

  button.addEventListener("click", function () {
    var iframe = document.createElement("iframe");
    iframe.src = container.getAttribute("data-karte-src");
    iframe.title = container.getAttribute("data-karte-titel") || "Google Maps";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    container.innerHTML = "";
    container.appendChild(iframe);
  });
});

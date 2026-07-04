// Schaltet das mobile Menü (Hamburger-Icon) auf kleinen Bildschirmen ein/aus.
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("hauptnavigation");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var istOffen = nav.classList.toggle("site-nav--offen");
    toggle.setAttribute("aria-expanded", istOffen ? "true" : "false");
  });
});

// Blendet Elemente mit der Klasse "reveal" beim Scrollen ein und wieder aus,
// je nachdem ob sie gerade im Sichtbereich sind - so wiederholt sich die
// Animation auch, wenn man hoch- und wieder runterscrollt. Wer in seinem
// Betriebssystem "Bewegungen reduzieren" eingestellt hat, bekommt keine
// Animation (siehe CSS: prefers-reduced-motion).
document.addEventListener("DOMContentLoaded", function () {
  var elemente = document.querySelectorAll(".reveal");
  if (!elemente.length) return;

  if (!("IntersectionObserver" in window)) {
    elemente.forEach(function (el) {
      el.classList.add("reveal--sichtbar");
    });
    return;
  }

  var beobachter = new IntersectionObserver(
    function (eintraege) {
      eintraege.forEach(function (eintrag) {
        eintrag.target.classList.toggle("reveal--sichtbar", eintrag.isIntersecting);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  elemente.forEach(function (el) {
    beobachter.observe(el);
  });
});

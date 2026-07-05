// Blendet Elemente mit der Klasse "reveal" sanft ein, sobald sie beim Scrollen
// sichtbar werden. Wer in seinem Betriebssystem "Bewegungen reduzieren"
// eingestellt hat, bekommt keine Animation (siehe CSS: prefers-reduced-motion).
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
        if (eintrag.isIntersecting) {
          eintrag.target.classList.add("reveal--sichtbar");
          beobachter.unobserve(eintrag.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  elemente.forEach(function (el) {
    beobachter.observe(el);
  });
});

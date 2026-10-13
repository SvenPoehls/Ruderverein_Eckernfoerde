/* Ruderclub Eckernförde – minimales JavaScript
   1. Mobiles Menü  2. Neuigkeiten aus js/news-data.js rendern  3. Formular-Platzhalter */

(function () {
  "use strict";

  // 1. Mobiles Menü ----------------------------------------------------------
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // 2. Neuigkeiten -----------------------------------------------------------
  // Datenquelle: window.NEWS (js/news-data.js). Neueste zuerst.
  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }
  function formatDate(iso) {
    var d = new Date(iso);
    return isNaN(d) ? esc(iso) : d.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
  }
  function renderNews(container, limit) {
    var items = (window.NEWS || []).slice().sort(function (a, b) {
      return String(b.datum).localeCompare(String(a.datum));
    });
    if (limit) items = items.slice(0, limit);
    if (!items.length) {
      container.innerHTML = "<p>Aktuell gibt es keine Neuigkeiten.</p>";
      return;
    }
    container.innerHTML = items.map(function (n) {
      var media = n.bild
        ? '<img src="' + esc(n.bild) + '" alt="' + esc(n.bildAlt || "") + '" loading="lazy">'
        : '<div class="ph" role="img" aria-label="Bildplatzhalter">[PLATZHALTER: Bild zum Beitrag]</div>';
      return '<article class="card">' + media +
        '<div class="card__body"><p class="card__meta"><time datetime="' + esc(n.datum) + '">' + formatDate(n.datum) + "</time></p>" +
        "<h3>" + esc(n.titel) + "</h3><p>" + esc(n.text) + "</p></div></article>";
    }).join("");
  }
  document.querySelectorAll("[data-news]").forEach(function (el) {
    renderNews(el, parseInt(el.getAttribute("data-news-limit"), 10) || 0);
  });

  // 3. Kontaktformular (Platzhalter – noch ohne Versand) ----------------------
  var form = document.querySelector("form[data-placeholder-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".form-status");
      if (msg) msg.textContent = "Hinweis: Das Formular ist noch nicht angebunden (Platzhalter).";
    });
  }
})();

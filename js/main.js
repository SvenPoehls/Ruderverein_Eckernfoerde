/* ==========================================================================
   Ruderclub Eckernförde – main.js
   Bewusst minimal und ohne Bibliotheken:
     1. Mobiles Menü
     2. Neuigkeiten anzeigen   (Daten: inhalte/aktuelles.js → window.AKTUELLES)
     3. Galerie anzeigen       (Daten: inhalte/galerie.js   → window.GALERIE)
     4. Filter-Buttons
     5. Kontaktformular (Platzhalter, noch kein Versand)
     6. Jahreszahl im Footer
   Die Seite bleibt ohne JavaScript nutzbar; nur Neuigkeiten & Galerie
   benötigen es (Hinweis per <noscript>).
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Hilfsfunktionen ---------- */
  // Text sicher in HTML einsetzen (verhindert kaputtes Layout durch Sonderzeichen)
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // "2026-10-01" → "1. Oktober 2026"
  function formatDate(iso) {
    var d = new Date(iso + "T12:00:00");
    if (isNaN(d)) return esc(iso);
    return d.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
  }

  // Leerzeile im Text = neuer Absatz
  function paragraphs(text) {
    return String(text || "").split(/\n\s*\n/).map(function (p) {
      return p.trim() ? "<p>" + esc(p.trim()) + "</p>" : "";
    }).join("");
  }

  function placeholderImg(label) {
    return '<div class="ph" role="img" aria-label="Bildplatzhalter">' + esc(label) + "</div>";
  }


  /* ---------- 1. Mobiles Menü ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Mit Escape schließen
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }


  /* ---------- 2. Neuigkeiten ---------- */
  function newsCard(item, headingLevel) {
    var h = "h" + headingLevel;
    var media = item.bild
      ? '<img src="' + esc(item.bild) + '" alt="' + esc(item.bildAlt) + '" loading="lazy" width="800" height="500">'
      : placeholderImg("[PLATZHALTER: Bild zum Beitrag]");
    var more = item.text
      ? '<details class="news-more"><summary>Weiterlesen</summary>' + paragraphs(item.text) + "</details>"
      : "";
    return '<article class="card" data-kategorie="' + esc(item.kategorie) + '">' +
      '<div class="card__media">' + media + "</div>" +
      '<div class="card__body">' +
        '<p class="card__meta"><time datetime="' + esc(item.datum) + '">' + formatDate(item.datum) + "</time>" +
          (item.kategorie ? '<span class="tag">' + esc(item.kategorie) + "</span>" : "") + "</p>" +
        "<" + h + ">" + esc(item.titel) + "</" + h + ">" +
        "<p>" + esc(item.teaser) + "</p>" + more +
      "</div></article>";
  }

  document.querySelectorAll("[data-news]").forEach(function (el) {
    var limit = parseInt(el.getAttribute("data-news-limit"), 10) || 0;
    var level = parseInt(el.getAttribute("data-heading-level"), 10) || 3;
    var items = (window.AKTUELLES || []).slice().sort(function (a, b) {
      return String(b.datum).localeCompare(String(a.datum)); // neueste zuerst
    });
    if (limit) items = items.slice(0, limit);
    el.innerHTML = items.length
      ? items.map(function (i) { return newsCard(i, level); }).join("")
      : "<p>Zurzeit gibt es keine Neuigkeiten.</p>";
    buildFilters(el, items.map(function (i) { return i.kategorie; }), "article");
  });


  /* ---------- 3. Galerie ---------- */
  document.querySelectorAll("[data-gallery]").forEach(function (el) {
    var items = window.GALERIE || [];
    el.innerHTML = items.map(function (bild) {
      var img = bild.datei
        ? '<a href="' + esc(bild.datei) + '" target="_blank" rel="noopener"><img src="' + esc(bild.datei) +
          '" alt="' + esc(bild.alt) + '" loading="lazy" width="800" height="600"></a>'
        : placeholderImg("[PLATZHALTER: " + (bild.alt || "Foto") + "]");
      return '<figure data-kategorie="' + esc(bild.album) + '">' + img +
        (bild.bildunterschrift ? "<figcaption>" + esc(bild.bildunterschrift) + "</figcaption>" : "") +
        "</figure>";
    }).join("");
    buildFilters(el, items.map(function (b) { return b.album; }), "figure");
  });


  /* ---------- 4. Filter-Buttons ----------
     Wird nur angezeigt, wenn ein Container data-filter-target besitzt
     und mehr als eine Kategorie vorhanden ist. */
  function buildFilters(container, categories, childSelector) {
    if (!container.id) return;
    var bar = document.querySelector('[data-filter-target="' + container.id + '"]');
    if (!bar) return;
    var unique = categories.filter(function (c, i, all) { return c && all.indexOf(c) === i; });
    if (unique.length < 2) return;

    bar.innerHTML = ["Alle"].concat(unique).map(function (c, i) {
      return '<button type="button" aria-pressed="' + (i === 0) + '" data-filter="' + esc(c) + '">' + esc(c) + "</button>";
    }).join("");

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      var value = btn.getAttribute("data-filter");
      bar.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      container.querySelectorAll(childSelector).forEach(function (child) {
        child.hidden = value !== "Alle" && child.getAttribute("data-kategorie") !== value;
      });
    });
  }


  /* ---------- 5. Kontaktformular (Platzhalter) ----------
     TODO: Versandweg festlegen (z. B. Netlify Forms, Formspree oder mailto).
     Bis dahin wird das Absenden abgefangen und ein Hinweis angezeigt. */
  document.querySelectorAll("form[data-form-placeholder]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      if (status) status.textContent = "Hinweis: Das Formular ist noch nicht angebunden (Entwurf). Bitte vorerst per E-Mail Kontakt aufnehmen.";
    });
  });


  /* ---------- 6. Jahreszahl im Footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();

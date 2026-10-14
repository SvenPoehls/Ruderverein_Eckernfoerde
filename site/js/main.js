/* ==========================================================================
   Ruderclub Eckernförde – main.js
   Bewusst minimal und ohne Bibliotheken:
     1. Mobiles Menü
     2. Neuigkeiten anzeigen   (Daten: /api/news, Rückfall inhalte/aktuelles.js)
     3. Galerie anzeigen       (Daten: /api/gallery, Rückfall inhalte/galerie.js)
     4. Filter-Buttons
     5. Kontaktformular (Platzhalter, noch kein Versand)
     6. Jahreszahl im Footer
     7. Bewegung: Header-Schatten, Parallax, Einblenden beim Scrollen
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


  /* ---------- Einblend-Beobachter (wird von 2., 3. und 7. genutzt) ---------- */
  // Hinweis: kein IntersectionObserver, da Chrome den clip-path des Elements
  // mitberücksichtigt – ein komplett „weggewischtes“ Bild gälte nie als sichtbar.
  var pendingReveals = [];
  function checkReveals() {
    if (!pendingReveals.length) return;
    var limit = window.innerHeight * 0.88;
    pendingReveals = pendingReveals.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < limit && r.bottom > 0) { el.classList.add("is-visible"); return false; }
      return true;
    });
  }
  function watchReveals(root) {
    var els = Array.prototype.slice.call(root.querySelectorAll("[data-reveal]:not(.is-visible)"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    pendingReveals = pendingReveals.concat(els);
    window.requestAnimationFrame(checkReveals);
  }


  /* ---------- 2. Neuigkeiten ---------- */
  var MONATE = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

  function newsMedia(item) {
    return item.bild
      ? '<img src="' + esc(item.bild) + '" alt="' + esc(item.bildAlt) + '" loading="lazy" width="800" height="600">'
      : placeholderImg("[PLATZHALTER: Bild zum Beitrag]");
  }
  function newsMore(item) {
    return item.text ? '<details class="news-more"><summary>Weiterlesen</summary>' + paragraphs(item.text) + "</details>" : "";
  }
  function newsMeta(item) {
    return '<p class="news-meta"><time datetime="' + esc(item.datum) + '">' + formatDate(item.datum) + "</time>" +
      (item.kategorie ? '<span class="tag">' + esc(item.kategorie) + "</span>" : "") + "</p>";
  }

  // Großer Aufmacher (Startseite)
  function newsFeature(item) {
    return '<article class="feature-news" data-kategorie="' + esc(item.kategorie) + '">' +
      '<div class="feature-news__media" data-reveal="wipe">' + newsMedia(item) + "</div>" +
      "<div>" + newsMeta(item) + "<h3>" + esc(item.titel) + "</h3><p>" + esc(item.teaser) + "</p>" + newsMore(item) + "</div></article>";
  }

  // Logbuch-Eintrag: Datum groß links, Text, Bild rechts
  function newsLog(item, withMedia) {
    var d = new Date(item.datum + "T12:00:00");
    var date = isNaN(d) ? esc(item.datum)
      : "<b>" + d.getDate() + "</b><span>" + MONATE[d.getMonth()] + " " + d.getFullYear() + "</span>";
    return '<li class="log__entry" data-kategorie="' + esc(item.kategorie) + '">' +
      '<time class="log__date" datetime="' + esc(item.datum) + '">' + date + "</time>" +
      '<div class="log__body">' + (item.kategorie ? '<span class="tag">' + esc(item.kategorie) + "</span>" : "") +
        "<h3>" + esc(item.titel) + "</h3><p>" + esc(item.teaser) + "</p>" + newsMore(item) + "</div>" +
      (withMedia ? '<div class="log__media" data-reveal="wipe">' + newsMedia(item) + "</div>" : "") +
      "</li>";
  }

  /* Datenquelle: Online kommen Beiträge & Bilder aus dem Admin-Bereich
     (/api/news, /api/gallery). Solange dort noch nichts gespeichert wurde
     – oder die Seite ohne Server geöffnet wird – gelten die Dateien in
     inhalte/ als Rückfall. */
  function loadContent(resource, fallback) {
    if (!/^https?:$/.test(location.protocol)) return Promise.resolve(fallback);
    return fetch("/api/" + resource, { headers: { Accept: "application/json" } })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) { return data && Array.isArray(data.items) ? data.items : fallback; })
      .catch(function () { return fallback; });
  }

  var newsTargets = document.querySelectorAll("[data-news]");
  if (newsTargets.length) {
    loadContent("news", window.AKTUELLES || []).then(function (all) {
      newsTargets.forEach(function (el) {
        var limit = parseInt(el.getAttribute("data-news-limit"), 10) || 0;
        var layout = el.getAttribute("data-news-layout") || "log";
        var items = all.slice().sort(function (a, b) {
          return String(b.datum).localeCompare(String(a.datum)); // neueste zuerst
        });
        if (limit) items = items.slice(0, limit);
        if (!items.length) {
          el.innerHTML = "<p>Zurzeit gibt es keine Neuigkeiten.</p>";
        } else if (layout === "feature") {
          el.innerHTML = newsFeature(items[0]) +
            (items.length > 1 ? '<ol class="log">' + items.slice(1).map(function (i) { return newsLog(i, false); }).join("") + "</ol>" : "");
        } else {
          el.innerHTML = '<ol class="log">' + items.map(function (i) { return newsLog(i, true); }).join("") + "</ol>";
        }
        watchReveals(el);
        buildFilters(el, items.map(function (i) { return i.kategorie; }), "[data-kategorie]");
      });
    });
  }


  /* ---------- 3. Galerie ---------- */
  var galleryTargets = document.querySelectorAll("[data-gallery]");
  if (galleryTargets.length) {
    loadContent("gallery", window.GALERIE || []).then(function (items) {
      galleryTargets.forEach(function (el) {
        el.innerHTML = items.length ? items.map(function (bild) {
          var img = bild.datei
            ? '<a href="' + esc(bild.datei) + '" target="_blank" rel="noopener"><img src="' + esc(bild.datei) +
              '" alt="' + esc(bild.alt) + '" loading="lazy" width="800" height="600"></a>'
            : placeholderImg("[PLATZHALTER: " + (bild.alt || "Foto") + "]");
          return '<figure data-kategorie="' + esc(bild.album) + '" data-reveal="wipe">' + img +
            (bild.bildunterschrift ? "<figcaption>" + esc(bild.bildunterschrift) + "</figcaption>" : "") +
            "</figure>";
        }).join("") : "<p>Zurzeit sind keine Bilder vorhanden.</p>";
        buildFilters(el, items.map(function (b) { return b.album; }), "figure");
        watchReveals(el);
      });
    });
  }


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


  /* ---------- 7. Bewegung ----------
     Respektiert die Systemeinstellung „Bewegung reduzieren“. */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".site-header");

  // 7.1 Parallax ----------------------------------------------------------
  // Elemente mit data-parallax="0.18" bleiben beim Scrollen um diesen Anteil
  // zurück, wirken also langsamer als der Text. Nur auf breiten Bildschirmen,
  // da Bild und Text mobil untereinander stehen.
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var hero = document.querySelector(".hero");
  var wide = window.matchMedia("(min-width: 56rem)");
  var MAX_SHIFT = 90; // px, begrenzt den Versatz

  function updateMotion() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    if (header) header.classList.toggle("is-scrolled", y > 10);
    checkReveals();
    if (reduceMotion) return;

    // Hero-Foto scrollt mit 35 % der Geschwindigkeit (solange sichtbar)
    if (hero && y < hero.offsetHeight + 200) {
      hero.style.setProperty("--hero-shift", (y * 0.35).toFixed(1) + "px");
    }

    parallaxEls.forEach(function (el) {
      if (!wide.matches) { el.style.transform = ""; return; }
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
      var parent = el.parentElement.getBoundingClientRect();
      if (parent.bottom < -200 || parent.top > vh + 200) return; // außerhalb
      // Abstand der Elementmitte zur Bildschirmmitte → Versatz
      var offset = (vh / 2 - (parent.top + parent.height / 2)) * speed;
      offset = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, offset));
      el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { updateMotion(); ticking = false; });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateMotion();

  // 7.2 Gezielte Einblend-Effekte ----------------------------------------
  // Nur Elemente mit data-reveal: "wipe" (Bilder), "rise" (große Überschriften)
  // und die Bojenkette. Kein pauschales Einblenden aller Abschnitte.
  watchReveals(document);
})();

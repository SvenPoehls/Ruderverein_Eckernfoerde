/* ==========================================================================
   Admin-Bereich – Ruderclub Eckernförde
   Spricht mit der API unter /api/… (netlify/functions/api.mjs).
   ========================================================================== */
(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var state = { me: null, news: [], gallery: [] };

  /* ---------- Hilfsfunktionen ---------- */
  function esc(v) {
    return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  // Pfade wie "assets/…" liegen eine Ebene höher als /admin/
  function imgSrc(p) { return !p ? "" : (p.charAt(0) === "/" ? p : "../" + p); }
  function today() { return new Date().toISOString().slice(0, 10); }
  function formatDate(iso) {
    var d = new Date(iso + "T12:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
  }

  function api(path, options) {
    options = options || {};
    var headers = { "X-Requested-With": "rce-admin" };
    if (options.json !== undefined) headers["Content-Type"] = "application/json";
    return fetch("/api/" + path, {
      method: options.method || "GET",
      headers: headers,
      credentials: "same-origin",
      body: options.json !== undefined ? JSON.stringify(options.json) : options.body
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (res.status === 401 && path !== "login" && path !== "password") { showLogin(); }
        if (!res.ok) throw new Error(data.error || "Fehler (" + res.status + ")");
        return data;
      });
    });
  }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 3000);
  }
  function setMsg(form, msg) { $(".admin-msg", form).textContent = msg || ""; }
  function busy(form, on) {
    form.querySelectorAll("button, input, textarea").forEach(function (el) { el.disabled = on; });
  }
  function formData(form) {
    var data = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (el.name && el.type !== "file") data[el.name] = el.value;
    });
    return data;
  }

  /* ---------- Ansichten ---------- */
  function showLogin() {
    state.me = null;
    $("#view-app").hidden = true;
    $("#userbar").hidden = true;
    $("#view-login").hidden = false;
    $("#login-user").focus();
  }

  function showApp(me, testUserActive) {
    state.me = me;
    $("#view-login").hidden = true;
    $("#view-app").hidden = false;
    $("#userbar").hidden = false;
    $("#me-name").textContent = me.name || me.username;
    $("#test-warning").hidden = !testUserActive;
    loadNews(); loadGallery(); loadUsers();
  }

  /* ---------- Reiter ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectTab(tab); });
    tab.addEventListener("keydown", function (e) {
      var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      selectTab(next); next.focus();
    });
  });

  /* ---------- Login / Logout ---------- */
  $("#login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.target;
    setMsg(form, ""); busy(form, true);
    api("login", { method: "POST", json: formData(form) })
      .then(function () { form.reset(); return api("me"); })
      .then(function (data) { showApp(data.user, data.testUserActive); })
      .catch(function (err) { setMsg(form, err.message); })
      .then(function () { busy(form, false); });
  });

  $("#logout").addEventListener("click", function () {
    api("logout", { method: "POST" }).catch(function () {}).then(showLogin);
  });

  /* ---------- Bild-Upload (wird vor dem Hochladen verkleinert) ---------- */
  var MAX_SIDE = 2000;
  function shrink(file) {
    if (!window.createImageBitmap || (file.size < 900 * 1024 && file.type !== "image/png")) return Promise.resolve(file);
    return createImageBitmap(file).then(function (bmp) {
      var scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
      var canvas = document.createElement("canvas");
      canvas.width = Math.round(bmp.width * scale);
      canvas.height = Math.round(bmp.height * scale);
      canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
      return new Promise(function (resolve) {
        canvas.toBlob(function (blob) {
          resolve(blob && blob.size < file.size ? new File([blob], "bild.jpg", { type: "image/jpeg" }) : file);
        }, "image/jpeg", 0.85);
      });
    }).catch(function () { return file; });
  }

  function setPreview(form, field, url) {
    form.elements[field].value = url || "";
    $("[data-preview]", form).innerHTML = url ? '<img src="' + esc(imgSrc(url)) + '" alt="Vorschau">' : "";
    var remove = $('[data-remove-image="' + field + '"]', form);
    if (remove) remove.hidden = !url;
  }

  document.querySelectorAll("[data-upload]").forEach(function (input) {
    input.addEventListener("change", function () {
      var file = input.files[0];
      if (!file) return;
      var form = input.form, field = input.getAttribute("data-upload");
      setMsg(form, "");
      $("[data-preview]", form).innerHTML = '<p class="uploading">Bild wird hochgeladen …</p>';
      shrink(file).then(function (small) {
        var body = new FormData();
        body.append("file", small);
        return api("upload", { method: "POST", body: body });
      }).then(function (data) {
        setPreview(form, field, data.url);
      }).catch(function (err) {
        setPreview(form, field, form.elements[field].value);
        setMsg(form, err.message);
      }).then(function () { input.value = ""; });
    });
  });
  document.querySelectorAll("[data-remove-image]").forEach(function (btn) {
    btn.addEventListener("click", function () { setPreview(btn.form, btn.getAttribute("data-remove-image"), ""); });
  });
  document.querySelectorAll("[data-cancel]").forEach(function (btn) {
    btn.addEventListener("click", function () { btn.form.hidden = true; });
  });

  /* ---------- Gemeinsame Editor-Logik ---------- */
  function openEditor(form, title, item, defaults, imageField) {
    form.reset();
    setMsg(form, "");
    form.dataset.id = item ? item.id : "";
    form.querySelector("h3").textContent = title;
    var values = item || defaults;
    Object.keys(values).forEach(function (k) {
      if (form.elements[k] && form.elements[k].type !== "file") form.elements[k].value = values[k] || "";
    });
    setPreview(form, imageField, values[imageField]);
    form.hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    var first = form.querySelector("input:not([type=hidden]):not([type=file]), textarea");
    if (first) first.focus({ preventScroll: true });
  }

  function saveEditor(form, resource, after) {
    var id = form.dataset.id;
    setMsg(form, ""); busy(form, true);
    api(resource + (id ? "/" + id : ""), { method: id ? "PUT" : "POST", json: formData(form) })
      .then(function () { form.hidden = true; toast("Gespeichert – die Webseite ist aktualisiert."); after(); })
      .catch(function (err) { setMsg(form, err.message); })
      .then(function () { busy(form, false); });
  }

  function remove(resource, id, label, after) {
    if (!confirm("„" + label + "“ wirklich löschen?")) return;
    api(resource + "/" + encodeURIComponent(id), { method: "DELETE" })
      .then(function () { toast("Gelöscht."); after(); })
      .catch(function (err) { alert(err.message); });
  }

  function fillDatalist(id, values) {
    var unique = values.filter(function (v, i, all) { return v && all.indexOf(v) === i; });
    $(id).innerHTML = unique.map(function (v) { return '<option value="' + esc(v) + '">'; }).join("");
  }

  /* ---------- Neuigkeiten ---------- */
  var newsForm = $("#news-form");
  function loadNews() {
    api("news").then(function (data) {
      $("#news-sample-hint").hidden = data.items !== null;
      state.news = (data.items || []).slice().sort(function (a, b) { return String(b.datum).localeCompare(String(a.datum)); });
      fillDatalist("#kategorien", ["Verein", "Regatta", "Jugend", "Termine"].concat(state.news.map(function (n) { return n.kategorie; })));
      $("#news-list").innerHTML = state.news.length ? state.news.map(function (n) {
        return '<li class="admin-item">' +
          (n.bild ? '<img class="admin-item__thumb" src="' + esc(imgSrc(n.bild)) + '" alt="">' : '<span class="admin-item__thumb"></span>') +
          '<div><p class="admin-item__title">' + esc(n.titel) + '</p><p class="admin-item__meta">' + esc(formatDate(n.datum)) +
          (n.kategorie ? " · " + esc(n.kategorie) : "") + "</p></div>" +
          '<div class="admin-item__actions"><button class="btn btn--outline btn--sm" data-edit="' + esc(n.id) + '">Bearbeiten</button>' +
          '<button class="btn btn--danger btn--sm" data-delete="' + esc(n.id) + '">Löschen</button></div></li>';
      }).join("") : '<li class="admin-empty">Noch keine eigenen Beiträge.</li>';
    }).catch(function (err) { toast(err.message); });
  }
  $("#news-new").addEventListener("click", function () {
    openEditor(newsForm, "Neuer Beitrag", null, { datum: today() }, "bild");
  });
  newsForm.addEventListener("submit", function (e) { e.preventDefault(); saveEditor(newsForm, "news", loadNews); });
  $("#news-list").addEventListener("click", function (e) {
    var btn = e.target.closest("button"); if (!btn) return;
    var item = state.news.filter(function (n) { return n.id === (btn.dataset.edit || btn.dataset.delete); })[0];
    if (!item) return;
    if (btn.dataset.edit) openEditor(newsForm, "Beitrag bearbeiten", item, {}, "bild");
    else remove("news", item.id, item.titel, loadNews);
  });

  /* ---------- Galerie ---------- */
  var galleryForm = $("#gallery-form");
  function loadGallery() {
    api("gallery").then(function (data) {
      $("#gallery-sample-hint").hidden = data.items !== null;
      state.gallery = data.items || [];
      fillDatalist("#alben", ["Training", "Regatta", "Jugend", "Verein"].concat(state.gallery.map(function (g) { return g.album; })));
      $("#gallery-list").innerHTML = state.gallery.length ? state.gallery.map(function (g) {
        return '<li><img src="' + esc(imgSrc(g.datei)) + '" alt="' + esc(g.alt) + '" loading="lazy">' +
          '<div class="admin-grid__body"><p class="admin-item__title">' + esc(g.bildunterschrift || g.alt) + "</p>" +
          '<p class="admin-item__meta">' + esc(g.album || "ohne Album") + "</p>" +
          '<div class="admin-item__actions"><button class="btn btn--outline btn--sm" data-edit="' + esc(g.id) + '">Bearbeiten</button>' +
          '<button class="btn btn--danger btn--sm" data-delete="' + esc(g.id) + '">Löschen</button></div></div></li>';
      }).join("") : '<li class="admin-empty">Noch keine eigenen Bilder.</li>';
    }).catch(function (err) { toast(err.message); });
  }
  $("#gallery-new").addEventListener("click", function () {
    openEditor(galleryForm, "Bild hinzufügen", null, {}, "datei");
  });
  galleryForm.addEventListener("submit", function (e) { e.preventDefault(); saveEditor(galleryForm, "gallery", loadGallery); });
  $("#gallery-list").addEventListener("click", function (e) {
    var btn = e.target.closest("button"); if (!btn) return;
    var item = state.gallery.filter(function (g) { return g.id === (btn.dataset.edit || btn.dataset.delete); })[0];
    if (!item) return;
    if (btn.dataset.edit) openEditor(galleryForm, "Bild bearbeiten", item, {}, "datei");
    else remove("gallery", item.id, item.bildunterschrift || item.alt, loadGallery);
  });

  /* ---------- Admins ---------- */
  function loadUsers() {
    api("users").then(function (data) {
      $("#test-warning").hidden = !data.testUserActive;
      $("#users-list").innerHTML = data.items.map(function (u) {
        var self = state.me && u.username === state.me.username;
        return '<li class="admin-item admin-item--user"><div><p class="admin-item__title">' + esc(u.name || u.username) +
          (self ? " (du)" : "") + '</p><p class="admin-item__meta">Benutzername: ' + esc(u.username) +
          (u.created ? " · angelegt am " + esc(formatDate(u.created.slice(0, 10))) : "") + "</p></div>" +
          (self ? "" : '<div class="admin-item__actions"><button class="btn btn--danger btn--sm" data-delete="' + esc(u.username) + '">Löschen</button></div>') +
          "</li>";
      }).join("");
    }).catch(function (err) { toast(err.message); });
  }
  $("#users-list").addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-delete]"); if (!btn) return;
    remove("users", btn.dataset.delete, btn.dataset.delete, loadUsers);
  });
  $("#user-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.target;
    setMsg(form, ""); busy(form, true);
    api("users", { method: "POST", json: formData(form) })
      .then(function () { form.reset(); toast("Admin angelegt."); loadUsers(); })
      .catch(function (err) { setMsg(form, err.message); })
      .then(function () { busy(form, false); });
  });

  /* ---------- Mein Konto ---------- */
  $("#password-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.target;
    setMsg(form, ""); busy(form, true);
    api("password", { method: "POST", json: formData(form) })
      .then(function () { form.reset(); toast("Passwort geändert."); })
      .catch(function (err) { setMsg(form, err.message); })
      .then(function () { busy(form, false); });
  });

  /* ---------- Start: bereits angemeldet? ---------- */
  fetch("/api/me", { credentials: "same-origin" }).then(function (res) {
    if (res.status === 404 || !(res.headers.get("content-type") || "").includes("json")) {
      $("#api-missing").hidden = false; showLogin(); return;
    }
    return res.json().then(function (data) {
      if (res.ok && data.user) showApp(data.user, data.testUserActive); else showLogin();
    });
  }).catch(function () { $("#api-missing").hidden = false; showLogin(); });
})();

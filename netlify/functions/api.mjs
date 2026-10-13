/* ==========================================================================
   API des Ruderclubs (Netlify Function, erreichbar unter /api/…)
   --------------------------------------------------------------------------
   Öffentlich (ohne Login):
     GET  /api/news              Neuigkeiten
     GET  /api/gallery           Galerie
     GET  /api/img/:id           hochgeladenes Bild
   Mit Login:
     POST /api/login             { username, password }
     POST /api/logout
     GET  /api/me                angemeldeter Benutzer
     POST   /api/news            Beitrag anlegen
     PUT    /api/news/:id        Beitrag ändern
     DELETE /api/news/:id        Beitrag löschen
     POST   /api/gallery         Bild zur Galerie hinzufügen
     PUT    /api/gallery/:id     Bildangaben ändern
     DELETE /api/gallery/:id     Bild entfernen
     POST   /api/upload          Bild hochladen (multipart, Feld "file")
     GET    /api/users           Admins auflisten
     POST   /api/users           Admin anlegen { username, name, password }
     DELETE /api/users/:username Admin löschen
     POST   /api/password        eigenes Passwort ändern { current, password }
   Schreibende Anfragen benötigen den Header "X-Requested-With: rce-admin"
   (Schutz gegen Anfragen von fremden Webseiten, CSRF).
   ========================================================================== */
import crypto from "node:crypto";
import { getStore } from "../lib/store.mjs";
import {
  clearCookie, currentUser, getUsers, hashPassword, login, publicUser,
  sessionCookie, TEST_USER, validPassword, validUsername,
} from "../lib/auth.mjs";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/* ---------- Antwort-Helfer ---------- */
function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}
const fail = (message, status = 400) => json({ error: message }, status);
const newId = () => Date.now().toString(36) + crypto.randomBytes(4).toString("hex");

/** Text bereinigen und auf Länge begrenzen. */
function text(value, max) {
  return String(value == null ? "" : value).replace(/\r\n/g, "\n").trim().slice(0, max);
}
function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(new Date(value + "T12:00:00"));
}
/** Nur eigene hochgeladene Bilder (/api/img/…) oder Dateien der Webseite (assets/…) zulassen. */
function imagePath(value) {
  const v = text(value, 300);
  return /^(\/api\/img\/[a-z0-9]+|assets\/[\w\-./]+\.(jpe?g|png|webp|svg))$/i.test(v) && !v.includes("..") ? v : "";
}
function uploadedImageId(path) {
  const m = /^\/api\/img\/([a-z0-9]+)$/.exec(path || "");
  return m ? m[1] : null;
}

async function readBody(req) {
  try { return await req.json(); } catch { return null; }
}

/* ---------- Inhalte ---------- */
function cleanNews(input, existing = {}) {
  const item = {
    id: existing.id || newId(),
    datum: text(input.datum, 10),
    titel: text(input.titel, 160),
    kategorie: text(input.kategorie, 40),
    teaser: text(input.teaser, 400),
    text: text(input.text, 10000),
    bild: imagePath(input.bild),
    bildAlt: text(input.bildAlt, 200),
  };
  if (!validDate(item.datum)) return { error: "Bitte ein gültiges Datum angeben." };
  if (!item.titel) return { error: "Bitte einen Titel angeben." };
  if (!item.teaser) return { error: "Bitte einen Kurztext angeben." };
  return { item };
}

function cleanGalleryItem(input, existing = {}) {
  const item = {
    id: existing.id || newId(),
    datei: imagePath(input.datei),
    alt: text(input.alt, 200),
    bildunterschrift: text(input.bildunterschrift, 200),
    album: text(input.album, 40),
  };
  if (!item.datei) return { error: "Bitte ein Bild hochladen." };
  if (!item.alt) return { error: "Bitte eine kurze Bildbeschreibung angeben." };
  return { item };
}

/** Gemeinsame Logik für Listen (Neuigkeiten, Galerie). */
async function handleList(req, store, key, segments, clean, user) {
  const list = await store.getJSON(key); // null = noch nie gespeichert
  const id = segments[1];

  if (req.method === "GET") return json({ items: list });
  if (!user) return fail("Bitte anmelden.", 401);

  const items = list || [];
  if (req.method === "POST" && !id) {
    const body = await readBody(req);
    if (!body) return fail("Ungültige Anfrage.");
    const { item, error } = clean(body);
    if (error) return fail(error);
    items.unshift(item);
    await store.setJSON(key, items);
    return json({ item }, 201);
  }

  const index = items.findIndex((i) => i.id === id);
  if (index < 0) return fail("Eintrag nicht gefunden.", 404);

  if (req.method === "PUT") {
    const body = await readBody(req);
    if (!body) return fail("Ungültige Anfrage.");
    const { item, error } = clean(body, items[index]);
    if (error) return fail(error);
    const oldImage = uploadedImageId(items[index].bild || items[index].datei);
    items[index] = item;
    await store.setJSON(key, items);
    // Ersetztes Bild aufräumen
    if (oldImage && oldImage !== uploadedImageId(item.bild || item.datei)) await store.delete("img/" + oldImage);
    return json({ item });
  }

  if (req.method === "DELETE") {
    const [removed] = items.splice(index, 1);
    await store.setJSON(key, items);
    const imageId = uploadedImageId(removed.bild || removed.datei);
    if (imageId) await store.delete("img/" + imageId);
    return json({ ok: true });
  }

  return fail("Methode nicht erlaubt.", 405);
}

/* ---------- Bilder ---------- */
async function handleUpload(req, store) {
  let form;
  try { form = await req.formData(); } catch { return fail("Ungültiger Upload."); }
  const file = form.get("file");
  if (!file || typeof file === "string") return fail("Keine Datei erhalten.");
  if (!IMAGE_TYPES[file.type]) return fail("Bitte ein JPG-, PNG- oder WebP-Bild hochladen.");
  if (file.size > MAX_UPLOAD_BYTES) return fail("Das Bild ist zu groß (max. 5 MB).");
  const id = newId();
  await store.setBinary("img/" + id, await file.arrayBuffer(), { contentType: file.type });
  return json({ url: "/api/img/" + id }, 201);
}

async function serveImage(store, id) {
  if (!/^[a-z0-9]+$/.test(id || "")) return fail("Nicht gefunden.", 404);
  const res = await store.getBinary("img/" + id);
  if (!res) return fail("Nicht gefunden.", 404);
  const type = IMAGE_TYPES[res.metadata?.contentType] ? res.metadata.contentType : "application/octet-stream";
  return new Response(res.data, {
    headers: {
      "content-type": type,
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
    },
  });
}

/* ---------- Admins ---------- */
async function handleUsers(req, store, segments, user) {
  const users = await getUsers(store);

  if (req.method === "GET") {
    return json({ items: users.map(publicUser), testUserActive: users.some((u) => u.username === TEST_USER) });
  }

  if (req.method === "POST") {
    const body = await readBody(req);
    if (!body) return fail("Ungültige Anfrage.");
    const username = String(body.username || "").trim().toLowerCase();
    if (!validUsername(username)) return fail("Benutzername: 3–60 Zeichen, nur Kleinbuchstaben, Ziffern und . _ - @");
    if (!validPassword(body.password)) return fail("Das Passwort muss mindestens 4 Zeichen lang sein.");
    if (users.some((u) => u.username === username)) return fail("Diesen Benutzernamen gibt es bereits.");
    const { salt, hash } = await hashPassword(body.password);
    const created = { username, name: text(body.name, 80), salt, hash, created: new Date().toISOString(), createdBy: user.username };
    users.push(created);
    await store.setJSON("users", users);
    return json({ item: publicUser(created) }, 201);
  }

  if (req.method === "DELETE") {
    const target = decodeURIComponent(segments[1] || "");
    if (target === user.username) return fail("Du kannst dich nicht selbst löschen.");
    if (users.length <= 1) return fail("Der letzte Admin kann nicht gelöscht werden.");
    const rest = users.filter((u) => u.username !== target);
    if (rest.length === users.length) return fail("Admin nicht gefunden.", 404);
    await store.setJSON("users", rest);
    return json({ ok: true });
  }

  return fail("Methode nicht erlaubt.", 405);
}

async function handlePassword(req, store, user) {
  const body = await readBody(req);
  if (!body) return fail("Ungültige Anfrage.");
  const check = await login(store, user.username, body.current);
  if (check.error) return fail("Das aktuelle Passwort ist falsch.", 400);
  if (!validPassword(body.password)) return fail("Das neue Passwort muss mindestens 4 Zeichen lang sein.");
  const users = await getUsers(store);
  const me = users.find((u) => u.username === user.username);
  Object.assign(me, await hashPassword(body.password));
  await store.setJSON("users", users);
  // Neue Sitzung ausstellen (alte Sitzungen werden ungültig)
  return json({ ok: true }, 200, { "set-cookie": await sessionCookie(req, store, me) });
}

/* ---------- Router ---------- */
export default async (req) => {
  const url = new URL(req.url);
  const segments = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  const route = segments[0] || "";

  try {
    const store = await getStore();

    // Öffentliche Routen
    if (req.method === "GET" && route === "img") return serveImage(store, segments[1]);
    if (req.method === "GET" && route === "news") return handleList(req, store, "news", segments, cleanNews, null);
    if (req.method === "GET" && route === "gallery") return handleList(req, store, "gallery", segments, cleanGalleryItem, null);

    // Ab hier: CSRF-Schutz für alle schreibenden Anfragen
    if (req.method !== "GET" && req.headers.get("x-requested-with") !== "rce-admin") {
      return fail("Anfrage abgelehnt.", 403);
    }

    if (req.method === "POST" && route === "login") {
      const body = (await readBody(req)) || {};
      const result = await login(store, body.username, body.password);
      if (result.error) return fail(result.error, result.status);
      return json({ user: publicUser(result.user) }, 200, { "set-cookie": await sessionCookie(req, store, result.user) });
    }
    if (req.method === "POST" && route === "logout") {
      return json({ ok: true }, 200, { "set-cookie": clearCookie(req) });
    }

    const user = await currentUser(req, store);
    if (!user) return fail("Bitte anmelden.", 401);

    switch (route) {
      case "me": {
        const users = await getUsers(store);
        return json({ user: publicUser(user), testUserActive: users.some((u) => u.username === TEST_USER) });
      }
      case "news": return handleList(req, store, "news", segments, cleanNews, user);
      case "gallery": return handleList(req, store, "gallery", segments, cleanGalleryItem, user);
      case "upload": return req.method === "POST" ? handleUpload(req, store) : fail("Methode nicht erlaubt.", 405);
      case "users": return handleUsers(req, store, segments, user);
      case "password": return req.method === "POST" ? handlePassword(req, store, user) : fail("Methode nicht erlaubt.", 405);
      default: return fail("Nicht gefunden.", 404);
    }
  } catch (err) {
    console.error(err);
    return fail("Interner Fehler. Bitte später erneut versuchen.", 500);
  }
};

export const config = { path: "/api/*" };

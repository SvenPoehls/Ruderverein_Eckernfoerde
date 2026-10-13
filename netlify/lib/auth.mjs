/* ==========================================================================
   Anmeldung & Benutzer
   --------------------------------------------------------------------------
   - Passwörter werden nie im Klartext gespeichert, sondern mit scrypt
     (Salt + Hash) abgelegt.
   - Nach dem Login erhält der Browser ein signiertes Sitzungs-Cookie
     (HttpOnly, SameSite=Strict, 8 Stunden gültig).
   - Nach 5 falschen Passwörtern wird ein Konto 15 Minuten gesperrt.
   - Gibt es noch keinen Benutzer, wird der Testzugang test / test angelegt.
     Er sollte gelöscht werden, sobald ein eigenes Konto existiert.
   ========================================================================== */
import crypto from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(crypto.scrypt);

export const COOKIE_NAME = "rce_session";
const SESSION_SECONDS = 8 * 60 * 60;
const MAX_FAILS = 5;
const LOCK_MINUTES = 15;
export const TEST_USER = "test";

/* ---------- Passwörter ---------- */
export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = (await scrypt(password, salt, 64)).toString("hex");
  return { salt, hash };
}

async function verifyPassword(password, user) {
  const hash = await scrypt(password, user.salt, 64);
  const stored = Buffer.from(user.hash, "hex");
  return stored.length === hash.length && crypto.timingSafeEqual(stored, hash);
}

/* ---------- Benutzerliste ---------- */
export async function getUsers(store) {
  let users = await store.getJSON("users");
  if (!users || !users.length) {
    // Erststart: Testzugang anlegen
    const { salt, hash } = await hashPassword("test");
    users = [{ username: TEST_USER, name: "Testzugang", salt, hash, created: new Date().toISOString() }];
    await store.setJSON("users", users);
  }
  return users;
}

export function publicUser(u) {
  return { username: u.username, name: u.name || "", created: u.created };
}

export function validUsername(name) {
  return typeof name === "string" && /^[a-z0-9._@-]{3,60}$/.test(name);
}
export function validPassword(pw) {
  return typeof pw === "string" && pw.length >= 4 && pw.length <= 200;
}

/* ---------- Geheimschlüssel für Sitzungen ----------
   Bevorzugt aus der Umgebungsvariable SESSION_SECRET (Netlify → Site
   configuration → Environment variables). Sonst wird einmalig ein
   zufälliger Schlüssel erzeugt und im Speicher abgelegt. */
async function getSecret(store) {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  let cfg = await store.getJSON("config");
  if (!cfg || !cfg.secret) {
    cfg = { ...(cfg || {}), secret: crypto.randomBytes(32).toString("hex") };
    await store.setJSON("config", cfg);
  }
  return cfg.secret;
}

const b64url = (buf) => Buffer.from(buf).toString("base64url");

async function sign(store, payload) {
  const body = b64url(JSON.stringify(payload));
  const mac = crypto.createHmac("sha256", await getSecret(store)).update(body).digest("base64url");
  return body + "." + mac;
}

async function verify(store, token) {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const [body, mac] = token.split(".");
  const expected = crypto.createHmac("sha256", await getSecret(store)).update(body).digest("base64url");
  const a = Buffer.from(mac || ""), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch { return null; }
}

/* ---------- Cookies ---------- */
function readCookie(req, name) {
  const header = req.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

function cookieFlags(req) {
  // Lokal (http://localhost) ohne "Secure", online immer mit
  const insecure = new URL(req.url).protocol === "http:";
  return "Path=/; HttpOnly; SameSite=Strict" + (insecure ? "" : "; Secure");
}

export async function sessionCookie(req, store, user) {
  // "pv" (Passwort-Version) macht alte Sitzungen nach Passwortwechsel ungültig
  const token = await sign(store, { u: user.username, pv: user.hash.slice(0, 12), exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS });
  return `${COOKIE_NAME}=${token}; ${cookieFlags(req)}; Max-Age=${SESSION_SECONDS}`;
}

export function clearCookie(req) {
  return `${COOKIE_NAME}=; ${cookieFlags(req)}; Max-Age=0`;
}

/** Liefert den angemeldeten Benutzer oder null. */
export async function currentUser(req, store) {
  const payload = await verify(store, readCookie(req, COOKIE_NAME));
  if (!payload) return null;
  const users = await getUsers(store);
  const user = users.find((u) => u.username === payload.u);
  // Benutzer gelöscht oder Passwort geändert → Sitzung ungültig
  if (!user || user.hash.slice(0, 12) !== payload.pv) return null;
  return user;
}

/* ---------- Login mit Sperre nach Fehlversuchen ---------- */
export async function login(store, username, password) {
  username = String(username || "").trim().toLowerCase();
  const failKey = "loginfail/" + crypto.createHash("sha256").update(username).digest("hex").slice(0, 32);
  const fails = (await store.getJSON(failKey)) || { count: 0, until: 0 };
  if (fails.until > Date.now()) {
    return { error: `Zu viele Fehlversuche. Bitte in ${Math.ceil((fails.until - Date.now()) / 60000)} Minuten erneut versuchen.`, status: 429 };
  }

  const users = await getUsers(store);
  const user = users.find((u) => u.username === username);
  const ok = user ? await verifyPassword(String(password || ""), user) : (await hashPassword("x"), false); // gleiche Rechenzeit

  if (!ok) {
    const count = fails.count + 1;
    await store.setJSON(failKey, count >= MAX_FAILS
      ? { count: 0, until: Date.now() + LOCK_MINUTES * 60000 }
      : { count, until: 0 });
    return { error: "Benutzername oder Passwort ist falsch.", status: 401 };
  }
  if (fails.count) await store.delete(failKey);
  return { user };
}

/* ==========================================================================
   Lokaler Testserver (ohne Netlify-Konto, ohne Installation)
   --------------------------------------------------------------------------
   Start:  npm start   (oder: node tools/dev-server.mjs)
   Dann:   http://localhost:8888  –  Admin-Bereich: http://localhost:8888/admin/
   Liefert den Ordner site/ aus und leitet /api/… an die Netlify Function
   weiter. Daten landen lokal im Ordner .data/ (nicht im Git).
   ========================================================================== */
import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteDir = path.join(root, "site");
process.env.LOCAL_STORE_DIR ||= path.join(root, ".data");
const port = Number(process.env.PORT) || 8888;

const { default: api } = await import("../netlify/functions/api.mjs");

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".woff2": "font/woff2", ".json": "application/json", ".pdf": "application/pdf",
};

async function serveStatic(req, res) {
  let pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (pathname.endsWith("/")) pathname += "index.html";
  const file = path.join(siteDir, pathname);
  if (!file.startsWith(siteDir)) { res.writeHead(403).end(); return; }
  try {
    const data = await fs.readFile(file);
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch {
    // Ordner ohne Schrägstrich → weiterleiten, sonst 404-Seite
    try {
      if ((await fs.stat(file)).isDirectory()) { res.writeHead(301, { location: pathname + "/" }).end(); return; }
    } catch {}
    res.writeHead(404, { "content-type": TYPES[".html"] });
    res.end(await fs.readFile(path.join(siteDir, "404.html")));
  }
}

async function serveApi(req, res) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const request = new Request(`http://localhost:${port}${req.url}`, {
    method: req.method,
    headers: req.headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : body,
  });
  const response = await api(request);
  const headers = {};
  response.headers.forEach((v, k) => { headers[k] = v; });
  res.writeHead(response.status, headers);
  res.end(Buffer.from(await response.arrayBuffer()));
}

http.createServer((req, res) => {
  const handler = req.url.startsWith("/api/") ? serveApi : serveStatic;
  handler(req, res).catch((err) => {
    console.error(err);
    if (!res.headersSent) res.writeHead(500);
    res.end("Fehler");
  });
}).listen(port, () => {
  console.log(`Ruderclub-Webseite: http://localhost:${port}`);
  console.log(`Admin-Bereich:      http://localhost:${port}/admin/  (Erststart: test / test)`);
});

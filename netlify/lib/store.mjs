/* ==========================================================================
   Datenspeicher
   --------------------------------------------------------------------------
   Online (Netlify): Netlify Blobs – ein Schlüssel-Wert-Speicher, der ohne
   eigene Datenbank auskommt. Lokal (tools/dev-server.mjs): einfache Dateien
   im Ordner aus LOCAL_STORE_DIR. Beide bieten dieselben vier Funktionen.
   ========================================================================== */
import { promises as fs } from "node:fs";
import path from "node:path";

const STORE_NAME = "ruderclub";

/** Lokaler Speicher: jeder Schlüssel wird zu einer Datei (+ .meta.json). */
function fileStore(dir) {
  const file = (key) => path.join(dir, encodeURIComponent(key));
  return {
    async getJSON(key) {
      try { return JSON.parse(await fs.readFile(file(key), "utf8")); }
      catch (e) { if (e.code === "ENOENT") return null; throw e; }
    },
    async setJSON(key, value) {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(file(key), JSON.stringify(value, null, 2));
    },
    async getBinary(key) {
      try {
        const data = await fs.readFile(file(key));
        const metadata = JSON.parse(await fs.readFile(file(key) + ".meta.json", "utf8"));
        return { data, metadata };
      } catch (e) { if (e.code === "ENOENT") return null; throw e; }
    },
    async setBinary(key, data, metadata) {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(file(key), Buffer.from(data));
      await fs.writeFile(file(key) + ".meta.json", JSON.stringify(metadata));
    },
    async delete(key) {
      await fs.rm(file(key), { force: true });
      await fs.rm(file(key) + ".meta.json", { force: true });
    },
  };
}

/** Netlify Blobs (Region Frankfurt, starke Konsistenz = Änderungen sofort sichtbar). */
async function blobStore() {
  const { getStore } = await import("@netlify/blobs");
  const store = getStore(STORE_NAME, {
    consistency: "strong",
    region: process.env.BLOBS_REGION || "eu-central-1",
  });
  return {
    getJSON: (key) => store.get(key, { type: "json" }),
    setJSON: (key, value) => store.setJSON(key, value),
    async getBinary(key) {
      const res = await store.getWithMetadata(key, { type: "arrayBuffer" });
      return res ? { data: res.data, metadata: res.metadata } : null;
    },
    setBinary: (key, data, metadata) => store.set(key, data, { metadata }),
    delete: (key) => store.delete(key),
  };
}

let cached;
export async function getStore() {
  if (!cached) {
    cached = process.env.LOCAL_STORE_DIR ? fileStore(process.env.LOCAL_STORE_DIR) : await blobStore();
  }
  return cached;
}

// Conexión con la hoja de la comunidad (Apps Script, ver apps-script/Code.gs).
// Sin config.api funciona en modo demostración: las mismas acciones, guardadas en este navegador.
import { applySettings, config } from "./config.js";
import { cleanSettings, text } from "./settings.js";
import { demoData } from "./data/demo.js";
import { layout } from "./layouts/index.js";

export const demo = !config.api;

// Datos públicos que pinta la web.
export const data = { doors: [], kids: [] };

export class ApiError extends Error {
  constructor(code) { super(code); this.code = code; }
}

export async function api(action, body = {}) {
  if (demo) return local(action, body);
  let res;
  try {
    // text/plain evita la petición previa de CORS, que Apps Script no admite.
    res = await fetch(config.api, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action, ...body }) });
  } catch {
    throw new ApiError("network");
  }
  if (!res.ok) throw new ApiError("network");
  const out = await res.json();
  if (out.error) throw new ApiError(out.error);
  return out;
}

// Ajustes + puertas + peques. Se guardan en el navegador para pintar al instante la próxima visita.
const CACHE = `halloween-cache-${config.api}`;
const set = new URLSearchParams(location.search).get("layout") === "houses" ? "houses" : "buildings";

function use(out) {
  applySettings(out.settings);
  data.doors = out.doors.filter((d) => layout().fits(d));
  data.kids = out.kids;
}

export function loadCached() {
  if (demo) return false;
  try {
    const out = JSON.parse(localStorage.getItem(CACHE));
    if (out) { use(out); return true; }
  } catch {}
  return false;
}

export async function loadPublic() {
  const out = await api("public");
  use(out);
  try { localStorage.setItem(CACHE, JSON.stringify(out)); } catch {}
}

// ---------- Modo demostración ----------
// Imita apps-script/Code.gs (mismas acciones, límites y errores). Clave del gestor: "demo".
// ?layout=houses abre la demo de casas (otro conjunto de datos).
const KEY = `halloween-demo2-${set}`;
const LIMITS = { alias: 40, age: 20, allergy: 80 };
const TAGS = ["gluten", "nuts", "lactose", "egg"];

function store() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) return saved;
  } catch {}
  const seed = structuredClone(demoData[set]);
  seed.kids = seed.kids.map((k, i) => ({ ...k, id: `demo${i}`, token: `demo${i}` }));
  return seed;
}

function save(db) {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {}
}

const cleanKid = (b) => ({ alias: text(b.alias, LIMITS.alias), age: text(b.age, LIMITS.age), allergy: text(b.allergy, LIMITS.allergy) });
const publicKid = ({ alias, age, allergy }) => ({ alias, age, allergy });
const random = () => Math.random().toString(36).slice(2, 10);

function local(action, b) {
  const db = store();
  const own = () => {
    const kid = db.kids.find((k) => k.id === b.id && k.token === b.token);
    if (!kid) throw new ApiError("notfound");
    return kid;
  };
  const admin = () => { if (b.key !== "demo") throw new ApiError("auth"); };

  switch (action) {
    case "public":
      return { settings: db.settings, doors: db.doors, kids: db.kids.map(publicKid) };
    case "kidCreate": {
      const kid = cleanKid(b);
      if (!kid.alias) throw new ApiError("invalid");
      const row = { ...kid, id: random(), token: random() + random() };
      db.kids.push(row);
      save(db);
      return { id: row.id, token: row.token };
    }
    case "kidGet":
      return publicKid(own());
    case "kidUpdate": {
      const kid = cleanKid(b);
      if (!kid.alias) throw new ApiError("invalid");
      Object.assign(own(), kid);
      save(db);
      return { ok: true };
    }
    case "kidDelete":
      own();
      db.kids = db.kids.filter((k) => k.id !== b.id);
      save(db);
      return { ok: true };
    case "adminCheck":
      admin();
      return { ok: true };
    case "adminKids":
      admin();
      return { kids: db.kids.map(({ id, alias, age, allergy }) => ({ id, alias, age, allergy })) };
    case "adminKidDelete":
      admin();
      db.kids = db.kids.filter((k) => k.id !== b.id);
      save(db);
      return { ok: true };
    case "adminSave":
      admin();
      if (b.settings) db.settings = cleanSettings(b.settings);
      if (b.doors) {
        db.doors = b.doors.map((d) => ({
          id: text(d.id, 80), street: text(d.street, 60), number: text(d.number, 10),
          tags: (d.tags || []).filter((tag) => TAGS.includes(tag)),
        })).filter((d) => d.id);
      }
      save(db);
      return { ok: true };
    default:
      throw new ApiError("invalid");
  }
}

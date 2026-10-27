// Conexión con la hoja de la comunidad (Apps Script, ver apps-script/Code.gs).
// Sin config.api funciona en modo demostración: las mismas acciones, guardadas en este navegador.
import { config } from "./config.js";
import { kind } from "./layouts/index.js";
import { demoDoors, demoKids } from "./data/demo.js";

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

export async function loadPublic() {
  const out = await api("public");
  data.doors = out.doors;
  data.kids = out.kids;
}

// ---------- Modo demostración ----------
// Imita apps-script/Code.gs (mismas acciones, límites y errores). Clave del gestor: "demo".
const KEY = `halloween-demo-${kind}`;
const LIMITS = { alias: 40, age: 20, allergy: 80 };
const TAGS = ["gluten", "nuts", "lactose", "egg"];

function store() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) return saved;
  } catch {}
  return { doors: demoDoors[kind], kids: demoKids.map((k, i) => ({ ...k, id: `demo${i}`, token: `demo${i}` })) };
}

function save(db) {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {}
}

const text = (v, max) => String(v ?? "").trim().replace(/^[=+\-@]+/, "").slice(0, max);
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
      return { doors: db.doors, kids: db.kids.map(publicKid) };
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
    case "adminDoorsSave":
      admin();
      db.doors = (b.doors || []).map((d) => ({
        id: text(d.id, 80), street: text(d.street, 60), number: text(d.number, 10),
        tags: (d.tags || []).filter((tag) => TAGS.includes(tag)),
      })).filter((d) => d.id);
      save(db);
      return { ok: true };
    default:
      throw new ApiError("invalid");
  }
}

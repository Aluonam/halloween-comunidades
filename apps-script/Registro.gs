// Registro de la plataforma (solo del propietario): invitaciones y comunidades dadas de alta.
// No guarda datos de vecinos ni de peques: esos están en la hoja de cada comunidad.
// Guía de instalación: docs/PROPIETARIO.md.

// 🔑 Clave maestra de superadmin.html. Cámbiala por una larga (mínimo 12 caracteres) y solo tuya antes de implementar.
const MASTER_KEY = "cambia-esta-clave-maestra";

// URL válida de la hoja de una comunidad (aplicación web de Apps Script).
const API_PATTERN = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]{20,}\/exec$/;
const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/;
const RESERVED = ["demo", "admin", "crear", "superadmin", "privacidad", "www"];

const INVITES = { name: "invitaciones", cols: ["codigo", "creada", "caduca", "usada", "comunidad"] };
const COMMUNITIES = { name: "comunidades", cols: ["direccion", "nombre", "hoja", "creada", "activa", "invitacion"] };

// ---------- Entrada ----------

function doPost(e) {
  const lock = LockService.getScriptLock();
  let out;
  let slow = false;
  try {
    const req = JSON.parse(e.postData.contents);
    lock.waitLock(10000);
    out = handle(req);
  } catch (err) {
    out = { error: err.code || "server" };
    slow = !!err.slow;
    if (!err.code) console.error(err);
  } finally {
    lock.releaseLock();
  }
  // Frena a quien intente adivinar claves, sin dejar la hoja bloqueada a los demás mientras espera.
  if (slow) Utilities.sleep(1000);
  return json(out);
}

const ACTIONS = {
  // Web pública: ?c=direccion → hoja de esa comunidad.
  resolve(r) {
    const c = communities().find((x) => x.slug === r.slug && x.active);
    if (!c) fail("notfound");
    return { name: c.name, api: c.api };
  },

  // Asistente de alta.
  inviteCheck(r) {
    validInvite(r.inv);
    return { ok: true };
  },
  register(r) {
    const invite = validInvite(r.inv);
    const slug = String(r.slug || "").trim().toLowerCase();
    const name = text(r.name, 60);
    const api = String(r.api || "").trim();
    if (!SLUG_PATTERN.test(slug) || RESERVED.includes(slug)) fail("badslug");
    if (!name) fail("invalid");
    if (!API_PATTERN.test(api)) fail("badapi");
    const list = communities();
    if (list.some((c) => c.slug === slug)) fail("slugtaken");
    if (list.some((c) => c.api === api)) fail("apitaken");

    // La hoja tiene que responder como una hoja de Halloween y tener ya su gestor.
    let ping;
    try {
      const res = UrlFetchApp.fetch(api, { method: "post", contentType: "text/plain", payload: JSON.stringify({ action: "ping" }), muteHttpExceptions: true, followRedirects: true });
      ping = JSON.parse(res.getContentText());
    } catch (err) {
      fail("badapi");
    }
    if (!ping || ping.app !== "halloween") fail("badapi");
    if (!ping.claimed) fail("unclaimed");

    table(COMMUNITIES).appendRow([slug, name, api, new Date().toISOString(), "sí", invite.code]);
    table(INVITES).getRange(invite.row, 4, 1, 2).setValues([[new Date().toISOString(), slug]]);
    return { ok: true, slug };
  },

  // Propietario (superadmin.html).
  ownerList(r) {
    owner(r);
    const now = Date.now();
    return {
      invites: invites().map((i) => ({ code: i.code, created: i.created, expires: i.expires, used: !!i.used, community: i.community, expired: !i.used && Date.parse(i.expires) < now })),
      communities: communities().map(({ slug, name, created, active }) => ({ slug, name, created, active })),
    };
  },
  ownerInvite(r) {
    owner(r);
    const days = Math.min(365, Math.max(1, parseInt(r.days, 10) || 30));
    const hex = Utilities.getUuid().replace(/-/g, "").toUpperCase();
    const code = `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
    const expires = new Date(Date.now() + days * 864e5);
    table(INVITES).appendRow([code, new Date().toISOString(), expires.toISOString(), "", ""]);
    return { code, expires: expires.toISOString() };
  },
  ownerRevoke(r) {
    owner(r);
    const i = invites().find((x) => x.code === r.code && !x.used);
    if (!i) fail("notfound");
    table(INVITES).deleteRow(i.row);
    return { ok: true };
  },
  ownerToggle(r) {
    owner(r);
    const c = communities().find((x) => x.slug === r.slug);
    if (!c) fail("notfound");
    table(COMMUNITIES).getRange(c.row, 5).setValue(r.active ? "sí" : "no");
    return { ok: true };
  },
};

function handle(req) {
  const action = ACTIONS[req && req.action];
  if (!action) fail("invalid");
  return action(req);
}

// ---------- Datos ----------

function invites() {
  return rows(INVITES).map(([code, created, expires, used, community], i) => ({ code, created, expires, used, community, row: i + 2 }));
}

function communities() {
  return rows(COMMUNITIES).map(([slug, name, api, created, active], i) => ({ slug, name, api, created, active: active === "sí", row: i + 2 }));
}

function validInvite(code) {
  const i = invites().find((x) => x.code === String(code || "").trim().toUpperCase());
  if (!i || i.used || Date.parse(i.expires) < Date.now()) {
    fail("badinvite", true);
  }
  return i;
}

function owner(r) {
  // Sin cambiar, o demasiado corta, no abre nada.
  if (MASTER_KEY === "cambia-esta-clave-maestra" || MASTER_KEY.length < 12 || r.key !== MASTER_KEY) fail("auth", true);
}

function text(v, max) {
  return String(v == null ? "" : v).trim().replace(/^[=+\-@]+/, "").slice(0, max);
}

// ---------- Hoja ----------

function table(t) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(t.name);
  if (!sh) {
    sh = ss.insertSheet(t.name);
    sh.getRange(1, 1, 1, t.cols.length).setValues([t.cols]).setFontWeight("bold");
    sh.setFrozenRows(1);
    sh.getRange("A:F").setNumberFormat("@");
  }
  return sh;
}

function rows(t) {
  const sh = table(t);
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, t.cols.length).getDisplayValues();
}

// slow = la respuesta espera 1 s (intento fallido de clave o invitación).
function fail(code, slow) {
  const err = new Error(code);
  err.code = code;
  err.slow = !!slow;
  throw err;
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

// Ejecútala una vez desde el editor (▶ Ejecutar) para crear las pestañas y dar permisos.
function setup() {
  table(INVITES);
  table(COMMUNITIES);
  UrlFetchApp.fetch("https://script.google.com", { muteHttpExceptions: true }); // pide el permiso de conexiones externas
}

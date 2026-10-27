// Asistente de alta: con una invitación (crear.html?inv=CODIGO), quien organiza copia la hoja plantilla,
// la publica, elige dirección y clave, y su comunidad queda registrada. Solo en español.
import { config, SETTINGS } from "./config.js";
import { registry, sheet } from "./api.js";
import { cleanSettings } from "./settings.js";
import { qrSvg } from "./share.js";
import { esc } from "./sections/ui.js";

const root = document.getElementById("crear");
const inv = (new URLSearchParams(location.search).get("inv") || "").trim().toUpperCase();
const base = `${location.origin}${location.pathname.replace(/[^/]*$/, "")}`;
const API_PATTERN = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]{20,}\/exec$/;
const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/;

const ERRORS = {
  badinvite: "Esta invitación no es válida, ya se ha usado o ha caducado. Pide otra a quien te la envió.",
  network: "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.",
  badapi: "Esa URL no responde como una hoja de Halloween. Revisa que hayas publicado la hoja (paso 2) y que la URL acabe en /exec.",
  apitaken: "Esa hoja ya está dada de alta en otra comunidad.",
  slugtaken: "Esa dirección ya la usa otra comunidad. Elige otra.",
  badslug: "La dirección solo puede tener minúsculas, números y guiones (3 a 40 caracteres).",
  unclaimed: "La hoja no tiene clave de gestor. Vuelve a intentarlo.",
  auth: "Esta hoja ya tiene gestor y la clave no coincide. Escribe la clave que pusiste la primera vez.",
  weakkey: "La clave debe tener al menos 6 caracteres.",
};
const errorText = (e) => ERRORS[e.code] || `Algo ha fallado (${e.code || e.message}). Inténtalo de nuevo.`;

// "Residencial Los Olmos" → "residencial-los-olmos"
const slugify = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40).replace(/-+$/, "");

let sheetOk = false;  // la URL de la hoja respondió bien
let slugTouched = false;
let busy = false;

function page(body) {
  root.innerHTML = `
    <header class="admin-head">
      <h1>🎃 Crea la web de tu comunidad</h1>
    </header>
    ${body}`;
}

function form() {
  page(`
    <p class="intro">Tendrás tu propia web de Halloween: recorrido de truco o trato con acertijos, inscripción de peques y un panel para gestionarlo.
      <b>Los datos de tu comunidad se guardan en tu propia hoja de Google</b>; necesitas una cuenta de Google. Son unos 5 minutos.</p>

    <ol class="steps">
      <li class="card">
        <h2>Copia tu hoja</h2>
        <p>Se creará en tu Google Drive una hoja con todo lo necesario.</p>
        ${config.templateSheet
          ? `<a class="btn" href="${esc(config.templateSheet)}" target="_blank" rel="noopener">📄 Copiar mi hoja</a>`
          : `<p class="warn">Falta configurar la hoja plantilla de la plataforma (config.templateSheet).</p>`}
        <p class="help">Google te preguntará «¿Quieres hacer una copia?» → <b>Hacer una copia</b>.</p>
      </li>

      <li class="card">
        <h2>Actívala y publícala</h2>
        <ol class="howto">
          <li>En tu hoja nueva, menú <b>🎃 Halloween → 1. Activar la hoja</b> (si no lo ves, recarga la página). Google pedirá permisos: <b>Continuar</b> → elige tu cuenta → <b>Configuración avanzada → Ir a…</b> → <b>Permitir</b>. Es tu propia hoja.</li>
          <li><b>Extensiones → Apps Script</b>.</li>
          <li>Arriba a la derecha: <b>Implementar → Nueva implementación</b> → en ⚙️ elige <b>Aplicación web</b>.</li>
          <li>Ejecutar como: <b>Yo</b> · Quién tiene acceso: <b>Cualquier usuario</b> → <b>Implementar</b>.</li>
          <li>Copia la <b>URL de la aplicación web</b> (acaba en <code>/exec</code>) y pégala aquí:</li>
        </ol>
        <form id="check" class="inline-form">
          <input name="api" type="url" required placeholder="https://script.google.com/macros/s/…/exec" aria-label="URL de la aplicación web" autocomplete="off">
          <button class="btn alt">Comprobar</button>
        </form>
        <p class="check-result" aria-live="polite"></p>
      </li>

      <li class="card">
        <h2>Tu comunidad</h2>
        <form id="create">
          <label>Nombre de la comunidad<input name="name" required maxlength="60" placeholder="Residencial Los Olmos" autocomplete="off"></label>
          <label>Dirección de tu web<input name="slug" required maxlength="40" placeholder="los-olmos" autocomplete="off"></label>
          <p class="help preview">${esc(base)}?c=<b class="slug-preview">…</b></p>
          <div class="grid">
            <label>Clave del gestor<input name="key" type="password" required minlength="6" autocomplete="new-password"></label>
            <label>Repite la clave<input name="key2" type="password" required minlength="6" autocomplete="new-password"></label>
          </div>
          <p class="help">Con esta clave entrarás al panel del gestor. Si la olvidas, puedes cambiarla desde tu hoja (menú 🎃 Halloween).</p>
          <button class="btn" ${busy ? "disabled" : ""}>${busy ? "Creando…" : "🎃 Crear mi web"}</button>
          <p class="error create-error" aria-live="polite"></p>
        </form>
      </li>
    </ol>`);
}

function done(slug, name) {
  const link = `${base}?c=${slug}`;
  const admin = `${base}admin.html?c=${slug}`;
  page(`
    <section class="card done">
      <h2>¡Lista! 🎉</h2>
      <p><b>${esc(name)}</b> ya tiene su web de Halloween.</p>
      <p>Web para los vecinos:<br><a href="${esc(link)}" target="_blank">${esc(link)}</a></p>
      <p>Tu panel de gestor (guárdalo):<br><a href="${esc(admin)}">${esc(admin)}</a></p>
      <div class="qr">${qrSvg(link)}</div>
      <a class="btn alt" download="qr-halloween.svg" href="data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrSvg(link))}">⬇️ Descargar QR</a>
      <a class="btn" href="${esc(admin)}">🧙 Ir al panel y configurar la fiesta</a>
      <p class="help">En el panel pon la fecha, si sois edificios o casas, los portales o calles… y quién reparte chuches.</p>
    </section>`);
}

const result = (text, ok) => {
  const el = root.querySelector(".check-result");
  el.textContent = text;
  el.className = `check-result ${ok ? "ok" : "error"}`;
};

async function checkSheet(url) {
  sheetOk = false;
  if (!API_PATTERN.test(url)) return result("La URL debe empezar por https://script.google.com/macros/s/ y acabar en /exec.", false), null;
  result("Comprobando…", true);
  try {
    const ping = await sheet(url, "ping");
    if (ping.app !== "halloween") throw Object.assign(new Error(), { code: "badapi" });
    sheetOk = true;
    result(ping.claimed ? "✓ Hoja conectada (ya tiene clave de gestor: usa la misma abajo)." : "✓ Hoja conectada.", true);
    return ping;
  } catch (e) {
    result(errorText(e.code === "network" ? { code: "badapi" } : e), false);
    return null;
  }
}

root.addEventListener("input", (e) => {
  const f = root.querySelector("#create");
  if (!f) return;
  if (e.target.name === "slug") slugTouched = true;
  if (e.target.name === "name" && !slugTouched) f.slug.value = slugify(f.name.value);
  root.querySelector(".slug-preview").textContent = f.slug.value || "…";
});

root.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;
  if (f.id === "check") return checkSheet(f.api.value.trim());
  if (f.id !== "create" || busy) return;

  const fail = (text) => { root.querySelector(".create-error").textContent = text; };
  const url = root.querySelector("#check [name=api]").value.trim();
  const name = f.name.value.trim();
  const slug = f.slug.value.trim().toLowerCase();
  const key = f.key.value;
  if (!sheetOk) return fail("Primero pega y comprueba la URL de tu hoja (paso 2).");
  if (!SLUG_PATTERN.test(slug) || slug === "demo") return fail(ERRORS.badslug);
  if (key.length < 6) return fail(ERRORS.weakkey);
  if (key !== f.key2.value) return fail("Las dos claves no coinciden.");

  busy = true;
  const button = f.querySelector(".btn");
  button.disabled = true;
  button.textContent = "Creando…";
  fail("");
  try {
    // 1. La clave del gestor queda guardada (cifrada) en su hoja.
    const ping = await sheet(url, "ping");
    if (ping.claimed) await sheet(url, "adminCheck", { key });
    else await sheet(url, "claim", { key });
    // 2. Alta en el registro (gasta la invitación).
    await registry("register", { inv, slug, name, api: url });
    // 3. Ajustes de partida con su nombre (si la hoja aún no tiene).
    const pub = await sheet(url, "public");
    if (!pub.settings) {
      const start = Object.fromEntries(SETTINGS.map((k) => [k, config[k]]));
      await sheet(url, "adminSave", { key, settings: cleanSettings({ ...start, community: name }) });
    }
    try { sessionStorage.setItem(`halloween-admin-${slug}`, key); } catch {}
    done(slug, name);
  } catch (err) {
    busy = false;
    button.disabled = false;
    button.textContent = "🎃 Crear mi web";
    fail(errorText(err));
  }
});

async function start() {
  if (!inv) return page(`<section class="card"><p>${ERRORS.badinvite}</p></section>`);
  page(`<p class="loading">Comprobando la invitación…</p>`);
  try {
    await registry("inviteCheck", { inv });
    form();
  } catch (e) {
    page(`<section class="card"><p class="error">${errorText(e)}</p></section>`);
  }
}
start();

// Panel del propietario de la plataforma: crea invitaciones de un solo uso y gestiona las comunidades.
// La clave maestra se comprueba en el registro (apps-script/Registro.gs). Solo en español.
import { registry } from "./api.js";
import { esc } from "./sections/ui.js";

const root = document.getElementById("owner");
const SESSION = "halloween-owner";
const base = `${location.origin}${location.pathname.replace(/[^/]*$/, "")}`;
const inviteLink = (code) => `${base}crear.html?inv=${code}`;
const day = (iso) => (iso ? new Date(iso).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" }) : "");

let key = "";
let list = { invites: [], communities: [] };
let fresh = null; // última invitación creada
let status = "";

try { key = sessionStorage.getItem(SESSION) || ""; } catch {}

const errorText = (e) => ({ auth: "Clave incorrecta.", network: "No se pudo conectar con el registro." })[e.code] || `Error: ${e.code || e.message}`;

function login(error = "") {
  root.innerHTML = `
    <section class="card login">
      <h1>🗝️ Plataforma</h1>
      <form id="login">
        <label>Clave maestra<input type="password" name="key" required autocomplete="current-password"></label>
        <button class="btn">Entrar</button>
      </form>
      ${error ? `<p class="error">${error}</p>` : ""}
    </section>`;
}

function inviteState(i) {
  if (i.used) return `✅ Usada por <a href="${base}?c=${esc(i.community)}" target="_blank">${esc(i.community)}</a>`;
  if (i.expired) return "⌛ Caducada";
  return `⏳ Pendiente · caduca el ${day(i.expires)}`;
}

function panel() {
  const pending = list.invites.filter((i) => !i.used && !i.expired);
  root.innerHTML = `
    <header class="admin-head">
      <h1>🗝️ Plataforma</h1>
      <p>${list.communities.length} comunidades · ${pending.length} invitaciones pendientes · <button type="button" class="link" data-act="logout">Salir</button></p>
    </header>

    <section class="card">
      <h2>Nueva invitación</h2>
      <p>Cada invitación sirve para crear <b>una</b> comunidad. Quien la usa se convierte en su gestor, pero no puede invitar a nadie.</p>
      <form id="invite" class="inline-form">
        <label>Caduca en
          <select name="days"><option value="7">7 días</option><option value="30" selected>30 días</option><option value="90">90 días</option></select>
        </label>
        <button class="btn">✉️ Crear invitación</button>
      </form>
      ${fresh ? `
        <div class="notice">
          <p>Envía este enlace privado (por WhatsApp, por ejemplo):</p>
          <p class="share-link"><a href="${esc(inviteLink(fresh.code))}">${esc(inviteLink(fresh.code))}</a></p>
          <button type="button" class="btn alt small" data-act="copy" data-code="${esc(fresh.code)}">🔗 Copiar enlace</button>
        </div>` : ""}
      ${status ? `<p class="warn">${status}</p>` : ""}
    </section>

    <section class="card">
      <h2>Comunidades</h2>
      ${list.communities.length ? `
        <table class="kid-table">
          <thead><tr><th>Nombre</th><th>Web</th><th>Alta</th><th>Activa</th></tr></thead>
          <tbody>${list.communities.map((c) => `
            <tr><td>${esc(c.name)}</td>
              <td><a href="${base}?c=${esc(c.slug)}" target="_blank">?c=${esc(c.slug)}</a></td>
              <td>${day(c.created)}</td>
              <td><input type="checkbox" data-toggle="${esc(c.slug)}" ${c.active ? "checked" : ""} aria-label="Activa"></td></tr>`).join("")}
          </tbody>
        </table>
        <p class="help">Desactivar una comunidad oculta su web en la plataforma. Sus datos siguen en su propia hoja.</p>` : `<p class="soon">Todavía no hay comunidades.</p>`}
    </section>

    <section class="card">
      <h2>Invitaciones</h2>
      ${list.invites.length ? `
        <table class="kid-table">
          <thead><tr><th>Código</th><th>Creada</th><th>Estado</th><th></th></tr></thead>
          <tbody>${[...list.invites].reverse().map((i) => `
            <tr><td><code>${esc(i.code)}</code></td><td>${day(i.created)}</td><td>${inviteState(i)}</td>
              <td>${i.used ? "" : `
                ${i.expired ? "" : `<button type="button" class="btn alt small" data-act="copy" data-code="${esc(i.code)}">🔗 Copiar</button>`}
                <button type="button" class="btn danger small" data-act="revoke" data-code="${esc(i.code)}">Anular</button>`}</td></tr>`).join("")}
          </tbody>
        </table>` : `<p class="soon">Todavía no has creado invitaciones.</p>`}
    </section>`;
}

async function load() {
  list = await registry("ownerList", { key });
}

async function enter(k) {
  root.innerHTML = `<p class="loading">Cargando…</p>`;
  key = k;
  try {
    await load();
    try { sessionStorage.setItem(SESSION, k); } catch {}
    panel();
  } catch (e) {
    try { sessionStorage.removeItem(SESSION); } catch {}
    login(errorText(e));
  }
}

async function run(task) {
  status = "";
  try {
    await task();
    await load();
  } catch (e) {
    status = errorText(e);
  }
  panel();
}

root.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  if (e.target.id === "login") return enter(f.get("key"));
  if (e.target.id === "invite") run(async () => { fresh = await registry("ownerInvite", { key, days: f.get("days") }); });
});

root.addEventListener("change", (e) => {
  const slug = e.target.dataset.toggle;
  if (slug === undefined) return;
  if (!e.target.checked && !confirm(`¿Desactivar la web de "${slug}"?`)) { e.target.checked = true; return; }
  run(() => registry("ownerToggle", { key, slug, active: e.target.checked }));
});

root.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const { act, code } = btn.dataset;
  if (act === "copy") {
    try { await navigator.clipboard.writeText(inviteLink(code)); btn.textContent = "Copiado ✓"; }
    catch { prompt("Enlace de invitación", inviteLink(code)); }
  }
  if (act === "revoke" && confirm(`¿Anular la invitación ${code}? El enlace dejará de funcionar.`)) {
    if (fresh?.code === code) fresh = null;
    run(() => registry("ownerRevoke", { key, code }));
  }
  if (act === "logout") {
    try { sessionStorage.removeItem(SESSION); } catch {}
    key = "";
    fresh = null;
    login();
  }
});

if (key) enter(key);
else login();

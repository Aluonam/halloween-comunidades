// Panel del gestor: decide quién reparte chuches y revisa las inscripciones de peques.
// Solo en español. La clave se comprueba en la hoja (apps-script/Code.gs), no aquí.
import { config } from "./config.js";
import { api, demo } from "./api.js";
import { setLang } from "./i18n.js";
import { kind, layout } from "./layouts/index.js";
import { ALLERGY, esc } from "./sections/ui.js";

setLang("es");
const TAG_NAMES = { gluten: "sin gluten", nuts: "sin frutos secos", lactose: "sin lactosa", egg: "sin huevo" };
const SESSION = "halloween-admin";

const root = document.getElementById("admin");
let key = "";
let doors = [];     // copia de trabajo; se guarda con "Guardar"
let kids = [];
let selected = null; // id de la puerta abierta en el editor (edificios)
let dirty = false;
let status = "";

try { key = sessionStorage.getItem(SESSION) || ""; } catch {}

const byId = () => Object.fromEntries(doors.map((d) => [d.id, d]));
const errorText = (e) => ({ auth: "Clave incorrecta.", network: "No se pudo conectar con la hoja." })[e.code] || `Error: ${e.code || e.message}`;

// ---------- Pantallas ----------

function login(error = "") {
  root.innerHTML = `
    <section class="card login">
      <h1>🧙 Gestor</h1>
      <p>${esc(config.community)}</p>
      <form id="login">
        <label>Clave del gestor<input type="password" name="key" required autocomplete="current-password"></label>
        <button class="btn">Entrar</button>
      </form>
      ${error ? `<p class="error">${error}</p>` : ""}
      ${demo ? `<p class="soon">Modo demostración: la clave es <b>demo</b>.</p>` : ""}
      <p><a href="./">← Volver a la web</a></p>
    </section>`;
}

function tagBoxes(door, attr) {
  return Object.entries(TAG_NAMES).map(([tag, label]) => `
    <label class="tag"><input type="checkbox" ${attr}="${esc(door.id)}" value="${tag}" ${door.tags?.includes(tag) ? "checked" : ""}> ${ALLERGY[tag]} ${label}</label>`).join("");
}

// Edificios: se toca la ventana para encenderla; la encendida se edita debajo.
function buildingsEditor() {
  const map = byId();
  const ui = {
    doors,
    playing: true, // las ventanas apagadas son botones
    shown: (id) => map[id],
    lit: (door, label) => `<button type="button" class="win on ${door.id === selected ? "sel" : ""}" data-door="${esc(door.id)}" aria-label="${esc(layout.name(door))}">🎃<span class="lt">${label}</span>${(door.tags || []).length ? `<span class="badge">${door.tags.map((t) => ALLERGY[t]).join("")}</span>` : ""}</button>`,
    guess: (id, aria, label) => `<button type="button" class="win" data-door="${esc(id)}" aria-label="${aria}">${label}</button>`,
    off: (label) => `<span class="win">${label}</span>`,
  };
  const door = map[selected];
  return `
    <p class="help">Toca una ventana para encenderla 🎃 (esa puerta reparte). Toca una encendida para editarla o quitarla.</p>
    <div class="buildings admin-buildings">${layout.scene(ui)}</div>
    ${door ? `
      <div class="editor">
        <p><b>🎃 ${esc(layout.name(door))}</b></p>
        <div class="tags">${tagBoxes(door, "data-tag")}</div>
        <button type="button" class="btn alt" data-act="close">Listo</button>
        <button type="button" class="btn danger" data-act="remove" data-id="${esc(door.id)}">Quitar puerta</button>
      </div>` : ""}`;
}

// Casas: formulario para añadir y lista para quitar.
function housesEditor() {
  const streets = [...new Set([...(config.houses?.streets || []), ...doors.map((d) => d.street).filter(Boolean)])];
  const list = layout.sort(doors);
  return `
    <form id="add-house" class="add-house">
      <label>Calle<input name="street" list="streets" maxlength="60" autocomplete="off" placeholder="Calle del Olmo"></label>
      <label>Número<input name="number" required maxlength="10" autocomplete="off" placeholder="12"></label>
      <datalist id="streets">${streets.map((s) => `<option value="${esc(s)}">`).join("")}</datalist>
      <div class="tags">${Object.entries(TAG_NAMES).map(([tag, label]) => `<label class="tag"><input type="checkbox" name="tags" value="${tag}"> ${ALLERGY[tag]} ${label}</label>`).join("")}</div>
      <button class="btn">➕ Añadir casa</button>
    </form>
    ${list.length ? `
      <ul class="house-list">${list.map((d) => `
        <li>
          <b>🎃 ${esc(layout.name(d))}</b>
          <div class="tags">${tagBoxes(d, "data-tag")}</div>
          <button type="button" class="btn danger small" data-act="remove" data-id="${esc(d.id)}">Quitar</button>
        </li>`).join("")}</ul>` : `<p class="soon">Todavía no hay casas. Añade la primera arriba.</p>`}`;
}

function kidsList() {
  if (!kids.length) return `<p class="soon">Todavía no hay peques inscritos.</p>`;
  return `
    <table class="kid-table">
      <thead><tr><th>Alias</th><th>Edad</th><th>Alergias</th><th></th></tr></thead>
      <tbody>${kids.map((k) => `
        <tr><td>${esc(k.alias)}</td><td>${esc(k.age)}</td><td>${esc(k.allergy)}</td>
          <td><button type="button" class="btn danger small" data-act="kid-delete" data-id="${esc(k.id)}">Borrar</button></td></tr>`).join("")}
      </tbody>
    </table>`;
}

function panel() {
  const what = kind === "houses" ? "casas" : "puertas";
  root.innerHTML = `
    <header class="admin-head">
      <h1>🧙 Gestor</h1>
      <p>${esc(config.community)} · <a href="./" target="_blank">Ver la web</a> · <button type="button" class="link" data-act="logout">Salir</button></p>
      ${demo ? `<p class="banner">🧪 Modo demostración: los cambios solo se guardan en este navegador.</p>` : ""}
    </header>

    <section class="card">
      <h2>Quién reparte</h2>
      <p class="count">🎃 ${doors.length} ${what}</p>
      ${kind === "houses" ? housesEditor() : buildingsEditor()}
    </section>

    <section class="card">
      <h2>Peques inscritos</h2>
      <p>Cada familia gestiona su inscripción. Borra aquí solo lo que no deba estar (alias inapropiados, duplicados...).</p>
      ${kidsList()}
    </section>

    <div class="savebar ${dirty ? "show" : ""}" role="status">
      <span>${status || (dirty ? "Cambios sin guardar" : "")}</span>
      ${dirty ? `<button type="button" class="btn" data-act="save">💾 Guardar</button>` : ""}
    </div>`;
}

// ---------- Acciones ----------

async function enter(k) {
  root.innerHTML = `<p class="loading">Cargando…</p>`;
  try {
    await api("adminCheck", { key: k });
    key = k;
    try { sessionStorage.setItem(SESSION, k); } catch {}
    const [pub, adm] = await Promise.all([api("public"), api("adminKids", { key })]);
    doors = pub.doors.map((d) => ({ ...d, tags: d.tags || [] }));
    kids = adm.kids;
    panel();
  } catch (e) {
    try { sessionStorage.removeItem(SESSION); } catch {}
    login(errorText(e));
  }
}

function change(fn) {
  fn();
  dirty = true;
  status = "";
  panel();
}

async function save() {
  status = "Guardando…";
  panel();
  try {
    await api("adminDoorsSave", { key, doors });
    dirty = false;
    status = "Guardado ✓ Ya se ve en la web.";
  } catch (e) {
    status = errorText(e);
  }
  panel();
  setTimeout(() => { if (!dirty) { status = ""; panel(); } }, 3000);
}

root.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  if (e.target.id === "login") return enter(f.get("key"));
  if (e.target.id === "add-house") {
    const street = f.get("street").trim();
    const number = f.get("number").trim();
    if (!number) return;
    const id = layout.idOf(street, number);
    if (doors.some((d) => d.id === id)) { status = `${layout.name({ street, number })} ya está en la lista.`; return panel(); }
    change(() => doors.push({ id, street, number, tags: f.getAll("tags") }));
    root.querySelector("#add-house [name=number]").focus();
  }
});

root.addEventListener("change", (e) => {
  const box = e.target.closest("[data-tag]");
  if (!box) return;
  const door = byId()[box.dataset.tag];
  change(() => {
    door.tags = box.checked ? [...new Set([...door.tags, box.value])] : door.tags.filter((t) => t !== box.value);
  });
});

root.addEventListener("click", async (e) => {
  const win = e.target.closest("[data-door]");
  if (win) {
    const id = win.dataset.door;
    if (byId()[id]) { selected = selected === id ? null : id; return panel(); }
    return change(() => { doors.push({ id, street: "", number: "", tags: [] }); selected = id; });
  }

  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const { act, id } = btn.dataset;
  if (act === "save") return save();
  if (act === "close") { selected = null; return panel(); }
  if (act === "remove") return change(() => { doors = doors.filter((d) => d.id !== id); selected = null; });
  if (act === "logout") {
    if (dirty && !confirm("Hay cambios sin guardar. ¿Salir igualmente?")) return;
    try { sessionStorage.removeItem(SESSION); } catch {}
    key = ""; dirty = false;
    return login();
  }
  if (act === "kid-delete") {
    const kid = kids.find((k) => k.id === id);
    if (!confirm(`¿Borrar la inscripción de "${kid.alias}"?`)) return;
    try {
      await api("adminKidDelete", { key, id });
      kids = kids.filter((k) => k.id !== id);
    } catch (e) {
      status = errorText(e);
    }
    panel();
  }
});

addEventListener("beforeunload", (e) => { if (dirty) e.preventDefault(); });

if (key) enter(key);
else login();

import { config } from "./config.js";
import { demo, loadPublic } from "./api.js";
import { getLang, setLang, t } from "./i18n.js";
import * as fx from "./fx.js";
import * as hero from "./sections/hero.js";
import * as route from "./sections/route.js";
import * as party from "./sections/party.js";
import * as kids from "./sections/kids.js";
import * as rules from "./sections/rules.js";
import * as contact from "./sections/contact.js";

// Orden de las secciones. Añadir/quitar/reordenar = tocar esta lista.
const sections = [hero, route, ...(config.partyPlace ? [party] : []), kids, rules, contact];

const app = document.getElementById("app");
const langBtn = document.getElementById("lang");
let loadFailed = false;

function banner() {
  if (demo) return `<p class="banner">${t("demoBanner")}</p>`;
  return loadFailed ? `<p class="banner">${t("loadError")}</p>` : "";
}

function render() {
  app.innerHTML = banner() + sections.map((s) => s.render()).join("");
  sections.forEach((s) => s.mount?.());
  langBtn.textContent = t("switchTo");
}

langBtn.addEventListener("click", () => {
  setLang(getLang() === "es" ? "en" : "es");
  render();
});

document.title = `Halloween 🎃 ${config.community}`;
setLang(getLang());
fx.init();
render();
// Datos de la hoja (puertas y peques): cuando llegan, se repinta todo una vez.
Promise.all([
  loadPublic().catch((e) => { loadFailed = true; console.warn("No se pudo leer la hoja", e); }),
  ...sections.map((s) => s.load?.()),
]).then(render);

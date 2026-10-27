import { config } from "../config.js";
import { data } from "../api.js";
import { candy, toast } from "../fx.js";
import { t } from "../i18n.js";
import { layout } from "../layouts/index.js";
import { ALLERGY as ICON, esc } from "./ui.js";

// Modo acertijos: step = índice de la puerta a encontrar (en order()), null = modo normal.
let step = null;
let msg = "";
const order = () => layout().sort(data.doors);

function info(door) {
  const tags = (door.tags || []).map((tag) => `${ICON[tag] || ""} ${t("tags")[tag] || tag}`);
  return esc([`🎃 ${layout().name(door)}`, ...tags].join(" · "));
}

// Cómo se pinta cada puerta; el layout decide dónde va cada una.
function painter() {
  const byId = Object.fromEntries(data.doors.map((d) => [d.id, d]));
  const playing = step !== null;
  const found = new Set(order().slice(0, step ?? 0).map((d) => d.id));
  return {
    doors: data.doors,
    playing,
    shown: (id) => (playing ? found.has(id) && byId[id] : byId[id]),
    lit(door, label, cls = "") {
      const badges = (door.tags || []).map((tag) => ICON[tag] || "").join("");
      const text = info(door);
      return `<button type="button" class="win on ${cls}" data-candy data-info="${text}" aria-label="${text}" style="--d:${(Math.random() * 3).toFixed(2)}s">🎃<span class="lt">${label}</span>${badges ? `<span class="badge">${badges}</span>` : ""}</button>`;
    },
    guess: (id, aria, label, cls = "") => `<button type="button" class="win ${cls}" data-id="${esc(id)}" aria-label="${aria}">${label}</button>`,
    off: (label) => `<span class="win">${label}</span>`,
  };
}

function riddleCard() {
  const list = order();
  if (step >= list.length) {
    return `
      <div class="riddle">
        <p class="riddle-title">${t("allFound")}</p>
        <button type="button" class="btn" data-act="play">${t("playAgain")}</button>
        <button type="button" class="btn alt" data-act="exit">${t("exit")}</button>
      </div>`;
  }
  return `
    <div class="riddle">
      ${msg ? `<p class="riddle-msg">${msg}</p>` : ""}
      <p class="riddle-title">🔮 ${t("riddleStep", { i: step + 1, n: list.length })}</p>
      <ul>${layout().riddle(list[step]).map((line) => `<li>${line}</li>`).join("")}</ul>
      <button type="button" class="btn alt" data-act="hint">${t("hint")}</button>
      <button type="button" class="btn alt" data-act="skip">${t("skip")}</button>
      <button type="button" class="btn alt" data-act="exit">${t("exit")}</button>
      <p class="riddle-hint" aria-live="polite"></p>
    </div>`;
}

function inner() {
  const n = data.doors.length;
  const meter = layout().total() ? `<div class="meter" aria-hidden="true"><i style="width:${(n / layout().total()) * 100}%"></i></div>` : "";
  const top = step === null
    ? `${n ? `${meter}
       <p class="count">${t(layout().countKey + (n === 1 ? "One" : ""), { n, total: layout().total() })}</p>
       <button type="button" class="btn play" data-act="play" data-candy>${t("playRiddles")}</button>` : `<p class="soon">${t("noDoors")}</p>`}`
    : riddleCard();

  return `
    <h2>${t("routeTitle")}</h2>
    <p>${t("routeIntro")}</p>
    ${config.routeEnd && config.date ? `<p>🕡 ${config.date.slice(11)} – ${config.routeEnd}</p>` : ""}
    ${top}
    <div class="buildings">${layout().scene(painter())}</div>
    <button type="button" class="btn alt next" hidden>${t(layout().nextKey)}</button>
    <p class="win-info" aria-live="polite">${n && step === null ? t("tapHint") : ""}</p>
    <p class="soon">${t("soon")}</p>`;
}

export const render = () => `<section id="route" class="card reveal">${inner()}</section>`;

export function mount() {
  const el = document.getElementById("route");
  const row = () => el.querySelector(".buildings");
  const resize = new ResizeObserver(() => {
    el.querySelector(".next").hidden = row().scrollWidth <= row().clientWidth + 4;
  });
  const groupEl = (door) => [...row().children].find((g) => g.dataset.group === layout().groupOf(door));

  // Vuelve a pintar la sección conservando el grupo (portal o calle) que se estaba viendo.
  const refresh = () => {
    const left = row().scrollLeft;
    el.innerHTML = inner();
    resize.disconnect();
    resize.observe(row());
    const list = order();
    const target = step !== null && step < list.length && groupEl(list[step]);
    row().style.scrollBehavior = "auto";
    row().scrollLeft = target ? target.offsetLeft - row().offsetLeft : left;
    row().style.scrollBehavior = "";
  };

  el.addEventListener("click", (e) => {
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (act === "play") { step = 0; msg = ""; return refresh(); }
    if (act === "exit") { step = null; return refresh(); }
    // Pasa a la siguiente puerta (la saltada queda encendida para ver dónde estaba).
    if (act === "skip") { step++; msg = ""; return refresh(); }
    if (act === "hint") {
      const door = order()[step];
      el.querySelector(".riddle-hint").textContent = layout().hint(door);
      [...el.querySelectorAll("[data-id]")].find((b) => b.dataset.id === door.id)?.classList.add("lit-row");
      return;
    }

    if (e.target.closest(".next")) {
      const [a, b] = row().children;
      if (!b) return;
      const stepW = b.offsetLeft - a.offsetLeft;
      const atEnd = row().scrollLeft + row().clientWidth >= row().scrollWidth - 4;
      return row().scrollTo({ left: atEnd ? 0 : row().scrollLeft + stepW });
    }

    // Modo acertijos: ¿ha tocado la puerta correcta?
    const guess = e.target.closest("[data-id]");
    if (guess && step !== null) {
      if (guess.dataset.id === order()[step].id) {
        candy(e.clientX, e.clientY);
        step++;
        msg = t("right");
        return refresh();
      }
      const wrong = t("wrong");
      toast(wrong[Math.floor(Math.random() * wrong.length)]);
      guess.classList.remove("nope");
      void guess.offsetWidth; // reinicia la animación
      guess.classList.add("nope");
      return;
    }

    const win = e.target.closest(".win.on");
    if (win) el.querySelector(".win-info").textContent = win.dataset.info;
  });

  resize.observe(row());
}

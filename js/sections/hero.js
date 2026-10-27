import { config } from "../config.js";
import { getLang, t } from "../i18n.js";
import { ghost, house, pumpkin } from "../art.js";
import { button, esc } from "./ui.js";

let timer;
const stars = Array.from({ length: 45 }, () =>
  `<i style="left:${Math.random() * 100}%;top:${Math.random() * 70}%;animation-delay:${Math.random() * 4}s"></i>`
).join("");

export function render() {
  const day = config.date && new Date(config.date).toLocaleDateString(getLang(), { weekday: "long", day: "numeric", month: "long" });
  const time = config.date.slice(11);

  return `
    <section class="hero">
      <div class="stars" aria-hidden="true">${stars}</div>
      <div class="moon" aria-hidden="true"></div>

      <div class="hero-content">
        <h1><small>${t("titleTop")}</small><span>${t("titleMain")}</span></h1>
        <p class="community">${esc(config.community)}</p>
        <p class="tagline">${t("tagline")}</p>
        <p class="when">${day ? `📅 ${day} · 🕡 ${time} h` : `📅 ${t("tbc")}`}</p>
        <div class="countdown" id="countdown" aria-live="off"></div>
        <div class="actions">
          <a class="btn" href="#route" data-candy>${t("seeRoute")}</a>
          ${button(config.whatsapp, t("joinWhatsapp"), "whatsapp")}
          ${config.poster ? `<button class="btn alt" type="button" id="open-poster">${t("seePoster")}</button>` : ""}
        </div>
      </div>

      <button class="ghost say" type="button" data-say="${t("boo")}" aria-label="${t("boo")}">${ghost}</button>

      <div class="scene">
        <div class="house" aria-hidden="true">${house}</div>
        <button class="pumpkin small say" type="button" data-candy data-say="${t("laugh")}" aria-label="🎃">${pumpkin}</button>
        <button class="pumpkin big say" type="button" data-candy data-say="${t("trickOrTreat")}" aria-label="🎃">${pumpkin}</button>
        <div class="fog" aria-hidden="true"></div>
        <div class="ground" aria-hidden="true"></div>
      </div>

      ${config.poster ? poster(config.poster) : ""}
    </section>`;
}

const poster = ({ image, credit, note }) => `
  <dialog id="poster" class="poster">
    <img src="${esc(image)}" alt="${t("posterAlt")}">
    ${credit ? `<p class="poster-thanks">${t("posterBy", { name: esc(credit) })}</p>` : ""}
    ${note ? `<p class="poster-note">${esc(note)}</p>` : ""}
    <form method="dialog"><button class="btn">${t("close")}</button></form>
  </dialog>`;

export function mount() {
  const dialog = document.getElementById("poster");
  if (dialog) {
    document.getElementById("open-poster").addEventListener("click", () => dialog.showModal());
    dialog.addEventListener("click", (e) => e.target === dialog && dialog.close());
  }

  const el = document.getElementById("countdown");
  const target = new Date(config.date);
  clearInterval(timer);
  if (!config.date) return;
  const tick = () => {
    const s = Math.floor((target - Date.now()) / 1000);
    if (s <= 0) { el.innerHTML = `<p class="started">${t("started")}</p>`; return clearInterval(timer); }
    const units = [[s / 86400, t("days")], [(s / 3600) % 24, t("hours")], [(s / 60) % 60, t("mins")], [s % 60, t("secs")]];
    el.innerHTML = units.map(([v, label]) =>
      `<div class="tomb"><b>${String(Math.floor(v)).padStart(2, "0")}</b><small>${label}</small></div>`
    ).join("");
  };
  clearInterval(timer);
  tick();
  timer = setInterval(tick, 1000);
}

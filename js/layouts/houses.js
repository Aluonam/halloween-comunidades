// Casas individuales: cada puerta es { id, street, number }. El gestor añade solo las que reparten.
import { t } from "../i18n.js";
import { esc } from "../sections/ui.js";

export const nextKey = "nextStreet";
export const countKey = "houseCount";
export const total = 0; // no hay un total fijo de casas

// "Calle del Olmo" + "12" → "calle-del-olmo-12"
export const idOf = (street, number) =>
  `${street}-${number}`.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const groupOf = (door) => door.street || "";
const num = (door) => parseInt(door.number, 10) || 0;

// Orden del juego: por calle y luego por número.
export const sort = (doors) => [...doors].sort((a, b) =>
  groupOf(a).localeCompare(groupOf(b)) || num(a) - num(b) || String(a.number).localeCompare(String(b.number)));

export const name = (door) => [door.street, door.number].filter(Boolean).join(" ");
export const hint = (door) => t("hintHouse", { n: door.number });

// Acertijo: la calle y el número escondido en una suma (siempre la misma para cada casa).
export function riddle(door) {
  const lines = door.street ? [t("riddleStreet", { street: esc(door.street) })] : [];
  const n = num(door);
  const extra = String(door.number).replace(/^\d+\s*/, ""); // "12B" → "B"
  if (n > 2) {
    const a = 1 + ((n * 7) % (n - 1));
    lines.push(t(extra ? "riddleSumLetter" : "riddleSum", { a, b: n - a, l: esc(extra) }));
  } else {
    lines.push(t("riddleNumber", { n: esc(door.number) }));
  }
  return lines;
}

export function scene(ui) {
  const streets = [...new Set(sort(ui.doors).map(groupOf))];
  if (!streets.length) return "";
  return streets.map((s) => `
    <article class="building street" data-group="${esc(s)}">
      <div class="roof"><span>${esc(s) || t("houses")}</span></div>
      <div class="homes">${sort(ui.doors).filter((d) => groupOf(d) === s).map((d) => {
        const lit = ui.shown(d.id);
        return lit ? ui.lit(lit, esc(d.number), "home") : ui.guess(d.id, esc(name(d)), esc(d.number), "home");
      }).join("")}</div>
      <div class="sidewalk" aria-hidden="true"></div>
    </article>`).join("");
}

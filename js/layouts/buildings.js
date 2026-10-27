// Edificios: puertas con id "portal-pisoLetra" (el bajo es el piso 0, p. ej. "3-0I").
// Portales, pisos, bajo y letras los configura el gestor (config.buildings).
import { config } from "../config.js";
import { t } from "../i18n.js";
import { esc } from "../sections/ui.js";

export const nextKey = "nextPortal";
export const countKey = "doorCount";

const lowest = () => (config.buildings.ground ? 0 : 1);
const letters = () => [...config.buildings.letters];
export const total = () => config.buildings.portals.length * (config.buildings.floors - lowest() + 1) * letters().length;

export function parseId(id) {
  const [p, rest = ""] = String(id).split("-");
  return { portal: Number(p), floor: Number(rest.slice(0, -1)), letter: rest.slice(-1) };
}

export const idOf = (portal, floor, letter) => `${portal}-${floor}${letter}`;
export const groupOf = (door) => String(parseId(door.id).portal);

// ¿Sigue existiendo esta puerta con la configuración actual?
export function fits(door) {
  const { portal, floor, letter } = parseId(door.id);
  const { portals, floors } = config.buildings;
  return portal >= 1 && portal <= portals.length && floor >= lowest() && floor <= floors && letters().includes(letter);
}

// Orden del juego: por portal, luego planta y luego letra.
export const sort = (doors) => [...doors].sort((a, b) => {
  const x = parseId(a.id), y = parseId(b.id);
  return x.portal - y.portal || x.floor - y.floor || x.letter.localeCompare(y.letter);
});

export const floorName = (f) => (f ? t("floor", { n: f }) : t("ground"));
const doorName = (f, l) => `${floorName(f)} ${l}`;
const streetOf = (p) => config.buildings.portals[p - 1]?.street || "";

export function name(door) {
  const { portal, floor, letter } = parseId(door.id);
  const street = streetOf(portal);
  return `${t("portal", { n: portal })}${street ? ` (${street})` : ""} · ${doorName(floor, letter)}`;
}

export const hint = (door) => {
  const { floor, letter } = parseId(door.id);
  return t("hintDoor", { door: doorName(floor, letter) });
};

// Acertijo: portal, planta (con un acertijo por planta) y letra (con una cosa terrorífica que empieza por ella).
export function riddle(door) {
  const { portal, floor, letter } = parseId(door.id);
  const street = streetOf(portal);
  const word = t("letterWords")[letter];
  return [
    t("riddlePortal", { n: portal }) + (street ? ` (${esc(street)})` : ""),
    t("floorClues")[floor] || t("riddleFloor", { ghosts: "👻".repeat(floor) }),
    word ? t("riddleLetter", { clue: word[1] }) : t("riddleLetterPlain", { letter }),
  ];
}

// Dibuja los portales. ui sabe pintar cada ventana: lit (reparte), guess (botón del juego) u off (apagada).
export function scene(ui) {
  const { portals, floors } = config.buildings;
  const list = letters();
  return portals.map(({ street }, i) => {
    const p = i + 1;
    const cells = [];
    for (let f = floors; f >= lowest(); f--) {
      cells.push(`<span class="fl">${floorName(f)}</span>`);
      for (const l of list) {
        const id = idOf(p, f, l);
        const door = ui.shown(id);
        if (door) cells.push(ui.lit(door, l));
        else if (ui.playing) cells.push(ui.guess(id, doorName(f, l), l));
        else cells.push(ui.off(l));
      }
    }
    return `
      <article class="building" data-group="${p}">
        <div class="roof"><span>${t("portal", { n: p })}</span></div>
        ${street ? `<p class="address">${esc(street)}</p>` : ""}
        <div class="facade" style="--cols:${list.length}">${cells.join("")}</div>
        <div class="entrance" aria-hidden="true"><span>🎃</span><i></i><span>🎃</span></div>
      </article>`;
  }).join("");
}

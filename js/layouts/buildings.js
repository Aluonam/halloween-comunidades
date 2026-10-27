// Edificios: puertas con id "portal-pisoLetra" (el bajo es el piso 0, p. ej. "3-0I").
import { config } from "../config.js";
import { t } from "../i18n.js";

const { portals: portalCount, floors, ground = true, letters: letterList } = config.buildings;
export const portals = Array.from({ length: portalCount }, (_, i) => i + 1);
export const letters = [...letterList];
const lowest = ground ? 0 : 1;
export const total = portalCount * (floors - lowest + 1) * letters.length;

export const nextKey = "nextPortal";
export const countKey = "doorCount";

export function parseId(id) {
  const [p, rest] = id.split("-");
  return { portal: Number(p), floor: Number(rest.slice(0, -1)), letter: rest.slice(-1) };
}

export const idOf = (portal, floor, letter) => `${portal}-${floor}${letter}`;
export const groupOf = (door) => String(parseId(door.id).portal);

// Orden del juego: por portal, luego planta y luego letra.
export const sort = (doors) => [...doors].sort((a, b) => {
  const x = parseId(a.id), y = parseId(b.id);
  return x.portal - y.portal || x.floor - y.floor || x.letter.localeCompare(y.letter);
});

export const floorName = (f) => (f ? t("floor", { n: f }) : t("ground"));
const doorName = (f, l) => `${floorName(f)} ${l}`;

export function name(door) {
  const { portal, floor, letter } = parseId(door.id);
  return `${t("portal", { n: portal })} · ${doorName(floor, letter)}`;
}

export const hint = (door) => {
  const { floor, letter } = parseId(door.id);
  return t("hintDoor", { door: doorName(floor, letter) });
};

// Acertijo: portal, planta (con un acertijo por planta) y letra (con una cosa terrorífica que empieza por ella).
export function riddle(door) {
  const { portal, floor, letter } = parseId(door.id);
  const word = t("letterWords")[letter];
  return [
    t("riddlePortal", { n: portal }),
    t("floorClues")[floor] || t("riddleFloor", { ghosts: "👻".repeat(floor) }),
    word ? t("riddleLetter", { clue: word[1] }) : t("riddleLetterPlain", { letter }),
  ];
}

// Dibuja los portales. ui sabe pintar cada ventana: lit (reparte), guess (botón del juego) u off (apagada).
export function scene(ui) {
  return portals.map((p) => {
    const cells = [];
    for (let f = floors; f >= lowest; f--) {
      cells.push(`<span class="fl">${floorName(f)}</span>`);
      for (const l of letters) {
        const id = idOf(p, f, l);
        const door = ui.shown(id);
        if (door) cells.push(ui.lit(door, l));
        else if (ui.playing) cells.push(ui.guess(id, doorName(f, l), l));
        else cells.push(ui.off(l, id));
      }
    }
    return `
      <article class="building" data-group="${p}">
        <div class="roof"><span>${t("portal", { n: p })}</span></div>
        <div class="facade" style="--cols:${letters.length}">${cells.join("")}</div>
        <div class="entrance" aria-hidden="true"><span>🎃</span><i></i><span>🎃</span></div>
      </article>`;
  }).join("");
}

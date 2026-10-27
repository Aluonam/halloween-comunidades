// Efectos globales: murciélagos, araña, lluvia de caramelos y bocadillos.
import { bat, spider } from "./art.js";

const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const CANDY = ["🍬", "🍭", "🍫", "🍬", "🎃", "👻"];
const rand = (min, max) => min + Math.random() * (max - min);

export function candy(x, y) {
  if (calm) return;
  for (let i = 0; i < 12; i++) {
    const c = document.createElement("span");
    c.className = "candy";
    c.textContent = CANDY[i % CANDY.length];
    c.style.cssText = `--x:${x}px;--y:${y}px;--dx:${rand(-120, 120)}px;--dy:${rand(-160, -60)}px;--r:${rand(-360, 360)}deg`;
    c.addEventListener("animationend", () => c.remove());
    document.body.append(c);
  }
}

function talk(el) {
  el.classList.add("talk");
  clearTimeout(el._talk);
  el._talk = setTimeout(() => el.classList.remove("talk"), 1300);
}

// Aviso breve abajo en el centro de la pantalla.
export function toast(text) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("p");
    el.className = "toast";
    el.setAttribute("aria-live", "polite");
    document.body.append(el);
  }
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 1600);
}

// Se llama una vez al cargar.
export function init() {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="bats" aria-hidden="true">${`<span class="bat">${bat}</span>`.repeat(3)}</div>
    <button class="spider" type="button" aria-label="🕷️"><span class="thread"></span>${spider}</button>`);

  const sp = document.querySelector(".spider");
  sp.addEventListener("click", () => {
    sp.classList.add("up");
    setTimeout(() => sp.classList.remove("up"), 2500);
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-candy]")) candy(e.clientX, e.clientY);
    const s = e.target.closest("[data-say]");
    if (s) talk(s);
  });
}


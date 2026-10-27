// Botón-enlace. Si no hay enlace, no se pinta nada (o el texto alternativo).
export function button(href, label, cls = "", fallback = "") {
  if (!href) return fallback ? `<p class="soon">${fallback}</p>` : "";
  return `<a class="btn ${cls}" href="${href}" target="_blank" rel="noopener">${label}</a>`;
}

// Iconos de alergias/intolerancias (el texto está en i18n → tags).
export const ALLERGY = { gluten: "🌾", nuts: "🥜", lactose: "🥛", egg: "🥚" };

// Escapa texto que viene de formularios (alias, etc.).
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[c]);

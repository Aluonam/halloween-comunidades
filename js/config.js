// ⚙️ Configuración de la plataforma (la pone el propietario una vez, ver docs/PROPIETARIO.md).
// Lo de cada comunidad (nombre, fecha, edificios o casas, calles...) lo decide su gestor desde admin.html
// y se guarda en la hoja de esa comunidad.
export const config = {
  // Registro de comunidades: URL de la aplicación web de apps-script/Registro.gs.
  // Vacío = solo modo demostración.
  registry: "",

  // Hoja plantilla que copia cada comunidad al darse de alta (enlace que acaba en /copy).
  templateSheet: "",

  poster: null,       // cartel común: { image: "img/cartel.jpg", credit: "...", note: "..." }
  partyDetails: null, // { es: "Juegos, merienda...", en: "Games, snacks..." }

  // ---- Ajustes del gestor ----
  // Valores de partida hasta que el gestor guarde los suyos. Lo que esté vacío no se muestra o sale como "Por confirmar".
  community: "Nuestra comunidad",
  date: "2026-10-31T18:30", // inicio (AAAA-MM-DDTHH:MM)
  routeEnd: "",             // "20:30"
  partyPlace: "",           // vacío = sin minifiesta
  partyStart: "",
  partyEnd: "",
  whatsapp: "",             // enlace de invitación al grupo
  volunteersForm: "",       // formulario de voluntarios

  layout: "buildings",      // "buildings" (portales con pisos y letras) o "houses" (casas individuales)
  buildings: {
    portals: [{ street: "" }, { street: "" }, { street: "" }, { street: "" }], // uno por portal; street = dirección opcional
    floors: 7,              // pisos por encima del bajo
    ground: true,           // ¿hay viviendas en el bajo?
    letters: "ABCDEFGHI",   // letras de cada planta
  },
  houses: {
    streets: [],            // calles participantes
  },
};

// Claves que guarda el gestor en la hoja.
export const SETTINGS = ["community", "date", "routeEnd", "partyPlace", "partyStart", "partyEnd", "whatsapp", "volunteersForm", "layout", "buildings", "houses"];

export function applySettings(s) {
  if (!s) return;
  for (const k of SETTINGS) if (s[k] != null) config[k] = structuredClone(s[k]);
}

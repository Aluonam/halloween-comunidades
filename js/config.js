// ⚙️ Configuración de tu comunidad. Es el único archivo que hay que tocar (ver README).
// Lo que esté vacío ("" o null) no se muestra o sale como "Por confirmar".
export const config = {
  community: "Residencial Los Fantasmas", // nombre de tu comunidad o urbanización
  date: "2026-10-31T18:30",               // día y hora de inicio (AAAA-MM-DDTHH:MM)
  routeEnd: null,     // "20:30"

  // Minifiesta. partyPlace: null = no hay minifiesta.
  partyPlace: "Sala común",
  partyStart: null,   // "19:30"
  partyEnd: null,     // "21:00"
  partyDetails: null, // { es: "Juegos, merienda...", en: "Games, snacks..." }

  whatsapp: "",       // enlace de invitación al grupo de WhatsApp
  volunteersForm: "", // enlace a un formulario de voluntarios (opcional)

  // Cartel (opcional): sube la imagen a la carpeta img/ y pon su ruta.
  // poster: { image: "img/cartel.jpg", credit: "Eva", note: "Busca el QR en tu portal" },
  poster: null,

  // Hoja de Google de la comunidad: URL de la aplicación web de Apps Script (README → "Conectar la hoja").
  // Vacío = modo demostración: los datos solo se guardan en este navegador.
  api: "",

  // Tipo de urbanización:
  //   "buildings" → edificios con portales, pisos y letras.
  //   "houses"    → casas individuales (calle + número).
  layout: "buildings",

  buildings: {
    portals: 4,           // número de portales
    floors: 7,            // pisos por encima del bajo
    ground: true,         // ¿hay viviendas en el bajo?
    letters: "ABCDEFGHI", // letras de cada planta
  },

  houses: {
    streets: [],          // calles para autocompletar en el gestor, p. ej. ["Calle del Olmo", "Calle del Roble"]
  },
};

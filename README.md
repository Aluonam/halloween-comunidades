# Halloween para comunidades 🎃

Plataforma para que comunidades de vecinos tengan su web de la fiesta de Halloween:

- **Recorrido de truco o trato** con las puertas que reparten chuches y un **juego de acertijos** para encontrarlas.
- Para **edificios** (portales, pisos y letras) o **casas** (calles y números).
- **Panel del gestor** (`admin.html`): fecha y hora, tipo de urbanización, portales o calles, quién reparte, enlace y **QR** para el cartel.
- **Inscripción de peques autogestionada**: varios hermanos de una vez, con enlace privado para cambiarla, añadir más o borrarla, aviso de qué datos son públicos y máximo de plazas (100 por defecto).
- Español e inglés. HTML + CSS + JS nativo, sin dependencias ni compilación. Fuentes servidas desde la propia web.

**Demo:** https://aluonam.github.io/halloween-comunidades/ (gestor: [admin.html](https://aluonam.github.io/halloween-comunidades/admin.html), clave `demo`; también [casas](https://aluonam.github.io/halloween-comunidades/?layout=houses)).

## Cómo funciona

| Quién | Qué hace | Dónde |
|---|---|---|
| **Propietario** (solo él) | Crea invitaciones de un solo uso, ve y desactiva comunidades | `superadmin.html` + su hoja de registro |
| **Gestor** de cada comunidad (con invitación) | Crea su web con el asistente y la configura | `crear.html?inv=…`, luego `admin.html?c=su-comunidad` |
| **Vecinos y familias** | Ven el recorrido, juegan y apuntan a sus peques | `?c=su-comunidad` |

- La **web** es una sola (GitHub Pages del propietario) y sirve a todas las comunidades: `…/?c=los-olmos`, `…/?c=el-sauce`…
- Los **datos de cada comunidad** (ajustes, puertas y peques) están en **su propia hoja de Google**, creada por su gestor al darse de alta.
- El **registro** del propietario solo sabe qué hoja corresponde a cada dirección. No guarda datos de vecinos ni de peques.
- La clave de cada gestor se guarda cifrada en su hoja. Si la olvida, la cambia desde su hoja (menú 🎃 Halloween).

Puesta en marcha (una vez): **[docs/PROPIETARIO.md](docs/PROPIETARIO.md)**.

> **¿Prefieres tener la web en tu propio GitHub?** Existe una versión independiente, para una sola comunidad y sin invitaciones:
> **[halloween-mi-comunidad](https://github.com/Aluonam/halloween-mi-comunidad)** (fork + tu hoja de Google, con actualizaciones automáticas).

## Estructura

```
index.html        web de cada comunidad (?c=direccion; sin ella, demostración)
admin.html        panel del gestor
crear.html        asistente de alta (con invitación)
superadmin.html   panel del propietario
privacidad.html   aviso de privacidad
apps-script/      Code.gs (hoja de cada comunidad) · Registro.gs (registro del propietario)
js/config.js      URLs del registro y de la hoja plantilla; valores de partida
js/api.js         conexión con el registro y con la hoja de la comunidad (y modo demostración)
js/layouts/       buildings.js (portales) · houses.js (casas): dibujo y acertijos
js/sections/      secciones de la web
js/admin.js · js/crear.js · js/superadmin.js · js/share.js (enlace y QR) · js/settings.js (validación)
js/i18n.js        textos ES/EN
css/ · fonts/ · js/vendor/ (QR, MIT)
```

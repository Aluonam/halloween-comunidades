# Halloween para comunidades 🎃

Web de la fiesta de Halloween de una comunidad de vecinos, lista para que cualquier comunidad la use con sus datos:

- **Recorrido de truco o trato** con las puertas que reparten chuches y un **juego de acertijos** para encontrarlas.
- Para **edificios** (portales, pisos y letras) o **casas individuales** (calle y número).
- **Panel del gestor** (`admin.html`): solo la persona que organiza decide quién reparte, para que nadie pueda apuntar a un vecino que no participa.
- **Inscripción de peques autogestionada**: cada familia se apunta desde la web y recibe un enlace privado para cambiar o borrar su inscripción.
- Español e inglés. HTML + CSS + JS nativo, sin dependencias ni compilación.

Cada comunidad guarda sus datos en **su propia hoja de Google**.

**Demo:** https://aluonam.github.io/halloween-comunidades/ (modo demostración; prueba también [casas](https://aluonam.github.io/halloween-comunidades/?layout=houses) y el [gestor](https://aluonam.github.io/halloween-comunidades/admin.html), clave `demo`).

---

## Montarla para tu comunidad (≈ 20 min)

### 1. Tu copia de la web

1. En GitHub, pulsa **Use this template → Create a new repository** (cuenta gratuita, repositorio público).
2. En tu repositorio nuevo: **Settings → Pages → Branch: `main` / `(root)` → Save**.
   En un par de minutos la web estará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

Sin más pasos ya funciona en **modo demostración** (los datos solo se guardan en tu navegador, clave del gestor `demo`). Para que sea real, conecta la hoja:

### 2. Conectar la hoja de Google

1. Crea una hoja de cálculo nueva en Google Drive (p. ej. "Halloween comunidad").
2. **Extensiones → Apps Script**. Borra lo que haya y pega entero [`apps-script/Code.gs`](apps-script/Code.gs).
3. Cambia la clave del gestor en la línea `const ADMIN_KEY = "cambia-esta-clave";` por una solo tuya. Guarda (💾).
4. Elige la función `setup` arriba y pulsa **▶ Ejecutar**. Acepta los permisos (es tu propia hoja). Aparecerán las pestañas `ajustes`, `puertas` y `peques`.
5. **Implementar → Nueva implementación → ⚙️ Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
   - **Implementar** y copia la **URL de la aplicación web** (acaba en `/exec`).
6. Pega esa URL en `js/config.js` → `api: "https://script.google.com/macros/s/.../exec"`.

> Si más adelante cambias `Code.gs` (o la clave), haz **Implementar → Gestionar implementaciones → ✏️ → Versión: nueva → Implementar**. La URL no cambia.

### 3. Configurar la fiesta (desde el panel, sin tocar código)

Entra en `https://.../admin.html` con tu clave y abre **⚙️ Configuración**:

- **La fiesta**: nombre de la comunidad, día, hora de inicio y fin del recorrido.
- **Minifiesta**: lugar y horario (deja el lugar vacío si no hay).
- **Enlaces**: grupo de WhatsApp y formulario de voluntarios.
- **Tipo de urbanización**:
  - 🏢 *Edificios*: nº de portales, pisos, si hay viviendas en el bajo, letras de cada planta y la calle de cada portal.
  - 🏡 *Casas*: las calles participantes, en el orden del recorrido.

Pulsa **💾 Guardar** y la web se actualiza al momento. Si reduces portales, pisos o letras (o quitas una calle), el panel avisa de las puertas que dejarán de existir.

Solo queda en código (`js/config.js`): la URL de la hoja y el cartel (sube la imagen a `img/` y rellena `poster`). Textos en `js/i18n.js`, colores en `css/base.css`.

---

## Uso durante la fiesta

**Gestor** → `https://.../admin.html` con tu clave, sección **Quién reparte**.
- *Edificios*: toca una ventana para encenderla 🎃 (esa puerta reparte); tócala otra vez para marcar "sin gluten", "sin frutos secos"... o quitarla.
- *Casas*: elige la calle, escribe el número y pulsa **Añadir casa**.
- Pulsa **💾 Guardar**: se ve en la web al momento.
- Abajo ves los peques inscritos y puedes borrar lo que no deba estar.

Los vecinos que quieran repartir se lo piden al gestor (por WhatsApp, en persona...).

**Familias** → rellenan el formulario de "Pequeños monstruos". Al enviar reciben un **enlace privado** para cambiar o borrar la inscripción; ese mismo móvil lo recuerda solo. En la web solo se publican alias, edad y alergias.

**Los datos** están en tu hoja de Google: puedes verlos, exportarlos o borrarlos cuando quieras. Al acabar la fiesta, borra las filas de `peques`.

---

## Estructura

```
index.html · admin.html     web pública · panel del gestor
apps-script/Code.gs         "servidor" en la hoja de Google (pestañas ajustes, puertas, peques)
js/config.js                URL de la hoja, cartel y valores de partida
js/settings.js              validación de los ajustes del gestor
js/api.js                   conexión con la hoja (y modo demostración)
js/layouts/                 buildings.js (portales) · houses.js (casas): dibujo y acertijos
js/sections/                cada sección de la web
js/admin.js                 panel del gestor
js/i18n.js                  textos ES/EN
js/data/                    emojis de los alias · datos de la demo
css/                        estilos
```

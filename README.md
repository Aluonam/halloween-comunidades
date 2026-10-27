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

Sin más pasos ya funciona en **modo demostración** (los datos solo se guardan en tu navegador). Para que sea real, conecta la hoja:

### 2. Conectar la hoja de Google

1. Crea una hoja de cálculo nueva en Google Drive (p. ej. "Halloween comunidad").
2. **Extensiones → Apps Script**. Borra lo que haya y pega entero [`apps-script/Code.gs`](apps-script/Code.gs).
3. Cambia la clave del gestor en la línea `const ADMIN_KEY = "cambia-esta-clave";` por una solo tuya. Guarda (💾).
4. Elige la función `setup` arriba y pulsa **▶ Ejecutar**. Acepta los permisos (es tu propia hoja). Aparecerán las pestañas `puertas` y `peques`.
5. **Implementar → Nueva implementación → ⚙️ Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
   - **Implementar** y copia la **URL de la aplicación web** (acaba en `/exec`).
6. Pega esa URL en `js/config.js` → `api: "https://script.google.com/macros/s/.../exec"`.

> Si más adelante cambias `Code.gs` (o la clave), haz **Implementar → Gestionar implementaciones → ✏️ → Versión: nueva → Implementar**. La URL no cambia.

### 3. Tus datos

Edita [`js/config.js`](js/config.js) (en GitHub: abre el archivo → ✏️ → *Commit changes*):

| Quiero…                                        | En `config.js`                    |
|------------------------------------------------|-----------------------------------|
| Nombre de la comunidad, fecha y hora           | `community`, `date`               |
| Edificios o casas                              | `layout: "buildings"` o `"houses"` |
| Nº de portales, pisos, bajo y letras           | `buildings`                       |
| Calles para autocompletar (casas)              | `houses.streets`                  |
| Minifiesta (o quitarla con `null`)             | `partyPlace`, `partyStart`...     |
| Grupo de WhatsApp, formulario de voluntarios   | `whatsapp`, `volunteersForm`      |
| Cartel                                         | sube la imagen a `img/` y rellena `poster` |

Otros cambios: textos en `js/i18n.js`, colores y fuentes en `css/base.css`, orden de secciones en `js/main.js`.

---

## Uso durante la fiesta

**Gestor** → `https://.../admin.html` con tu clave.
- *Edificios*: toca una ventana para encenderla 🎃 (esa puerta reparte); tócala otra vez para marcar "sin gluten", "sin frutos secos"... o quitarla.
- *Casas*: escribe calle y número y pulsa **Añadir casa**.
- Pulsa **💾 Guardar**: se ve en la web al momento.
- Abajo ves los peques inscritos y puedes borrar lo que no deba estar.

Los vecinos que quieran repartir se lo piden al gestor (por WhatsApp, en persona...).

**Familias** → rellenan el formulario de "Pequeños monstruos". Al enviar reciben un **enlace privado** para cambiar o borrar la inscripción; ese mismo móvil lo recuerda solo. En la web solo se publican alias, edad y alergias.

**Los datos** están en tu hoja de Google: puedes verlos, exportarlos o borrarlos cuando quieras. Al acabar la fiesta, borra las filas de `peques`.

---

## Estructura

```
index.html · admin.html     web pública · panel del gestor
apps-script/Code.gs         "servidor" en la hoja de Google de la comunidad
js/config.js                ⚙️ datos de la comunidad
js/api.js                   conexión con la hoja (y modo demostración)
js/layouts/                 buildings.js (portales) · houses.js (casas): dibujo y acertijos
js/sections/                cada sección de la web
js/admin.js                 panel del gestor
js/i18n.js                  textos ES/EN
js/data/                    emojis de los alias · datos de la demo
css/                        estilos
```

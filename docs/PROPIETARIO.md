# Guía del propietario de la plataforma

Se hace **una sola vez** (≈ 10 min). Después solo creas invitaciones desde `superadmin.html`.

Necesitas tu cuenta de Google. Recomendado: **verificación en dos pasos** activada en Google y en GitHub
(quien entre en tu GitHub podría cambiar la web de todas las comunidades).

---

## A. Tu registro de comunidades

Guarda las invitaciones y la lista de comunidades (nombre, dirección y URL de su hoja). **No guarda datos de vecinos ni de peques.**

1. En Google Drive: **Nuevo → Hojas de cálculo de Google**. Llámala, por ejemplo, `Halloween · Registro`.
2. **Extensiones → Apps Script**. Borra lo que haya y pega entero [`apps-script/Registro.gs`](../apps-script/Registro.gs).
3. Cambia la clave maestra en `const MASTER_KEY = "cambia-esta-clave-maestra";` por una **larga** (mínimo 12 caracteres; si es más corta, el panel no abre) y solo tuya. Guarda (💾).
4. Arriba, elige la función `setup` y pulsa **▶ Ejecutar**. Acepta los permisos
   (*Configuración avanzada → Ir a… → Permitir*; es tu propio script).
5. **Implementar → Nueva implementación → ⚙️ Aplicación web**
   - Ejecutar como: **Yo** · Quién tiene acceso: **Cualquier usuario** → **Implementar**.
   - Copia la **URL de la aplicación web** (acaba en `/exec`). → es tu **URL del registro**.

## B. La hoja plantilla (la que copia cada comunidad)

1. Crea otra hoja nueva: `Halloween · Mi comunidad` (ese nombre verán las comunidades al copiarla).
2. **Extensiones → Apps Script**. Borra lo que haya y pega entero [`apps-script/Code.gs`](../apps-script/Code.gs). Guarda (💾).
   **No la implementes**: cada comunidad publicará su propia copia.
3. Vuelve a la hoja: **Compartir → Acceso general: Cualquier persona con el enlace → Lector**.
4. Copia la URL de la hoja y cambia el final `/edit…` por `/copy`:
   `https://docs.google.com/spreadsheets/d/XXXXXXXX/copy` → es tu **enlace de copia**.

> Al copiar la hoja, Google copia también el script. Nadie puede modificar tu plantilla: solo copiarla.

## C. Conectar la web

En [`js/config.js`](../js/config.js) pon las dos URLs y publica (o pásamelas y lo hago yo):

```js
registry: "https://script.google.com/macros/s/…/exec",            // A.5
templateSheet: "https://docs.google.com/spreadsheets/d/…/copy",    // B.4
```

## D. Invitar a una comunidad

1. Abre `https://aluonam.github.io/halloween-comunidades/superadmin.html` con tu clave maestra.
2. **Crear invitación** → copia el enlace y envíalo (WhatsApp, correo…). Sirve **una sola vez** y caduca.
3. Quien lo abre sigue el asistente (`crear.html`): copia la hoja, la publica, elige dirección y clave, y ya tiene su web en
   `…/?c=su-comunidad` con su QR. Desde entonces es el gestor de su comunidad; no puede invitar a otras.

En `superadmin.html` ves las comunidades, puedes **desactivar** una (su web deja de verse; sus datos siguen en su hoja)
y **anular** invitaciones que no se hayan usado.

## Si cambias un script

- **Registro.gs:** en su editor, **Implementar → Gestionar implementaciones → ✏️ → Versión: nueva → Implementar**. La URL no cambia.
- **Code.gs:** actualiza la hoja plantilla para las comunidades nuevas. Las ya creadas tienen su propia copia: si el cambio
  es importante, hay que pedirles que peguen el nuevo `Code.gs` y hagan lo mismo (nueva versión de su implementación).

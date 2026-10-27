// Elige cómo se dibuja la urbanización: edificios (portales) o casas individuales.
// Cada layout exporta: groupOf, sort, name, hint, riddle, scene y los textos nextKey/countKey.
import { config } from "../config.js";
import * as buildings from "./buildings.js";
import * as houses from "./houses.js";

// En modo demostración (sin hoja) se puede probar el otro tipo con ?layout=houses o ?layout=buildings.
const asked = !config.api && new URLSearchParams(location.search).get("layout");
export const kind = ["buildings", "houses"].includes(asked) ? asked : config.layout;
export const layout = kind === "houses" ? houses : buildings;

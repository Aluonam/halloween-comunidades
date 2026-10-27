// Cómo se dibuja la urbanización (lo elige el gestor): edificios (portales) o casas individuales.
// Cada layout exporta: total, fits, groupOf, sort, name, hint, riddle, scene y los textos nextKey/countKey.
import { config } from "../config.js";
import * as buildings from "./buildings.js";
import * as houses from "./houses.js";

export const layout = () => (config.layout === "houses" ? houses : buildings);

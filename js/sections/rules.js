import { t } from "../i18n.js";

export const render = () => `
  <section class="card parchment reveal">
    <h2>${t("rulesTitle")}</h2>
    <ul>${t("rules").map((r) => `<li>${r}</li>`).join("")}</ul>
  </section>`;

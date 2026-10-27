import { config } from "../config.js";
import { getLang, t } from "../i18n.js";
import { button, esc } from "./ui.js";

function time() {
  const { partyStart: s, partyEnd: e } = config;
  if (!s) return t("tbc");
  return e ? `${s} – ${e}` : s;
}

export function render() {
  const details = config.partyDetails?.[getLang()];
  return `
    <section class="card party reveal">
      <div>
        <h2>${t("partyTitle")}</h2>
        <p>📍 ${esc(config.partyPlace)}</p>
        <p>${t("partyTime", { time: time() })}</p>
        <p>${details || t("partyMore")}</p>
      </div>
      <div class="cauldron" aria-hidden="true"><i></i><i></i><i></i><i></i><span class="pot"></span></div>
      <div class="actions">
        ${button(config.volunteersForm, t("signupVolunteers"))}
      </div>
    </section>`;
}

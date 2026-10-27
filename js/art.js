// Dibujos SVG reutilizables.

export const pumpkin = `
<svg viewBox="0 0 100 92" aria-hidden="true">
  <path d="M50 16 q1 -10 10 -13" stroke="#4a6b2a" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="30" cy="54" rx="25" ry="33" fill="#d9590b"/>
  <ellipse cx="70" cy="54" rx="25" ry="33" fill="#d9590b"/>
  <ellipse cx="50" cy="54" rx="27" ry="36" fill="#f47b20"/>
  <g class="face" fill="#ffd34d">
    <path d="M29 44 l8 -12 l8 12z"/>
    <path d="M55 44 l8 -12 l8 12z"/>
    <path d="M47 53 l3 -6 l3 6z"/>
    <path d="M24 60 L33 64 L37 58 L44 65 L50 59 L56 65 L63 58 L67 64 L76 60 Q71 79 50 80 Q29 79 24 60Z"/>
  </g>
</svg>`;

export const ghost = `
<svg viewBox="0 0 60 80" aria-hidden="true">
  <path d="M30 4 C14 4 6 18 6 34 L6 76 L14 68 L22 76 L30 68 L38 76 L46 68 L54 76 L54 34 C54 18 46 4 30 4Z" fill="#f4f0ff"/>
  <ellipse cx="22" cy="32" rx="4" ry="6" fill="#1b1030"/>
  <ellipse cx="38" cy="32" rx="4" ry="6" fill="#1b1030"/>
  <ellipse cx="30" cy="48" rx="5" ry="7" fill="#1b1030"/>
</svg>`;

export const bat = `
<svg viewBox="0 0 100 40" aria-hidden="true">
  <path class="wl" d="M50 20 C40 6 24 4 4 10 C12 14 14 20 12 26 C20 22 26 24 30 30 C34 24 42 24 50 26Z"/>
  <path class="wr" d="M50 20 C60 6 76 4 96 10 C88 14 86 20 88 26 C80 22 74 24 70 30 C66 24 58 24 50 26Z"/>
  <ellipse cx="50" cy="21" rx="6" ry="9"/>
  <path d="M45 14 l2 -7 l3 5 l3 -5 l2 7z"/>
</svg>`;

export const spider = `
<svg viewBox="0 0 40 36" aria-hidden="true">
  <g stroke="#120a1f" stroke-width="2.5" fill="none" stroke-linecap="round">
    <path d="M14 16 L4 8 L1 14"/><path d="M14 19 L3 18 L0 24"/><path d="M14 21 L5 27 L4 34"/><path d="M15 23 L10 32 L11 36"/>
    <path d="M26 16 L36 8 L39 14"/><path d="M26 19 L37 18 L40 24"/><path d="M26 21 L35 27 L36 34"/><path d="M25 23 L30 32 L29 36"/>
  </g>
  <circle cx="20" cy="12" r="6" fill="#120a1f"/>
  <ellipse cx="20" cy="22" rx="8" ry="9" fill="#120a1f"/>
  <circle cx="18" cy="11" r="1.4" fill="#ff4d4d"/><circle cx="22" cy="11" r="1.4" fill="#ff4d4d"/>
</svg>`;

export const house = `
<svg viewBox="0 0 220 200" aria-hidden="true">
  <g fill="#0f0818">
    <path d="M10 200 V112 L52 72 L94 112 V200Z"/>
    <path d="M70 200 V92 L124 42 L178 92 V200Z"/>
    <rect x="140" y="34" width="28" height="70"/>
    <path d="M134 36 L154 0 L174 36Z"/>
    <rect x="92" y="50" width="12" height="30"/>
    <path d="M178 200 V150 h30 v50z"/>
  </g>
  <g class="lit" fill="#ffb347">
    <rect x="30" y="126" width="13" height="17"/>
    <rect x="62" y="126" width="13" height="17"/>
    <rect x="95" y="112" width="15" height="20"/>
    <rect x="138" y="112" width="15" height="20"/>
    <path d="M148 70 v-10 a6 6 0 0 1 12 0 v10z"/>
    <rect x="186" y="162" width="10" height="12"/>
  </g>
  <path d="M112 200 v-26 a10 10 0 0 1 20 0 v26z" fill="#c75b12"/>
</svg>`;

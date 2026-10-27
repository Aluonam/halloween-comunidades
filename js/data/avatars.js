// Emoji de cada peque según su alias. Se busca en orden: gana la primera palabra que encaje.
// Las palabras van sin tildes ni mayúsculas y se comparan con el inicio de cada palabra del alias
// ("bruj" encaja con "Bruji, bruji" y con "La bruja Lola").
// Si no encaja ninguna, se usa uno de los de `fallback`.
export const avatars = [
  // Personajes concretos (antes que las palabras genéricas)
  [["peter pan", "piter pan", "campanilla", "tinker"], "🧚"],
  [["garfio", "hook", "pirat"], "🏴‍☠️"],
  [["chucky", "annabelle", "muñec", "doll"], "🔪"],
  [["frankenstein"], "🧟‍♂️"],
  [["dracul", "vampir", "vampire"], "🧛"],
  [["batman", "batgirl", "murcielag"], "🦇"],
  [["spider", "arañ"], "🕷️"],
  [["pennywise", "payas", "clown"], "🤡"],
  [["elsa", "frozen", "olaf", "muñeco de nieve", "snow"], "⛄"],

  // Disfraces de Halloween
  [["calaba", "pumpkin", "jack"], "🎃"],
  [["bruj", "witch"], "🧙‍♀️"],
  [["mago", "maga", "wizard", "harry"], "🧙"],
  [["fantasm", "ghost", "espectr"], "👻"],
  [["calaver", "esquelet", "skelet", "skull", "hueso", "catrin"], "💀"],
  [["zombi", "momia", "mummy"], "🧟"],
  [["lobo", "loba", "wolf"], "🐺"],
  [["gat", "catwoman", "kitty"], "🐈‍⬛"],
  [["buho", "lechuz", "owl"], "🦉"],
  [["diabl", "demon", "devil", "diablill"], "😈"],
  [["monstru", "monster"], "👹"],
  [["alien", "marcian", "extraterrest"], "👽"],
  [["ojo", "eye"], "👁️"],
  [["serpient", "snake"], "🐍"],

  // Otros disfraces habituales
  [["princes", "reina", "queen"], "👸"],
  [["principe", "rey", "prince", "king"], "🤴"],
  [["hada", "fairy"], "🧚"],
  [["sirena", "mermaid"], "🧜‍♀️"],
  [["elf"], "🧝"],
  [["dino", "rex", "dinosaur"], "🦖"],
  [["dragon"], "🐉"],
  [["unicorn"], "🦄"],
  [["ninja"], "🥷"],
  [["robot"], "🤖"],
  [["super", "hero", "heroe"], "🦸"],
  [["astronaut", "espacial"], "🧑‍🚀"],
  [["vaquer", "cowboy"], "🤠"],
  [["leon", "lion"], "🦁"],
  [["tigre", "tiger"], "🐯"],
  [["mariquit"], "🐞"],
  [["mariposa", "butterfly"], "🦋"],
  [["abej", "bee"], "🐝"],
];

export const fallback = ["🎃", "👻", "🦇", "🕷️", "🧙", "🧛", "🧟", "💀", "🐈‍⬛", "🦉"];

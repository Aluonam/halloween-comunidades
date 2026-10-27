// Datos de ejemplo para el modo demostración (cuando config.api está vacío).
export const demoDoors = {
  buildings: [
    { id: "1-0B", tags: [] },
    { id: "1-3A", tags: ["gluten"] },
    { id: "2-2C", tags: [] },
    { id: "2-5F", tags: ["nuts"] },
    { id: "3-0I", tags: [] },
    { id: "3-4D", tags: [] },
    { id: "4-1B", tags: ["gluten", "nuts"] },
  ],
  houses: [
    { id: "calle-del-olmo-3", street: "Calle del Olmo", number: "3", tags: [] },
    { id: "calle-del-olmo-8", street: "Calle del Olmo", number: "8", tags: ["gluten"] },
    { id: "calle-del-olmo-15", street: "Calle del Olmo", number: "15", tags: [] },
    { id: "calle-del-roble-4", street: "Calle del Roble", number: "4", tags: ["nuts"] },
    { id: "calle-del-roble-12b", street: "Calle del Roble", number: "12B", tags: [] },
  ],
};

export const demoKids = [
  { alias: "Bruja Piruja", age: "6", allergy: "" },
  { alias: "Vampirito", age: "4", allergy: "frutos secos" },
  { alias: "Calabacín Zombi", age: "8", allergy: "" },
];

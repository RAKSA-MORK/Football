import type { Formation, FormationName, Role, RoleSlot, ShirtSize } from "./types";

export const roles: Role[] = [
  "Goalkeeper",
  "Center Back",
  "Left Back",
  "Right Back",
  "Defensive Midfielder",
  "Central Midfielder",
  "Attacking Midfielder",
  "Left Winger",
  "Right Winger",
  "Striker",
  "Reserve",
];

export const pitchRoles = roles.filter((role) => role !== "Reserve") as Exclude<Role, "Reserve">[];

export const shirtSizes: ShirtSize[] = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

export const roleShortName: Record<Role, string> = {
  "Goalkeeper": "GK",
  "Center Back": "CB",
  "Left Back": "LB",
  "Right Back": "RB",
  "Defensive Midfielder": "DM",
  "Central Midfielder": "CM",
  "Attacking Midfielder": "AM",
  "Left Winger": "LW",
  "Right Winger": "RW",
  "Striker": "ST",
  "Reserve": "RES",
};

const slot = (
  id: string,
  role: Exclude<Role, "Reserve">,
  label: string,
  x: number,
  y: number
): RoleSlot => ({ id, role, label, x, y });

export const formations: Record<FormationName, Formation> = {
  "4-4-2": {
    name: "4-4-2",
    slots: [
      slot("gk", "Goalkeeper", "Goalkeeper", 50, 92),
      slot("lb", "Left Back", "Left Back", 18, 72),
      slot("cb1", "Center Back", "Center Back", 39, 72),
      slot("cb2", "Center Back", "Center Back", 61, 72),
      slot("rb", "Right Back", "Right Back", 82, 72),
      slot("lm", "Left Winger", "Left Midfield", 18, 48),
      slot("cm1", "Central Midfielder", "Centre Midfield", 39, 50),
      slot("cm2", "Central Midfielder", "Centre Midfield", 61, 50),
      slot("rm", "Right Winger", "Right Midfield", 82, 48),
      slot("st1", "Striker", "Centre Forward", 39, 20),
      slot("st2", "Striker", "Centre Forward", 61, 20),
    ],
  },
  "4-3-3": {
    name: "4-3-3",
    slots: [
      slot("gk", "Goalkeeper", "Goalkeeper", 50, 92),
      slot("lb", "Left Back", "Left Back", 16, 72),
      slot("cb1", "Center Back", "Center Back", 39, 74),
      slot("cb2", "Center Back", "Center Back", 61, 74),
      slot("rb", "Right Back", "Right Back", 84, 72),
      slot("dm", "Defensive Midfielder", "Defensive Midfield", 50, 58),
      slot("cm1", "Central Midfielder", "Central Midfield", 35, 46),
      slot("cm2", "Central Midfielder", "Central Midfield", 65, 46),
      slot("lw", "Left Winger", "Left Winger", 20, 23),
      slot("st", "Striker", "Striker", 50, 18),
      slot("rw", "Right Winger", "Right Winger", 80, 23),
    ],
  },
  "3-5-2": {
    name: "3-5-2",
    slots: [
      slot("gk", "Goalkeeper", "Goalkeeper", 50, 92),
      slot("cb1", "Center Back", "Center Back", 30, 73),
      slot("cb2", "Center Back", "Center Back", 50, 76),
      slot("cb3", "Center Back", "Center Back", 70, 73),
      slot("lm", "Left Winger", "Left Midfield", 14, 50),
      slot("dm", "Defensive Midfielder", "Defensive Midfield", 38, 56),
      slot("cm", "Central Midfielder", "Central Midfield", 50, 46),
      slot("am", "Attacking Midfielder", "Attacking Midfield", 62, 56),
      slot("rm", "Right Winger", "Right Midfield", 86, 50),
      slot("st1", "Striker", "Striker", 39, 20),
      slot("st2", "Striker", "Striker", 61, 20),
    ],
  },
  "4-2-3-1": {
    name: "4-2-3-1",
    slots: [
      slot("gk", "Goalkeeper", "Goalkeeper", 50, 92),
      slot("lb", "Left Back", "Left Back", 16, 73),
      slot("cb1", "Center Back", "Center Back", 39, 75),
      slot("cb2", "Center Back", "Center Back", 61, 75),
      slot("rb", "Right Back", "Right Back", 84, 73),
      slot("dm1", "Defensive Midfielder", "Defensive Midfield", 40, 58),
      slot("dm2", "Defensive Midfielder", "Defensive Midfield", 60, 58),
      slot("lw", "Left Winger", "Left Winger", 20, 39),
      slot("am", "Attacking Midfielder", "Attacking Midfield", 50, 36),
      slot("rw", "Right Winger", "Right Winger", 80, 39),
      slot("st", "Striker", "Striker", 50, 17),
    ],
  },
  Custom: {
    name: "Custom",
    slots: [
      slot("gk", "Goalkeeper", "Goalkeeper", 50, 92),
      slot("cb", "Center Back", "Center Back", 50, 72),
      slot("cm", "Central Midfielder", "Central Midfielder", 50, 50),
      slot("st", "Striker", "Striker", 50, 22),
    ],
  },
};

export const formationNames = Object.keys(formations) as FormationName[];

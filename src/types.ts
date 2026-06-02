export type Role =
  | "Goalkeeper"
  | "Center Back"
  | "Left Back"
  | "Right Back"
  | "Defensive Midfielder"
  | "Central Midfielder"
  | "Attacking Midfielder"
  | "Left Winger"
  | "Right Winger"
  | "Striker"
  | "Reserve";

export type FormationName = "4-4-2" | "4-3-3" | "3-5-2" | "4-2-3-1" | "Custom";

export type ShirtSize = "S" | "M" | "L" | "XL" | "2XL" | "3XL" | "4XL" | "5XL";

export interface Player {
  id: string;
  name: string;
  realName: string;
  shirtNumber: number;
  shirtSize: ShirtSize;
  role: Role;
  isCaptain: boolean;
}

export interface RoleSlot {
  id: string;
  role: Exclude<Role, "Reserve">;
  label: string;
  x: number;
  y: number;
}

export interface Formation {
  name: FormationName;
  slots: RoleSlot[];
}

import type { Formation, FormationName, Player } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export type SquadStatePayload = {
  players: Player[];
  formationName: FormationName;
  customFormation: Formation;
};

export async function fetchSavedSquad(): Promise<Partial<SquadStatePayload>> {
  const response = await fetch(`${API_URL}/api/squads/latest`);

  if (!response.ok) {
    throw new Error("Failed to fetch saved squad");
  }

  return response.json();
}

export async function saveSquad(payload: SquadStatePayload) {
  const response = await fetch(`${API_URL}/api/squads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to save squad");
  }

  return response.json();
}

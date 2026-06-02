import type { Formation, FormationName, Player } from "./types";

/**
 * Important:
 * - In Vercel production, API routes live on the same domain as the frontend.
 *   So production must call "/api/..." and must NOT call localhost.
 * - In local dev, Vite runs on 5173 and Vercel API routes run on 4000.
 */
function getApiBaseUrl() {
  if (import.meta.env.PROD) {
    return "";
  }

  return import.meta.env.VITE_API_URL || "http://localhost:4000";
}

const API_URL = getApiBaseUrl();

export type SquadStatePayload = {
  players: Player[];
  formationName: FormationName;
  customFormation: Formation;
};

export async function fetchSavedSquad(): Promise<Partial<SquadStatePayload>> {
  const response = await fetch(`${API_URL}/api/squads/latest`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch saved squad: ${response.status}`);
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
    throw new Error(`Failed to save squad: ${response.status}`);
  }

  return response.json();
}

export async function clearSavedSquadFile() {
  const response = await fetch(`${API_URL}/api/squads`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to clear squad: ${response.status}`);
  }

  return response.json();
}

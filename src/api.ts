import type { Formation, FormationName, Player } from "./types";

/**
 * Production calls same-domain Vercel API routes.
 * Local dev calls Vercel dev API on port 4000.
 */
function getApiBaseUrl() {
  if (import.meta.env.PROD) {
    return "";
  }

  return import.meta.env.VITE_API_URL || "http://localhost:4000";
}

const API_URL = getApiBaseUrl();

export type StorageMode = "mongodb" | "server-file-fallback" | "local-browser-storage";

export type SquadStatePayload = {
  players: Player[];
  formationName: FormationName;
  customFormation: Formation;
  storage?: StorageMode;
  warning?: string;
  mongoError?: string;
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

  return response.json() as Promise<SquadStatePayload>;
}

export async function clearSavedSquadFile() {
  const response = await fetch(`${API_URL}/api/squads`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to clear squad: ${response.status}`);
  }

  return response.json() as Promise<SquadStatePayload>;
}

import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

export type ServerSquadState = {
  players: unknown[];
  formationName: string;
  customFormation: unknown;
  updatedAt?: string;
  storage?: "mongodb" | "server-file-fallback";
};

const defaultCustomFormation = {
  name: "Custom",
  slots: [
    { id: "gk", role: "Goalkeeper", label: "Goalkeeper", x: 50, y: 92 },
    { id: "cb", role: "Center Back", label: "Center Back", x: 50, y: 72 },
    { id: "cm", role: "Central Midfielder", label: "Central Midfielder", x: 50, y: 50 },
    { id: "st", role: "Striker", label: "Striker", x: 50, y: 22 }
  ]
};

export const defaultSquadState: ServerSquadState = {
  players: [],
  formationName: "4-4-2",
  customFormation: defaultCustomFormation,
  storage: "server-file-fallback",
};

function getServerFilePath() {
  // Vercel Serverless Functions can write only to /tmp.
  // Locally this also works and avoids writing inside immutable build output.
  return process.env.SERVER_FILE_STORE_PATH || path.join(os.tmpdir(), "football-squad-state.json");
}

export async function readServerFileStore(): Promise<ServerSquadState> {
  try {
    const raw = await fs.readFile(getServerFilePath(), "utf-8");
    return {
      ...JSON.parse(raw),
      storage: "server-file-fallback",
    };
  } catch {
    return defaultSquadState;
  }
}

export async function writeServerFileStore(state: Omit<ServerSquadState, "updatedAt" | "storage">) {
  const filePath = getServerFilePath();

  await fs.mkdir(path.dirname(filePath), { recursive: true });

  const nextState: ServerSquadState = {
    ...state,
    updatedAt: new Date().toISOString(),
    storage: "server-file-fallback",
  };

  await fs.writeFile(filePath, JSON.stringify(nextState, null, 2), "utf-8");

  return nextState;
}

export async function clearServerFileStore() {
  return writeServerFileStore({
    players: [],
    formationName: "4-4-2",
    customFormation: defaultCustomFormation,
  });
}

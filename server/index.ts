import "dotenv/config";
import cors from "cors";
import express from "express";
import { promises as fs } from "node:fs";
import path from "node:path";

type SquadState = {
  players: unknown[];
  formationName: string;
  customFormation: unknown;
  updatedAt?: string;
};

const app = express();
const port = Number(process.env.PORT ?? 4000);

const dataFilePath =
  process.env.DATA_FILE_PATH ??
  path.join(process.cwd(), "server", "data", "squad-state.json");

const defaultState: SquadState = {
  players: [],
  formationName: "4-4-2",
  customFormation: null,
};

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://football-omega-one.vercel.app"],
  credentials: true,
}));

app.use(express.json({ limit: "2mb" }));

async function ensureDataDirectory() {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
}

async function readSquadState(): Promise<SquadState> {
  try {
    const raw = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(raw) as SquadState;
  } catch (error: unknown) {
    const code = (error as NodeJS.ErrnoException).code;

    if (code === "ENOENT") {
      return defaultState;
    }

    throw error;
  }
}

async function writeSquadState(state: SquadState) {
  await ensureDataDirectory();

  const nextState: SquadState = {
    ...state,
    updatedAt: new Date().toISOString(),
  };

  await fs.writeFile(dataFilePath, JSON.stringify(nextState, null, 2), "utf-8");
  return nextState;
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, dataFilePath });
});

app.get("/api/squads/latest", async (_req, res) => {
  try {
    const squad = await readSquadState();
    return res.json(squad);
  } catch (error) {
    console.error("Failed to read squad file:", error);
    return res.status(500).json({ message: "Failed to read squad data file." });
  }
});

app.post("/api/squads", async (req, res) => {
  try {
    const { players, formationName, customFormation } = req.body ?? {};

    if (!Array.isArray(players)) {
      return res.status(400).json({ message: "players must be an array." });
    }

    if (typeof formationName !== "string") {
      return res.status(400).json({ message: "formationName must be a string." });
    }

    if (!customFormation || typeof customFormation !== "object") {
      return res.status(400).json({ message: "customFormation is required." });
    }

    const saved = await writeSquadState({
      players,
      formationName,
      customFormation,
    });

    return res.json(saved);
  } catch (error) {
    console.error("Failed to save squad file:", error);
    return res.status(500).json({ message: "Failed to save squad data file." });
  }
});

app.delete("/api/squads", async (_req, res) => {
  try {
    const saved = await writeSquadState(defaultState);
    return res.json(saved);
  } catch (error) {
    console.error("Failed to clear squad file:", error);
    return res.status(500).json({ message: "Failed to clear squad data file." });
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
  console.log(`Squad data file: ${dataFilePath}`);
});

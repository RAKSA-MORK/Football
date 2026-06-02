import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDatabase, getMongoConfig } from "../../lib/mongodb";
import { clearServerFileStore, writeServerFileStore } from "../../lib/serverFileStore";

const DEFAULT_KEY = "default";

const defaultCustomFormation = {
  name: "Custom",
  slots: [
    { id: "gk", role: "Goalkeeper", label: "Goalkeeper", x: 50, y: 92 },
    { id: "cb", role: "Center Back", label: "Center Back", x: 50, y: 72 },
    { id: "cm", role: "Central Midfielder", label: "Central Midfielder", x: 50, y: 50 },
    { id: "st", role: "Striker", label: "Striker", x: 50, y: 22 }
  ]
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    return saveSquad(req, res);
  }

  if (req.method === "DELETE") {
    return clearSquad(res);
  }

  return res.status(405).json({ message: "Method not allowed." });
}

async function saveSquad(req: VercelRequest, res: VercelResponse) {
  const config = getMongoConfig();

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

  const nextState = {
    players,
    formationName,
    customFormation,
  };

  try {
    if (!config.hasMongoUri) {
      const fallback = await writeServerFileStore(nextState);
      return res.status(200).json({
        ...fallback,
        warning: "MongoDB URI is missing. Saved to server file fallback.",
      });
    }

    const db = getDatabase();

    const mongoState = {
      key: DEFAULT_KEY,
      players,
      formationName,
      customFormation,
      updatedAt: new Date().toISOString(),
    };

    await db.collection("squad_states").updateOne(
      { key: DEFAULT_KEY },
      { $set: mongoState, $setOnInsert: { createdAt: new Date().toISOString() } },
      { upsert: true }
    );

    return res.status(200).json({
      ...mongoState,
      storage: "mongodb",
    });
  } catch (error) {
    console.error("MongoDB save failed. Falling back to server file store:", error);

    const fallback = await writeServerFileStore(nextState);

    return res.status(200).json({
      ...fallback,
      warning: "MongoDB save failed. Saved to server file fallback.",
      mongoError: error instanceof Error ? error.message : String(error),
    });
  }
}

async function clearSquad(res: VercelResponse) {
  const config = getMongoConfig();

  const emptyState = {
    players: [],
    formationName: "4-4-2",
    customFormation: defaultCustomFormation,
  };

  try {
    if (!config.hasMongoUri) {
      const fallback = await clearServerFileStore();
      return res.status(200).json({
        ...fallback,
        warning: "MongoDB URI is missing. Cleared server file fallback.",
      });
    }

    const db = getDatabase();

    const mongoState = {
      key: DEFAULT_KEY,
      ...emptyState,
      updatedAt: new Date().toISOString(),
    };

    await db.collection("squad_states").updateOne(
      { key: DEFAULT_KEY },
      { $set: mongoState, $setOnInsert: { createdAt: new Date().toISOString() } },
      { upsert: true }
    );

    return res.status(200).json({
      ...mongoState,
      storage: "mongodb",
    });
  } catch (error) {
    console.error("MongoDB clear failed. Falling back to server file store:", error);

    const fallback = await clearServerFileStore();

    return res.status(200).json({
      ...fallback,
      warning: "MongoDB clear failed. Cleared server file fallback.",
      mongoError: error instanceof Error ? error.message : String(error),
    });
  }
}

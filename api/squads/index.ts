import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDatabase } from "../../lib/mongodb";

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

    const db = getDatabase();
    const nextState = {
      key: DEFAULT_KEY,
      players,
      formationName,
      customFormation,
      updatedAt: new Date().toISOString(),
    };

    await db.collection("squad_states").updateOne(
      { key: DEFAULT_KEY },
      { $set: nextState, $setOnInsert: { createdAt: new Date().toISOString() } },
      { upsert: true }
    );

    return res.status(200).json(nextState);
  } catch (error) {
    console.error("Failed to save squad:", error);
    return res.status(500).json({
      message: "Failed to save squad data.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

async function clearSquad(res: VercelResponse) {
  try {
    const db = getDatabase();

    const emptyState = {
      key: DEFAULT_KEY,
      players: [],
      formationName: "4-4-2",
      customFormation: defaultCustomFormation,
      updatedAt: new Date().toISOString(),
    };

    await db.collection("squad_states").updateOne(
      { key: DEFAULT_KEY },
      { $set: emptyState, $setOnInsert: { createdAt: new Date().toISOString() } },
      { upsert: true }
    );

    return res.status(200).json(emptyState);
  } catch (error) {
    console.error("Failed to clear squad:", error);
    return res.status(500).json({
      message: "Failed to clear squad data.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

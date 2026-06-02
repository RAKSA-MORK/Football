import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDatabase, getMongoConfig } from "../../lib/mongodb";
import { readServerFileStore } from "../../lib/serverFileStore";

const DEFAULT_KEY = "default";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const config = getMongoConfig();

  try {
    if (!config.hasMongoUri) {
      const fallback = await readServerFileStore();
      return res.status(200).json({
        ...fallback,
        warning: "MongoDB URI is missing. Loaded from server file fallback.",
      });
    }

    const db = getDatabase();
    const squad = await db.collection("squad_states").findOne({ key: DEFAULT_KEY });

    if (!squad) {
      return res.status(200).json({
        players: [],
        formationName: "4-4-2",
        customFormation: null,
        storage: "mongodb",
      });
    }

    return res.status(200).json({
      players: squad.players ?? [],
      formationName: squad.formationName ?? "4-4-2",
      customFormation: squad.customFormation ?? null,
      updatedAt: squad.updatedAt,
      storage: "mongodb",
    });
  } catch (error) {
    console.error("MongoDB read failed. Falling back to server file store:", error);

    const fallback = await readServerFileStore();

    return res.status(200).json({
      ...fallback,
      warning: "MongoDB read failed. Loaded from server file fallback.",
      mongoError: error instanceof Error ? error.message : String(error),
    });
  }
}

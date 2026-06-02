import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDatabase } from "../../lib/mongodb";

const DEFAULT_KEY = "default";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const db = getDatabase();
    const squad = await db.collection("squad_states").findOne({ key: DEFAULT_KEY });

    if (!squad) {
      return res.status(200).json({
        players: [],
        formationName: "4-4-2",
        customFormation: null,
      });
    }

    return res.status(200).json({
      players: squad.players ?? [],
      formationName: squad.formationName ?? "4-4-2",
      customFormation: squad.customFormation ?? null,
      updatedAt: squad.updatedAt,
    });
  } catch (error) {
    console.error("Failed to read squad:", error);
    return res.status(500).json({
      message: "Failed to read squad data.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

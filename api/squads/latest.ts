import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../lib/prisma";

const DEFAULT_KEY = "default";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  if (_req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const squad = await prisma.squadState.findUnique({
      where: { key: DEFAULT_KEY },
    });

    if (!squad) {
      return res.status(200).json({
        players: [],
        formationName: "4-4-2",
        customFormation: null,
      });
    }

    return res.status(200).json({
      players: squad.players,
      formationName: squad.formationName,
      customFormation: squad.customFormation,
      updatedAt: squad.updatedAt,
    });
  } catch (error) {
    console.error("Failed to read squad:", error);
    return res.status(500).json({ message: "Failed to read squad data." });
  }
}

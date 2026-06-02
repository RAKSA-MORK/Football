import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDatabase } from "../lib/mongodb";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const db = getDatabase();
    await db.command({ ping: 1 });

    return res.status(200).json({
      ok: true,
      database: process.env.MONGODB_DB || "football_squad_builder",
      hasMongoUri: Boolean(process.env.MONGODB_URI),
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return res.status(500).json({
      ok: false,
      hasMongoUri: Boolean(process.env.MONGODB_URI),
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

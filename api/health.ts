import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDatabase, getMongoConfig } from "../lib/mongodb";
import { readServerFileStore } from "../lib/serverFileStore";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const config = getMongoConfig();

  try {
    if (!config.hasMongoUri) {
      const fileState = await readServerFileStore();

      return res.status(200).json({
        ok: true,
        mongodb: false,
        fileFallback: true,
        hasMongoUri: false,
        database: config.databaseName,
        fileStorage: fileState.storage,
        message: "MONGODB_URI is missing. API is using server file fallback.",
      });
    }

    const db = getDatabase();
    await db.command({ ping: 1 });

    return res.status(200).json({
      ok: true,
      mongodb: true,
      fileFallback: false,
      hasMongoUri: true,
      database: config.databaseName,
      message: "MongoDB connection OK.",
    });
  } catch (error) {
    console.error("Health check MongoDB failed. Server file fallback is available:", error);

    const fileState = await readServerFileStore();

    return res.status(200).json({
      ok: true,
      mongodb: false,
      fileFallback: true,
      hasMongoUri: config.hasMongoUri,
      database: config.databaseName,
      fileStorage: fileState.storage,
      message: "MongoDB failed. API is using server file fallback.",
      mongoError: error instanceof Error ? error.message : String(error),
    });
  }
}

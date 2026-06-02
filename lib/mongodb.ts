import { MongoClient, type Db, type MongoClientOptions } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

let cachedClient: MongoClient | null = null;

function cleanMongoUri(value: string | undefined) {
  if (!value) return "";

  // Sometimes env values are copied with quotes into dashboards.
  // This removes surrounding single/double quotes only.
  return value.trim().replace(/^['"]|['"]$/g, "");
}

export function getMongoConfig() {
  const uri = cleanMongoUri(process.env.MONGODB_URI);
  const databaseName = process.env.MONGODB_DB || "football_squad_builder";

  return {
    uri,
    databaseName,
    hasMongoUri: Boolean(uri),
  };
}

export function getMongoClient() {
  const { uri } = getMongoConfig();

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (cachedClient) {
    return cachedClient;
  }

  const options: MongoClientOptions = {
    appName: "football-squad-builder",
    maxIdleTimeMS: 5000,
  };

  cachedClient = new MongoClient(uri, options);

  try {
    attachDatabasePool(cachedClient);
  } catch (error) {
    // Keep API alive even if this helper is unavailable in local/dev runtime.
    console.warn("attachDatabasePool failed; continuing with cached MongoClient.", error);
  }

  return cachedClient;
}

export function getDatabase(): Db {
  const { databaseName } = getMongoConfig();
  return getMongoClient().db(databaseName);
}

import { MongoClient, type Db, type MongoClientOptions } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

const options: MongoClientOptions = {
  appName: "football-squad-builder",
  maxIdleTimeMS: 5000,
};

const client = new MongoClient(uri, options);

// Attach the client to ensure proper cleanup on Vercel Function suspension.
attachDatabasePool(client);

export default client;

export function getDatabase(): Db {
  // Your pasted URI has no database path after mongodb.net/.
  // Native MongoDB can still work if we explicitly choose a database name here.
  return client.db(process.env.MONGODB_DB || "football_squad_builder");
}

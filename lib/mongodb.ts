import { MongoClient, type MongoClientOptions } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

const options: MongoClientOptions = {
  appName: "devrel.vercel.integration",
  maxIdleTimeMS: 5000,
};

const client = new MongoClient(uri, options);

// This is useful when using the native MongoDB driver in Vercel Functions.
// Prisma uses its own connection handling, so this helper is available
// for future native-driver endpoints.
attachDatabasePool(client);

export default client;

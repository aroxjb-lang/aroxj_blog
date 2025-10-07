import { Collection, MongoClient, MongoClientOptions } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  appName: "devrel.vercel.integration",
};

let client: MongoClient | null = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClient?: MongoClient;
    };

    if (!globalWithMongo._mongoClient) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClient = client;
    }
    client = globalWithMongo._mongoClient;
  } else {
    client = new MongoClient(uri, options);

    attachDatabasePool(client);
  }
}



export default client;

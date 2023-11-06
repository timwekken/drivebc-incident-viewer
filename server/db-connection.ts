import { MongoClient, Db } from "mongodb";

const connectionString = process.env.MONGODB_CONNECTION;

let client: MongoClient | null = null;

async function connectDB(): Promise<void> {
  try {
    if (!connectionString) {
      throw new Error("No connection string for MongoDB provided");
    }
    if (!client) {
      client = new MongoClient(connectionString);
      console.log("Attempting to connect to MongoDB...");
      await client.connect();
      console.log("Connected to MongoDB!");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Unable to connect to the database");
  }
}

export async function getDB(): Promise<Db> {
  try {
    if (!client) {
      await connectDB();
    }
    if (!client) {
      throw new Error("MongoDB client is not available");
    }
    return client.db(process.env.NEXT_DB_NAME);
  } catch (error) {
    throw error;
  }
}

export async function closeDB(): Promise<void> {
  try {
    if (client) {
      await client.close();
      client = null;
      console.log("MongoDB connection closed");
    }
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}

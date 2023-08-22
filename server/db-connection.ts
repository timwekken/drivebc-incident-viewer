import { MongoClient } from "mongodb";
// TODO: Move to env
const connectionString = "mongodb+srv://admin:BfOAgqdTdRNjbU5Y@cluster1.trujpua.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(connectionString);

const dbName = "drivebc";

export const connectToServer = async () => {
  console.log("Attemping to connect to MongoDB...");
  await client.connect().catch((err) => {
    console.error(err);
  });
  console.log("Connected to MongoDB!");
};

export const getDb = () => {
  return client.db(dbName);
};

export default { connectToServer, getDb };

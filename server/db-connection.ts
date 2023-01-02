import { MongoClient } from "mongodb";
// TODO: Move to env
const connectionString =
  "mongodb+srv://admin:uG7RnnE7wqWoEipM@cluster0.sb2867x.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(connectionString);

const dbName = "drivebc";

export const connectToServer = async () => {
  console.log("Attemping to connect to MongoDB...");
  await client.connect();
  console.log("Connected to MongoDB!");
};

export const getDb = () => {
  return client.db(dbName);
};

export default { connectToServer, getDb };

import { MongoClient } from "mongodb";
import dotenv from "dotenv"

dotenv.config()

// MongoDB connection string from environment variables
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGO_CONNECTION_STRING environment variable is not set.");
}

// MongoDB client and collection setup
const client = new MongoClient(uri);
const databaseName = "auth_test";
const collectionName = "test";

async function runWebJob() {
  try {
    await client.connect();
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);

    console.log("Connected to MongoDB. Starting WebJob...");

    // Run the job indefinitely
    while (true) {
      try {
        const document = { date: new Date() };
        await collection.insertOne(document);
        console.log(`Inserted document: ${JSON.stringify(document)}`);
      } catch (err) {
        console.error("Error inserting document:", err);
      }

      // Wait for 30 seconds
      await new Promise((resolve) => setTimeout(resolve, 30000));
    }
  } catch (err) {
    console.error("WebJob error:", err);
  } finally {
    await client.close();
  }
}

runWebJob().catch(console.error);
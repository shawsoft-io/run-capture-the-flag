import { MongoClient } from "mongodb";
import cron from "node-cron";
import dotenv from "dotenv"
import  dbClient  from "../lib/mongodb"
import clientPromise from "../lib/mongodb";
dotenv.config()

// MongoDB connection string
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set.");
}

const client = new MongoClient(uri);
const collectionName = "web_job_activity"



async function processExpiringTokens() {
  const client = await clientPromise;
  const db = client.db();
  const accountsCollection = db.collection("accounts");

  const currentTime = Math.floor(Date.now() / 1000);
  const threshold = currentTime + 5 * 60; 

  const expiringAccounts = await accountsCollection.find({
    expires_at: { $lte: threshold },
  }).toArray();

  console.log(`Found ${expiringAccounts.length} accounts with expiring tokens.`);

  for (const account of expiringAccounts) {

    
  }
}

processExpiringTokens().catch(console.error);

// Job function to insert a document into MongoDB
async function insertDocument() {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection(collectionName);

    const document = {
       executionStartAt: new Date(),
       executionCompleteAt: null,
       status: "In progress"
    };
    await collection.insertOne(document);

    console.log(`[WEBJOB] Inserted document: ${JSON.stringify(document)}`);
  } catch (err) {
    console.error("[WEBJOB] Error inserting document:", err);
  } finally {
    await client.close();
  }
}

const cronSchedule = process.env.WEBJOB_CRON;
if (!cronSchedule) {
  throw new Error("[WEBJOB] WEBJOB_CRON environment variable is not set.");
}


// Schedule the job using node-cron
cron.schedule(cronSchedule, () => {
  console.log(`[WEBJOB] Running job at ${new Date()}`);

  processExpiringTokens().catch(console.error);

  insertDocument();
});

console.log(`[WEBJOB] WebJob started with schedule: ${cronSchedule}`);
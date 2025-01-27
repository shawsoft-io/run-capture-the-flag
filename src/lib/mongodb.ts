import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || ''; // MongoDB connection string from .env
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

/**
 * Get the MongoDB client instance
 */
export const getMongoClient = async (): Promise<MongoClient> => {
  if (!client) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  if (clientPromise) {
    await clientPromise;
  }

  return client!;
};

/**
 * Get the MongoDB database instance
 */
export const getDatabase = async (dbName: string): Promise<Db> => {
  const client = await getMongoClient();
  return client.db(dbName);
};
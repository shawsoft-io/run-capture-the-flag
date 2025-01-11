import NextAuth, { User } from "next-auth"
import Strava from "next-auth/providers/strava"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { ObjectId } from "mongodb"
import  dbClient  from "./lib/mongodb"
import clientPromise from "./lib/mongodb"


export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  secret: process.env.AUTH_SECRET,
  adapter: MongoDBAdapter(dbClient),
  providers: [
    Strava({
      clientId: process.env.AUTH_STRAVA_CLIENT_ID!,
      clientSecret: process.env.AUTH_STRAVA_SECRET!,
        authorization : {
            params: {
                scope:  "read_all,activity:read_all" 
            }
        },
      },
    ),
  ],
  callbacks: {
    async signIn({ user } : { user: User}) {      

      // If initial sign in there is nothing to update so skip
      if (!ObjectId.isValid(user.id ?? "")) {
        return true; 
      }

      const client = await clientPromise;
      const db = client.db();
      const usersCollection = db.collection<User>("users");

      await usersCollection.updateOne(
        { _id: new ObjectId(user.id) },
        {
          $set: {
            image: user.image,
            lastLoginAt: new Date()
          },
        }
      );    

      return true;
    },
  },
  events: {
    async createUser({ user } : { user: User }) {
      const client = await clientPromise;
      const db = client.db();
      const usersCollection = db.collection<User>("users");
      
      await usersCollection.updateOne(
        { _id: new ObjectId(user.id) },
        {
          $set: {
            role: "athlete", // default role
            verified: false,
            createdAt: new Date(),
            lastLoginAt: new Date()
          },
        }
      );    
    }      
  }
})
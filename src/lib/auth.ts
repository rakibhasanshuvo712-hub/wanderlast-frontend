import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins"

const uri = process.env.MONGODB_URI;

// Fail fast with an actionable message. The driver throws while parsing an
// empty/undefined connection string, and because this module is imported while
// `next build` collects page data, a missing MONGODB_URI would otherwise fail
// the Vercel build with a cryptic "Invalid scheme" error.
if (!uri || !/^mongodb(\+srv)?:\/\//.test(uri)) {
  throw new Error(
    "MONGODB_URI is missing or invalid. Set it in .env.local for local development and in the Vercel project's Environment Variables (Project Settings > Environment Variables) for production."
  );
}

const client = new MongoClient(uri);
const db = client.db('wanderlust');

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled:true,
  },
   plugins: [
        jwt(), 
    ],
    session: {
      cookieCache:{
        enabled:true ,
        strategy: 'jwt',
        maxAge:7*24*60*60
      }
    }
});
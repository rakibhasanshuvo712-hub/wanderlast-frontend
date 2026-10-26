import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(
      new Error(
        "MONGODB_URI is not defined. Add it to .env.local (e.g. MONGODB_URI=mongodb://localhost:27017/wanderlust)"
      )
    )
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri)
      global._mongoClientPromise = client.connect()
    }
    return global._mongoClientPromise
  }

  if (!clientPromise) {
    client = new MongoClient(uri)
    clientPromise = client.connect()
  }
  return clientPromise
}

export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise()
  return client.db("wanderlust")
}

export async function getCollection(collectionName: string) {
  const db = await getDatabase()
  return db.collection(collectionName)
}

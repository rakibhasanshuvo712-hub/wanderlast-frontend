import { NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb"

export async function GET() {
  try {
    const collection = await getCollection("destination")
    const destinations = await collection.find({}).toArray()

    return NextResponse.json(destinations, { status: 200 })
  } catch (err) {
    console.error("Failed to fetch destinations:", err)
    return NextResponse.json(
      { success: false, message: "Failed to fetch destinations" },
      { status: 500 }
    )
  }
}

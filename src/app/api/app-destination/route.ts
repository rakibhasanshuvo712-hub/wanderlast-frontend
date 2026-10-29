import { NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth-session"

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Sign in to add a travel package" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()

    if (!body || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { success: false, message: "Destination name is required" },
        { status: 400 }
      )
    }

    const doc = {
      name: body.name.trim(),
      country: typeof body.country === "string" ? body.country : "",
      category: typeof body.category === "string" ? body.category : "Beach",
      price: String(body.price ?? ""),
      duration: typeof body.duration === "string" ? body.duration : "",
      departureDate:
        typeof body.departureDate === "string" ? body.departureDate : "",
      imageUrl: typeof body.imageUrl === "string" ? body.imageUrl : "",
      description: typeof body.description === "string" ? body.description : "",
      rating: typeof body.rating === "number" ? body.rating : 4.5,
      reviews: typeof body.reviews === "number" ? body.reviews : 0,
      highlights: Array.isArray(body.highlights) ? body.highlights : [],
      exclusions: Array.isArray(body.exclusions) ? body.exclusions : [],
      createdBy: { id: user.id, name: user.name, email: user.email },
    }

    const collection = await getCollection("destination")
    const result = await collection.insertOne(doc)

    return NextResponse.json(
      {
        success: true,
        message: "Travel package added",
        data: { ...doc, _id: result.insertedId.toString() },
      },
      { status: 201 }
    )
  } catch (err) {
    console.error("Failed to add travel package:", err)
    return NextResponse.json(
      { success: false, message: "Failed to add travel package" },
      { status: 500 }
    )
  }
}

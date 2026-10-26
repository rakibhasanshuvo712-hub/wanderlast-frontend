import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getCollection } from "@/lib/mongodb"

export async function GET() {
  try {
    const collection = await getCollection("bookings")
    const bookings = await collection.find({}).sort({ bookedAt: -1 }).toArray()

    return NextResponse.json(bookings, { status: 200 })
  } catch (err) {
    console.error("Failed to fetch bookings:", err)
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const destinationId =
      body && typeof body.destinationId === "string" ? body.destinationId : ""

    if (!destinationId || !ObjectId.isValid(destinationId)) {
      return NextResponse.json(
        { success: false, message: "A valid destination id is required" },
        { status: 400 }
      )
    }

    const destinations = await getCollection("destination")
    const destination = await destinations.findOne({
      _id: new ObjectId(destinationId),
    })

    if (!destination) {
      return NextResponse.json(
        { success: false, message: "Destination not found" },
        { status: 404 }
      )
    }

    // Snapshot the trip details so the booking survives later edits.
    const booking = {
      destinationId,
      name: String(destination.name ?? "Trip"),
      country: String(destination.country ?? ""),
      price: String(destination.price ?? ""),
      duration: String(destination.duration ?? ""),
      departureDate: String(destination.departureDate ?? ""),
      imageUrl: String(destination.imageUrl ?? ""),
      bookedAt: new Date(),
    }

    const collection = await getCollection("bookings")
    const result = await collection.insertOne(booking)

    return NextResponse.json(
      { ...booking, _id: result.insertedId.toString() },
      { status: 201 }
    )
  } catch (err) {
    console.error("Failed to create booking:", err)
    return NextResponse.json(
      { success: false, message: "Failed to create booking" },
      { status: 500 }
    )
  }
}

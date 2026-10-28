import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getCollection } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth-session"

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/**
 * GET /api/bookings
 *
 * Returns the bookings that belong to the signed-in user only. Each booking
 * document in MongoDB stores `userId`, `userName` and `userEmail`, so every
 * account sees its own list — never anyone else's.
 *
 * Optional `?userId=` / `?email=` query params exist for clients pointed at an
 * external backend that has no session cookie; they are only accepted when
 * they match the signed-in user.
 */
export async function GET(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Sign in to view your bookings" },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const requestedUserId = searchParams.get("userId")
  const requestedEmail = searchParams.get("email")

  const mismatchedUser =
    (requestedUserId && requestedUserId !== user.id) ||
    (requestedEmail &&
      requestedEmail.toLowerCase() !== user.email.toLowerCase())

  if (mismatchedUser) {
    return NextResponse.json(
      { success: false, message: "You can only view your own bookings" },
      { status: 403 }
    )
  }

  try {
    const collection = await getCollection("bookings")
    const bookings = await collection
      .find({
        $or: [
          { userId: user.id },
          // Bookings saved before user tracking only carry an email.
          { userEmail: user.email, userId: { $exists: false } },
        ],
      })
      .sort({ bookedAt: -1 })
      .toArray()

    return NextResponse.json(bookings, { status: 200 })
  } catch (err) {
    console.error("Failed to fetch bookings:", err)
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/bookings
 *
 * Creates a booking for the signed-in user. The trip details are snapshotted
 * from the destination document on the server (so the client cannot invent a
 * price or name), together with the user's id, name and email.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Sign in to book a trip" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json().catch(() => null)
    const destinationId =
      body && typeof body.destinationId === "string" ? body.destinationId : ""
    const departureDate =
      body && typeof body.departureDate === "string"
        ? body.departureDate.trim()
        : ""

    if (!destinationId || !ObjectId.isValid(destinationId)) {
      return NextResponse.json(
        { success: false, message: "A valid destination id is required" },
        { status: 400 }
      )
    }

    if (departureDate && !DATE_PATTERN.test(departureDate)) {
      return NextResponse.json(
        { success: false, message: "Departure date must be YYYY-MM-DD" },
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

    // Snapshot the trip + user onto the booking so it survives later edits.
    const booking = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      destinationId,
      destinationName: String(destination.name ?? "Trip"),
      destinationImage: String(destination.imageUrl ?? ""),
      country: String(destination.country ?? ""),
      price: String(destination.price ?? ""),
      duration: String(destination.duration ?? ""),
      departureDate: departureDate || String(destination.departureDate ?? ""),
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

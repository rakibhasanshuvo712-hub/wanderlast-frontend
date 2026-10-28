import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getCollection } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth-session"

type Params = { params: Promise<{ id: string }> }

/**
 * DELETE /api/bookings/:id
 *
 * Cancels a booking. Only the user who created the booking may delete it —
 * ownership is checked against the session, not against anything the client
 * sends in the request.
 */
export async function DELETE(_request: Request, { params }: Params) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Sign in to cancel a booking" },
      { status: 401 }
    )
  }

  const { id } = await params

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid booking id" },
      { status: 400 }
    )
  }

  try {
    const collection = await getCollection("bookings")
    const booking = await collection.findOne({ _id: new ObjectId(id) })

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      )
    }

    const ownsBooking =
      booking.userId === user.id ||
      // Bookings saved before user tracking only carry an email.
      (!booking.userId &&
        typeof booking.userEmail === "string" &&
        booking.userEmail.toLowerCase() === user.email.toLowerCase())

    if (!ownsBooking) {
      return NextResponse.json(
        { success: false, message: "You can only cancel your own bookings" },
        { status: 403 }
      )
    }

    await collection.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json(
      { success: true, message: "Booking cancelled" },
      { status: 200 }
    )
  } catch (err) {
    console.error("Failed to cancel booking:", err)
    return NextResponse.json(
      { success: false, message: "Failed to cancel booking" },
      { status: 500 }
    )
  }
}

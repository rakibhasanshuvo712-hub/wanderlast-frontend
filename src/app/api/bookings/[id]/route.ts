import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getCollection } from "@/lib/mongodb"

type Params = { params: Promise<{ id: string }> }

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid booking id" },
      { status: 400 }
    )
  }

  try {
    const collection = await getCollection("bookings")
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      )
    }

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

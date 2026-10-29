import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getCollection } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth-session"

const editableFields = [
  "name",
  "country",
  "category",
  "price",
  "duration",
  "departureDate",
  "imageUrl",
  "description",
] as const

type Params = { params: Promise<{ id: string }> }

function invalidId() {
  return NextResponse.json(
    { success: false, message: "Invalid destination id" },
    { status: 400 }
  )
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params

  if (!ObjectId.isValid(id)) return invalidId()

  try {
    const collection = await getCollection("destination")
    const destination = await collection.findOne({ _id: new ObjectId(id) })

    if (!destination) {
      return NextResponse.json(
        { success: false, message: "Destination not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(destination, { status: 200 })
  } catch (err) {
    console.error("Failed to fetch destination:", err)
    return NextResponse.json(
      { success: false, message: "Failed to fetch destination" },
      { status: 500 }
    )
  }
}

async function updateDestination(request: Request, id: string) {
  if (!ObjectId.isValid(id)) return invalidId()

  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Sign in to edit a travel package" },
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

    const updates: Record<string, unknown> = {}
    for (const field of editableFields) {
      if (typeof body[field] === "string") {
        updates[field] =
          field === "name" ? (body[field] as string).trim() : body[field]
      }
    }

    const collection = await getCollection("destination")
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Destination not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Travel package updated",
        data: { _id: id, ...updates },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error("Failed to update travel package:", err)
    return NextResponse.json(
      { success: false, message: "Failed to update travel package" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params
  return updateDestination(request, id)
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  return updateDestination(request, id)
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params

  if (!ObjectId.isValid(id)) return invalidId()

  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Sign in to delete a travel package" },
      { status: 401 }
    )
  }

  try {
    const collection = await getCollection("destination")
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Destination not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Travel package deleted" },
      { status: 200 }
    )
  } catch (err) {
    console.error("Failed to delete travel package:", err)
    return NextResponse.json(
      { success: false, message: "Failed to delete travel package" },
      { status: 500 }
    )
  }
}

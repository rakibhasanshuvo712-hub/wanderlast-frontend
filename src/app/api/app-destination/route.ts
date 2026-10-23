import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Received travel package:", body)
    return NextResponse.json(
      { success: true, message: "Travel package added", data: body },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to add travel package" },
      { status: 400 }
    )
  }
}

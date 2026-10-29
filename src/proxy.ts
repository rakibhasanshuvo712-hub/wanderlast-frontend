import { NextResponse, type NextRequest } from "next/server"
import { auth } from "@/lib/auth"

/**
 * Guards the pages that create or edit travel packages. Browsing
 * destinations, booking and the bookings list stay public — the API routes
 * (e.g. /api/app-destination, /api/destinations/:id) do their own session
 * checks and return 401 JSON, so only the HTML pages are redirected here.
 */
export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (session?.user) {
    return NextResponse.next()
  }

  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/app-destination/:path*"],
}

import { headers } from "next/headers"
import { auth } from "@/lib/auth"

/**
 * Read the better-auth session for the incoming request (server-only).
 *
 * Returns the signed-in user, or `null` when nobody is authenticated. API
 * routes use this so bookings are always tied to a real account instead of
 * trusting user ids sent from the client.
 */
export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

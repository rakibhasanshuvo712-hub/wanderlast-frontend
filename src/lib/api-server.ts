/**
 * Server-only helpers for reaching this app's API routes.
 *
 * Kept separate from `@/lib/api` because `next/headers` cannot be imported by
 * client components, and `API_BASE` is shared with them.
 */
import { headers } from "next/headers"
import { API_BASE } from "./api"

/**
 * Resolve an API path to an absolute URL for calls made from server
 * components — `fetch("/api/...")` only works in the browser, where the origin
 * is implied.
 */
export async function apiUrl(path: string): Promise<string> {
  if (/^https?:\/\//i.test(API_BASE)) {
    return `${API_BASE}${path}`
  }

  const requestHeaders = await headers()
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http"
  const host = requestHeaders.get("host") ?? "localhost:3000"

  return `${protocol}://${host}${API_BASE}${path}`
}

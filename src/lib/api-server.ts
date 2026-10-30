/**
 * Server-only helpers for reaching this app's API routes.
 *
 * Kept separate from `@/lib/api` because `next/headers` cannot be imported by
 * client components, and `API_BASE` is shared with them.
 */
import { headers } from "next/headers"
import { API_BASE, apiBases } from "./api"

/**
 * Resolve an API path to an absolute URL for calls made from server
 * components — `fetch("/api/...")` only works in the browser, where the origin
 * is implied.
 *
 * `base` defaults to the configured backend; pass one of `apiBases()` to
 * resolve against this app's own routes instead. Trailing slashes are trimmed
 * so a base like `http://localhost:8000/` cannot produce `//destination`.
 */
export async function apiUrl(
  path: string,
  base: string = API_BASE
): Promise<string> {
  const cleanBase = base.replace(/\/+$/, "")

  if (/^https?:\/\//i.test(cleanBase)) {
    return `${cleanBase}${path}`
  }

  const requestHeaders = await headers()
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http"
  const host = requestHeaders.get("host") ?? "localhost:3000"

  return `${protocol}://${host}${cleanBase}${path}`
}

/**
 * Server-side twin of `fetchFromApi()`: try every base (the configured backend
 * first, then this app's own routes) against each candidate path and keep the
 * first answer that isn't a 404 (a 404 means the route shape was wrong, not
 * that the document is missing).
 *
 * The last response wins when every candidate 404s; transport errors are only
 * rethrown once every base and path has failed.
 */
export async function fetchFromApiServer(
  paths: string[],
  init?: RequestInit
): Promise<Response> {
  let lastError: unknown = null
  let lastResponse: Response | null = null

  for (const base of apiBases()) {
    for (const path of paths) {
      try {
        const res = await fetch(await apiUrl(path, base), init)
        if (res.status !== 404) return res
        lastResponse = res
      } catch (err) {
        lastError = err
      }
    }
  }

  if (lastResponse) return lastResponse
  throw lastError instanceof Error
    ? lastError
    : new Error("Could not reach the destination API")
}

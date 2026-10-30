/**
 * Base URL for the destination API.
 *
 * NEXT_PUBLIC_API_URL points at the backend server that owns the data:
 * http://localhost:8000 in development, and the deployed backend URL on Vercel.
 * NEXT_PUBLIC_* values are inlined at build time, so the variable has to be set
 * in the Vercel project's Environment Variables before deploying.
 *
 * This app's own Next.js API routes (`/api/destination[s]`) are used when the
 * variable is unset, and again as a fallback whenever the configured backend
 * cannot be reached — see `apiBases()`.
 *
 * Always read the base through `API_BASE` — never concatenate
 * `process.env.NEXT_PUBLIC_API_URL` directly, because an unset variable would
 * otherwise build URLs like `undefined/destination`.
 *
 * Server components should use the helpers in `@/lib/api-server` instead of
 * concatenating this value directly — a relative path only works in the
 * browser.
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api"

/**
 * This app's own API routes. Always relative to the page origin, so it works
 * identically in the browser and in a server component (where it is resolved
 * to an absolute URL by `apiUrl()` in `@/lib/api-server`).
 */
const APP_API_BASE = "/api"

/**
 * Every base worth trying, in order: the configured backend first, then this
 * app's own API routes.
 *
 * The second entry only differs from the first when NEXT_PUBLIC_API_URL points
 * somewhere else — and it is what keeps the app alive when that backend is
 * unreachable (not running locally, asleep or redeploying): a transport error
 * on the first base simply falls through to the routes this app owns, which
 * serve the same MongoDB collections. Trailing slashes are trimmed so a base
 * like `http://localhost:8000/` cannot produce `//destination` URLs.
 */
export function apiBases(): string[] {
  const primary = API_BASE.replace(/\/+$/, "")
  return primary === APP_API_BASE ? [primary] : [primary, APP_API_BASE]
}

/**
 * Destination endpoints, primary shape first.
 *
 * Two route shapes exist in the wild:
 *   - this app's own routes:      /api/destinations, /api/destinations/:id
 *   - the external backend:       /destination,      /destination/:id
 *
 * Callers ask every base (see `apiBases()`) for every candidate and use the
 * first one that doesn't answer 404, so the frontend works against either
 * backend without reconfiguring NEXT_PUBLIC_API_URL. Creating a package uses
 * `/app-destination` on both.
 */
export function destinationPaths(id?: string): string[] {
  const suffix = id ? `/${encodeURIComponent(id)}` : ""
  return [`/destinations${suffix}`, `/destination${suffix}`]
}

/** Endpoint that creates a travel package (same path on both backends). */
export const CREATE_DESTINATION_PATH = "/app-destination"

/**
 * Issue a request against the first base + candidate path combination that
 * isn't answered with a 404 (a 404 means we guessed the route shape wrong, not
 * that the resource is missing — genuine "not found" only comes back from the
 * shape that exists).
 *
 * Bases are tried in order, so the configured backend wins whenever it answers;
 * this app's own routes only take over once it errors out or lacks the route.
 * The last response is returned when every candidate 404s; transport errors
 * are only rethrown once every base and path has failed.
 */
export async function fetchFromApi(
  paths: string[],
  init?: RequestInit
): Promise<Response> {
  let lastError: unknown = null
  let lastResponse: Response | null = null

  for (const base of apiBases()) {
    for (const path of paths) {
      try {
        const res = await fetch(`${base}${path}`, init)
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

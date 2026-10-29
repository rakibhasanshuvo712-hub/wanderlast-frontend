/**
 * Base URL for the destination API.
 *
 * Defaults to this app's own Next.js API routes (`/api/destination[s]`), so the
 * pages work without a separate backend process — leave NEXT_PUBLIC_API_URL
 * unset for Vercel, where the relative `/api` base resolves against the
 * deployment's own origin. Set NEXT_PUBLIC_API_URL only when the data is
 * served by another host (it must be an absolute origin incl. `/api`).
 *
 * Server components should use `apiUrl()` from `@/lib/api-server` instead of
 * concatenating this value directly — a relative path only works in the
 * browser.
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api"

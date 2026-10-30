import { jwtClient } from "better-auth/client/plugins"

import { createAuthClient } from "better-auth/react"
// Only NEXT_PUBLIC_* variables reach the browser bundle — BETTER_AUTH_URL is
// server-only, so reading it here is always undefined once the app is built.
// Leaving baseURL unset makes better-auth call the page origin, which is
// correct both locally and on Vercel.
export const authClient = createAuthClient({
    plugins: [
        jwtClient (), 
    ]
})
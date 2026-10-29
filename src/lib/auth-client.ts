import { jwtClient } from "better-auth/client/plugins"

import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    // Only NEXT_PUBLIC_* variables reach the browser bundle — BETTER_AUTH_URL
    // is server-only, so reading it here would always be undefined once the
    // app is deployed. When unset, better-auth falls back to the page origin,
    // which is correct both locally and on Vercel.
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    plugins: [
        jwtClient (), 
    ]
})
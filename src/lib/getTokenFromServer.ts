import { headers } from "next/headers";
import { auth } from "./auth";

/**
 * Mint a JWT for the current request, or `undefined` when there is no session.
 *
 * better-auth throws (`APIError: Unauthorized`) instead of returning null for
 * an anonymous visitor — and this is called by public pages (the destination
 * detail page, for one), so a missing session must never surface as an error:
 * callers simply send no `authorization` header.
 */
export const getTokenFromServer =async(): Promise<string | undefined> => {
    try {
        const jwtToken=await auth.api.getToken({
            headers:await headers()
        })
        return jwtToken?.token
    } catch {
        return undefined
    }
}
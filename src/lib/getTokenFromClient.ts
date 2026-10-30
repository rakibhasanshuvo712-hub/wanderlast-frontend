import { authClient } from "./auth-client"/**
 * Mint a JWT for the signed-in user, or `undefined` when nobody is signed in.
 *
 * Never throws: callers treat a missing token as "unauthenticated" and let the
 * server answer instead of failing the whole action.
 */
export const getTokenFromClient= async (): Promise<string | undefined> => {
    try {
        const {data}= await authClient.token();
        return data?.token;
    } catch {
        return undefined;
    }
}
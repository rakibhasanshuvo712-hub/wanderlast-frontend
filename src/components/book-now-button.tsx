"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

/**
 * Where bookings are written. Defaults to this app's own session-backed API
 * route (`/api/bookings`), so the signed-in user is read from the cookie
 * instead of trusting ids sent by the client, and the trip details are
 * snapshotted from the destination document on the server. The My Bookings
 * page reads from this same route, so writes and reads always agree on the
 * shape of a booking.
 */
const BOOKING_ENDPOINT =
  process.env.NEXT_PUBLIC_BOOKING_API_URL ?? "/api/bookings"

export function BookNowButton({
  destinationId,
  departureDate,
  callbackPath,
}: {
  destinationId: string
  destinationName?: string
  destinationImage?: string
  price?: string
  /** Departure date that ships with the destination, used as the default. */
  departureDate?: string
  /** Where to return after signing in (only used when the session expired). */
  callbackPath?: string
}) {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const user = session?.user

  const [date, setDate] = React.useState(departureDate ?? "")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const today = new Date().toISOString().slice(0, 10)

  const handleBook = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (loading) return

    if (!user) {
      // Session expired between page load and click — send them to login.
      router.push(
        `/login?callbackUrl=${encodeURIComponent(callbackPath ?? "/bookings")}`
      )
      return
    }

    setLoading(true)
    setError(null)

    // The API route reads the signed-in user from the session cookie and
    // snapshots the trip from the destination document, so only the trip
    // itself has to be sent from here.
    const payload = {
      destinationId,
      departureDate: date,
    }

    try {
      const res = await fetch(BOOKING_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.message ?? "Something went wrong")
      }

      router.push("/bookings")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleBook} className="space-y-3">
      <div className="space-y-1.5">
        <label
          htmlFor="departure-date"
          className="text-sm font-medium text-foreground"
        >
          Departure date
        </label>
        <Input
          id="departure-date"
          type="date"
          value={date}
          min={today}
          onChange={(event) => setDate(event.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-600 text-white hover:bg-cyan-700"
      >
        {loading ? "Booking…" : "Book Now"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      {error && (
        <p className="text-sm text-rose-500" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}

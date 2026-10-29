"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { API_BASE } from "@/lib/api"

/**
 * Where bookings are written. Defaults to this app's own session-backed API
 * route (`/api/bookings`), so the signed-in user is read from the cookie
 * instead of trusting ids sent by the client. Override with
 * NEXT_PUBLIC_BOOKING_API_URL if bookings live on another host.
 */
const BOOKING_ENDPOINT =
  process.env.NEXT_PUBLIC_BOOKING_API_URL ?? `${API_BASE}/bookings`

export function BookNowButton({
  destinationId,
  destinationName,
  destinationImage,
  price,
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

    // Field names must match what the bookings collection and the My Bookings
    // page read back: userId/userName/userEmail + a snapshot of the trip.
    const payload = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      destinationId,
      destinationName: destinationName ?? "Trip",
      destinationImage: destinationImage ?? "",
      price: price ?? "",
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

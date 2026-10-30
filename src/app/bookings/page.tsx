"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, MapPin, PlaneTakeoff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"

interface Booking {
  _id: string
  destinationId: string
  /** Snapshot of the trip taken when it was booked. */
  destinationName: string
  destinationImage?: string
  country?: string
  price?: string
  duration?: string
  departureDate?: string
  bookedAt?: string
}

function SignInCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sign in to see your bookings</CardTitle>
        <CardDescription>
          Your bookings are tied to your account, so sign in to view the trips
          you&apos;ve booked.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href="/login?callbackUrl=/bookings"
          className={`${buttonVariants({ variant: "default" })} mt-2`}
        >
          Sign in
        </Link>
      </CardContent>
    </Card>
  )
}

export default function BookingsPage() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [loadedFor, setLoadedFor] = React.useState<string | null>(null)
  const [failed, setFailed] = React.useState(false)
  const [cancellingId, setCancellingId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!user?.id) return

    const controller = new AbortController()
    const userId = user.id

    const loadBookings = async () => {
      try {
        const res = await fetch("/api/bookings", {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`Server responded ${res.status}`)
        const data = await res.json()
        setBookings(Array.isArray(data) ? data : [])
        setFailed(false)
        setLoadedFor(userId)
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return
        setFailed(true)
        setLoadedFor(userId)
      }
    }

    loadBookings()

    return () => controller.abort()
  }, [user?.id, user?.email])

  // Still loading until the fetch for the signed-in user settles.
  const loading = !isPending && !!user && loadedFor !== user.id

  const handleCancel = async (id: string) => {
    if (cancellingId) return
    setCancellingId(id)

    try {
      // The backend has no booking-delete route yet, so cancelling still goes
      // through this app's own session-backed handler. Switch it to
      // `${process.env.NEXT_PUBLIC_API_URL}/booking/:id` once that route exists.
      const res = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error(`Server responded ${res.status}`)
      setBookings((prev) => prev.filter((booking) => booking._id !== id))
    } catch (err) {
      console.error("Failed to cancel booking:", err)
      window.alert("Could not cancel this booking. Please try again.")
    } finally {
      setCancellingId(null)
    }
  }

  const showEmpty = !!user && !loading && !failed && bookings.length === 0

  return (
    <div className="min-h-[60vh] bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My Bookings
        </h1>
        <p className="mt-2 text-muted-foreground">
          {user?.name
            ? `Trips ${user.name} has booked, all in one place.`
            : "Trips you've booked, all in one place."}
        </p>

        <div className="mt-8">
          {isPending && (
            <p className="text-sm text-muted-foreground">Checking session…</p>
          )}

          {!isPending && !user && <SignInCard />}

          {loading && (
            <p className="text-sm text-muted-foreground">Loading bookings…</p>
          )}

          {failed && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Bookings are unavailable right now
                </CardTitle>
                <CardDescription>
                  We couldn&apos;t load your bookings. Please try again in a
                  moment.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {showEmpty && !failed && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">No bookings yet</CardTitle>
                <CardDescription>
                  Book a trip and it will show up here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/destinations"
                  className={`${buttonVariants({ variant: "outline" })} mt-2`}
                >
                  Browse destinations
                </Link>
              </CardContent>
            </Card>
          )}

          {!loading && !failed && bookings.length > 0 && (
            <ul className="space-y-4">
              {bookings.map((booking) => (
                <li key={booking._id}>
                  <Card>
                    <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
                      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg sm:w-48">
                        {booking.destinationImage && (
                          <Image
                            src={booking.destinationImage}
                            alt={booking.destinationName}
                            fill
                            sizes="(max-width: 640px) 100vw, 192px"
                            className="object-cover"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate text-lg font-semibold text-foreground">
                            {booking.destinationName}
                          </h2>
                          <Badge variant="outline">Booked</Badge>
                        </div>

                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                          {booking.country && (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              {booking.country}
                            </span>
                          )}
                          {booking.departureDate && (
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-4 w-4" />
                              Departs {booking.departureDate}
                            </span>
                          )}
                          {booking.duration && (
                            <span className="inline-flex items-center gap-1.5">
                              <PlaneTakeoff className="h-4 w-4" />
                              {booking.duration}
                            </span>
                          )}
                        </div>

                        {booking.bookedAt && (
                          <p className="text-xs text-muted-foreground">
                            Booked on{" "}
                            {new Date(booking.bookedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-start gap-3 sm:items-end">
                        <span className="text-xl font-bold text-foreground">
                          {booking.price ? `$${booking.price}` : "Price on request"}
                        </span>
                        <div className="flex gap-2">
                          <Link
                            href={`/destinations/${booking.destinationId}`}
                            className={buttonVariants({
                              variant: "outline",
                              size: "sm",
                            })}
                          >
                            View trip
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={cancellingId === booking._id}
                            onClick={() => handleCancel(booking._id)}
                          >
                            {cancellingId === booking._id
                              ? "Cancelling…"
                              : "Cancel"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

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
import { API_BASE } from "@/lib/api"

interface Booking {
  _id: string
  destinationId: string
  name: string
  country?: string
  price?: string
  duration?: string
  departureDate?: string
  imageUrl?: string
  bookedAt?: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [loading, setLoading] = React.useState(true)
  const [failed, setFailed] = React.useState(false)
  const [cancellingId, setCancellingId] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetch(`${API_BASE}/bookings`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setBookings(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setFailed(true)
        setLoading(false)
      })
  }, [])

  const handleCancel = async (id: string) => {
    if (cancellingId) return
    setCancellingId(id)

    try {
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
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

  return (
    <div className="min-h-[60vh] bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My Bookings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Trips you&apos;ve booked, all in one place.
        </p>

        <div className="mt-8">
          {loading && (
            <p className="text-sm text-muted-foreground">Loading bookings…</p>
          )}

          {failed && !loading && (
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

          {!loading && !failed && bookings.length === 0 && (
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
                        {booking.imageUrl && (
                          <Image
                            src={booking.imageUrl}
                            alt={booking.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 192px"
                            className="object-cover"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate text-lg font-semibold text-foreground">
                            {booking.name}
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

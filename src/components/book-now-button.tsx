"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { API_BASE } from "@/lib/api"

export function BookNowButton({ destinationId }: { destinationId: string }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleBook = async () => {
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationId }),
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
    <div className="space-y-2">
      <Button
        onClick={handleBook}
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
    </div>
  )
}

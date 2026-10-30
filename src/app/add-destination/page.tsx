"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { API_BASE, CREATE_DESTINATION_PATH } from "@/lib/api"
import { getTokenFromClient } from "@/lib/getTokenFromClient"

const initialForm = {
  name: "",
  country: "",
  category: "Beach",
  price: "",
  duration: "",
  departureDate: "",
  imageUrl: "",
  description: "",
}

export default function AddDestinationPage() {
  const router = useRouter()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }))

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      const token = await getTokenFromClient()

      const res = await fetch(`${API_BASE}${CREATE_DESTINATION_PATH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      })

      const result = await res.json().catch(() => null)

      if (res.status === 401) {
        // Nobody is signed in (or the token expired) — let login send the
        // visitor back here afterwards instead of failing silently.
        router.push(
          `/login?callbackUrl=${encodeURIComponent("/add-destination")}`
        )
        return
      }

      if (!res.ok) {
        throw new Error(result?.message ?? `Server responded ${res.status}`)
      }

      router.push("/destinations")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground">
            Add New Travel Package
          </h1>
          <p className="mt-2 text-muted-foreground">
            Publish a new destination to the listings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="destination-name">Destination Name</Label>
              <Input
                id="destination-name"
                required
                placeholder="e.g., Bali Paradise"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="category">Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) => update("category", value ?? "Beach")}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Beach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beach">Beach</SelectItem>
                  <SelectItem value="City">City</SelectItem>
                  <SelectItem value="Mountain">Mountain</SelectItem>
                  <SelectItem value="Desert">Desert</SelectItem>
                  <SelectItem value="Island">Island</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="e.g., Indonesia"
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                required
                placeholder="e.g., 1299"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 7 Days/6 Nights"
                value={form.duration}
                onChange={(e) => update("duration", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="departure-date">Departure Date</Label>
              <Input
                id="departure-date"
                type="date"
                value={form.departureDate}
                onChange={(e) => update("departureDate", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the travel experience..."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href="/destinations"
              className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="bg-cyan-600 text-white hover:bg-cyan-700"
            >
              {loading ? "Adding..." : "Add Travel Package"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

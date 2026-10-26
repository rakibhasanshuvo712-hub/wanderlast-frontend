"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { API_BASE } from "@/lib/api"

export interface DestinationInput {
  name: string
  country: string
  category: string
  price: string
  duration: string
  departureDate: string
  imageUrl: string
  description: string
}

const emptyValues: DestinationInput = {
  name: "",
  country: "",
  category: "Beach",
  price: "",
  duration: "",
  departureDate: "",
  imageUrl: "",
  description: "",
}

export function DestinationForm({
  id,
  initial,
}: {
  id?: string
  initial?: Partial<DestinationInput>
}) {
  const editing = Boolean(id)
  const router = useRouter()

  const [formData, setFormData] = useState<DestinationInput>({
    ...emptyValues,
    ...initial,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (key: keyof DestinationInput, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        editing ? `${API_BASE}/destinations/${id}` : `${API_BASE}/app-destination`,
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      )

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.message ?? "Something went wrong")
      }

      router.push(editing ? `/destinations/${id}` : "/destinations")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="destination-name">Destination Name</Label>
          <Input
            id="destination-name"
            required
            placeholder="e.g., Bali Paradise"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange("category", value ?? "Beach")}
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
            value={formData.country}
            onChange={(e) => handleChange("country", e.target.value)}
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
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            placeholder="e.g., 7 Days/6 Nights"
            value={formData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="departure-date">Departure Date</Label>
          <Input
            id="departure-date"
            type="date"
            value={formData.departureDate}
            onChange={(e) => handleChange("departureDate", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="image-url">Image URL</Label>
        <Input
          id="image-url"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={formData.imageUrl}
          onChange={(e) => handleChange("imageUrl", e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the travel experience..."
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={4}
        />
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href={editing ? `/destinations/${id}` : "/destinations"}
          className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
        >
          Cancel
        </Link>
        <Button
          type="submit"
          disabled={loading}
          className="bg-cyan-600 text-white hover:bg-cyan-700"
        >
          {loading
            ? editing
              ? "Saving..."
              : "Adding..."
            : editing
              ? "Save changes"
              : "Add Travel Package"}
        </Button>
      </div>
    </form>
  )
}

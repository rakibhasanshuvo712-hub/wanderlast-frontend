"use client"

import React, { useState } from "react"
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

export default function AddDestination() {
  const [formData, setFormData] = useState({
    name: "Bali Paradise",
    country: "Indonesia",
    category: "Beach",
    price: "",
    duration: "",
    departureDate: "",
    imageUrl: "https://example.com/image.jpg",
    description: "",
  })

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/app-destination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error(`Server responded ${res.status}`)
      const data = await res.json()
      console.log("Add Travel Package:", data)
      alert("Travel package added successfully!")
    } catch (err) {
      console.error("Failed to add travel package:", err)
      alert("Failed to add travel package. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="max-w-2xl w-full">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground">
            Add New Travel Package
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="destination-name">Destination Name</Label>
              <Input
                id="destination-name"
                placeholder="e.g., Bali Paradise"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={formData.category}
                onValueChange={(value) => handleChange("category", value ?? "")}
              >
                <SelectTrigger>
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
                placeholder="mm/dd/yyyy"
                value={formData.departureDate}
                onChange={(e) => handleChange("departureDate", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
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

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" className="border-destructive text-destructive">
              Cancel
            </Button>
            <Button type="submit" variant="default" className="bg-primary text-primary-foreground">
              Add Travel Package
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { API_BASE } from "@/lib/api"

interface Destination {
  _id?: string
  name?: string
  category?: string
  price?: string
  duration?: string
  imageUrl?: string
  rating?: number
}

const categories = ["All", "Beach", "City", "Mountain", "Desert", "Island"]

const priceRanges = [
  { label: "All", min: 0, max: Number.POSITIVE_INFINITY },
  { label: "$0 - $1,000", min: 0, max: 1000 },
  { label: "$1,000 - $2,500", min: 1000, max: 2500 },
  { label: "$2,500 - $5,000", min: 2500, max: 5000 },
  { label: "$5,000+", min: 5000, max: Number.POSITIVE_INFINITY },
]

const sorts = ["Featured", "Price: Low to High", "Price: High to Low", "Rating"]

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  const [category, setCategory] = useState("All")
  const [priceRange, setPriceRange] = useState("All")
  const [sort, setSort] = useState("Featured")

  useEffect(() => {
    fetch(`${API_BASE}/destinations`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setDestinations(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setFailed(true)
        setLoading(false)
      })
  }, [])

  const visible = useMemo(() => {
    const range =
      priceRanges.find((option) => option.label === priceRange) ?? priceRanges[0]

    const filtered = destinations.filter((dest) => {
      const matchesCategory = category === "All" || dest.category === category
      const value = Number.parseFloat(dest.price ?? "") || 0
      const matchesPrice = value >= range.min && value <= range.max
      return matchesCategory && matchesPrice
    })

    const sorted = [...filtered]
    if (sort === "Price: Low to High") {
      sorted.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
    } else if (sort === "Price: High to Low") {
      sorted.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
    } else if (sort === "Rating") {
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    }

    return sorted
  }, [destinations, category, priceRange, sort])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-6 w-32 rounded bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] bg-background">
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Explore All Destinations
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Find your perfect travel experience from our curated collection
          </p>

          {/* Filter bar */}
          <div className="mt-10 flex flex-wrap items-center gap-4 rounded-lg border border-input bg-card p-3 shadow-sm">
            <label className="relative flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">CATEGORY</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="bg-transparent border-none outline-none text-sm text-foreground cursor-pointer"
              >
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="relative flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">PRICE RANGE</span>
              <select
                value={priceRange}
                onChange={(event) => setPriceRange(event.target.value)}
                className="bg-transparent border-none outline-none text-sm text-foreground cursor-pointer"
              >
                {priceRanges.map((option) => (
                  <option key={option.label} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="relative flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">SORT BY</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="bg-transparent border-none outline-none text-sm text-foreground cursor-pointer"
              >
                {sorts.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Results count */}
          <p className="mt-6 text-sm text-muted-foreground">
            Showing {visible.length} destination{visible.length === 1 ? "" : "s"}
          </p>

          {/* Destinations grid */}
          {visible.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-foreground">
                {failed ? "Destinations are unavailable right now" : "No destinations match these filters"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {failed
                  ? "Start your backend server, then refresh this page."
                  : "Try a different category or price range."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/app-destination"
                  className="inline-flex items-center rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
                >
                  Add a package
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((dest, index) => (
                <Link
                  key={dest._id ?? dest.name ?? index}
                  href={`/destinations/${dest._id ?? dest.name ?? index}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                    <div className="relative h-48 bg-muted">
                      {dest.imageUrl ? (
                        <Image
                          src={dest.imageUrl}
                          alt={dest.name ?? "Destination"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                          No image
                        </div>
                      )}
                      {typeof dest.rating === "number" && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-white">
                          <span className="flex h-2 w-2 items-center">
                            <svg
                              className="text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.724c-.783-.57-.384-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </span>
                          <span>{dest.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-cyan-600 uppercase tracking-wider">
                          {dest.category ?? "Trip"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground">
                        {dest.name ?? "Untitled destination"}
                      </h3>
                      {dest.duration && (
                        <p className="mt-1 text-sm text-muted-foreground">{dest.duration}</p>
                      )}
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-lg font-bold text-foreground">
                          {dest.price ? `$${dest.price}` : "Price on request"}
                        </span>
                        {dest.price && (
                          <span className="text-sm text-muted-foreground">/Person</span>
                        )}
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-cyan-600 transition-all group-hover:gap-2">
                        BOOK NOW
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

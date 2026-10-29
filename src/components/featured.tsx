import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { getCollection } from "@/lib/mongodb"

interface FeaturedDestination {
  _id: string
  name?: string
  country?: string
  category?: string
  price?: string
  duration?: string
  imageUrl?: string
  rating?: number
  reviews?: number
}

async function loadFeatured(): Promise<FeaturedDestination[]> {
  try {
    const collection = await getCollection("destination")
    const docs = await collection
      .find({})
      .sort({ rating: -1, reviews: -1 })
      .limit(6)
      .toArray()

    return docs.map((doc) => ({
      ...doc,
      _id: String(doc._id),
    })) as FeaturedDestination[]
  } catch (err) {
    // Never let a missing database take the home page down.
    console.error("Failed to load featured destinations:", err)
    return []
  }
}

export async function Featured() {
  const destinations = await loadFeatured()

  if (destinations.length === 0) return null

  return (
    <section className="bg-background pb-16 pt-24">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
            Featured destinations
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Hand-picked trips our travelers love most, updated automatically
            from our catalog.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <Link
              key={dest._id}
              href={`/destinations/${dest._id}`}
              className="group block"
            >
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="relative h-48 bg-muted">
                  {dest.imageUrl ? (
                    <Image
                      src={dest.imageUrl}
                      alt={dest.name ?? "Destination"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="absolute inset-0 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                      No image
                    </div>
                  )}
                  {typeof dest.rating === "number" && (
                    <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{dest.rating}</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-cyan-600">
                    {dest.category ?? "Trip"}
                  </span>
                  <h3 className="text-lg font-bold text-foreground">
                    {dest.name ?? "Untitled destination"}
                  </h3>
                  {dest.country && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {dest.country}
                      {dest.duration ? ` • ${dest.duration}` : ""}
                    </p>
                  )}
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-lg font-bold text-foreground">
                      {dest.price ? `$${dest.price}` : "Price on request"}
                    </span>
                    {dest.price && (
                      <span className="text-sm text-muted-foreground">
                        /Person
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/destinations"
            className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            View all destinations
          </Link>
        </div>
      </div>
    </section>
  )
}

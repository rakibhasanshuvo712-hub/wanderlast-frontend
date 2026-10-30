import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { destinationPaths } from "@/lib/api";
import { fetchFromApiServer } from "@/lib/api-server";
import { getCurrentUser } from "@/lib/auth-session";
import DeleteDestination from "@/components/deleteDestination";

import { BookNowButton } from "@/components/book-now-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  MapPin,
  Star,
  Calendar,
  ArrowLeft,
  Check,
  X,
  Pencil,
} from "lucide-react";

interface Destination {
  _id: string;
  name?: string;
  country?: string;
  category?: string;
  price?: string;
  duration?: string;
  imageUrl?: string;
  rating?: number;
  reviews?: number;
  description?: string;
  highlights?: string[];
  exclusions?: string[];
  departureDate?: string;
}

interface DestinationDetailsPageProps {
  params: Promise<{ id: string }>;
}

type LoadResult =
  | { status: "ok"; data: Destination }
  | { status: "not-found" }
  | { status: "unavailable" };

async function loadDestination(id: string): Promise<LoadResult> {
  try {
    const token = await getTokenFromServer();

    const res = await fetchFromApiServer(destinationPaths(id), {
      cache: "no-store",
      headers: token ? { authorization: `Bearer ${token}` } : undefined,
    });

    if (res.status === 400 || res.status === 404) {
      return { status: "not-found" };
    }

    if (!res.ok) {
      return { status: "unavailable" };
    }

    const doc = (await res.json()) as Record<string, unknown> | null;

    if (!doc || typeof doc !== "object") {
      return { status: "not-found" };
    }

    return {
      status: "ok",
      data: { ...doc, _id: String(doc._id ?? id) } as Destination,
    };
  } catch (err) {
    console.error("Failed to load destination:", err);
    return { status: "unavailable" };
  }
}

export async function DestinationDetailsPage({
  params,
}: DestinationDetailsPageProps) {
  const { id } = await params;
  const result = await loadDestination(id);

  if (result.status === "not-found") {
    notFound();
  }

  if (result.status === "unavailable") {
    return (
      <div className="min-h-[60vh] bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Destinations are unavailable right now
          </h1>
          <p className="mt-3 text-muted-foreground">
            We couldn&apos;t load this trip. Please try again in a moment.
          </p>
          <Link
            href="/destinations"
            className={`${buttonVariants({ variant: "outline" })} mt-8`}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  const data = result.data;
  const highlights = data.highlights ?? [];
  const exclusions = data.exclusions ?? [];
  const user = await getCurrentUser();

  return (
    <div className="min-h-[60vh] bg-background">
      {/* Top action bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Destinations
          </Link>
          {user && (
            <div className="flex items-center gap-2">
              <Link
                href={`/app-destination/${data._id}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
              <Link
                href="/app-destination"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Add new
              </Link>
              <DeleteDestination id={data._id} />
            </div>
          )}
        </div>
      </div>

      {/* Hero Image */}
      {data.imageUrl && (
        <div className="relative h-[420px] w-full overflow-hidden">
          <Image
            src={data.imageUrl}
            alt={data.name ?? "Destination"}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <MapPin className="h-4 w-4" />
              <span>{data.country ?? "Worldwide"}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6 flex items-center gap-2">
              {data.name ?? "Destination"}
            </h1>

            {/* Category, Rating & Duration */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Badge variant="outline" className="text-sm px-2 py-1.5">
                {data.category ?? "Trip"}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-foreground">
                  {data.rating ?? "—"}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({data.reviews ?? 0} reviews)
                </span>
              </div>
              {data.duration && (
                <span className="text-sm text-muted-foreground">
                  • {data.duration}
                </span>
              )}
            </div>

            {/* Overview */}
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg max-w-2xl">
                {data.description ||
                  "A hand-picked itinerary with everything arranged — just bring your bags."}
              </p>
            </section>

            {/* Highlights */}
            {(highlights.length > 0 || exclusions.length > 0) && (
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Highlights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                      Included
                    </h3>
                    {highlights.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                        <span className="text-muted-foreground leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-5">
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                      Not Included
                    </h3>
                    {exclusions.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <X className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
                        <span className="text-muted-foreground leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Booking Sidebar */}
          <aside className="lg:col-span-4">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Starting from</CardTitle>
                <CardDescription className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">
                      {data.price ? `$${data.price}` : "Price on request"}
                    </span>
                    {data.price && (
                      <span className="text-sm text-muted-foreground">
                        /person
                      </span>
                    )}
                  </div>
                  {data.departureDate && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Departs {data.departureDate}</span>
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {user ? (
                  <BookNowButton
                    destinationId={data._id}
                    destinationName={data.name}
                    destinationImage={data.imageUrl}
                    price={data.price}
                    departureDate={data.departureDate}
                    callbackPath={`/destinations/${data._id}`}
                  />
                ) : (
                  <div className="space-y-2">
                    <Link
                      href={`/login?callbackUrl=${encodeURIComponent(`/destinations/${data._id}`)}`}
                      className={`${buttonVariants({ variant: "default" })} w-full bg-cyan-600 text-white hover:bg-cyan-700`}
                    >
                      Sign in to book
                    </Link>
                    <p className="text-center text-sm text-muted-foreground">
                      You need an account to book this trip.
                    </p>
                  </div>
                )}

                {user && (
                  <Link
                    href={`/app-destination/${data._id}`}
                    className={`${buttonVariants({ variant: "outline" })} w-full`}
                  >
                    Edit this package
                  </Link>
                )}

                <Separator />

                <div className="space-y-3">
                  {[
                    "Free cancellation up to 10 days",
                    "Travel insurance included",
                    "24/7 customer support",
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default DestinationDetailsPage;

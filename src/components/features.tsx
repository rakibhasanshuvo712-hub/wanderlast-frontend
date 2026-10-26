"use client"

import Image from "next/image"
import * as React from "react"
import { cn } from "cn"

function FeatureCard({
  src,
  title,
  description,
}: {
  src: string
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-border p-6 hover:border-primary transition-colors">
      <Image src={src} alt={title} className="mb-4 h-12 w-auto object-contain" width={48} height={48} />
      <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

export function Features({
  className,
  ...props
}: React.ComponentProps<"section"> & { className?: string }) {
  return (
    <section
      data-slot="features"
      className={cn("py-16 bg-background", className)}
      {...props}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-3xl sm:text-4xl font-bold tracking-tighter text-foreground">
            What we offer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to travel smarter and experience more.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            src="/images/Headset.png"
            title="24/7 Support"
            description="Round-the-clock assistance wherever you are in the world."
          />
          <FeatureCard
            src="/images/MapTrifold.png"
            title="Curated Destinations"
            description="Hand-picked travel guides to the best spots on the map."
          />
          <FeatureCard
            src="/images/ShieldCheck.png"
            title="Secure Booking"
            description="Safe, reliable reservations with trusted partners."
          />
        </div>
      </div>
    </section>
  )
}

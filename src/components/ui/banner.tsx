"use client"

import Image from "next/image"
import * as React from "react"
import { cn } from "cn"

export function Banner({
  className,
  ...props
}: React.ComponentProps<"section"> & { className?: string }) {
  return (
    <section
      data-slot="banner"
      className={cn(
        "relative overflow-hidden py-20 bg-background",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Banner.png"
          alt="banner"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1600px"
          priority
        />
      </div>
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="mb-4 text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tighter text-foreground">
            Build beautiful
            <span className="italic">Next.js</span> apps
          </h1>
          <p className="mb-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern portfolio template with shadcn/ui, Tailwind CSS v4, and the React Compiler.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 bg-primary text-primary-foreground hover:bg-primary/80">
              View Projects
              <svg
                aria-hidden="true"
                className="ml-2 -ms-1 inline-block align-middle size-4"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </button>
            <button className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 bg-background border border-border hover:bg-muted hover:text-foreground dark:hover:bg-muted/30">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

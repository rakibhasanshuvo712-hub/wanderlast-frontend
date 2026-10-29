import type { Metadata } from "next"
import Link from "next/link"
import { CompassIcon, PlaneIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you're looking for doesn't exist — but plenty of great destinations do.",
}

const popularLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/bookings", label: "My Bookings" },
]

export default function NotFound() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_35%,rgba(6,182,212,0.10),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 h-px bg-[linear-gradient(90deg,transparent,rgba(6,182,212,0.35),transparent)]"
      />

      <div className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-2xl text-center">
          {/* Ghost 404 behind the content */}
          <p
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-10 select-none text-[9rem] leading-none font-bold tracking-tighter text-foreground/[0.05] sm:-top-14 sm:text-[12rem]"
          >
            404
          </p>

          <div className="relative">
            <div className="relative mx-auto flex size-16 items-center justify-center rounded-full border border-border bg-card shadow-sm">
              <span className="absolute inline-flex size-full animate-ping rounded-full border border-cyan-500/40" />
              <CompassIcon className="size-7 text-cyan-600" />
            </div>

            <p className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              <PlaneIcon className="size-3.5 text-cyan-600" />
              Error 404
            </p>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              This page has wandered off.
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              The link you followed doesn&apos;t lead anywhere — it may have been
              moved, retired, or never made it onto the map.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600/50 sm:w-auto"
              >
                Back to home
              </Link>
              <Link
                href="/destinations"
                className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:w-auto"
              >
                Explore destinations
              </Link>
            </div>

            <div className="mt-12 border-t border-border pt-6">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Popular destinations
              </p>
              <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {popularLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-cyan-600 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

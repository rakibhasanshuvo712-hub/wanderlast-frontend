import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative h-[calc(100svh-4rem)] w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Banner.png"
          alt="hero banner"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 z-10 bg-black/50" />

      {/* Content */}
      <div className="relative z-20 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-6 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-white drop-shadow-md">
            Discover Your Next Adventure
          </h1>
          <p className="mb-10 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-sm">
            Explore breathtaking destinations and create unforgettable memories with
            our curated travel experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/destinations"
              className="inline-flex items-center rounded-lg px-8 py-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg shadow-cyan-500/30"
            >
              EXPLORE NOW{" "}
              <svg
                aria-hidden="true"
                className="ml-2 -ms-1 inline-block align-middle size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/destinations"
              className="inline-flex items-center rounded-lg px-8 py-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-sm"
            >
              VIEW DESTINATION
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

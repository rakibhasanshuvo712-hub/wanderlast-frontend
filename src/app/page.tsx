import Image from "next/image"
import Link from "next/link"
import { Hero } from "@/components/hero"
import { SearchBar } from "@/components/SearchBar"
import { Featured } from "@/components/featured"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <SearchBar />
      <Featured />
      <section className="py-16 bg-background">
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

      <section className="py-16 bg-muted">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <Image
                src="/images/person1.png"
                alt="Traveler 1"
                className="rounded-xl shadow-lg"
                width={400}
                height={300}
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground">
                Journeys worth taking
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From mountain trails to coastal escapes, we help you find the
                path that fits your story.
              </p>
              <Link
                href="/destinations"
                className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 bg-primary text-primary-foreground hover:bg-primary/80"
              >
                Browse trips
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 items-center md:flex-row-reverse">
            <div>
              <Image
                src="/images/person2.png"
                alt="Traveler 2"
                className="rounded-xl shadow-lg"
                width={400}
                height={300}
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground">
                Travel your way
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Flexible itineraries, local insights, and seamless planning for
                every kind of explorer.
              </p>
              <Link
                href="/destinations"
                className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 bg-primary text-primary-foreground hover:bg-primary/80"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 bg-primary">
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            New destinations added weekly
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tighter text-primary-foreground">
            Ready to explore?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of travelers discovering the world with wanderlust.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/destinations"
              className="inline-flex items-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Start planning
            </Link>
            <Link
              href="mailto:hello@wanderlust.travel"
              className="inline-flex items-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 border border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

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

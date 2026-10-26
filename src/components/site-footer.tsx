import Image from "next/image"
import Link from "next/link"

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/destinations", label: "Destinations" },
    ],
  },
  {
    title: "Manage",
    links: [
      { href: "/app-destination", label: "Add a package" },
      { href: "/destinations", label: "Browse all trips" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/Wanderlast.png"
                alt="wanderlust"
                className="h-8 w-auto"
                width={162}
                height={24}
              />
              <span className="text-xl font-semibold tracking-tighter">wanderlust</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Hand-picked destinations, honest prices and trips worth taking — from
              mountain trails to coastal escapes.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-cyan-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col justify-between gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} wanderlust. All rights reserved.</p>
          <p>Travel curiosity. Pack light.</p>
        </div>
      </div>
    </footer>
  )
}

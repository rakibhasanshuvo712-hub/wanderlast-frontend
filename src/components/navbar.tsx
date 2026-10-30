"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOutIcon, MenuIcon, UserIcon, XIcon } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavLinkItem {
  href: string
  label: string
  icon?: boolean
}

const navLinks: NavLinkItem[] = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/app-destination", label: "Add Destination" },
  { href: "/bookings", label: "My Bookings" },
]

const guestLinks: NavLinkItem[] = [
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign Up" },
]

const memberLinks: NavLinkItem[] = [{ href: "/profile", label: "Profile", icon: true }]

function NavLink({
  href,
  active,
  children,
  className,
  onClick,
  ...props
}: {
  href: string
  active?: boolean
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        active
          ? "text-cyan-600"
          : "text-foreground/80 hover:bg-muted hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

export function Navbar({
  className,
  ...props
}: React.ComponentProps<"nav"> & { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  const accountLinks = user ? memberLinks : guestLinks
  const close = () => setOpen(false)
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  const handleSignOut = async () => {
    close()
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <nav
      data-slot="navbar"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-border bg-background",
        className
      )}
      {...props}
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between gap-4">
          {/* Left: navigation links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={isActive(link.href)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Center: brand */}
          <Link
            href="/"
            onClick={close}
            className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold tracking-tight text-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            Wanderlust
          </Link>

          {/* Right: account links */}
          <div className="hidden items-center justify-end gap-1 lg:flex">
            {accountLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={isActive(link.href)}
                className={cn(
                  link.href === "/signup" && "text-cyan-600 hover:text-cyan-700"
                )}
              >
                {link.icon && (
                  <UserIcon className="mr-1.5 inline-block h-4 w-4 align-text-bottom" />
                )}
                {link.label}
              </NavLink>
            ))}

            {!isPending && user && (
              <>
                <Link
                  href="/profile"
                  onClick={close}
                  aria-label="Open profile"
                  className="ml-1 inline-flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name ?? "Account"}
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0)?.toUpperCase() ?? (
                        <UserIcon className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[9rem] truncate text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LogOutIcon className="h-4 w-4" />
                  Sign out
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="ml-auto rounded-md p-2 text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="flex flex-col gap-1 border-t border-border py-3 lg:hidden">
            {[...navLinks, ...accountLinks].map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={isActive(link.href)}
                onClick={close}
                className="py-2.5"
              >
                {"icon" in link && link.icon && (
                  <UserIcon className="mr-1.5 inline-block h-4 w-4 align-text-bottom" />
                )}
                {link.label}
              </NavLink>
            ))}
            {!isPending && user && (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOutIcon className="h-4 w-4" />
                Sign out
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

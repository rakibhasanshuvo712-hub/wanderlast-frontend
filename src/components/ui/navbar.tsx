"use client"

import * as React from "react"
import { cn } from "cn"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function NavLink({
  href,
  children,
  className,
  ...props
}: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/30",
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
  const { data: session } = authClient.useSession()
  const user = session?.user

  return (
    <nav
      data-slot="navbar"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 text-white",
        className
      )}
      {...props}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Navigation links */}
          <div className="hidden items-center gap-6 lg:flex">
            <NavLink href="/" className="text-sm">
              Home
            </NavLink>
            <NavLink href="/destinations" className="text-sm">
              Destinations
            </NavLink>
            <NavLink href="/bookings" className="text-sm">
              My Bookings
            </NavLink>
            <NavLink href="/admin" className="text-sm">
              Admin
            </NavLink>
          </div>

          {/* Center: Brand logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <span className="self-center text-xl font-bold tracking-tighter text-white italic">
              Wanderlast
            </span>
          </div>

          {/* Right: Auth links */}
          <div className="hidden items-center gap-6 lg:flex">
            {user ? (
              <>
                <NavLink href="/profile" className="text-sm">
                  Profile
                </NavLink>
                <Avatar>
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </>
            ) : (
              <>
                <NavLink href="/login" className="text-sm">
                  Login
                </NavLink>
                <NavLink
                  href="/signup"
                  className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

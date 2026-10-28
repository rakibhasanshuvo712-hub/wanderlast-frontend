"use client"

import * as React from "react"
import { cn } from "cn"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User } from "lucide-react"

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
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

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
              Wanderlust
            </span>
          </div>

          {/* Right: Auth */}
          <div className="hidden items-center gap-4 lg:flex">
            {isPending ? (
              <span className="text-sm text-white/60">…</span>
            ) : user ? (
              <>
                <NavLink href="/profile" className="flex items-center gap-2 text-sm">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.image ?? undefined} alt={user.name ?? "Account"} />
                    <AvatarFallback>
                      {user.name?.charAt(0)?.toUpperCase() ?? <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[10rem] truncate">{user.name}</span>
                </NavLink>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
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

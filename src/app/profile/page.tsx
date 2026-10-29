"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  LogOutIcon,
  MailIcon,
  MapIcon,
  PencilIcon,
  PlaneTakeoff,
  UserIcon,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function SignInCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sign in to view your profile</CardTitle>
        <CardDescription>
          Your profile keeps your bookings, saved trips and account details in
          one place.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Link
          href="/login?callbackUrl=/profile"
          className={buttonVariants({ variant: "default" })}
        >
          Sign in
        </Link>
        <Link
          href="/signup?callbackUrl=/profile"
          className={buttonVariants({ variant: "outline" })}
        >
          Create an account
        </Link>
      </CardContent>
    </Card>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  const [saving, setSaving] = React.useState(false)
  const [status, setStatus] = React.useState<
    { type: "success" | "error"; message: string } | null
  >(null)

  const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving) return

    const formData = new FormData(event.currentTarget)
    const trimmedName = String(formData.get("name") ?? "").trim()
    const nextImage = String(formData.get("image") ?? "").trim()

    if (!trimmedName) {
      setStatus({ type: "error", message: "Name cannot be empty" })
      return
    }

    setSaving(true)
    setStatus(null)

    const { error } = await authClient.updateUser({
      name: trimmedName,
      image: nextImage || undefined,
    })

    setSaving(false)

    if (error) {
      setStatus({
        type: "error",
        message: error.message ?? "Could not update your profile",
      })
      return
    }

    setStatus({ type: "success", message: "Profile updated" })
    router.refresh()
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  if (isPending) {
    return (
      <div className="min-h-[60vh] bg-background">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-8 h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] bg-background">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
            Profile
          </h1>
          <SignInCard />
        </div>
      </div>
    )
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : null

  return (
    <div className="min-h-[60vh] bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Profile
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account details and jump back into your trips.
        </p>

        {/* Account overview */}
        <Card className="mt-8">
          <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? "Account"} />
              <AvatarFallback className="text-2xl">
                {user.name?.charAt(0)?.toUpperCase() ?? <UserIcon className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-1">
              <h2 className="truncate text-2xl font-bold text-foreground">
                {user.name ?? "Traveler"}
              </h2>
              <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                <MailIcon className="h-4 w-4 shrink-0" />
                {user.email}
              </p>
              {memberSince && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 shrink-0" />
                  Member since {memberSince}
                </p>
              )}
            </div>

            <Button
              variant="outline"
              onClick={handleSignOut}
              className="shrink-0"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </CardContent>
        </Card>

        {/* Edit profile */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PencilIcon className="h-4 w-4" />
              Edit profile
            </CardTitle>
            <CardDescription>
              Update the name and avatar shown across wanderlust.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="profile-name">Name</Label>
                <Input
                  id="profile-name"
                  name="name"
                  key={`name-${user.id}`}
                  defaultValue={user.name ?? ""}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-image">Avatar URL (optional)</Label>
                <Input
                  id="profile-image"
                  name="image"
                  type="url"
                  key={`image-${user.id}`}
                  defaultValue={user.image ?? ""}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              {status && (
                <p
                  role="alert"
                  className={
                    status.type === "error"
                      ? "rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                      : "rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600"
                  }
                >
                  {status.message}
                </p>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-cyan-600 text-white hover:bg-cyan-700"
                >
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick links */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/bookings"
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-cyan-600"
          >
            <PlaneTakeoff className="mb-2 h-5 w-5 text-cyan-600" />
            <h3 className="font-semibold text-foreground">My bookings</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              View and manage the trips you&apos;ve booked.
            </p>
          </Link>
          <Link
            href="/app-destination"
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-cyan-600"
          >
            <MapIcon className="mb-2 h-5 w-5 text-cyan-600" />
            <h3 className="font-semibold text-foreground">Add a destination</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Publish a new travel package to the listings.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

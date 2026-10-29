"use client"

import * as React from "react"
import { ArrowUpRight, CheckIcon } from "lucide-react"

export function FooterNewsletter() {
  const [email, setEmail] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "error" | "success">("idle")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error")
      return
    }

    setStatus("success")
    setEmail("")
  }

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
        Newsletter
      </h3>
      <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
        Subscribe for exclusive travel deals and inspiration.
      </p>

      {status === "success" ? (
        <p className="mt-5 flex items-center gap-2 text-sm text-emerald-400">
          <CheckIcon className="h-4 w-4" />
          You&apos;re on the list — check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-5">
          <label htmlFor="footer-newsletter-email" className="sr-only">
            Email address
          </label>
          <div className="flex h-11 max-w-xs items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 transition-colors focus-within:border-cyan-500/60">
            <input
              id="footer-newsletter-email"
              type="email"
              name="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (status === "error") setStatus("idle")
              }}
              placeholder="Enter email"
              aria-invalid={status === "error"}
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-white/10 text-zinc-300 transition-colors hover:bg-cyan-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          {status === "error" && (
            <p className="mt-2 text-xs text-red-400" role="alert">
              Please enter a valid email address.
            </p>
          )}
        </form>
      )}
    </div>
  )
}

/**
 * End-to-end check that bookings are isolated per user.
 *
 * Signs up two users, books a destination as each, then verifies:
 *   1. Each user's GET /api/bookings returns only their own booking.
 *   2. A user cannot cancel someone else's booking (403).
 *   3. Booking without a session is rejected (401).
 *
 * Run with the dev server up: npx tsx scripts/test-bookings.mjs
 */

const BASE = process.env.BASE_URL ?? "http://localhost:3000"
// better-auth validates the Origin header; match what the browser would send.
const ORIGIN = process.env.ORIGIN ?? "http://localhost:3000"

// Minimal cookie jar so each user keeps its own session.
function makeJar() {
  const cookies = new Map()
  return {
    store(setCookie) {
      for (const raw of [].concat(setCookie ?? [])) {
        const [pair] = raw.split(";")
        const idx = pair.indexOf("=")
        if (idx > 0) cookies.set(pair.slice(0, idx).trim(), pair.slice(idx + 1).trim())
      }
    },
    header() {
      return [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join("; ")
    },
  }
}

async function api(jar, path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Origin: ORIGIN,
      ...(jar ? { cookie: jar.header() } : {}),
      ...(options.headers ?? {}),
    },
    redirect: "manual",
  })
  if (jar && res.headers.getSetCookie?.()) jar.store(res.headers.getSetCookie())
  const body = await res.json().catch(() => null)
  return { status: res.status, body }
}

async function signUp(jar, email, password, name) {
  return api(jar, "/api/auth/sign-up/email", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  })
}

let passed = 0
let failed = 0
function check(label, ok, extra = "") {
  if (ok) {
    passed++
    console.log(`  PASS  ${label}`)
  } else {
    failed++
    console.log(`  FAIL  ${label}${extra ? ` — ${extra}` : ""}`)
  }
}

async function main() {
  const stamp = Date.now()
  const aliceJar = makeJar()
  const bobJar = makeJar()

  const alice = await signUp(aliceJar, `alice-${stamp}@test.dev`, "pass1234!", "Alice")
  const bob = await signUp(bobJar, `bob-${stamp}@test.dev`, "pass1234!", "Bob")
  check("sign up alice", alice.status === 200, `got ${alice.status}`)
  check("sign up bob", bob.status === 200, `got ${bob.status}`)

  const destinations = await api(null, "/api/destinations")
  const [first, second] = destinations.body
  check("destinations available", destinations.status === 200 && !!first, `got ${destinations.status}`)

  // Anonymous booking must be rejected.
  const anon = await api(null, "/api/bookings", {
    method: "POST",
    body: JSON.stringify({ destinationId: first._id }),
  })
  check("anonymous booking rejected (401)", anon.status === 401, `got ${anon.status}`)

  // Each user books a different trip.
  const aliceBook = await api(aliceJar, "/api/bookings", {
    method: "POST",
    body: JSON.stringify({ destinationId: first._id }),
  })
  const bobBook = await api(bobJar, "/api/bookings", {
    method: "POST",
    body: JSON.stringify({ destinationId: second._id }),
  })
  check("alice booking created (201)", aliceBook.status === 201, `got ${aliceBook.status}`)
  check("bob booking created (201)", bobBook.status === 201, `got ${bobBook.status}`)

  // Booking docs carry the user identity from the diagram.
  const doc = aliceBook.body
  check("booking has userId", !!doc.userId, "missing userId")
  check("booking has userEmail", !!doc.userEmail, "missing userEmail")
  check("booking has userName", !!doc.userName, "missing userName")
  check("booking has destinationName", !!doc.destinationName, "missing destinationName")
  check("booking has departureDate", "departureDate" in doc, "missing departureDate")

  // Each user sees only their own bookings.
  const aliceList = await api(aliceJar, "/api/bookings")
  const bobList = await api(bobJar, "/api/bookings")
  const aliceIds = (aliceList.body ?? []).map((b) => b._id)
  const bobIds = (bobList.body ?? []).map((b) => b._id)
  check("alice sees her booking", aliceIds.includes(doc._id))
  check("alice does not see bob's booking", !aliceIds.includes(bobBook.body._id))
  check("bob sees his booking", bobIds.includes(bobBook.body._id))
  check("bob does not see alice's booking", !bobIds.includes(doc._id))

  // Query params must not let a user read someone else's list.
  const spoof = await api(bobJar, `/api/bookings?userId=${doc.userId}&email=${doc.userEmail}`)
  check("spoofed userId query rejected (403)", spoof.status === 403, `got ${spoof.status}`)

  // A user cannot cancel someone else's booking.
  const crossCancel = await api(bobJar, `/api/bookings/${doc._id}`, { method: "DELETE" })
  check("cross-user cancel rejected (403)", crossCancel.status === 403, `got ${crossCancel.status}`)

  // Cancel your own booking works.
  const selfCancel = await api(bobJar, `/api/bookings/${bobBook.body._id}`, { method: "DELETE" })
  check("own booking cancel (200)", selfCancel.status === 200, `got ${selfCancel.status}`)
  const bobAfter = await api(bobJar, "/api/bookings")
  check("bob's list is empty after cancel", (bobAfter.body ?? []).length === 0)

  console.log(`\n${passed} passed, ${failed} failed`)
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error("Test run failed:", err)
  process.exit(1)
})

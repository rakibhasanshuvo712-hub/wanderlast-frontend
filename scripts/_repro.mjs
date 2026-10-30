// Repro part 2: edit page + cookie-cache-miss fallback + sign-in flow.
const FRONT = 'http://localhost:3000'
const BACK = 'http://localhost:8000'

function makeJar() {
  const c = new Map()
  return {
    store(sc){ for (const raw of [].concat(sc ?? [])) { const [p]=raw.split(';'); const i=p.indexOf('='); if(i>0) c.set(p.slice(0,i).trim(), p.slice(i+1).trim()) } },
    del(name){ c.delete(name) },
    header(){ return [...c.entries()].map(([k,v])=>`${k}=${v}`).join('; ') },
  }
}
async function page(jar, path) {
  const res = await fetch(`${FRONT}${path}`, { headers: { cookie: jar.header() }, redirect: 'manual' })
  return `${res.status} ${res.headers.get('location') ?? 'rendered'}`
}

// 1. sign IN (not sign-up) via the login endpoint
const jar = makeJar()
const email = `repro2-${Date.now()}@test.dev`
await fetch(`${FRONT}/api/auth/sign-up/email`, { method:'POST', headers:{'Content-Type':'application/json',Origin:FRONT}, body: JSON.stringify({ email, password:'pass1234!', name:'Repro User' }) }).then(r=>jar.store(r.headers.getSetCookie?.()))
const signIn = await fetch(`${FRONT}/api/auth/sign-in/email`, { method:'POST', headers:{'Content-Type':'application/json',Origin:FRONT,cookie:jar.header()}, body: JSON.stringify({ email, password:'pass1234!' }) })
jar.store(signIn.headers.getSetCookie?.())
console.log('sign-in:', signIn.status, 'cookies:', jar.header().split(';').map(c=>c.trim().split('=')[0]).join(', '))
console.log('  /app-destination ->', await page(jar, '/app-destination'))

// 2. get a real destination id for the edit page
const destRes = await fetch(`${BACK}/destination`)
const dests = await destRes.json().catch(()=>[])
const id = dests?.[0]?._id
console.log('backend destination id:', id ?? '(none — backend down?)')
if (id) console.log('  /app-destination/'+id+' ->', await page(jar, `/app-destination/${id}`))

// 3. cookie cache missing (session_data cookie gone) -> getSession must hit the DB
jar.del('better-auth.session_data')
console.log('without session_data cookie:')
console.log('  /app-destination ->', await page(jar, '/app-destination'))

// 4. session_token cookie missing too -> should redirect to login (unauthenticated)
jar.del('better-auth.session_token')
console.log('without any session cookies:')
console.log('  /app-destination ->', await page(jar, '/app-destination'))

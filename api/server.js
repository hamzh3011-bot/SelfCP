// The Asemaneh API: the site content the admin panel edits, the two visitor
// inboxes, and the password-protected admin routes.
//
// Plain node:http + a tiny router — the surface is small enough that a
// framework would only add weight. Runs behind the web dev server's /api
// proxy, so the browser always talks to one origin.

import http from 'node:http'
import { initDb, pool } from './db.js'
import {
  clearFailures,
  configure,
  createSession,
  destroySession,
  isConfigured,
  recordFailure,
  tooManyAttempts,
  validSession,
  verify,
} from './auth.js'

const PORT = Number(process.env.PORT || 8000)
const MAX_BODY_BYTES = 256 * 1024
const MAX_LIST_ITEMS = 60
const MAX_CHARS = 800
const MIN_PASSWORD = 6

// Fields the panel may store, per collection. Anything else in the payload is
// dropped before it reaches the database.
const LIST_FIELDS = {
  destinations: ['name', 'country', 'price', 'image'],
  packages: ['title', 'duration', 'hotel', 'rating', 'price', 'image', 'cta'],
  testimonials: ['name', 'destination', 'rating', 'text', 'avatar'],
}

function send(res, status, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  })
  res.end(body)
}

function fail(res, status, message) {
  send(res, status, { error: message })
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let done = false
    req.on('data', (chunk) => {
      if (done) return
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        done = true
        reject(new Error('payload too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (done) return
      if (!chunks.length) return resolve({})
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        reject(new Error('invalid json'))
      }
    })
    req.on('error', reject)
  })
}

function text(value, max = MAX_CHARS) {
  return typeof value === 'string' ? value.slice(0, max) : ''
}

function bearerToken(req) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')
  return scheme === 'Bearer' && token ? token : null
}

async function requireAdmin(req, res) {
  const token = bearerToken(req)
  if (!(await validSession(token))) {
    fail(res, 401, 'دسترسی مدیریتی معتبر نیست. لطفاً دوباره وارد شوید.')
    return null
  }
  return token
}

function cleanList(value, fields) {
  if (!Array.isArray(value)) return null
  return value.slice(0, MAX_LIST_ITEMS).map((item) => {
    const out = {}
    const source = item && typeof item === 'object' && !Array.isArray(item) ? item : {}
    for (const field of fields) out[field] = text(source[field])
    return out
  })
}

function sanitizeContent(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null
  const doc = {}
  if (input.brand && typeof input.brand === 'object') {
    doc.brand = {
      name: text(input.brand.name, 80),
      latin: text(input.brand.latin, 80),
      tagline: text(input.brand.tagline, 200),
      about: text(input.brand.about, 600),
    }
  }
  for (const [key, fields] of Object.entries(LIST_FIELDS)) {
    const list = cleanList(input[key], fields)
    if (list) doc[key] = list
  }
  return doc
}

const BOOKING_COLUMNS = `
  id, origin AS "from", destination AS "to", depart_date AS depart,
  return_date AS back, passengers, cabin, created_at AS "createdAt"
`

const clientKey = (req) => req.socket.remoteAddress || 'unknown'

async function handle(req, res, url) {
  const path = url.pathname
  const method = req.method.toUpperCase()

  // ---- public: the site itself -------------------------------------------
  if (method === 'GET' && path === '/api/content') {
    const result = await pool.query('SELECT doc FROM site_content WHERE id = 1')
    return send(res, 200, { content: result.rowCount ? result.rows[0].doc : null })
  }

  if (method === 'POST' && path === '/api/bookings') {
    let body
    try {
      body = await readJson(req)
    } catch {
      return fail(res, 400, 'درخواست نامعتبر است.')
    }
    const booking = {
      origin: text(body.from, 60),
      destination: text(body.to, 60),
      depart: text(body.depart, 40),
      back: text(body.back, 40),
      passengers: text(body.passengers, 60),
      cabin: text(body.cabin, 60),
    }
    if (!booking.origin || !booking.destination) {
      return fail(res, 400, 'مبدا و مقصد الزامی است.')
    }
    const inserted = await pool.query(
      `INSERT INTO bookings (origin, destination, depart_date, return_date, passengers, cabin)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${BOOKING_COLUMNS}`,
      [booking.origin, booking.destination, booking.depart, booking.back, booking.passengers, booking.cabin],
    )
    return send(res, 201, { booking: inserted.rows[0] })
  }

  if (method === 'POST' && path === '/api/subscribers') {
    let body
    try {
      body = await readJson(req)
    } catch {
      return fail(res, 400, 'درخواست نامعتبر است.')
    }
    const email = text(body.email, 160).trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return fail(res, 400, 'نشانی ایمیل معتبر نیست.')
    }
    // Already-subscribed addresses answer the same way, so the endpoint never
    // reveals whether an address is on the list.
    await pool.query('INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', [email])
    return send(res, 201, { ok: true })
  }

  // ---- admin: password setup and login -----------------------------------
  if (method === 'GET' && path === '/api/admin/session') {
    return send(res, 200, { configured: await isConfigured() })
  }

  if (method === 'POST' && path === '/api/admin/setup') {
    let body
    try {
      body = await readJson(req)
    } catch {
      return fail(res, 400, 'درخواست نامعتبر است.')
    }
    const password = text(body.password, 200)
    if (password.length < MIN_PASSWORD) {
      return fail(res, 400, 'رمز عبور باید حداقل ۶ کاراکتر باشد.')
    }
    if (!(await configure(password))) {
      return fail(res, 409, 'رمز عبور قبلاً تعیین شده است.')
    }
    return send(res, 201, { token: await createSession() })
  }

  if (method === 'POST' && path === '/api/admin/login') {
    const key = clientKey(req)
    if (tooManyAttempts(key)) {
      return fail(res, 429, 'تلاش‌های ناموفق زیاد بوده است. کمی بعد دوباره امتحان کنید.')
    }
    let body
    try {
      body = await readJson(req)
    } catch {
      return fail(res, 400, 'درخواست نامعتبر است.')
    }
    if (!(await verify(text(body.password, 200)))) {
      recordFailure(key)
      return fail(res, 401, 'رمز عبور نادرست است.')
    }
    clearFailures(key)
    return send(res, 200, { token: await createSession() })
  }

  if (method === 'POST' && path === '/api/admin/logout') {
    const token = bearerToken(req)
    await destroySession(token)
    return send(res, 200, { ok: true })
  }

  // ---- admin: content and inboxes ----------------------------------------
  const token = await requireAdmin(req, res)
  if (!token) return undefined

  if (path === '/api/admin/content' && method === 'PUT') {
    let body
    try {
      body = await readJson(req)
    } catch {
      return fail(res, 400, 'درخواست نامعتبر است.')
    }
    const doc = sanitizeContent(body)
    if (!doc) return fail(res, 400, 'محتوای ارسالی نامعتبر است.')
    await pool.query(
      `INSERT INTO site_content (id, doc, updated_at) VALUES (1, $1, now())
       ON CONFLICT (id) DO UPDATE SET doc = EXCLUDED.doc, updated_at = now()`,
      [doc],
    )
    return send(res, 200, { ok: true })
  }

  if (path === '/api/admin/content' && method === 'DELETE') {
    // Clearing the document puts the site back on its shipped defaults.
    await pool.query('DELETE FROM site_content WHERE id = 1')
    return send(res, 200, { ok: true })
  }

  if (path === '/api/admin/inbox' && method === 'GET') {
    const bookings = await pool.query(`SELECT ${BOOKING_COLUMNS} FROM bookings ORDER BY created_at DESC LIMIT 100`)
    const subscribers = await pool.query(
      'SELECT id, email, created_at AS "createdAt" FROM subscribers ORDER BY created_at DESC LIMIT 200',
    )
    return send(res, 200, { bookings: bookings.rows, subscribers: subscribers.rows })
  }

  const bookingMatch = path.match(/^\/api\/admin\/bookings\/(\d+)$/)
  if (bookingMatch && method === 'DELETE') {
    await pool.query('DELETE FROM bookings WHERE id = $1', [bookingMatch[1]])
    return send(res, 200, { ok: true })
  }

  const subscriberMatch = path.match(/^\/api\/admin\/subscribers\/(\d+)$/)
  if (subscriberMatch && method === 'DELETE') {
    await pool.query('DELETE FROM subscribers WHERE id = $1', [subscriberMatch[1]])
    return send(res, 200, { ok: true })
  }

  return fail(res, 404, 'مسیر یافت نشد.')
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  handle(req, res, url).catch((error) => {
    if (error && error.message === 'payload too large') {
      return fail(res, 413, 'حجم درخواست بیش از حد مجاز است.')
    }
    console.error('[api]', error)
    if (!res.headersSent) fail(res, 500, 'خطای داخلی سرور.')
    return undefined
  })
})

initDb()
  .then(() => {
    server.listen(PORT, '0.0.0.0', () => console.log(`[api] listening on ${PORT}`))
  })
  .catch((error) => {
    console.error('[api] could not start', error)
    process.exit(1)
  })

// Thin fetch wrapper around the Asemaneh API. In development the Vite dev
// server proxies /api to the api service, so the browser stays on one origin;
// a deployment that serves them apart can set VITE_API_BASE.

const BASE = import.meta.env.VITE_API_BASE ?? ''
const TOKEN_KEY = 'asemaneh.admin.token'

let token = null
try {
  token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(TOKEN_KEY) : null
} catch {
  token = null
}

export function getToken() {
  return token
}

export function setToken(next) {
  token = next || null
  try {
    if (typeof sessionStorage === 'undefined') return
    if (token) sessionStorage.setItem(TOKEN_KEY, token)
    else sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    // Storage can be blocked; the token still lives in memory for this page.
  }
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { accept: 'application/json' }
  if (body !== undefined) headers['content-type'] = 'application/json'
  if (auth && token) headers.authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('ارتباط با سرور برقرار نشد.', 0)
  }

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new ApiError((payload && payload.error) || `خطای سرور (${response.status})`, response.status)
  }
  return payload || {}
}

export const api = {
  getContent: () => request('/api/content'),

  createBooking: (booking) => request('/api/bookings', { method: 'POST', body: booking }),
  subscribe: (email) => request('/api/subscribers', { method: 'POST', body: { email } }),

  adminSession: () => request('/api/admin/session'),
  adminSetup: (password) => request('/api/admin/setup', { method: 'POST', body: { password } }),
  adminLogin: (password) => request('/api/admin/login', { method: 'POST', body: { password } }),
  adminLogout: () => request('/api/admin/logout', { method: 'POST', auth: true }),

  saveContent: (doc) => request('/api/admin/content', { method: 'PUT', body: doc, auth: true }),
  resetContent: () => request('/api/admin/content', { method: 'DELETE', auth: true }),
  inbox: () => request('/api/admin/inbox', { auth: true }),
  deleteBooking: (id) => request(`/api/admin/bookings/${id}`, { method: 'DELETE', auth: true }),
  deleteSubscriber: (id) => request(`/api/admin/subscribers/${id}`, { method: 'DELETE', auth: true }),
}

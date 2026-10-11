// Admin password handling: scrypt hashes, opaque session tokens (stored
// hashed), and a small in-memory throttle for failed logins.

import crypto from 'node:crypto'
import { pool } from './db.js'

const SESSION_TTL = '7 days'
const MAX_FAILURES = 8
const FAILURE_WINDOW_MS = 15 * 60 * 1000

const failures = new Map()

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex')
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/** Compares two equal-length strings without leaking their difference. */
function sameSecret(a, b) {
  const left = Buffer.from(String(a), 'utf8')
  const right = Buffer.from(String(b), 'utf8')
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}

export function tooManyAttempts(key) {
  const entry = failures.get(key)
  if (!entry) return false
  if (Date.now() - entry.at > FAILURE_WINDOW_MS) {
    failures.delete(key)
    return false
  }
  return entry.count >= MAX_FAILURES
}

export function recordFailure(key) {
  const entry = failures.get(key)
  if (!entry || Date.now() - entry.at > FAILURE_WINDOW_MS) {
    failures.set(key, { count: 1, at: Date.now() })
    return
  }
  entry.count += 1
  entry.at = Date.now()
}

export function clearFailures(key) {
  failures.delete(key)
}

export async function isConfigured() {
  const result = await pool.query('SELECT 1 FROM admin_config WHERE id = 1')
  return result.rowCount > 0
}

/**
 * Stores the first password ever set. Returns false when one already exists,
 * so a second caller cannot overwrite it (ON CONFLICT DO NOTHING is the guard).
 */
export async function configure(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const result = await pool.query(
    `INSERT INTO admin_config (id, password_salt, password_hash)
     VALUES (1, $1, $2)
     ON CONFLICT (id) DO NOTHING`,
    [salt, hashPassword(password, salt)],
  )
  return result.rowCount === 1
}

export async function verify(password) {
  const result = await pool.query('SELECT password_salt, password_hash FROM admin_config WHERE id = 1')
  if (!result.rowCount) return false
  const { password_salt: salt, password_hash: hash } = result.rows[0]
  return sameSecret(hashPassword(password, salt), hash)
}

export async function createSession() {
  const token = crypto.randomBytes(32).toString('hex')
  await pool.query('INSERT INTO admin_sessions (token_hash) VALUES ($1)', [hashToken(token)])
  await pool.query(`DELETE FROM admin_sessions WHERE created_at < now() - interval '${SESSION_TTL}'`)
  return token
}

export async function validSession(token) {
  if (!token) return false
  const result = await pool.query(
    `SELECT 1 FROM admin_sessions WHERE token_hash = $1 AND created_at > now() - interval '${SESSION_TTL}'`,
    [hashToken(token)],
  )
  return result.rowCount === 1
}

export async function destroySession(token) {
  if (!token) return
  await pool.query('DELETE FROM admin_sessions WHERE token_hash = $1', [hashToken(token)])
}

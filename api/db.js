// Postgres access for the API. One pool for the process; the tables are
// created on boot so a fresh database is ready without a migration step.

import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
})

const SCHEMA = `
  -- The single site-content document the admin panel edits. An empty table
  -- means "the site renders the defaults shipped in web/src/data/content.js".
  CREATE TABLE IF NOT EXISTS site_content (
    id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    doc jsonb NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  );

  -- The admin password, set once from the panel itself (never from the repo).
  CREATE TABLE IF NOT EXISTS admin_config (
    id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    password_salt text NOT NULL,
    password_hash text NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash text PRIMARY KEY,
    created_at timestamptz NOT NULL DEFAULT now()
  );

  -- Visitor submissions, read by the admin panel's inboxes.
  CREATE TABLE IF NOT EXISTS bookings (
    id bigserial PRIMARY KEY,
    origin text NOT NULL,
    destination text NOT NULL,
    depart_date text,
    return_date text,
    passengers text,
    cabin text,
    created_at timestamptz NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id bigserial PRIMARY KEY,
    email text NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now()
  );
`

/** Creates the schema, retrying while Postgres finishes starting up. */
export async function initDb(attempts = 15) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await pool.query(SCHEMA)
      return
    } catch (error) {
      if (attempt === attempts) throw error
      console.warn(`[db] not ready (${attempt}/${attempts}): ${error.message}`)
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }
}

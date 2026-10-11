// A tiny localStorage-backed store for the site's editable content.
//
// The static copy in `content.js` stays the single source of truth for the
// default values; everything the admin panel changes is layered on top in a
// separate snapshot that is persisted to localStorage, so edits survive a
// reload and reach every component through `useSiteContent()`.

import { useSyncExternalStore } from 'react'
import {
  brand as defaultBrand,
  destinations as defaultDestinations,
  footer as defaultFooter,
  packages as defaultPackages,
  testimonials as defaultTestimonials,
} from './content'

const STORAGE_KEY = 'asemaneh.site.v1'

// Collections the admin panel can add to, edit and delete from.
const EDITABLE = ['destinations', 'packages', 'testimonials']
// Collections that only grow: the site's forms append to them.
const APPEND_ONLY = ['bookings', 'subscribers']

export function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function defaults() {
  return {
    brand: {
      name: defaultBrand.name,
      latin: defaultBrand.latin,
      tagline: defaultBrand.tagline,
      about: defaultFooter.about,
    },
    destinations: defaultDestinations,
    packages: defaultPackages,
    testimonials: defaultTestimonials,
    bookings: [],
    subscribers: [],
  }
}

function read() {
  const base = defaults()
  if (typeof localStorage === 'undefined') return base
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    const saved = JSON.parse(raw)
    const next = { ...base, ...saved }
    next.brand = { ...base.brand, ...(saved.brand || {}) }
    for (const key of [...EDITABLE, ...APPEND_ONLY]) {
      if (!Array.isArray(next[key])) next[key] = base[key]
    }
    return next
  } catch {
    return base
  }
}

let state = read()
const listeners = new Set()

function emit() {
  listeners.forEach((listener) => listener())
}

function persist() {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can be blocked or full; the session keeps working in memory.
  }
}

function commit(next) {
  state = next
  persist()
  emit()
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return state
}

/** React hook — re-renders the caller whenever any admin edit lands. */
export function useSiteContent() {
  return useSyncExternalStore(subscribe, getSnapshot)
}

/**
 * Copy written in `content.js` mentions the shipped brand name in a few
 * places; this swaps that name for whatever the admin panel set, so a rename
 * reads consistently everywhere.
 */
export function branded(text, brand) {
  const name = brand && brand.name
  if (!name || name === defaultBrand.name) return text
  return String(text).split(defaultBrand.name).join(name)
}

export function setBrand(patch) {
  commit({ ...state, brand: { ...state.brand, ...patch } })
}

export function addItem(collection, item) {
  commit({ ...state, [collection]: [...state[collection], item] })
}

export function updateItem(collection, index, patch) {
  commit({
    ...state,
    [collection]: state[collection].map((item, i) => (i === index ? { ...item, ...patch } : item)),
  })
}

export function removeItem(collection, index) {
  commit({ ...state, [collection]: state[collection].filter((_, i) => i !== index) })
}

export function removeById(collection, id) {
  commit({ ...state, [collection]: state[collection].filter((item) => item.id !== id) })
}

export function addBooking(booking) {
  commit({
    ...state,
    bookings: [{ id: uid(), createdAt: Date.now(), ...booking }, ...state.bookings],
  })
}

export function addSubscriber(email) {
  const value = email.trim().toLowerCase()
  if (!value || state.subscribers.some((item) => item.email === value)) return
  commit({
    ...state,
    subscribers: [{ id: uid(), email: value, createdAt: Date.now() }, ...state.subscribers],
  })
}

export function resetSite() {
  commit(defaults())
}

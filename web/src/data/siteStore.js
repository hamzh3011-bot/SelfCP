// The site content store.
//
// The static copy in `content.js` is the shipped default; the current content
// lives on the API server, so every visitor sees the same edits. This module is
// a `useSyncExternalStore` store: reads are synchronous (components keep
// rendering the moment they always did) and admin writes are applied locally
// first, then saved to the server in the background.

import { useSyncExternalStore } from 'react'
import {
  brand as defaultBrand,
  destinations as defaultDestinations,
  footer as defaultFooter,
  packages as defaultPackages,
  testimonials as defaultTestimonials,
} from './content'
import { ApiError, api, getToken, setToken } from './api'

// Collections the admin panel can add to, edit and delete from.
const CONTENT_KEYS = ['destinations', 'packages', 'testimonials']
const SAVE_DEBOUNCE_MS = 500

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
  }
}

let state = {
  ...defaults(),
  bookings: [],
  subscribers: [],
  status: {
    loaded: false,
    saving: 'idle', // idle | saving | saved | error
    error: null,
    adminConfigured: null, // null until the server answers
    adminAuthed: false,
  },
}

const listeners = new Set()

function emit() {
  listeners.forEach((listener) => listener())
}

function patch(partial) {
  state = { ...state, ...partial }
  emit()
}

function patchStatus(partial) {
  patch({ status: { ...state.status, ...partial } })
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return state
}

/** React hook — re-renders the caller whenever the content or status changes. */
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

// --- loading the content from the server ------------------------------------
function mergeContent(doc) {
  const base = defaults()
  if (!doc) return base
  if (doc.brand) base.brand = { ...base.brand, ...doc.brand }
  for (const key of CONTENT_KEYS) {
    if (Array.isArray(doc[key])) base[key] = doc[key]
  }
  return base
}

let refreshing = null

export function refresh() {
  if (refreshing) return refreshing
  refreshing = api
    .getContent()
    .then((payload) => {
      patch({ ...mergeContent(payload.content) })
      patchStatus({ loaded: true, error: null })
    })
    .catch((error) => {
      patchStatus({ loaded: true, error: error.message })
    })
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

// --- saving edits to the server ---------------------------------------------
let saveTimer = null
let idleTimer = null

function contentDoc() {
  return {
    brand: state.brand,
    destinations: state.destinations,
    packages: state.packages,
    testimonials: state.testimonials,
  }
}

function scheduleSave() {
  clearTimeout(saveTimer)
  clearTimeout(idleTimer)
  patchStatus({ saving: 'saving', error: null })
  saveTimer = setTimeout(() => {
    void flushSave()
  }, SAVE_DEBOUNCE_MS)
}

async function flushSave() {
  try {
    await api.saveContent(contentDoc())
    patchStatus({ saving: 'saved', error: null })
    idleTimer = setTimeout(() => {
      if (state.status.saving === 'saved') patchStatus({ saving: 'idle' })
    }, 2500)
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      setToken(null)
      patchStatus({ saving: 'error', adminAuthed: false, error: 'نشست مدیریتی منقضی شده است. دوباره وارد شوید.' })
      return
    }
    patchStatus({ saving: 'error', error: error.message })
  }
}

// --- editing (optimistic, saved in the background) --------------------------
export function setBrand(brandPatch) {
  patch({ brand: { ...state.brand, ...brandPatch } })
  scheduleSave()
}

export function addItem(collection, item) {
  patch({ [collection]: [...state[collection], item] })
  scheduleSave()
}

export function updateItem(collection, index, itemPatch) {
  patch({
    [collection]: state[collection].map((item, i) => (i === index ? { ...item, ...itemPatch } : item)),
  })
  scheduleSave()
}

export function removeItem(collection, index) {
  patch({ [collection]: state[collection].filter((_, i) => i !== index) })
  scheduleSave()
}

/** Drops the stored document so the site falls back to its shipped defaults. */
export async function resetSite() {
  clearTimeout(saveTimer)
  clearTimeout(idleTimer)
  try {
    await api.resetContent()
    patch({ ...defaults() })
    patchStatus({ saving: 'idle', error: null })
  } catch (error) {
    patchStatus({ saving: 'error', error: error.message })
    throw error
  }
}

// --- visitor submissions ----------------------------------------------------
export async function addBooking(booking) {
  const payload = await api.createBooking(booking)
  if (payload.booking) patch({ bookings: [payload.booking, ...state.bookings] })
  return payload.booking
}

export async function addSubscriber(email) {
  await api.subscribe(String(email || '').trim().toLowerCase())
}

export async function removeById(collection, id) {
  if (collection === 'bookings') await api.deleteBooking(id)
  else await api.deleteSubscriber(id)
  patch({ [collection]: state[collection].filter((item) => String(item.id) !== String(id)) })
}

// --- admin session ----------------------------------------------------------
export async function checkAdminSession() {
  try {
    const payload = await api.adminSession()
    patchStatus({ adminConfigured: Boolean(payload.configured), error: null })
  } catch (error) {
    patchStatus({ adminConfigured: null, error: error.message })
  }
}

async function startAdminSession(token) {
  setToken(token)
  patchStatus({ adminAuthed: true, adminConfigured: true, error: null })
  await loadInbox()
}

export async function setupAdmin(password) {
  const payload = await api.adminSetup(password)
  await startAdminSession(payload.token)
}

export async function loginAdmin(password) {
  const payload = await api.adminLogin(password)
  await startAdminSession(payload.token)
}

export async function logoutAdmin() {
  try {
    await api.adminLogout()
  } catch {
    // The session may already be gone; either way the client forgets it.
  }
  setToken(null)
  patch({ bookings: [], subscribers: [] })
  patchStatus({ adminAuthed: false, error: null })
}

export async function loadInbox() {
  try {
    const payload = await api.inbox()
    patch({ bookings: payload.bookings || [], subscribers: payload.subscribers || [] })
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      setToken(null)
      patchStatus({ adminAuthed: false, error: null })
      return
    }
    patchStatus({ error: error.message })
  }
}

// A token kept from an earlier page in this tab is reused; if the server no
// longer accepts it, loadInbox() signs the panel back out.
if (getToken()) {
  state = { ...state, status: { ...state.status, adminAuthed: true } }
  void loadInbox()
}

void refresh()

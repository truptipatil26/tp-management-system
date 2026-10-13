import { createSeed, DB_VERSION, type MockDB } from './seed'

const DB_KEY = 'tp-mock-db'
const SESSION_KEY = 'tp-mock-session'

let cache: MockDB | null = null

// If another tab changes the data, drop our cached copy so we re-read it.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === DB_KEY) cache = null
  })
}

export function getDB(): MockDB {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as MockDB
      if (parsed.version === DB_VERSION) {
        cache = parsed
        return cache
      }
    }
  } catch {
    /* corrupted or unavailable storage: rebuild from seed */
  }
  cache = createSeed()
  saveDB()
  return cache
}

export function saveDB(): void {
  if (!cache) return
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(cache))
  } catch {
    /* storage full or unavailable: data stays in memory only */
  }
}

/** Restore the original fictional data and sign out. */
export function resetDB(): void {
  cache = createSeed()
  saveDB()
  setSessionUserId(null)
}

// Session is per-tab (sessionStorage) so each tab can be a different user.
export function getSessionUserId(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

export function setSessionUserId(id: string | null): void {
  try {
    if (id) sessionStorage.setItem(SESSION_KEY, id)
    else sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}

export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
}
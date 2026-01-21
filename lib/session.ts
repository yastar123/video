'use client'

import type { User } from './db'

// Session storage using cookies or localStorage
const SESSION_KEY = 'streamflix_session'
const USER_KEY = 'streamflix_user'

export function saveSession(token: string, user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function getSessionToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(SESSION_KEY)
  }
  return null
}

export function getCurrentUser(): User | null {
  if (typeof window !== 'undefined') {
    const userJson = localStorage.getItem(USER_KEY)
    if (userJson) {
      return JSON.parse(userJson)
    }
  }
  return null
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(USER_KEY)
  }
}

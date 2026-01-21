import { query } from './postgres'

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function setSession(token: string, user: any): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('session_token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export function removeSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('session_token')
    localStorage.removeItem('user')
  }
}

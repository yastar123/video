'use client'

// LocalStorage utility for popunder cooldown management
export class PopunderStorage {
  private static readonly STORAGE_KEY = 'popunder_last_trigger'

  // Get last trigger time
  static getLastTrigger(): number {
    if (typeof window === 'undefined') return 0
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? parseInt(stored) : 0
    } catch {
      return 0
    }
  }

  // Set last trigger time
  static setLastTrigger(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(this.STORAGE_KEY, Date.now().toString())
    } catch (error) {
      console.error('Failed to set popunder trigger time:', error)
    }
  }

  // Check if cooldown has passed
  static isCooldownPassed(cooldownSeconds: number): boolean {
    const now = Date.now()
    const lastTrigger = this.getLastTrigger()
    const timeSinceLastTrigger = (now - lastTrigger) / 1000 // seconds
    return timeSinceLastTrigger >= cooldownSeconds
  }

  // Get time until next available trigger
  static getTimeUntilNextTrigger(cooldownSeconds: number): number {
    const now = Date.now()
    const lastTrigger = this.getLastTrigger()
    const timeSinceLastTrigger = (now - lastTrigger) / 1000 // seconds
    const remaining = cooldownSeconds - timeSinceLastTrigger
    return Math.max(0, remaining)
  }

  // Clear storage (for testing)
  static clear(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear popunder storage:', error)
    }
  }
}

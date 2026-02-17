'use client'

// LocalStorage utility for popunder cooldown management
export class PopunderStorage {
  private static readonly STORAGE_KEY = 'popunder_last_trigger'

  // Get last trigger time
  static getLastTrigger(): number {
    if (typeof window === 'undefined') return 0
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return 0
      
      const timestamp = parseInt(stored)
      const now = Date.now()
      
      // Validate timestamp is reasonable (not in future, not too old)
      if (isNaN(timestamp) || timestamp > now || timestamp < 0) {
        console.log('Invalid timestamp detected, clearing storage')
        this.clear()
        return 0
      }
      
      // If timestamp is more than 1 day old, reset it
      const oneDayAgo = now - (24 * 60 * 60 * 1000)
      if (timestamp < oneDayAgo) {
        console.log('Old timestamp detected, clearing storage')
        this.clear()
        return 0
      }
      
      return timestamp
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
      console.log('Popunder storage cleared')
    } catch (error) {
      console.error('Failed to clear popunder storage:', error)
    }
  }

  // Reset storage to fix invalid timestamps
  static reset(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.setItem(this.STORAGE_KEY, '0')
      console.log('Popunder storage reset to 0')
    } catch (error) {
      console.error('Failed to reset popunder storage:', error)
    }
  }

  // Get debug info
  static getDebugInfo(): any {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      const timestamp = stored ? parseInt(stored) : 0
      const now = Date.now()
      const timeSince = timestamp ? (now - timestamp) / 1000 : 0
      
      return {
        stored,
        timestamp,
        now,
        timeSinceSeconds: timeSince,
        isValid: !isNaN(timestamp) && timestamp > 0 && timestamp <= now
      }
    } catch (error) {
      return { error: (error as Error).message }
    }
  }
}

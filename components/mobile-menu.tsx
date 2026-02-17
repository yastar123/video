'use client'

import { useEffect, useState } from 'react'
import { Menu, X, LogIn, User } from 'lucide-react'
import { ForceRefreshLink } from '@/components/force-refresh-link'
import { getCurrentUser } from '@/lib/session'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<ReturnType<typeof getCurrentUser>>(null)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 hover:bg-muted rounded-lg transition"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border md:hidden z-50">
          <nav className="flex flex-col p-4 gap-3">
            <ForceRefreshLink
              href="/"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 hover:bg-muted rounded-lg transition"
            >
              Home
            </ForceRefreshLink>
            <ForceRefreshLink
              href="/kategori"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 hover:bg-muted rounded-lg transition"
            >
              Categories
            </ForceRefreshLink>
            <div className="border-t border-border pt-3">
              {currentUser ? (
                <ForceRefreshLink
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-lg transition"
                >
                  <User size={18} />
                  {currentUser.username}
                </ForceRefreshLink>
              ) : (
                <ForceRefreshLink
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
                >
                  <LogIn size={18} />
                  Login
                </ForceRefreshLink>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, Settings } from 'lucide-react'
import { getCurrentUser } from '@/lib/session'

export function HeaderUser() {
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    setCurrentUser(getCurrentUser())
  }, [])

  if (!currentUser) {
    return (
      <Link
        href="/auth/login"
        className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-md hover:bg-foreground/90 transition-colors"
      >
        Sign In
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3">
      {currentUser.role === 'admin' && (
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings size={16} />
          Admin
        </Link>
      )}
      <Link
        href="/profile"
        className="flex items-center gap-2 text-sm font-medium hover:text-muted-foreground transition-colors"
      >
        {currentUser.image ? (
          <img
            src={currentUser.image}
            alt={currentUser.username}
            className="w-8 h-8 rounded-full border border-border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
            <User size={16} />
          </div>
        )}
        <span>{currentUser.username}</span>
      </Link>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  User, 
  Crown, 
  LogOut
} from 'lucide-react'
import { getCurrentUser } from '@/lib/session'

export function HeaderUser() {
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    setCurrentUser(getCurrentUser())
  }, [])

  if (!currentUser) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="px-4 py-1.5 text-sm font-medium hover:text-foreground/80 transition-colors"
        >
          Masuk
        </Link>
        <Link
          href="/auth/register"
          className="px-4 py-1.5 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90 transition-colors"
        >
          Daftar
        </Link>
      </div>
    )
  }

  const isVIP = currentUser.role === 'userVIP'

  return (
    <div className="flex items-center gap-3 relative">
      <div className="relative group">
        <Link
          href="/profile"
          className="flex items-center gap-2 p-1.5 hover:bg-accent rounded-full transition-colors"
        >
          <div className="relative">
            {currentUser.image ? (
              <img
                src={currentUser.image}
                alt={`Profile ${currentUser.username}`}
                className="w-8 h-8 rounded-full object-cover border border-border"
                loading="lazy"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Link>

        <div className="absolute top-full right-0 mt-2 w-56 sm:w-64 bg-black/95 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
          <Link 
            href="/profile" 
            className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 hover:bg-white/10 rounded-lg sm:rounded-xl mx-2 mt-2 border border-transparent hover:border-white/20 transition-all"
          >
            <User size={18} className="text-purple-400 flex-shrink-0" />
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">Profil Saya</div>
              <div className="text-[10px] sm:text-xs text-white/70">Kelola akun</div>
            </div>
          </Link>

          <div className="mx-2 my-2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <button 
            onClick={() => {
              window.location.href = '/auth/logout'
            }}
            className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 text-destructive hover:bg-destructive/10 rounded-lg sm:rounded-xl mx-2 transition-all"
          >
            <LogOut size={18} />
            <span className="font-semibold text-white/90 text-xs sm:text-sm">Keluar</span>
          </button>
        </div>
      </div>
    </div>
  )
}

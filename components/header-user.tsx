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
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="group relative px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-purple-500/50 backdrop-blur-sm"
        >
          <span className="flex items-center gap-2">
            <Crown size={16} className="hidden sm:block" />
            <Crown size={14} className="sm:hidden" />
            Masuk
          </span>
        </Link>
        
        <Link
          href="/auth/register"
          className="px-3 sm:px-5 py-2 sm:py-3 bg-black/50 backdrop-blur-sm text-white/90 font-semibold text-xs sm:text-sm rounded-lg sm:rounded-xl hover:bg-black/70 border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center gap-2"
        >
          <User size={14} className="sm:hidden" />
          <User size={16} className="hidden sm:block" />
          Daftar
        </Link>
      </div>
    )
  }

  const isVIP = currentUser.role === 'userVIP'

  return (
    <div className="flex items-center gap-3 relative">
      {isVIP && (
        <div className="absolute -top-3 -right-4 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-black shadow-lg border-2 border-yellow-400/50 animate-pulse">
            VIP
          </div>
        </div>
      )}

      <div className="relative group">
        <Link
          href="/profile"
          className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 pr-3 sm:pr-4 bg-gradient-to-r from-gray-800/50 to-black/50 hover:from-gray-700/70 hover:to-gray-900/70 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 hover:border-purple-500/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] min-w-[120px] sm:min-w-[180px]"
        >
          <div className="relative">
            {currentUser.image ? (
              <img
                src={currentUser.image}
                alt={`Profile ${currentUser.username}`}
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover border-2 sm:border-3 border-white/30 shadow-2xl hover:border-purple-400/70 transition-all group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500/40 to-pink-500/40 border-2 sm:border-3 border-white/30 shadow-2xl flex items-center justify-center text-sm sm:text-xl font-bold text-white group-hover:scale-110 transition-all">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-5 sm:h-5 bg-emerald-400 border-2 sm:border-3 border-background rounded-full shadow-lg" />
          </div>

          <div className="min-w-0 flex-1 hidden sm:block">
            <div className="font-bold text-white text-sm truncate leading-tight">
              {currentUser.username}
            </div>
            {isVIP && (
              <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold mt-1">
                <Crown size={12} />
                <span>VIP Member</span>
              </div>
            )}
          </div>

          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 rotate-0 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

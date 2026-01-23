'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  User, 
  Settings, 
  Heart, 
  Crown, 
  Video, 
  Bookmark, 
  LogOut,
  Eye 
} from 'lucide-react'
import { getCurrentUser } from '@/lib/session'
import { usePathname } from 'next/navigation'

export function HeaderUser() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    setCurrentUser(getCurrentUser())
  }, [])

  if (!currentUser) {
    return (
      <div className="flex items-center gap-3">
        {/* Primary CTA - Login for VIP Access */}
        <Link
          href="/auth/login"
          className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm rounded-2xl hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-purple-500/50 backdrop-blur-sm"
        >
          <span className="flex items-center gap-2">
            <Crown size={18} />
            Masuk VIP
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
        </Link>
        
        {/* Secondary CTA - Register */}
        <Link
          href="/auth/register"
          className="px-5 py-3 bg-black/50 backdrop-blur-sm text-white/90 font-semibold text-sm rounded-xl hover:bg-black/70 border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center gap-2"
        >
          <User size={16} />
          Daftar
        </Link>
      </div>
    )
  }

  const isVIP = currentUser.role === 'userVIP'
  const isAdmin = currentUser.role === 'admin'

  return (
    <div className="flex items-center gap-3 relative">
      {/* VIP Badge Container */}
      {isVIP && (
        <div className="absolute -top-3 -right-4 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full text-xs font-bold text-black shadow-lg border-2 border-yellow-400/50 animate-pulse">
            <Heart size={12} className="inline mr-1" />
            VIP
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 hover:text-red-100 font-semibold text-sm rounded-xl backdrop-blur-sm border border-red-500/30 transition-all hover:scale-105 shadow-md"
          title="Admin Panel"
        >
          <Settings size={16} />
          <span className="hidden sm:inline">Admin</span>
        </Link>
      )}

      {/* Quick Actions - Boost Engagement */}
      <div className="hidden md:flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
        <Link 
          href="/favorites" 
          className="p-2 hover:bg-white/10 rounded-lg transition-all group"
          title="Favorites"
        >
          <Heart 
            size={18} 
            className={`transition-colors ${pathname.includes('/favorites') ? 'text-red-400 fill-red-400' : 'text-white/70 hover:text-red-400'}`} 
          />
        </Link>
        <Link 
          href="/profile/watch-history" 
          className="p-2 hover:bg-white/10 rounded-lg transition-all group"
          title="Watch History"
        >
          <Video 
            size={18} 
            className={`transition-colors ${pathname.includes('watch-history') ? 'text-purple-400' : 'text-white/70 hover:text-purple-400'}`} 
          />
        </Link>
        <Link 
          href="/profile/bookmarks" 
          className="p-2 hover:bg-white/10 rounded-lg transition-all group"
          title="Bookmarks"
        >
          <Bookmark 
            size={18} 
            className={`transition-colors ${pathname.includes('bookmarks') ? 'text-orange-400' : 'text-white/70 hover:text-orange-400'}`} 
          />
        </Link>
      </div>

      {/* Profile Dropdown */}
      <div className="relative group">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-3 pr-4 bg-gradient-to-r from-gray-800/50 to-black/50 hover:from-gray-700/70 hover:to-gray-900/70 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-purple-500/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] min-w-[200px]"
        >
          {/* Profile Avatar */}
          <div className="relative">
            {currentUser.image ? (
              <img
                src={currentUser.image}
                alt={`Profile ${currentUser.username}`}
                className="w-12 h-12 rounded-2xl object-cover border-3 border-white/30 shadow-2xl hover:border-purple-400/70 transition-all group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/40 to-pink-500/40 border-3 border-white/30 shadow-2xl flex items-center justify-center text-xl font-bold text-white group-hover:scale-110 transition-all">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Online Status */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-3 border-background rounded-full shadow-lg animate-ping" />
          </div>

          {/* Username & Status */}
          <div className="min-w-0 flex-1">
            <div className="font-bold text-white text-sm truncate leading-tight">
              {currentUser.username}
            </div>
            {isVIP ? (
              <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold mt-1">
                <Crown size={12} />
                <span>VIP Member</span>
              </div>
            ) : (
              <div className="text-xs text-yellow-400 font-semibold mt-1 flex items-center gap-1">
                <Heart size={12} />
                <span>Upgrade VIP</span>
              </div>
            )}
          </div>

          {/* Chevron */}
          <svg className="w-4 h-4 text-white/60 rotate-0 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Link>

        {/* Enhanced Dropdown Menu */}
        <div className="absolute top-full right-0 mt-2 w-64 bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
          {/* Profile Links */}
          <Link 
            href="/profile" 
            className="flex items-center gap-3 px-5 py-4 hover:bg-white/10 rounded-xl mx-2 mt-2 border border-transparent hover:border-white/20 transition-all first:border-t-0"
          >
            <User size={20} className="text-purple-400 flex-shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">Profil Saya</div>
              <div className="text-xs text-white/70">Kelola akun & membership</div>
            </div>
          </Link>

          <Link 
            href="/profile/watch-history" 
            className="flex items-center gap-3 px-5 py-4 hover:bg-white/10 rounded-xl mx-2 border border-transparent hover:border-white/20 transition-all"
          >
            <Video size={20} className="text-blue-400 flex-shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">Riwayat Tonton</div>
              <div className="text-xs text-white/70">Video yang pernah ditonton</div>
            </div>
          </Link>

          <Link 
            href="/favorites" 
            className="flex items-center gap-3 px-5 py-4 hover:bg-white/10 rounded-xl mx-2 border border-transparent hover:border-white/20 transition-all"
          >
            <Heart size={20} className="text-red-400 flex-shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">Favorit</div>
              <div className="text-xs text-white/70">Koleksi video favorit</div>
            </div>
          </Link>

          {!isVIP && (
            <Link 
              href="/profile/membership" 
              className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 mx-2 rounded-xl border border-yellow-500/40 transition-all shadow-lg"
            >
              <Crown size={20} className="text-yellow-400 flex-shrink-0" />
              <div>
                <div className="font-bold text-yellow-400 text-sm">Upgrade VIP</div>
                <div className="text-xs text-yellow-300">Streaming tanpa iklan + eksklusif</div>
              </div>
            </Link>
          )}

          {/* Divider */}
          <div className="mx-2 my-2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Logout */}
          <button 
            onClick={() => {
              // Add logout logic here
              window.location.href = '/auth/logout'
            }}
            className="w-full flex items-center gap-3 px-5 py-4 text-destructive hover:bg-destructive/10 rounded-xl mx-2 transition-all"
          >
            <LogOut size={20} />
            <span className="font-semibold text-white/90">Keluar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
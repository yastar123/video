'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { getCurrentUser, saveSession } from '@/lib/session'
import type { User } from '@/lib/db'
import { Upload, LogOut, Heart, Crown, Shield, Video, Eye, Share2, Bookmark } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMembershipForm, setShowMembershipForm] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = getCurrentUser()
      if (currentUser) {
        try {
          const res = await fetch(`/api/users?id=${currentUser.id}`)
          const dbUsers = await res.json()
          const dbUser = Array.isArray(dbUsers) ? dbUsers.find((u: any) => u.id === currentUser.id) : null
          if (dbUser) {
            setUser(dbUser as User)
          } else {
            setUser(currentUser as User)
          }
        } catch (err) {
          setUser(currentUser as User)
        }
      } else {
        router.push('/auth/login')
      }
      setLoading(false)
    }
    fetchUser()
  }, [router])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleMembershipSubmit = async () => {
    if (!user || !selectedFile) return

    const formData = new FormData()
    formData.append('userId', user.id)
    formData.append('file', selectedFile)

    try {
      const response = await fetch('/api/membership/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        saveSession('', updatedUser)
        setShowMembershipForm(false)
        setSelectedFile(null)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: '' }),
      })
      localStorage.removeItem('streamflix_session')
      localStorage.removeItem('streamflix_user')
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        <div className="animate-spin w-12 h-12 border-4 border-muted border-t-primary rounded-full" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const seoKeywords = [
    'profil pengguna bokep', 'akun VIP nonton bokep', 'membership bokep gratis',
    'upgrade VIP streaming dewasa', 'profil member video porno indonesia',
    'akun premium bokep jepang', 'vip nonton film dewasa'
  ].join(', ')

  return (
    <>
      {/* SEO Meta Tags */}
      <title>Profil Pengguna VIP - Nonton Bokep Terbaru Gratis Indonesia Jepang China | StreamFlix</title>
      <meta name="description" content="Kelola profil akun VIP Anda untuk nonton bokep terbaru gratis. Upgrade membership VIP dapatkan akses streaming video porno Indonesia, Jepang, China dan kategori dewasa lainnya tanpa batas." />
      <meta name="keywords" content={seoKeywords} />
      <meta property="og:title" content="Profil VIP Member - StreamFlix Bokep Terlengkap" />
      <meta property="og:description" content="Kelola akun VIP nonton bokep gratis HD Indonesia Jepang China. Nikmati konten eksklusif." />
      <meta property="og:type" content="profile" />
      <meta name="robots" content="noindex, nofollow" /> {/* Profiles typically noindex */}

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-pink-900/30">
        {/* Schema.org Person JSON-LD */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": user.username,
              "email": user.email,
              "memberOf": {
                "@type": "Organization",
                "name": "StreamFlix - Situs Bokep Terlengkap"
              }
            })
          }}
        />

        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:scale-105 transition-all">
              StreamFlix
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                href="/video" 
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white/90 hover:text-white transition-all"
              >
                <Video size={20} />
                <span className="hidden sm:inline">Bokep Terbaru</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold rounded-xl backdrop-blur-sm transition-all hover:scale-105 shadow-lg"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Hero Profile Section */}
          <section className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 p-8 md:p-12 mb-12 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-4 border-white/20 p-4 md:p-6">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={`Foto profil ${user.username} - Member VIP bokep StreamFlix`}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover rounded-2xl shadow-2xl group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center text-2xl font-bold text-white/50">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-black/50">
                  {user.role === 'userVIP' ? (
                    <Crown className="w-6 h-6 text-black font-bold" />
                  ) : (
                    <Heart className="w-6 h-6 text-black" />
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    {user.username}
                  </h1>
                  {user.role === 'userVIP' && (
                    <div className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-2xl shadow-xl flex items-center gap-2">
                      <Crown size={20} />
                      <span className="hidden sm:inline">VIP MEMBER</span>
                      <span className="sm:hidden">VIP</span>
                    </div>
                  )}
                </div>
                
                <p className="text-xl text-white/80 mb-2">{user.email}</p>
                <p className="text-lg text-yellow-400 mb-6">
                  Bergabung sejak {new Date(user.joinDate).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                
                {user.role === 'userVIP' && (
                  <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-emerald-400 mb-3 flex items-center gap-2">
                      <Shield size={24} />
                      Keuntungan VIP Member
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-lg">
                      <div className="flex items-start gap-2">
                        <Video className="w-6 h-6 text-emerald-400 mt-1" />
                        <span>Streaming Tanpa Gangguan</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Eye className="w-6 h-6 text-emerald-400 mt-1" />
                        <span>Konten Eksklusif</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Bookmark className="w-6 h-6 text-emerald-400 mt-1" />
                        <span>Download Video</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Heart className="w-6 h-6 text-emerald-400 mt-1" />
                        <span>Prioritas Support</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Membership Upgrade Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* VIP Benefits Preview */}
            <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-8 md:p-10 shadow-2xl order-2 lg:order-1">
              <h2 className="text-3xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Mengapa Upgrade VIP?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                    <Video size={24} className="text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Bokep Kualitas Tinggi</h3>
                    <p className="text-lg text-white/80">Nikmati streaming video bokep Indonesia, Jepang, China dengan kualitas HD terbaik.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                    <Crown size={24} className="text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Akses Premium</h3>
                    <p className="text-lg text-white/80">Konten eksklusif + prioritas streaming HD 1080p.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Membership Action */}
            <div className="bg-gradient-to-br from-purple-600/90 to-pink-600/90 backdrop-blur-xl rounded-3xl border border-purple-500/50 p-8 md:p-10 shadow-2xl order-1 lg:order-2">
              <h2 className="text-3xl font-black mb-8 text-white text-center">
                {user.role === 'userVIP' 
                  ? 'VIP Membership Aktif' 
                  : 'Upgrade ke VIP Sekarang'
                }
              </h2>

              {user.role === 'userVIP' ? (
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500/30 border-2 border-emerald-500/50 rounded-2xl mb-6 backdrop-blur-sm">
                    <Crown className="w-8 h-8 text-emerald-400" />
                    <span className="text-2xl font-bold text-emerald-300">
                      Aktif hingga {user.membershipDate && 
                        new Date(user.membershipDate).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <p className="text-xl text-white/90 mb-6">
                    Nikmati semua fitur premium tanpa batas!
                  </p>
                </div>
              ) : user.membershipStatus === 'pending' ? (
                <div className="text-center p-12">
                  <div className="w-24 h-24 bg-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-blue-500/40">
                    <Shield size={40} className="text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Membership Sedang Diproses</h3>
                  <p className="text-lg text-white/80 mb-8">Bukti pembayaran Anda sedang ditinjau admin.</p>
                </div>
              ) : (
                <>
                  {!showMembershipForm ? (
                    <button
                      onClick={() => setShowMembershipForm(true)}
                      className="w-full px-8 py-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-xl rounded-3xl hover:scale-105 hover:shadow-2xl transition-all shadow-xl border-4 border-yellow-400/50 mb-6"
                    >
                      <Heart size={28} className="inline mr-3" />
                      UPGRDE VIP SEKARANG
                    </button>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <h3 className="font-black text-2xl text-white mb-4 flex items-center gap-3">
                          <Upload size={28} />
                          Upload Bukti Transfer
                        </h3>
                        <p className="text-lg text-white/90 mb-6">
                          Kirim screenshot atau bukti pembayaran untuk aktifkan VIP membership nonton bokep.
                        </p>
                        
                        <div className="border-2 border-dashed border-white/30 rounded-2xl p-8 text-center hover:border-purple-400/70 transition-all cursor-pointer bg-white/5">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-input"
                          />
                          <label
                            htmlFor="file-input"
                            className="cursor-pointer flex flex-col items-center gap-3 py-8"
                          >
                            <Upload size={48} className="text-purple-400 w-12 h-12" />
                            <div>
                              <span className="font-bold text-xl text-white block">
                                {selectedFile
                                  ? selectedFile.name
                                  : 'Klik atau drag file ke sini'}
                              </span>
                              <span className="text-lg text-white/70">
                                PNG, JPG, PDF (max 10MB)
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                          onClick={handleMembershipSubmit}
                          disabled={!selectedFile}
                          className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-lg rounded-2xl hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 border-2 border-emerald-400/50"
                        >
                          📤 Kirim Bukti Pembayaran
                        </button>
                        <button
                          onClick={() => setShowMembershipForm(false)}
                          className="flex-1 px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/40 text-white font-semibold rounded-2xl hover:bg-white/30 transition-all"
                        >
                          ❌ Batal
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Quick Links */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Link href="/video" className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all">
              <Video size={32} className="mx-auto mb-3 group-hover:scale-110 transition-transform text-purple-400" />
              <p className="font-bold text-white text-center text-lg">Video Bokep</p>
            </Link>
            <Link href="/favorites" className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-pink-500/20 hover:border-pink-500/50 transition-all">
              <Heart size={32} className="mx-auto mb-3 group-hover:scale-110 transition-transform text-pink-400" />
              <p className="font-bold text-white text-center text-lg">Favorit</p>
            </Link>
            {/* Add more profile links */}
          </section>
        </div>
      </main>
    </>
  )
}
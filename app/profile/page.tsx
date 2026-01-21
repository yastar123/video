'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, saveSession } from '@/lib/session'
import { findUserById } from '@/lib/auth'
import type { User } from '@/lib/db'
import { Upload, LogOut, Heart } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMembershipForm, setShowMembershipForm] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    } else {
      router.push('/auth/login')
    }
    setLoading(false)
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-muted border-t-primary rounded-full" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            StreamFlix
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <section className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="flex items-start gap-6">
            {user.image && (
              <img
                src={user.image || "/placeholder.svg"}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{user.username}</h1>
                {user.role === 'userVIP' && (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-600 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Heart size={16} />
                    VIP Member
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Joined {new Date(user.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        {/* Membership Section */}
        <section className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-6">Membership</h2>

          {user.role === 'userVIP' ? (
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-6 border border-yellow-500/20 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="text-yellow-600" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-yellow-600">
                    VIP Member
                  </h3>
                  <p className="text-sm text-yellow-600/80">
                    Premium member since{' '}
                    {user.membershipDate &&
                      new Date(user.membershipDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Enjoy ad-free streaming and exclusive content!
              </p>
            </div>
          ) : user.membershipStatus === 'pending' ? (
            <div className="bg-blue-500/10 rounded-lg p-6 border border-blue-500/20 mb-6">
              <h3 className="text-lg font-bold text-blue-600 mb-2">
                Membership Pending
              </h3>
              <p className="text-sm text-blue-600/80">
                Your membership request is being reviewed by our admin team.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-muted-foreground mb-6">
                Upgrade to VIP membership to enjoy ad-free streaming and
                exclusive content.
              </p>

              {!showMembershipForm ? (
                <button
                  onClick={() => setShowMembershipForm(true)}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition flex items-center gap-2"
                >
                  <Heart size={20} />
                  Upgrade to VIP
                </button>
              ) : (
                <div className="bg-muted/50 rounded-lg p-6 border border-border">
                  <h3 className="font-bold mb-4">Upload Payment Proof</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please upload proof of payment (screenshot or receipt) for
                    VIP membership.
                  </p>

                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-input"
                      />
                      <label
                        htmlFor="file-input"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload size={32} className="text-muted-foreground" />
                        <span className="font-medium">
                          {selectedFile
                            ? selectedFile.name
                            : 'Click to upload or drag and drop'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          PNG, JPG, PDF up to 10MB
                        </span>
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleMembershipSubmit}
                        disabled={!selectedFile}
                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Payment Proof
                      </button>
                      <button
                        onClick={() => setShowMembershipForm(false)}
                        className="flex-1 px-4 py-2 border border-input rounded-lg hover:bg-muted transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

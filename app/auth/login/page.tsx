'use client'

import { GoogleLoginButton } from '@/components/google-login-button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveSession } from '@/lib/session'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.success) {
        saveSession(data.token, data.user)
        router.push(data.user.role === 'admin' ? '/admin/dashboard' : '/')
        router.refresh()
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = (token: string) => {
    router.push('/profile')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border border-border shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Ruang Malam</h1>
            <p className="text-muted-foreground">Sign in to access VIP content</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            {error && <div className="text-destructive text-sm text-center">{error}</div>}
            <div>
              <label className="text-sm font-medium">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md bg-background"
                placeholder="admin@streamflix.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md bg-background"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">or continue with</span>
            </div>
          </div>

          <div className="space-y-4">
            <GoogleLoginButton onLoginSuccess={handleLoginSuccess} />
            <Link
              href="/"
              className="block w-full px-4 py-2 border border-input rounded-lg text-center hover:bg-muted transition font-medium text-sm"
            >
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

'use client'

import { GoogleLoginButton } from '@/components/google-login-button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveSession } from '@/lib/session'

export default function LoginPage() {
  const router = useRouter()

  const handleLoginSuccess = (token: string) => {
    // Session already saved by API, redirect to profile
    router.push('/profile')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border border-border shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">StreamFlix</h1>
            <p className="text-muted-foreground">
              Sign in to your account
            </p>
          </div>

          <div className="space-y-6">
            <GoogleLoginButton onLoginSuccess={handleLoginSuccess} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  or continue as guest
                </span>
              </div>
            </div>

            <Link
              href="/"
              className="block w-full px-4 py-2 border border-input rounded-lg text-center hover:bg-muted transition font-medium"
            >
              Continue as Guest
            </Link>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New to StreamFlix?{' '}
            <span className="text-primary">Sign up with Google</span>
          </p>
        </div>
      </div>
    </main>
  )
}

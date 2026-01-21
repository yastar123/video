'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: unknown) => void
          renderButton: (element: HTMLElement, options: unknown) => void
          oneTap: (options: unknown) => void
        }
      }
    }
  }
}

interface GoogleLoginButtonProps {
  onLoginSuccess?: (token: string) => void
}

export function GoogleLoginButton({ onLoginSuccess }: GoogleLoginButtonProps) {
  const router = useRouter()
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      setScriptLoaded(true)
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!scriptLoaded || !window.google) return

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    })

    const buttonContainer = document.getElementById('google-login-button')
    if (buttonContainer) {
      window.google.accounts.id.renderButton(buttonContainer, {
        theme: 'outline',
        size: 'large',
        text: 'signin',
      })
    }
  }, [scriptLoaded])

  async function handleCredentialResponse(response: { credential: string }) {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      })

      const data = await res.json()

      if (data.success) {
        if (onLoginSuccess) {
          onLoginSuccess(data.sessionToken)
        }
        // Redirect to profile or home
        router.push('/profile')
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div id="google-login-button" className="flex justify-center" />
  )
}

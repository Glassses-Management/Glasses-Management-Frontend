import { useEffect, useRef, useState } from 'react'
import { initGoogle, isGoogleConfigured, onGoogleCredential } from '@/lib/googleIdentity'

// Renders the real Google button produced by Google Identity Services. Using the
// official button instead of a hand-rolled one avoids Google's branding rules
// and gives the popup handling, One Tap support and accessibility for free.

function GoogleSignInButton({ onCredential, onError, disabled = false }) {
  const hostRef = useRef(null)
  const callbackRef = useRef(onCredential)
  // The client id is a build-time constant, so "is Google even available" is
  // derived rather than stored: no effect and no state update needed for it.
  const configured = isGoogleConfigured()
  const [status, setStatus] = useState('loading')

  // Keep the latest handler without re-rendering the button: the GIS button is
  // rendered once and re-rendering it would restart the popup.
  useEffect(() => {
    callbackRef.current = onCredential
  }, [onCredential])

  // Hand the credential to whoever is currently signed in to the flow. Going
  // through the lib's registry (rather than only the button's `credential`
  // option) is what makes the popup actually deliver the token.
  useEffect(() => {
    if (!configured) return undefined
    return onGoogleCredential((credential) => callbackRef.current?.(credential))
  }, [configured])

  useEffect(() => {
    if (!configured) return undefined

    let cancelled = false

    const render = async () => {
      try {
        const ready = await initGoogle()
        if (cancelled) return
        if (!ready || !hostRef.current) {
          setStatus('unavailable')
          return
        }

        window.google.accounts.id.renderButton(hostRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          width: 280,
          // Kept in addition to the initialize() callback: older GIS builds
          // deliver the token through this property instead.
          credential: (response) => {
            if (response?.credential) {
              callbackRef.current?.(response.credential)
            }
          },
        })
        setStatus('ready')
      } catch (err) {
        if (cancelled) return
        setStatus('error')
        onError?.(err)
      }
    }

    void render()
    return () => { cancelled = true }
  }, [configured, onError])

  if (!configured) return null

  return (
    <div className="relative flex min-h-[42px] flex-col items-center justify-center">
      {/* This host must already be in the DOM when the effect calls
          renderButton, so it is always mounted. The overlays below cover it
          until Google has actually drawn the button into it. */}
      <div
        ref={hostRef}
        className={disabled ? 'pointer-events-none opacity-60' : ''}
        data-testid="google-signin-button"
      />

      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[42px] w-[280px] animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-800" />
        </div>
      )}

      {(status === 'unavailable' || status === 'error') && (
        <p className="absolute inset-0 flex items-center justify-center px-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Google sign-in is unavailable right now. Use email and password instead.
        </p>
      )}
    </div>
  )
}

export default GoogleSignInButton

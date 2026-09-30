import AuthLeftPanel from '@/pages/auth/AuthLeftPanel'
import AuthSignInPanel from '@/pages/auth/AuthSignInPanel'

function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mist via-mist-soft to-white font-sans text-neutral-800 antialiased transition-colors duration-300 dark:from-surface-canvas dark:via-surface-ink-deep dark:to-surface-canvas">
      <div className="mx-auto grid min-h-screen max-w-5xl lg:grid-cols-2">
        <AuthLeftPanel />
        <AuthSignInPanel />
      </div>
    </div>
  )
}

export default LoginPage
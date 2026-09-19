import AuthLeftPanel from '@/pages/auth/AuthLeftPanel'
import AuthSignInPanel from '@/pages/auth/AuthSignInPanel'

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist-soft px-4 py-8 transition-colors duration-300 dark:bg-[#0E1A15]">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#0E1A15]">
        <div className="grid lg:grid-cols-2">
          <AuthLeftPanel />
          <AuthSignInPanel />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
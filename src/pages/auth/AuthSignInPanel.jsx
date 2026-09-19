import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useAuth } from '@/hook/UseAuth'
import { hasRole, ROLES } from '@/utils/Roles'
import AuthSegmentedToggle from '@/pages/auth/AuthSegmentedToggle'
import AuthSsoRow from '@/pages/auth/AuthSsoRow'
import AuthTrustLine from '@/pages/auth/AuthTrustLine'

function AuthSignInPanel() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || null

  const [portal, setPortal] = useState('patient')
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [phoneMode, setPhoneMode] = useState(false)
  const [remember, setRemember] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (serverError) setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.identifier.trim()) nextErrors.identifier = 'Email or patient ID is required'
    if (!form.password) nextErrors.password = 'Password is required'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const user = await login(form.identifier.trim(), form.password)
      if (hasRole(user, ROLES.CUSTOMER)) {
        navigate(redirectTo || '/account', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch {
      setServerError('Invalid email or password. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col justify-center p-8 lg:p-10">
      <AuthSegmentedToggle value={portal} onChange={setPortal} />

      <h1 className="mt-6 font-sans text-2xl font-semibold text-neutral-900 md:text-3xl dark:text-neutral-50">
        Sign In to {portal === 'patient' ? 'OptiCraft Vault' : 'Clinician Console'}
      </h1>
      <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
        {portal === 'patient'
          ? 'Access your private optical health record and orders.'
          : 'Staff & practitioner access with role-based privileges.'}
      </p>

      <div className="mt-6">
        <AuthSsoRow />
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Or sign in with email &amp; patient ID
        </span>
        <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
      </div>

      {serverError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-500/10 dark:text-red-400">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <div className="mb-1 flex items-end justify-between gap-2">
            <label htmlFor="identifier" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email or Patient ID
            </label>
            <button
              type="button"
              onClick={() => setPhoneMode((value) => !value)}
              className="text-xs font-semibold text-forest hover:underline dark:text-leaf"
            >
              {phoneMode ? 'Prefer email?' : 'New prescription? Use phone #'}
            </button>
          </div>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              id="identifier"
              name="identifier"
              type="text"
              value={form.identifier}
              onChange={handleChange}
              placeholder={phoneMode ? 'Enter your phone number' : 'you@example.com or patient ID'}
              className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-900 outline-none transition-colors focus:border-forest dark:border-neutral-600 dark:bg-[#0E1A15] dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-leaf"
            />
          </div>
          {errors.identifier && <p className="mt-1 text-xs text-red-500">{errors.identifier}</p>}
        </div>

        <div>
          <div className="mb-1 flex items-end justify-between gap-2">
            <label htmlFor="password" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <button type="button" className="text-xs font-semibold text-forest hover:underline dark:text-leaf">
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-900 outline-none transition-colors focus:border-forest dark:border-neutral-600 dark:bg-[#0E1A15] dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-leaf"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 rounded accent-forest"
            />
            Remember device (30-day HIPAA token)
          </label>
          <span className="rounded-full bg-mist px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:bg-white/5 dark:text-neutral-400">
            SafeVault™
          </span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60 dark:bg-leaf dark:text-forest dark:hover:opacity-90"
        >
          {submitting ? 'Signing in…' : 'Sign In to Patient Portal'}
          {!submitting && <ArrowRight size={16} />}
        </button>
      </form>

      <div className="mt-5">
        <AuthTrustLine />
      </div>

      <p className="mt-5 text-center text-sm text-neutral-500 dark:text-neutral-400">
        New to OptiCraft Precision Eyecare?{' '}
        <Link to="/register" state={location.state} className="font-semibold text-forest hover:underline dark:text-leaf">
          Create an account / Register patient profile →
        </Link>
      </p>
    </div>
  )
}

export default AuthSignInPanel
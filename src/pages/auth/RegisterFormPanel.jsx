import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarDays, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react'
import { useAuth } from '@/hook/UseAuth'
import { useToast } from '@/hook/UseToast'
import { email, phone as verifyPhone } from '@/utils/Validators'
import AuthSsoRow from '@/pages/auth/AuthSsoRow'

const inputClass =
  'w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-900 outline-none transition-colors focus:border-forest dark:border-neutral-600 dark:bg-[#0E1A15] dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-leaf'

const iconClass = 'pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500'

function RegisterFormPanel() {
  const { register } = useAuth()
  const { error: toastError } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || null

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    email: '',
    password: '',
    showPassword: false,
    terms: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const update = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.firstName.trim() || !form.lastName.trim()) next.firstName = 'First and last name are required'
    if (!form.phone.trim()) next.phone = 'Phone is required'
    else if (verifyPhone(form.phone)) next.phone = verifyPhone(form.phone)
    if (!form.dateOfBirth) next.dateOfBirth = 'Date of birth is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (email(form.email)) next.email = email(form.email)
    if (form.password.length < 6 || form.password.length > 100)
      next.password = 'Password must be 6-100 characters'
    else if (!form.password) next.password = 'Password is required'
    if (!form.terms) next.terms = 'Accept the Terms of Service and HIPAA Privacy Notice to continue'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      await register({
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: '',
        date_of_birth: form.dateOfBirth,
        password: form.password,
      })
      navigate(redirectTo || '/account', { replace: true })
    } catch (err) {
      const data = err?.response?.data
      let msg = data?.error || data?.message || err?.message || ''
      if (!msg && data && typeof data === 'object') {
        msg = Object.values(data).find((value) => typeof value === 'string') || ''
      }
      toastError(msg || 'Registration failed. Check your details or try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center p-5 md:p-10">
      <div className="w-full max-w-[440px] rounded-2xl bg-white p-7 shadow-lg ring-1 ring-neutral-200/60 transition-colors duration-300 md:p-8 dark:bg-[#16271F] dark:ring-neutral-800">
        <h1 className="font-sans text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          Create a secure profile in seconds.
        </p>

        <div className="mt-6">
          <AuthSsoRow />
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            or with email
          </span>
          <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="relative">
                <User size={16} className={iconClass} />
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  placeholder="First name"
                  className={inputClass}
                />
              </div>
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
            </div>
            <div>
              <div className="relative">
                <User size={16} className={iconClass} />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  placeholder="Last name"
                  className={inputClass}
                />
              </div>
              {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <div className="relative">
              <Mail size={16} className={iconClass} />
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="relative">
                <Phone size={16} className={iconClass} />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={inputClass}
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
            <div>
              <div className="relative">
                <CalendarDays size={16} className={iconClass} />
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => update('dateOfBirth', e.target.value)}
                  className={`${inputClass} pr-3 [color-scheme:light] dark:[color-scheme:dark]`}
                />
              </div>
              {errors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>}
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <label htmlFor="password" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Password
              </label>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">Min 6 chars</span>
            </div>
            <div className="relative">
              <Lock size={16} className={iconClass} />
              <input
                id="password"
                name="password"
                type={form.showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="••••••••"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => update('showPassword', !form.showPassword)}
                aria-label={form.showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
              >
                {form.showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={(e) => update('terms', e.target.checked)}
                className="mt-0.5 size-4 rounded accent-forest"
              />
              <span>
                I agree to the <span className="font-semibold text-forest dark:text-leaf">Terms of Service</span>{' '}
                &amp; <span className="font-semibold text-forest dark:text-leaf">HIPAA Privacy Notice</span> regarding
                optical telemetry storage.
              </span>
            </label>
            {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60 dark:bg-leaf dark:text-forest dark:hover:opacity-90"
          >
            {submitting ? 'Creating Account…' : 'Create Secure Account'}
            {!submitting && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Already have an OptiCraft profile?{' '}
          <Link to="/login" state={location.state} className="font-semibold text-forest hover:underline dark:text-leaf">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterFormPanel
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hook/UseAuth'
import { useToast } from '@/hook/UseToast'

export default function LoginPage() {
  const { login } = useAuth()
  const { error: toastError } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ identifier: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.identifier.trim()) nextErrors.identifier = 'Email or phone is required'
    if (!form.password) nextErrors.password = 'Password is required'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await login(form.identifier, form.password)
      navigate('/')
    } catch {
      toastError('Login failed. Check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f6fb] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a1a2e] text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="15" r="4" />
              <circle cx="18" cy="15" r="4" />
              <path d="M14 15a2 2 0 0 0-4 0" />
              <path d="M2.5 13L5 7c.7-1.3 2-2 3.5-2h7c1.5 0 2.8.7 3.5 2l2.5 6" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1a1a2e]">glasses-web</h1>
            <p className="text-xs text-gray-400">Optical Shop Management</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-[#1a1a2e]">Welcome back</h2>
        <p className="mt-1 mb-6 text-sm text-gray-400">Sign in to continue to the dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#1a1a2e]">Email or phone</label>
            <input
              type="text"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#1a1a2e] outline-none transition-colors focus:border-[#8fa88f]"
            />
            {errors.identifier && <p className="mt-1 text-xs text-red-500">{errors.identifier}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#1a1a2e]">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#1a1a2e] outline-none transition-colors focus:border-[#8fa88f]"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#1a1a2e] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          New customer?{' '}
          <Link to="/register" className="font-medium text-[#8fa88f] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
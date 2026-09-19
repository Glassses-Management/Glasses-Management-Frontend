import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hook/UseAuth'
import { useToast } from '@/hook/UseToast'
import { email, phone } from '@/utils/Validators'

export default function RegisterPage() {
  const { register } = useAuth()
  const { error: toastError } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = location.state?.from?.pathname || null

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    date_of_birth: '',
    password: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required'
    if (!form.phone.trim()) nextErrors.phone = 'Phone is required'
    else if (phone(form.phone)) nextErrors.phone = phone(form.phone)
    if (!form.email.trim()) nextErrors.email = 'Email is required'
    else if (email(form.email)) nextErrors.email = email(form.email)
    if (!form.password) nextErrors.password = 'Password is required'
    else if (form.password.length < 6 || form.password.length > 100)
      nextErrors.password = 'Password must be 6-100 characters'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await register(form)
      navigate(redirectTo || '/account', { replace: true })
    } catch (err) {
      const data = err?.response?.data
      let msg =
        data?.error ||
        data?.message ||
        err?.message ||
        ''
      if (!msg && data && typeof data === 'object') {
        msg = Object.values(data).find((v) => typeof v === 'string') || ''
      }
      toastError(msg || 'Registration failed. Check your details or try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-4 py-8 transition-colors duration-300 dark:bg-[#111118]">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm transition-colors duration-300 dark:bg-[#1c1c28] dark:ring-1 dark:ring-neutral-800">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a1a2e] text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="15" r="4" />
              <circle cx="18" cy="15" r="4" />
              <path d="M14 15a2 2 0 0 0-4 0" />
              <path d="M2.5 13L5 7c.7-1.3 2-2 3.5-2h7c1.5 0 2.8.7 3.5 2l2.5 6" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1a1a2e] dark:text-neutral-50">Optic Shop</h1>
            <p className="text-xs text-gray-400 dark:text-neutral-500">Optical Shop Management</p>
          </div>
        </Link>

        <h2 className="text-xl font-semibold text-[#1a1a2e] dark:text-neutral-50">Create your account</h2>
        <p className="mt-1 mb-6 text-sm text-gray-400 dark:text-neutral-500">Register as a customer to get started</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#1a1a2e] dark:text-neutral-300">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#1a1a2e] outline-none transition-colors focus:border-[#8fa88f] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#8fa88f]"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#1a1a2e] dark:text-neutral-300">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0123456789"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#1a1a2e] outline-none transition-colors focus:border-[#8fa88f] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#8fa88f]"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#1a1a2e] dark:text-neutral-300">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#1a1a2e] outline-none transition-colors focus:border-[#8fa88f] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#8fa88f]"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#1a1a2e] dark:text-neutral-300">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Main St"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#1a1a2e] outline-none transition-colors focus:border-[#8fa88f] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#8fa88f]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#1a1a2e] dark:text-neutral-300">Date of birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#1a1a2e] outline-none transition-colors focus:border-[#8fa88f] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#8fa88f]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#1a1a2e] dark:text-neutral-300">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#1a1a2e] outline-none transition-colors focus:border-[#8fa88f] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#8fa88f]"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#1a1a2e] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400 dark:text-neutral-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#8fa88f] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

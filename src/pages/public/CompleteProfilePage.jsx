import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarDays, Phone, User } from 'lucide-react'
import { useAuth } from '@/hook/UseAuth'
import { useToast } from '@/hook/UseToast'
import { completeMyProfile } from '@/api/customerApi'
import { phone as verifyPhone } from '@/utils/Validators'

const inputClass =
  'w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-900 outline-none transition-colors focus:border-forest dark:border-neutral-600 dark:bg-[#0E1A15] dark:text-neutral-100 dark:focus:border-leaf'

const iconClass = 'pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500'

// Shown after a Google signup. Google verifies the email but cannot supply the
// phone number the customer record needs, so the account is created first and
// the remaining details are collected here.
function CompleteProfilePage() {
  const { user, getUser } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    dateOfBirth: '',
    address: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const update = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.phone.trim()) next.phone = 'Phone number is required'
    else if (verifyPhone(form.phone)) next.phone = verifyPhone(form.phone)
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      await completeMyProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        date_of_birth: form.dateOfBirth || null,
      })
      // Refresh the cached account so the header shows the real name right away.
      await getUser()
      success('Profile completed. Welcome!')
      navigate('/account', { replace: true })
    } catch (err) {
      const data = err?.response?.data
      let msg = data?.error || data?.message || ''
      if (!msg && data && typeof data === 'object') {
        msg = Object.values(data).find((value) => typeof value === 'string') || ''
      }
      error(msg || 'Could not save your profile. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center p-5 md:p-10">
      <div className="w-full max-w-[440px] rounded-2xl bg-white p-7 shadow-lg ring-1 ring-neutral-200/60 dark:bg-[#16271F] dark:ring-neutral-800">
        <h1 className="font-sans text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
          Finish setting up your account
        </h1>
        <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          You are signed in{user?.email ? ` as ${user.email}` : ''}. Add a few details so we
          can reach you about your orders and appointments.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Full name
            </label>
            <div className="relative">
              <User size={16} className={iconClass} />
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Jane Doe"
                className={inputClass}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Phone number
            </label>
            <div className="relative">
              <Phone size={16} className={iconClass} />
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="5551234567"
                className={inputClass}
              />
            </div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Used to look up your records and send appointment reminders.
            </p>
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Date of birth <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <div className="relative">
              <CalendarDays size={16} className={iconClass} />
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => update('dateOfBirth', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Address <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              placeholder="Street, city"
              className={`${inputClass} pl-3`}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60 dark:bg-leaf dark:text-forest"
          >
            {submitting ? 'Saving…' : 'Save and continue'}
            {!submitting && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CompleteProfilePage

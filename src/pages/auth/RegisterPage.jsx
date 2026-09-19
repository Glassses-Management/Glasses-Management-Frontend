import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '@/hook/UseAuth'
import { useToast } from '@/hook/UseToast'
import { email, phone } from '@/utils/Validators'
import RegisterHeader from '@/pages/auth/RegisterHeader'
import RegisterStepTracker from '@/pages/auth/RegisterStepTracker'
import RegisterSectionPersonal from '@/pages/auth/RegisterSectionPersonal'
import RegisterSectionOptical from '@/pages/auth/RegisterSectionOptical'
import RegisterSectionSecurity from '@/pages/auth/RegisterSectionSecurity'
import RegisterBenefitsCard from '@/pages/auth/RegisterBenefitsCard'
import RegisterSocialProofCard from '@/pages/auth/RegisterSocialProofCard'
import RegisterCalloutCard from '@/pages/auth/RegisterCalloutCard'

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  phone: '',
  email: '',
  address: '',
  sameAsBilling: false,
  insuranceCarrier: '',
  memberId: '',
  needsRx: '',
  autoCopay: false,
  password: '',
  confirmPassword: '',
  showPassword: false,
  showConfirm: false,
  consents: { hipaa: false, biometric: false, sms: false },
}

function RegisterPage() {
  const { register } = useAuth()
  const { error: toastError } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || null

  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const update = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.firstName.trim() || !form.lastName.trim()) next.firstName = 'First and last name are required'
    if (!form.dateOfBirth) next.dateOfBirth = 'Date of birth is required'
    if (!form.phone.trim()) next.phone = 'Phone is required'
    else if (phone(form.phone)) next.phone = phone(form.phone)
    if (!form.email.trim()) next.email = 'Email is required'
    else if (email(form.email)) next.email = email(form.email)
    if (!form.address.trim()) next.address = 'Address is required'
    if (!form.password) next.password = 'Password is required'
    else if (form.password.length < 6 || form.password.length > 100)
      next.password = 'Password must be 6-100 characters'
    if (form.password && form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match'
    if (!form.consents.hipaa) next.consents = 'Accept the HIPAA clinical notice to continue'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      await register({
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
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

  const hasPersonal = form.firstName && form.lastName && form.dateOfBirth
  const activeStep = !hasPersonal ? 0 : !form.password ? 1 : 2

  return (
    <div className="min-h-screen bg-mist-soft text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#0E1A15] dark:text-neutral-200">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <RegisterHeader />
        <RegisterStepTracker activeStep={activeStep} />

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <form className="min-w-0 space-y-6" onSubmit={handleSubmit} noValidate>
            <RegisterSectionPersonal form={form} errors={errors} update={update} />
            <RegisterSectionOptical form={form} update={update} />
            <RegisterSectionSecurity form={form} errors={errors} update={update} />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-forest px-6 text-sm font-semibold text-white transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60 dark:bg-leaf dark:text-forest dark:hover:opacity-90"
              >
                {submitting ? 'Creating Account…' : 'Create Patient Account & Access Vault'}
                {!submitting && <ArrowRight size={16} />}
              </button>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Already registered?{' '}
                <Link to="/login" className="font-semibold text-forest hover:underline dark:text-leaf">
                  Sign In
                </Link>
              </p>
            </div>
          </form>

          <aside className="min-w-0 space-y-6">
            <RegisterBenefitsCard />
            <RegisterSocialProofCard />
            <RegisterCalloutCard />
          </aside>
        </div>
      </section>
    </div>
  )
}

export default RegisterPage
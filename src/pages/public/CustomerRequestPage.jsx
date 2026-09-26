import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AlertCircle, Check, ClipboardList, Lock, Mail, Phone, Send, ShieldCheck, User } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import HomeFooter from '@/pages/public/HomeFooter'
import Button from '@/components/ui/Button'
import RequestTypePicker from '@/components/request/RequestTypePicker'
import RequestDetailsCard from '@/components/request/RequestDetailsCard'
import RequestPrescriptionSection from '@/components/request/RequestPrescriptionSection'
import CustomerRequestSidebar from '@/components/request/CustomerRequestSidebar'
import { useAuth } from '@/hook/UseAuth'
import { useToast } from '@/hook/UseToast'
import { createRequest } from '@/api/requestApi'
import { getPrescriptionsByCustomer } from '@/api/prescriptionApi'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function SectionHeader({ icon: Icon, title, required }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
        <Icon size={16} strokeWidth={2} />
      </span>
      <h2 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">
        {title}
        {required && <span className="ml-1 text-red-500">*</span>}
      </h2>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-neutral-400 dark:text-neutral-500">{label}</p>
        <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-50">{value || '—'}</p>
      </div>
    </div>
  )
}

const cardClass =
  'rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/70 sm:p-6 dark:bg-[#16271F]/60 dark:ring-neutral-800'

function GuestPrompt({ from }) {
  return (
    <div className="mt-8 flex flex-col items-center rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-neutral-200/70 dark:bg-[#16271F]/60 dark:ring-neutral-800" data-aos="fade-up">
      <span className="flex size-14 items-center justify-center rounded-full bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
        <Lock size={24} strokeWidth={1.8} />
      </span>
      <h2 className="mt-5 font-sans text-xl font-semibold text-neutral-900 dark:text-neutral-50">
        Sign in to submit a request
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
        Our request form uses the details on your account. Sign in or create an account to get started.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/login"
          state={{ from }}
          className="rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-deep"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:border-forest hover:text-forest dark:border-neutral-600 dark:text-neutral-200 dark:hover:border-leaf dark:hover:text-leaf"
        >
          Create an account
        </Link>
      </div>
    </div>
  )
}

export default function CustomerRequestPage() {
  const { token, user } = useAuth()
  const { success: toastSuccess, error: toastError } = useToast()
  const location = useLocation()

  const customerId = user?.customer_id ?? user?.id
  const isAuthenticated = !!token

  const [requestType, setRequestType] = useState('')
  const [reason, setReason] = useState('')
  const [contactMethod, setContactMethod] = useState('Phone')
  const [notes, setNotes] = useState('')

  const [enabledRx, setEnabledRx] = useState(false)
  const [selectedRxId, setSelectedRxId] = useState(undefined)
  const [prescriptions, setPrescriptions] = useState([])
  const [rxLoading, setRxLoading] = useState(() => Boolean(token))

  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const [errors, setErrors] = useState({})
  const [detailsError, setDetailsError] = useState({})
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    if (!token || customerId == null) return
    let cancelled = false
    getPrescriptionsByCustomer(customerId)
      .then((data) => {
        if (!cancelled) setPrescriptions(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!cancelled) setPrescriptions([])
      })
      .finally(() => {
        if (!cancelled) setRxLoading(false)
      })
    return () => { cancelled = true }
  }, [token, customerId])

  // Only an eye exam / prescription change can be submitted here, so the notes
  // are always built from the exam fields.
  const composedNotes = useMemo(() => {
    const lines = []
    if (reason) lines.push(`Reason for visit: ${reason}`)
    if (contactMethod) lines.push(`Preferred contact method: ${contactMethod}`)
    if (notes.trim()) lines.push(notes.trim())
    return lines.join('\n')
  }, [reason, contactMethod, notes])

  // Clear any server-side field error when the user edits that field.
  const patchDetails = (patch) => {
    if (patch.notes) setNotes(patch.notes)
    if (patch.reason) setReason(patch.reason)
    if (patch.contactMethod) setContactMethod(patch.contactMethod)
    if (patch.notes !== undefined && detailsError.notes) setDetailsError({})
  }

  const chooseType = (type) => {
    setRequestType(type)
    setErrors((prev) => ({ ...prev, requestType: undefined }))
    setReason('')
    setSelectedRxId(undefined)
    setEnabledRx(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    const nextErrors = {}
    if (!requestType) nextErrors.requestType = 'Please choose a request type'
    if (enabledRx && !selectedRxId) nextErrors.prescription = 'Please select a prescription'
    if (!confirmed) nextErrors.confirmed = 'Please confirm that the information provided is accurate'

    setServerError('')
    setDetailsError({})
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const res = await createRequest({
        type: requestType,
        notes: composedNotes || undefined,
        prescriptionId: selectedRxId || undefined,
      })
      setSubmitted({ id: res?.id })
      toastSuccess('Request submitted successfully!')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      const data = err?.response?.data
      const fieldErrors = {}
      if (data?.type) fieldErrors.requestType = data.type
      if (data?.prescriptionId) fieldErrors.prescription = data.prescriptionId
      setErrors((prev) => ({ ...prev, ...fieldErrors }))
      setDetailsError(data?.notes ? { notes: data.notes } : {})
      const msg =
        typeof data?.error === 'string'
          ? data.error
          : data?.message || err?.message || 'Something went wrong while submitting your request.'
      setServerError(msg)
      toastError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setRequestType('')
    setReason('')
    setContactMethod('Phone')
    setNotes('')
    setEnabledRx(false)
    setSelectedRxId(undefined)
    setConfirmed(false)
    setSubmitting(false)
    setErrors({})
    setDetailsError({})
    setServerError('')
    setSubmitted(null)
  }

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800 antialiased transition-colors duration-300 dark:bg-[#0E1A15] dark:text-neutral-200">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">New Request</p>
        <h1 className="mt-3 font-sans font-semibold text-4xl leading-tight text-neutral-900 dark:text-neutral-50 md:text-5xl" data-aos="fade-up">
          Request an Eye Exam or <span className="italic">Prescription Change</span>
        </h1>
        <div className="mt-4 h-[3px] w-12 rounded-full bg-forest" />
        <p className="mt-5 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Tell us what you need and our optical team will review your request and contact you with the next steps.
          Non-prescription products such as sunglasses are ordered from the catalog instead.
        </p>

        {!isAuthenticated ? (
          <GuestPrompt from={location} />
        ) : submitted ? (
          <div className="mt-8 flex flex-col items-center rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-neutral-200/70 dark:bg-[#16271F]/60 dark:ring-neutral-800" data-aos="fade-up">
            <span className="flex size-16 items-center justify-center rounded-full bg-forest/10 text-forest ring-8 ring-forest/10 dark:bg-leaf/10 dark:text-leaf dark:ring-leaf/10">
              <Check size={30} strokeWidth={2.5} />
            </span>
            <h2 className="mt-6 font-sans text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
              Request Submitted Successfully
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              Your request has been sent to our optical team. You can track its status from your requests.
            </p>
            {submitted.id != null && (
              <p className="mt-2 rounded-full bg-forest/10 px-3 py-1 text-xs font-medium text-forest dark:bg-leaf/10 dark:text-leaf">
                Request #{submitted.id}
              </p>
            )}
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/account"
                className="rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-deep"
              >
                View My Requests
              </Link>
              <Button variant="outline" onClick={resetForm}>
                Submit Another Request
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-8 grid items-start gap-6 lg:grid-cols-3" data-aos="fade-up">
            <div className="space-y-6 lg:col-span-2">
              {/* Request type */}
              <section className={cn(cardClass, errors.requestType && 'ring-1 ring-red-300')} data-aos="fade-up" data-aos-delay="100">
                <SectionHeader icon={ClipboardList} title="Request Type" required />
                <RequestTypePicker value={requestType} onChange={chooseType} />
                {errors.requestType && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-red-500" role="alert">
                    <AlertCircle size={13} />
                    {errors.requestType}
                  </p>
                )}
              </section>

              {/* Customer information */}
              <section className={cardClass} data-aos="fade-up" data-aos-delay="200">
                <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
                  <SectionHeader icon={User} title="Customer Information" />
                  <Link
                    to="/account"
                    className="text-sm font-medium text-forest transition-colors hover:text-forest-deep dark:text-leaf"
                  >
                    Update information
                  </Link>
                </div>
                <p className="-mt-2 mb-4 text-xs text-neutral-400 dark:text-neutral-500">
                  We will use the details saved on your account.
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <InfoRow icon={User} label="Full name" value={user?.name} />
                  <InfoRow icon={Mail} label="Email" value={user?.email} />
                  <InfoRow icon={Phone} label="Phone" value={user?.phone} />
                </div>
              </section>

              {/* Request details */}
              <section className={cardClass} data-aos="fade-up" data-aos-delay="300">
                <SectionHeader icon={ShieldCheck} title="Request Details" required />
                {!requestType ? (
                  <p className="rounded-xl border border-dashed border-neutral-200 p-4 text-center text-sm text-neutral-400 dark:border-neutral-700 dark:text-neutral-500">
                    Choose a request type above to see the relevant fields.
                  </p>
                ) : (
                  <RequestDetailsCard
                    type={requestType}
                    value={{ reason, contactMethod, notes }}
                    onChange={patchDetails}
                    error={detailsError}
                  />
                )}
              </section>

              {/* Prescription */}
              {requestType && (
                <section className={cardClass}>
                  <SectionHeader icon={ClipboardList} title="Prescription" />
                  {requestType === 'exam' && prescriptions.length === 0 ? (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      You do not need a prescription to request an eye exam — our optometrist will prepare one
                      after your consultation.
                    </p>
                  ) : (
                    <RequestPrescriptionSection
                      type={requestType}
                      prescriptions={prescriptions}
                      loading={rxLoading}
                      enabled={enabledRx}
                      selectedId={selectedRxId}
                      onToggle={() => {
                        setEnabledRx((v) => !v)
                        setSelectedRxId(undefined)
                        setErrors((prev) => ({ ...prev, prescription: undefined }))
                      }}
                      onSelect={(id) => {
                        setSelectedRxId(id)
                        setErrors((prev) => ({ ...prev, prescription: undefined }))
                      }}
                      error={errors}
                    />
                  )}
                </section>
              )}

              {/* Confirmation */}
              <section className={cardClass}>
                <SectionHeader icon={ShieldCheck} title="Confirmation" required />
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => {
                      setConfirmed(e.target.checked)
                      setErrors((prev) => ({ ...prev, confirmed: undefined }))
                    }}
                    className="mt-0.5 size-4 shrink-0 rounded border-neutral-300 accent-forest dark:accent-leaf"
                  />
                  <span>
                    <span className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      I confirm that the information provided is accurate.
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-400 dark:text-neutral-500">
                      After submitting your request, our optical staff will review it and update the request status.
                    </span>
                  </span>
                </label>
                {errors.confirmed && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500" role="alert">
                    <AlertCircle size={13} />
                    {errors.confirmed}
                  </p>
                )}
              </section>

              {/* Server error */}
              {serverError && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                  <p className="text-sm text-red-700 dark:text-red-300">{serverError}</p>
                </div>
              )}

              {/* Submit */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="submit"
                  size="lg"
                  loading={submitting}
                  className="w-full !rounded-full !bg-forest hover:!bg-forest-deep dark:!bg-leaf dark:!text-forest dark:hover:!opacity-90 sm:w-auto"
                >
                  {!submitting && <Send size={16} />}
                  Submit Request
                </Button>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                  You will stay on the customer portal — your request is reviewed by our staff.
                </p>
              </div>
            </div>

            <aside className="lg:col-span-1" data-aos="fade-right">
              <div className="lg:sticky lg:top-24">
                <CustomerRequestSidebar />
              </div>
            </aside>
          </form>
        )}
      </div>

      <HomeFooter />
    </div>
  )
}